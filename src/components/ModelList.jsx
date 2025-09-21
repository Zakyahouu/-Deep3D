import React, { useState, useEffect } from 'react';
import ModelThumbnail from './ModelThumbnail';

function ModelList({ 
  models, 
  selectedModel, 
  onModelSelect, 
  onModelEdit,
  onBulkOperations,
  selectionMode = false,
  onSelectionChange,
  categories = [],
  tags = []
}) {
  const [selectedModels, setSelectedModels] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedModels);
    }
  }, [selectedModels, onSelectionChange]);

  const handleModelClick = (model, event) => {
    if (selectionMode) {
      event.stopPropagation();
      toggleModelSelection(model);
    } else {
      onModelSelect(model);
    }
  };

  const toggleModelSelection = (model) => {
    setSelectedModels(prev => {
      const isSelected = prev.some(m => m.id === model.id);
      if (isSelected) {
        return prev.filter(m => m.id !== model.id);
      } else {
        return [...prev, model];
      }
    });
  };

  const selectAllModels = () => {
    setSelectedModels([...models]);
  };

  const deselectAllModels = () => {
    setSelectedModels([]);
  };

  const handleEditModel = (model, event) => {
    event.stopPropagation();
    if (onModelEdit) {
      onModelEdit(model);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#6b7280';
  };

  // Sort models
  const sortedModels = [...models].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = (a.name || '').toLowerCase();
        bValue = (b.name || '').toLowerCase();
        break;
      case 'created_at':
        aValue = new Date(a.created_at || 0);
        bValue = new Date(b.created_at || 0);
        break;
      case 'updated_at':
        aValue = new Date(a.updated_at || 0);
        bValue = new Date(b.updated_at || 0);
        break;
      case 'file_size':
        aValue = a.file_size || 0;
        bValue = b.file_size || 0;
        break;
      case 'category':
        aValue = getCategoryName(a.category_id).toLowerCase();
        bValue = getCategoryName(b.category_id).toLowerCase();
        break;
      default:
        aValue = (a.name || '').toLowerCase();
        bValue = (b.name || '').toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No models found</h3>
        <p className="text-sm">Add your first 3D model to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          {/* Selection mode controls */}
          {selectionMode && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedModels.length} of {models.length} selected
              </span>
              <button
                onClick={selectAllModels}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Select All
              </button>
              <button
                onClick={deselectAllModels}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Clear
              </button>
              {selectedModels.length > 0 && onBulkOperations && (
                <button
                  onClick={() => onBulkOperations(selectedModels)}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
                >
                  Bulk Actions
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Sort controls */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="created_at">Date Created</option>
            <option value="updated_at">Date Modified</option>
            <option value="file_size">File Size</option>
            <option value="category">Category</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          </button>

          {/* View mode toggle */}
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Model list/grid */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <div className="p-4 space-y-2">
            {sortedModels.map(model => (
              <div
                key={model.id}
                className={`flex gap-3 p-3 rounded-md cursor-pointer transition-colors border relative ${
                  selectedModel?.id === model.id 
                    ? 'bg-blue-50 border-blue-300' 
                    : selectedModels.some(m => m.id === model.id)
                    ? 'bg-green-50 border-green-300'
                    : 'border-transparent hover:bg-gray-50'
                }`}
                onClick={(e) => handleModelClick(model, e)}
              >
                {/* Selection checkbox */}
                {selectionMode && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedModels.some(m => m.id === model.id)}
                      onChange={() => toggleModelSelection(model)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                )}

                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <ModelThumbnail modelPath={model.file_path} size={48} />
                </div>
                
                {/* Model info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{model.name || 'Unnamed Model'}</h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">{formatFileSize(model.file_size)}</span>
                      {onModelEdit && (
                        <button
                          onClick={(e) => handleEditModel(model, e)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit Model"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: getCategoryColor(model.category_id) + '20',
                          color: getCategoryColor(model.category_id)
                        }}
                      >
                        {getCategoryName(model.category_id)}
                      </div>
                      {model.tags && Array.isArray(model.tags) && model.tags.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {model.tags.length} tags
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(model.created_at)}
                    </span>
                  </div>

                  {model.description && (
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {model.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="p-4 grid grid-cols-2 gap-4">
            {sortedModels.map(model => (
              <div
                key={model.id}
                className={`p-4 rounded-lg cursor-pointer transition-colors border relative ${
                  selectedModel?.id === model.id 
                    ? 'bg-blue-50 border-blue-300' 
                    : selectedModels.some(m => m.id === model.id)
                    ? 'bg-green-50 border-green-300'
                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={(e) => handleModelClick(model, e)}
              >
                {/* Selection checkbox */}
                {selectionMode && (
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedModels.some(m => m.id === model.id)}
                      onChange={() => toggleModelSelection(model)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                )}

                {/* Edit button */}
                {onModelEdit && (
                  <button
                    onClick={(e) => handleEditModel(model, e)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    title="Edit Model"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}

                {/* Thumbnail */}
                <div className="mb-3">
                  <ModelThumbnail modelPath={model.file_path} size={120} />
                </div>

                {/* Model info */}
                <div>
                  <h4 className="font-medium text-gray-900 truncate mb-1">{model.name || 'Unnamed Model'}</h4>
                  <div 
                    className="text-xs font-medium px-2 py-0.5 rounded mb-2 inline-block"
                    style={{ 
                      backgroundColor: getCategoryColor(model.category_id) + '20',
                      color: getCategoryColor(model.category_id)
                    }}
                  >
                    {getCategoryName(model.category_id)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(model.file_size)}</span>
                    <span>{formatDate(model.created_at)}</span>
                  </div>
                  {model.tags && Array.isArray(model.tags) && model.tags.length > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {model.tags.length} tags
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelList;