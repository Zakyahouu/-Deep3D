# Presentation 3D Viewer (P3DV) - User Manual

## 🎯 Overview

Presentation 3D Viewer is a professional desktop application for managing, viewing, and organizing 3D models. Built with modern technologies, it provides an intuitive interface for handling GLB/GLTF files with advanced features for presentations and model management.

## 🚀 Getting Started

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 100MB for application, additional space for models
- **Graphics**: DirectX 11 compatible or OpenGL 3.3+

### Installation
1. Download the latest release from the official repository
2. Run the installer and follow the setup wizard
3. Launch the application from your desktop or start menu

## 🖥️ Interface Overview

### Multi-Panel Layout
The application features a modern multi-panel interface designed for efficiency:

```
┌─────────────────────────────────────────────────────────────┐
│                    Top Header (Toolbar)                     │
├─────────────┬─────────────────────────────┬─────────────────┤
│             │                             │                 │
│   Library   │       3D Viewer             │     Tools       │
│   Panel     │        Panel                │     Panel       │
│             │                             │                 │
│             │                             │                 │
├─────────────┼─────────────────────────────┼─────────────────┤
│             │                             │                 │
│ Properties  │        Properties           │                 │
│   Panel     │        Panel                │                 │
│             │                             │                 │
└─────────────┴─────────────────────────────┴─────────────────┘
```

### Panel Descriptions

#### 1. **Top Header**
- **App branding** and version information
- **Quick action buttons** for search, selection, export/import
- **Status indicators** for search and selection modes
- **Settings access**

#### 2. **Library Panel (Left)**
- **Model browser** with search functionality
- **Category management** for organizing models
- **Tag system** for flexible labeling
- **Add model** button for importing new files

#### 3. **3D Viewer Panel (Center)**
- **Interactive 3D model display** with Three.js rendering
- **View controls** for rotation, zoom, and pan
- **Model information overlay** when a model is selected
- **Empty state** with call-to-action when no model is selected

#### 4. **Properties Panel (Bottom)**
- **Detailed model information** in tabbed interface
- **General properties**: name, description, category, dates
- **Metadata viewer**: custom properties and notes
- **File information**: paths, sizes, formats
- **Quick edit/delete actions**

#### 5. **Tools Panel (Right)**
- **Organized tool sections**: View, Edit, Data, Settings
- **Quick access** to common operations
- **Bulk operation controls** when in selection mode
- **Library statistics** and status information

## 📁 File Management

### Supported Formats
- **GLB** (.glb) - Binary glTF format (recommended)
- **GLTF** (.gltf) - JSON-based glTF format

### Adding Models
1. Click the **"+ Add Model"** button in the Library Panel
2. Select your GLB/GLTF file from the file dialog
3. Fill in the model information:
   - **Name**: Display name for the model
   - **Description**: Optional description
   - **Category**: Choose from existing categories or create new
   - **Tags**: Add relevant tags for organization
4. Click **"Add Model"** to import

### Organizing Models

#### Categories
- **Create categories** to group related models
- **Color-code categories** for visual organization
- **Assign models** to categories during import or editing

#### Tags
- **Add multiple tags** to each model
- **Search by tags** for flexible filtering
- **Bulk tag operations** for multiple models

#### Search & Filter
- **Quick search** in the Library Panel search bar
- **Advanced search** with multiple criteria:
  - Text search across names and descriptions
  - Category filtering
  - Tag filtering
  - Date range filtering
  - File size filtering

## 🎮 3D Viewer Controls

### Mouse Controls
- **Left Click + Drag**: Rotate the model
- **Right Click + Drag**: Pan the view
- **Scroll Wheel**: Zoom in/out
- **Double Click**: Reset view to default

### View Controls
- **Reset View**: Return to default camera position
- **Toggle Grid**: Show/hide the reference grid
- **Fullscreen**: Expand viewer to full screen

### Model Information
When a model is selected, an overlay shows:
- **Model name** and description
- **Category** with color coding
- **File size** and format
- **Quick actions** for editing

## ⚙️ Advanced Features

### Selection Mode
1. Click the **selection toggle** in the top header
2. **Select multiple models** using checkboxes
3. **Perform bulk operations**:
   - Delete multiple models
   - Move to different category
   - Add/remove tags
   - Export as collection

### Bulk Operations
- **Bulk Delete**: Remove multiple models at once
- **Bulk Move**: Change category for multiple models
- **Bulk Tag**: Add or remove tags from multiple models
- **Bulk Export**: Export multiple models as a collection

### Export Options
- **Individual Export**: Export single models
- **Collection Export**: Export multiple models with metadata
- **Metadata Only**: Export just the database information
- **ZIP Archive**: Compressed collection export

### Import Features
- **Single Model Import**: Add individual GLB/GLTF files
- **Batch Import**: Import multiple files at once
- **Collection Import**: Import previously exported collections

## 🔧 Settings & Preferences

### General Settings
- **Theme**: Light/Dark mode selection
- **Auto-save**: Automatic saving of changes
- **Startup behavior**: What to load on startup
- **File associations**: Default file handling

### Appearance
- **UI scaling**: Adjust interface size
- **Color scheme**: Customize interface colors
- **Grid settings**: Configure 3D viewer grid
- **Background**: 3D viewer background options

### Performance
- **Rendering quality**: Balance quality vs performance
- **Cache settings**: Model caching preferences
- **Memory usage**: Optimize for your system
- **Hardware acceleration**: GPU rendering options

### Backup & Sync
- **Auto-backup**: Automatic library backups
- **Backup location**: Choose backup directory
- **Sync settings**: Cloud sync preferences
- **Export schedule**: Regular export automation

## 🎨 Customization

### Categories
- **Create custom categories** with names and colors
- **Edit existing categories** to change appearance
- **Delete unused categories** to clean up

### Tags
- **Create custom tags** for flexible organization
- **Color-code tags** for visual identification
- **Manage tag library** for consistency

### View Preferences
- **Default camera position** for new models
- **Grid appearance** and visibility
- **Lighting settings** for 3D viewer
- **Background environment** selection

## 🚨 Troubleshooting

### Common Issues

#### Models Not Loading
- **Check file format**: Ensure files are valid GLB/GLTF
- **File size**: Large files may take time to load
- **File path**: Ensure files are accessible
- **Permissions**: Check file read permissions

#### Performance Issues
- **Reduce model complexity**: Simplify 3D models
- **Lower rendering quality**: Adjust performance settings
- **Close other applications**: Free up system resources
- **Update graphics drivers**: Ensure latest drivers

#### Import/Export Problems
- **File permissions**: Check write permissions
- **Disk space**: Ensure sufficient storage
- **File corruption**: Verify file integrity
- **Format compatibility**: Check file format support

### Getting Help
- **Check the logs**: View application logs for errors
- **Restart application**: Try restarting if issues persist
- **Reset settings**: Restore default settings if needed
- **Contact support**: Reach out for technical assistance

## 📊 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Add new model |
| `Ctrl + O` | Open file |
| `Ctrl + S` | Save changes |
| `Ctrl + F` | Search models |
| `Ctrl + A` | Select all models |
| `Delete` | Delete selected models |
| `Escape` | Exit selection mode |
| `F11` | Toggle fullscreen |
| `Ctrl + +` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Ctrl + 0` | Reset view |

## 🔄 Updates & Maintenance

### Automatic Updates
- **Check for updates**: Application checks for updates on startup
- **Download updates**: Updates are downloaded automatically
- **Install updates**: Follow the update wizard when prompted

### Manual Updates
1. Visit the official repository
2. Download the latest release
3. Run the installer
4. Follow the setup wizard

### Data Backup
- **Regular backups**: Export your library regularly
- **Backup location**: Store backups in a safe location
- **Version control**: Keep multiple backup versions
- **Cloud storage**: Consider cloud backup solutions

## 🎯 Best Practices

### File Organization
- **Use descriptive names** for models and categories
- **Create logical categories** for your use case
- **Add meaningful tags** for better searchability
- **Keep file sizes reasonable** for better performance

### Performance Optimization
- **Optimize 3D models** before importing
- **Use appropriate file formats** (GLB for better compression)
- **Regular cleanup** of unused models and categories
- **Monitor system resources** during heavy usage

### Workflow Tips
- **Batch import** similar models together
- **Use bulk operations** for efficiency
- **Regular exports** for data safety
- **Organize by project** using categories and tags

## 📞 Support & Community

### Getting Help
- **Documentation**: Check this manual first
- **FAQ**: Common questions and answers
- **Community Forum**: User discussions and tips
- **Issue Tracker**: Report bugs and request features

### Contributing
- **Bug Reports**: Help improve the application
- **Feature Requests**: Suggest new functionality
- **Code Contributions**: Contribute to development
- **Documentation**: Help improve this manual

### Version History
- **v1.0.0**: Initial release with core functionality
- **Future updates**: Regular improvements and new features

---

**Presentation 3D Viewer** - Professional 3D Model Management Made Simple

*For the latest updates and support, visit our official repository.*
