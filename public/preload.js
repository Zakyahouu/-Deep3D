const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  getModels: () => ipcRenderer.invoke('db:get-models'),
  getCategories: () => ipcRenderer.invoke('db:get-categories'),
  getTags: () => ipcRenderer.invoke('db:get-tags'),
  addModel: (modelData) => ipcRenderer.invoke('db:add-model', modelData),
  updateModelPath: (modelId, filePath) => ipcRenderer.invoke('db:update-model-path', modelId, filePath),
  addCategory: (categoryData) => ipcRenderer.invoke('db:add-category', categoryData),
  addTag: (tagData) => ipcRenderer.invoke('db:add-tag', tagData),
  
  // File system operations
  copyModel: (sourcePath, modelId) => ipcRenderer.invoke('fs:copy-model', sourcePath, modelId),
  getModelPath: (modelId) => ipcRenderer.invoke('fs:get-model-path', modelId),
  getThumbnailPath: (modelId) => ipcRenderer.invoke('fs:get-thumbnail-path', modelId),
  
  // App info
  platform: process.platform,
  versions: process.versions
});
