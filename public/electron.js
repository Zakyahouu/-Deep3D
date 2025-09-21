const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === '1' || !app.isPackaged;

// Register custom protocol for serving model files
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'p3dv-models',
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true
    }
  }
]);

// Database setup
const Database = require('sqlite3').Database;
const fs = require('fs');
const os = require('os');

// Create database instance
let db;

// Initialize database
function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'p3dv.db');
  
  db = new Database(dbPath);
  
  // Create tables
  db.serialize(() => {
    // Models table
    db.run(`
      CREATE TABLE IF NOT EXISTS models (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        thumbnail_path TEXT,
        category_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);
    
    // Categories table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT DEFAULT '#3B82F6',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Tags table
    db.run(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        color TEXT DEFAULT '#6B7280',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Model tags junction table
    db.run(`
      CREATE TABLE IF NOT EXISTS model_tags (
        model_id INTEGER,
        tag_id INTEGER,
        PRIMARY KEY (model_id, tag_id),
        FOREIGN KEY (model_id) REFERENCES models (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
      )
    `);
    
    // App settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert sample data
    db.run(`
      INSERT OR IGNORE INTO categories (id, name, color) VALUES 
      (1, 'Architecture', '#3B82F6'),
      (2, 'Vehicles', '#EF4444'),
      (3, 'Characters', '#10B981'),
      (4, 'Furniture', '#F59E0B')
    `);
    
    db.run(`
      INSERT OR IGNORE INTO tags (id, name, color) VALUES 
      (1, 'Modern', '#6B7280'),
      (2, 'Vintage', '#8B5CF6'),
      (3, 'Minimalist', '#06B6D4'),
      (4, 'Detailed', '#EC4899')
    `);
  });
}

// File system manager
class FileSystemManager {
  constructor() {
    this.modelsDir = path.join(app.getPath('userData'), 'models');
    this.thumbnailsDir = path.join(app.getPath('userData'), 'thumbnails');
    
    // Create directories if they don't exist
    if (!fs.existsSync(this.modelsDir)) {
      fs.mkdirSync(this.modelsDir, { recursive: true });
    }
    if (!fs.existsSync(this.thumbnailsDir)) {
      fs.mkdirSync(this.thumbnailsDir, { recursive: true });
    }
  }
  
  async copyModelFile(sourcePath, modelId) {
    const fileName = `model_${modelId}.glb`;
    const destPath = path.join(this.modelsDir, fileName);
    
    return new Promise((resolve, reject) => {
      fs.copyFile(sourcePath, destPath, (err) => {
        if (err) reject(err);
        else resolve(destPath);
      });
    });
  }
  
  getModelPath(modelId) {
    const fileName = `model_${modelId}.glb`;
    return path.join(this.modelsDir, fileName);
  }
  
  getThumbnailPath(modelId) {
    const fileName = `thumb_${modelId}.png`;
    return path.join(this.thumbnailsDir, fileName);
  }
}

const fileSystemManager = new FileSystemManager();

// Create the main window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (isDev) {
    // Try to detect which port Vite is running on
    const tryLoadDev = async () => {
      const ports = [5173, 5174, 5175, 5176, 5177];
      
      for (const port of ports) {
        try {
          await mainWindow.loadURL(`http://localhost:${port}`);
          console.log(`Successfully connected to development server on port ${port}`);
          return;
        } catch (err) {
          console.log(`Port ${port} not available, trying next...`);
        }
      }
      
      console.error('Could not connect to any development server port');
      // Fallback to a default URL
      mainWindow.loadURL('http://localhost:5173');
    };
    
    tryLoadDev();
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  return mainWindow;
}

