// AddModelDialog.js - Add Model Dialog Component
import React, { useState } from 'react';

function AddModelDialog({ categories, tags, onClose, onModelAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    filePath: '',
    categoryId: '',
    selectedTags: []
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.filePath) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // First add the model to get an ID
      const modelData = {
        name: formData.name.trim(),
        filePath: '', // Will be updated after file copy
        categoryId: formData.categoryId && formData.categoryId !== '' ? parseInt(formData.categoryId) : null
      };
      
      console.log('Sending model data to backend:', modelData);
      const modelId = await window.electronAPI.addModel(modelData);
      
      // Copy the actual file to the app's data directory
      const copiedFilePath = await window.electronAPI.copyModel(formData.filePath, modelId);
      
      // Update the model with the correct file path
      await window.electronAPI.updateModelPath(modelId, copiedFilePath);
      
      // Add tags if any are selected
      if (formData.selectedTags.length > 0) {
        // This would need to be implemented in the backend
        console.log('Selected tags:', formData.selectedTags);
      }
      
      onModelAdd(); // Just notify that a model was added
      onClose();
    } catch (error) {
      console.error('Error adding model:', error);
      console.error('Form data was:', formData);
      alert(`Error adding model: ${error.message || error}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        filePath: file.path,
        name: prev.name || file.name.replace(/\.[^/.]+$/, "") // Remove extension
      }));
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Add New Model</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Model Name *</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">3D Model File (.glb) *</label>
            <input
              type="file"
              id="file"
              accept=".glb"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              onChange={handleFileSelect}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            >
              <option value="">No Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                    formData.selectedTags.includes(tag.id) 
                      ? 'text-white border-transparent' 
                      : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTagToggle(tag.id)}
                  style={{ 
                    backgroundColor: formData.selectedTags.includes(tag.id) ? tag.color : undefined
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                'Add Model'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModelDialog;