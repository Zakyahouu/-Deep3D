import React from 'react';

const SimpleInfoPanel = ({ 
  selectedModel, 
  onModelEdit, 
  onModelDelete,
  categories = [],
  tags = []
}) => {
  if (!selectedModel) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center text-gray-500">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No Model Selected</h3>
          <p className="text-sm">Select a model to view its details</p>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === selectedModel.category_id);
  const modelTags = Array.isArray(selectedModel.tags) ? selectedModel.tags : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Model Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onModelEdit(selectedModel)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onModelDelete(selectedModel)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-2-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</label>
              <p className="text-sm text-gray-900 mt-1">{selectedModel.name || 'Unnamed'}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</label>
              <p className="text-sm text-gray-900 mt-1">
                {selectedModel.description || 'No description available'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</label>
              <p className="text-sm text-gray-900 mt-1">
                {category ? category.name : 'Uncategorized'}
              </p>
            </div>
          </div>
        </div>

        {/* File Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">File Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">File Size</label>
              <p className="text-sm text-gray-900 mt-1">
                {selectedModel.file_size ? `${(selectedModel.file_size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">File Type</label>
              <p className="text-sm text-gray-900 mt-1">GLB (3D Model)</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Added</label>
              <p className="text-sm text-gray-900 mt-1">
                {selectedModel.created_at ? new Date(selectedModel.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {modelTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {modelTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        {selectedModel.metadata && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Metadata</h3>
            <div className="space-y-2">
              {Object.entries(selectedModel.metadata).map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <p className="text-sm text-gray-900 mt-1">{value || 'Not specified'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex space-x-2">
          <button
            onClick={() => onModelEdit(selectedModel)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Edit Model
          </button>
          <button
            onClick={() => onModelDelete(selectedModel)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Delete Model
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleInfoPanel;