// App event handlers
app.whenReady().then(() => {
  // Register protocol handler for model files
  protocol.registerFileProtocol('p3dv-models', (request, callback) => {
    console.log('Protocol handler - Requested URL:', request.url);
    
    // Extract the encoded path from URL like p3dv-models://file/C%3A%5CUsers%5C...
    const urlParts = request.url.split('/');
    if (urlParts.length < 4 || urlParts[2] !== '' || urlParts[3] !== 'file') {
      console.log('Protocol handler - Invalid URL format');
      callback({ error: -6 }); // ERR_FILE_NOT_FOUND
      return;
    }
    
    // Decode the file path
    const encodedPath = urlParts.slice(4).join('/');
    const filePath = decodeURIComponent(encodedPath);
    
    console.log('Protocol handler - Encoded path:', encodedPath);
    console.log('Protocol handler - Decoded path:', filePath);
    
    // Security check - only allow files from the models directory
    const modelsDir = path.join(app.getPath('userData'), 'models');
    console.log('Protocol handler - Models directory:', modelsDir);
    console.log('Protocol handler - File path starts with models dir:', filePath.startsWith(modelsDir));
    
    if (!filePath.startsWith(modelsDir)) {
      console.log('Protocol handler - Security check failed, denying access');
      callback({ error: -6 }); // ERR_FILE_NOT_FOUND
      return;
    }
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      console.log('Protocol handler - File does not exist:', filePath);
      callback({ error: -6 }); // ERR_FILE_NOT_FOUND
      return;
    }
    
    console.log('Protocol handler - Serving file:', filePath);
    callback({ path: filePath });
  });

  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for database operations
ipcMain.handle('db:get-models', async () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT m.*, c.name as category_name, c.color as category_color,
             GROUP_CONCAT(t.name) as tags
      FROM models m
      LEFT JOIN categories c ON m.category_id = c.id
      LEFT JOIN model_tags mt ON m.id = mt.model_id
      LEFT JOIN tags t ON mt.tag_id = t.id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('db:get-categories', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('db:get-tags', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM tags ORDER BY name', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('db:add-model', async (event, modelData) => {
  return new Promise((resolve, reject) => {
    if (!modelData) {
      reject(new Error('Model data is required'));
      return;
    }
    
    const { name, filePath, categoryId } = modelData;
    
    if (!name) {
      reject(new Error('Name is required'));
      return;
    }
    
    db.run(
      'INSERT INTO models (name, file_path, category_id) VALUES (?, ?, ?)',
      [name, filePath || '', categoryId || null],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
});

ipcMain.handle('db:update-model-path', async (event, modelId, filePath) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE models SET file_path = ? WHERE id = ?',
      [filePath, modelId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
});

ipcMain.handle('db:add-category', async (event, categoryData) => {
  return new Promise((resolve, reject) => {
    const { name, color } = categoryData;
    
    db.run(
      'INSERT INTO categories (name, color) VALUES (?, ?)',
      [name, color],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
});

ipcMain.handle('db:add-tag', async (event, tagData) => {
  return new Promise((resolve, reject) => {
    const { name, color } = tagData;
    
    db.run(
      'INSERT INTO tags (name, color) VALUES (?, ?)',
      [name, color],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
});

ipcMain.handle('fs:copy-model', async (event, sourcePath, modelId) => {
  try {
    const destPath = await fileSystemManager.copyModelFile(sourcePath, modelId);
    return destPath;
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('fs:get-model-path', async (event, modelId) => {
  return fileSystemManager.getModelPath(modelId);
});

ipcMain.handle('fs:get-thumbnail-path', async (event, modelId) => {
  return fileSystemManager.getThumbnailPath(modelId);
});

// Deep linking setup (Phase 3)
app.setAsDefaultProtocolClient('p3dv');

app.on('open-url', (event, url) => {
  event.preventDefault();
  // Handle deep link URL
  console.log('Deep link received:', url);
  // Parse URL and load specific model
  // This will be implemented in Phase 3
});

// Handle protocol on Windows
app.on('second-instance', (event, commandLine, workingDirectory) => {
  // Someone tried to run a second instance, focus our window instead
  const mainWindow = BrowserWindow.getAllWindows()[0];
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  
  // Handle deep link from command line
  const url = commandLine.find(arg => arg.startsWith('p3dv://'));
  if (url) {
    console.log('Deep link received:', url);
    // Parse URL and load specific model
    // This will be implemented in Phase 3
  }
});
