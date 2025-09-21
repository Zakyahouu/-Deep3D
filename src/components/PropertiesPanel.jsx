import React, { useState } from 'react';

function PropertiesPanel({ selectedModel, onModelEdit, onModelDelete }) {
  const [activeTab, setActiveTab] = useState('general');

  if (!selectedModel) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">No Model Selected</h3>
          <p className="text-sm">Select a model to view its properties</p>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onModelEdit(selectedModel)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onModelDelete(selectedModel.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 px-3 py-2 text-sm font-medium ${
            activeTab === 'general'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`flex-1 px-3 py-2 text-sm font-medium ${
            activeTab === 'metadata'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Metadata
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 px-3 py-2 text-sm font-medium ${
            activeTab === 'files'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Files
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{selectedModel.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md min-h-[60px]">
                {selectedModel.description || 'No description provided'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                {selectedModel.category_name || 'Uncategorized'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                {formatDate(selectedModel.created_at)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                {formatDate(selectedModel.updated_at)}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            {selectedModel.metadata ? (
              Object.entries(JSON.parse(selectedModel.metadata)).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                    {value || 'Not specified'}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">📄</div>
                <p>No metadata available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model File</label>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-900 font-mono break-all">{selectedModel.file_path}</p>
                <p className="text-xs text-gray-500 mt-1">Size: {formatFileSize(selectedModel.file_size)}</p>
              </div>
            </div>

            {selectedModel.thumbnail_path && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail</label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-900 font-mono break-all">{selectedModel.thumbnail_path}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                {selectedModel.file_path?.split('.').pop()?.toUpperCase() || 'Unknown'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesPanel;
