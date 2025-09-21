# Presentation 3D Viewer (P3DV)

A self-contained, offline-first 3D model viewer with a local library system and one-time activation feature.

## Features

- **3D Model Viewing**: View GLB 3D models with interactive controls
- **Local Library**: Manage your 3D models with categories and tags
- **Offline-First**: Works completely offline after initial setup
- **Deep Linking**: Launch specific models via `p3dv://` protocol (Phase 3)
- **One-Time Activation**: Simple license key validation (Phase 2)

## Technology Stack

- **Desktop Wrapper**: Electron
- **Frontend UI**: React with Vite
- **3D Rendering**: react-three/fiber and three.js
- **Database**: SQLite3 for embedded metadata
- **Backend Logic**: Node.js within Electron's main process
- **Packaging**: electron-builder

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd P3DV
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run electron-dev
```

This will start both the Vite development server and Electron in development mode.

### Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run build` - Build the React app for production
- `npm run electron` - Run Electron with built app
- `npm run electron-dev` - Run Electron in development mode
- `npm run electron-pack` - Build and package the app

## Project Structure

```
P3DV/
├── public/
│   ├── electron.js          # Main Electron process
│   └── preload.js           # Preload script for secure IPC
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx
│   │   ├── LibraryPanel.jsx
│   │   ├── ModelViewer.jsx
│   │   ├── ModelList.jsx
│   │   ├── AddModelDialog.jsx
│   │   ├── CategoryManager.jsx
│   │   ├── TagManager.jsx
│   │   └── SearchBar.jsx
│   ├── App.jsx              # Main React component
│   ├── App.css
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## Development Phases

### Phase 1: Core Architecture & Scaffolding ✅
- [x] Electron + React + Vite project setup
- [x] three.js integration for 3D rendering
- [x] SQLite database with models, categories, and tags schema
- [x] File system manager for storing .glb files locally
- [x] Basic UI for model viewing and library management

### Phase 2: Licensing and Activation (Pending)
- [ ] One-time offline activation system
- [ ] License key validation UI
- [ ] Remote API integration for key validation
- [ ] Local activation state management

### Phase 3: Main Features and Deep Linking (Pending)
- [ ] Custom protocol registration (`p3dv://`)
- [ ] Deep linking URL parsing
- [ ] Enhanced library management features
- [ ] Advanced filtering and searching

### Phase 4: Build and Deployment (Pending)
- [ ] electron-builder configuration
- [ ] Windows and macOS installer creation
- [ ] End-to-end testing
- [ ] Quality assurance process

## Database Schema

The application uses SQLite with the following tables:

- **models**: Stores 3D model metadata
- **categories**: Model categories with colors
- **tags**: Model tags with colors
- **model_tags**: Many-to-many relationship between models and tags
- **settings**: Application settings including activation state

## Usage

1. **Adding Models**: Use the "Add Model" button to import GLB files
2. **Organizing**: Create categories and tags to organize your models
3. **Viewing**: Click on any model in the library to view it in 3D
4. **Searching**: Use the search bar and filters to find specific models

## Building for Production

To create a production build:

```bash
npm run electron-pack
```

This will create installers in the `dist-electron` directory for both Windows and macOS.

## License

MIT License - see LICENSE file for details.

