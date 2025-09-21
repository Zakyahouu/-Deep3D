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
const crypto = require('crypto');
const { machineId } = require('node-machine-id');

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
          preload: path.join(__dirname, 'preload.js'),
          devTools: true // Re-enable dev tools for debugging
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
    const match = request.url.match(/^p3dv-models:\/\/file\/(.+)$/);
    if (!match) {
      console.log('Protocol handler - Invalid URL format, expected p3dv-models://file/...');
      callback({ error: -6 }); // ERR_FILE_NOT_FOUND
      return;
    }
    
    // Decode the file path
    const encodedPath = match[1];
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

// Enhanced CRUD operations
ipcMain.handle('db:update-model', async (event, modelId, modelData) => {
  try {
    const { name, description, category_id, metadata } = modelData;
    
    const stmt = db.prepare(`
      UPDATE models 
      SET name = ?, description = ?, category_id = ?, metadata = ?, updated_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(
      name,
      description,
      category_id || null,
      JSON.stringify(metadata || {}),
      new Date().toISOString(),
      modelId
    );
    
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error('Error updating model:', error);
    throw new Error('Failed to update model');
  }
});

ipcMain.handle('db:delete-model', async (event, modelId) => {
  try {
    // Get model info first to delete associated files
    const model = db.prepare('SELECT * FROM models WHERE id = ?').get(modelId);
    if (!model) {
      throw new Error('Model not found');
    }

    // Delete the model file
    if (model.file_path && fs.existsSync(model.file_path)) {
      await fs.promises.unlink(model.file_path);
    }

    // Delete thumbnail if exists
    if (model.thumbnail_path && fs.existsSync(model.thumbnail_path)) {
      await fs.promises.unlink(model.thumbnail_path);
    }

    // Delete from database
    const stmt = db.prepare('DELETE FROM models WHERE id = ?');
    const result = stmt.run(modelId);
    
    return { success: true, changes: result.changes };
  } catch (error) {
    console.error('Error deleting model:', error);
    throw new Error('Failed to delete model');
  }
});

ipcMain.handle('db:bulk-delete-models', async (event, modelIds) => {
  try {
    let totalDeleted = 0;
    
    for (const modelId of modelIds) {
      // Get model info first
      const model = db.prepare('SELECT * FROM models WHERE id = ?').get(modelId);
      if (model) {
        // Delete files
        if (model.file_path && fs.existsSync(model.file_path)) {
          await fs.promises.unlink(model.file_path);
        }
        if (model.thumbnail_path && fs.existsSync(model.thumbnail_path)) {
          await fs.promises.unlink(model.thumbnail_path);
        }
        
        // Delete from database
        const stmt = db.prepare('DELETE FROM models WHERE id = ?');
        const result = stmt.run(modelId);
        totalDeleted += result.changes;
      }
    }
    
    return { success: true, deleted: totalDeleted };
  } catch (error) {
    console.error('Error bulk deleting models:', error);
    throw new Error('Failed to delete models');
  }
});

ipcMain.handle('db:bulk-move-models', async (event, modelIds, categoryId) => {
  try {
    const stmt = db.prepare('UPDATE models SET category_id = ?, updated_at = ? WHERE id = ?');
    const updateTime = new Date().toISOString();
    let totalUpdated = 0;
    
    for (const modelId of modelIds) {
      const result = stmt.run(categoryId || null, updateTime, modelId);
      totalUpdated += result.changes;
    }
    
    return { success: true, updated: totalUpdated };
  } catch (error) {
    console.error('Error bulk moving models:', error);
    throw new Error('Failed to move models');
  }
});

ipcMain.handle('db:bulk-tag-models', async (event, modelIds, tagsToAdd, tagsToRemove) => {
  try {
    let totalUpdated = 0;
    
    for (const modelId of modelIds) {
      // Get current tags
      const model = db.prepare('SELECT tags FROM models WHERE id = ?').get(modelId);
      if (model) {
        let currentTags = [];
        try {
          currentTags = model.tags ? JSON.parse(model.tags) : [];
        } catch (e) {
          currentTags = [];
        }
        
        // Add new tags
        tagsToAdd.forEach(tagId => {
          if (!currentTags.includes(tagId)) {
            currentTags.push(tagId);
          }
        });
        
        // Remove tags
        tagsToRemove.forEach(tagId => {
          const index = currentTags.indexOf(tagId);
          if (index > -1) {
            currentTags.splice(index, 1);
          }
        });
        
        // Update model
        const stmt = db.prepare('UPDATE models SET tags = ?, updated_at = ? WHERE id = ?');
        const result = stmt.run(
          JSON.stringify(currentTags),
          new Date().toISOString(),
          modelId
        );
        totalUpdated += result.changes;
      }
    }
    
    return { success: true, updated: totalUpdated };
  } catch (error) {
    console.error('Error bulk tagging models:', error);
    throw new Error('Failed to update model tags');
  }
});

ipcMain.handle('db:export-models', async (event, modelIds, format) => {
  try {
    const exportDir = path.join(app.getPath('userData'), 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportPath = path.join(exportDir, `p3dv-export-${timestamp}`);
    
    if (format === 'collection') {
      // Create collection with metadata and models
      fs.mkdirSync(exportPath, { recursive: true });
      fs.mkdirSync(path.join(exportPath, 'models'), { recursive: true });
      
      const exportData = {
        format: 'P3DV Collection',
        version: '1.0.0',
        exported_at: new Date().toISOString(),
        models: []
      };
      
      for (const modelId of modelIds) {
        const model = db.prepare(`
          SELECT m.*, c.name as category_name, c.color as category_color
          FROM models m
          LEFT JOIN categories c ON m.category_id = c.id
          WHERE m.id = ?
        `).get(modelId);
        
        if (model && model.file_path && fs.existsSync(model.file_path)) {
          const fileName = `model_${model.id}.glb`;
          const destPath = path.join(exportPath, 'models', fileName);
          await fs.promises.copyFile(model.file_path, destPath);
          
          exportData.models.push({
            ...model,
            file_path: `models/${fileName}`,
            metadata: model.metadata ? JSON.parse(model.metadata) : {},
            tags: model.tags ? JSON.parse(model.tags) : []
          });
        }
      }
      
      await fs.promises.writeFile(
        path.join(exportPath, 'collection.json'),
        JSON.stringify(exportData, null, 2)
      );
      
      return { success: true, path: exportPath, format: 'collection' };
    } else if (format === 'metadata') {
      // Export metadata only
      const exportData = { models: [] };
      
      for (const modelId of modelIds) {
        const model = db.prepare(`
          SELECT m.*, c.name as category_name, c.color as category_color
          FROM models m
          LEFT JOIN categories c ON m.category_id = c.id
          WHERE m.id = ?
        `).get(modelId);
        
        if (model) {
          exportData.models.push({
            ...model,
            metadata: model.metadata ? JSON.parse(model.metadata) : {},
            tags: model.tags ? JSON.parse(model.tags) : []
          });
        }
      }
      
      const exportFile = exportPath + '.json';
      await fs.promises.writeFile(exportFile, JSON.stringify(exportData, null, 2));
      
      return { success: true, path: exportFile, format: 'metadata' };
    }
    
    return { success: false, error: 'Unsupported export format' };
  } catch (error) {
    console.error('Error exporting models:', error);
    throw new Error('Failed to export models');
  }
});

// License data handlers
ipcMain.handle('license:save', async (event, licenseData) => {
  try {
    const licenseFile = path.join(app.getPath('userData'), 'license.json');
    await fs.promises.writeFile(licenseFile, JSON.stringify(licenseData, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving license data:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('license:load', async () => {
  try {
    const licenseFile = path.join(app.getPath('userData'), 'license.json');
    const data = await fs.promises.readFile(licenseFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is corrupted
    return null;
  }
});

ipcMain.handle('license:clear', async () => {
  try {
    const licenseFile = path.join(app.getPath('userData'), 'license.json');
    await fs.promises.unlink(licenseFile);
    return { success: true };
  } catch (error) {
    // File doesn't exist, that's fine
    return { success: true };
  }
});

// Hardware fingerprinting and crypto operations
const SECRET_KEY = 'P3DV_SECRET_KEY_2024'; // In production, use environment variable

ipcMain.handle('license:generate-fingerprint', async () => {
  try {
    const machineID = await machineId();
    const platform = process.platform;
    const arch = process.arch;
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${machineID}-${platform}-${arch}`)
      .digest('hex');
    
    return fingerprint;
  } catch (error) {
    console.error('Error generating hardware fingerprint:', error);
    throw new Error('Failed to generate hardware fingerprint');
  }
});

ipcMain.handle('license:sign-payload', async (event, payload) => {
  try {
    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex');
    
    return signature;
  } catch (error) {
    console.error('Error signing payload:', error);
    throw new Error('Failed to sign payload');
  }
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
