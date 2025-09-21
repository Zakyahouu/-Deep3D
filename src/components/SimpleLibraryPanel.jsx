import React, { useState } from 'react';

const SimpleLibraryPanel = ({ 
  models, 
  selectedModel, 
  onModelSelect, 
  onModelAdd,
  categories = [],
  tags = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter models based on search and category
  const filteredModels = models.filter(model => {
    const matchesSearch = !searchQuery || 
      model.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || 
      model.category_id?.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Library</h2>
        
        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="mb-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Model Button */}
        <button
          onClick={onModelAdd}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add New Model
        </button>
      </div>

      {/* Models List */}
      <div className="flex-1 overflow-y-auto">
        {filteredModels.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="mb-2">
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm">No models found</p>
            <p className="text-xs text-gray-400 mt-1">Add your first 3D model</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredModels.map(model => (
              <div
                key={model.id}
                onClick={() => onModelSelect(model)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedModel?.id === model.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Model Icon */}
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  
                  {/* Model Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {model.name || 'Unnamed Model'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {model.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {model.category_id && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === model.category_id)?.name || 'Unknown'}
                        </span>
                      )}
                      {model.file_size && (
                        <span className="text-xs text-gray-400">
                          {(model.file_size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Models:</span>
            <span className="font-semibold">{models.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Categories:</span>
            <span className="font-semibold">{categories.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLibraryPanel;
