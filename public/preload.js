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
  
  // Enhanced CRUD operations
  updateModel: (modelId, modelData) => ipcRenderer.invoke('db:update-model', modelId, modelData),
  deleteModel: (modelId) => ipcRenderer.invoke('db:delete-model', modelId),
  bulkDeleteModels: (modelIds) => ipcRenderer.invoke('db:bulk-delete-models', modelIds),
  bulkMoveModels: (modelIds, categoryId) => ipcRenderer.invoke('db:bulk-move-models', modelIds, categoryId),
  bulkTagModels: (modelIds, tagsToAdd, tagsToRemove) => ipcRenderer.invoke('db:bulk-tag-models', modelIds, tagsToAdd, tagsToRemove),
  exportModels: (modelIds, format) => ipcRenderer.invoke('db:export-models', modelIds, format),
  
  // File system operations
  copyModel: (sourcePath, modelId) => ipcRenderer.invoke('fs:copy-model', sourcePath, modelId),
  getModelPath: (modelId) => ipcRenderer.invoke('fs:get-model-path', modelId),
  getThumbnailPath: (modelId) => ipcRenderer.invoke('fs:get-thumbnail-path', modelId),
  
  // License management
  saveLicenseData: (licenseData) => ipcRenderer.invoke('license:save', licenseData),
  loadLicenseData: () => ipcRenderer.invoke('license:load'),
  clearLicenseData: () => ipcRenderer.invoke('license:clear'),
  generateHardwareFingerprint: () => ipcRenderer.invoke('license:generate-fingerprint'),
  signPayload: (payload) => ipcRenderer.invoke('license:sign-payload', payload),
  
  // App info
  platform: process.platform,
  versions: process.versions
});
