import React, { useState, useEffect } from 'react';

const AdvancedSearch = ({ 
  isOpen, 
  onClose, 
  onSearch, 
  categories, 
  tags,
  models 
}) => {
  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const [searchCriteria, setSearchCriteria] = useState({
    query: '',
    category: '',
    tags: [],
    dateRange: {
      from: '',
      to: ''
    },
    fileSize: {
      min: '',
      max: ''
    },
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      performSearch();
    }
  }, [searchCriteria, isOpen]);

  const performSearch = async () => {
    setSearching(true);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredModels = [...models];

      // Text search
      if (searchCriteria.query.trim()) {
        const query = searchCriteria.query.toLowerCase();
        filteredModels = filteredModels.filter(model =>
          (model.name || '').toLowerCase().includes(query) ||
          (model.description && model.description.toLowerCase().includes(query)) ||
          (model.metadata?.author && model.metadata.author.toLowerCase().includes(query)) ||
          (model.metadata?.notes && model.metadata.notes.toLowerCase().includes(query))
        );
      }

      // Category filter
      if (searchCriteria.category) {
        filteredModels = filteredModels.filter(model =>
          model.category_id === parseInt(searchCriteria.category)
        );
      }

      // Tags filter
      if (searchCriteria.tags.length > 0) {
        filteredModels = filteredModels.filter(model =>
          model.tags && Array.isArray(model.tags) && searchCriteria.tags.some(tagId =>
            model.tags.includes(tagId)
          )
        );
      }

      // Date range filter
      if (searchCriteria.dateRange.from || searchCriteria.dateRange.to) {
        filteredModels = filteredModels.filter(model => {
          const modelDate = new Date(model.created_at);
          const fromDate = searchCriteria.dateRange.from ? new Date(searchCriteria.dateRange.from) : null;
          const toDate = searchCriteria.dateRange.to ? new Date(searchCriteria.dateRange.to) : null;
          
          if (fromDate && modelDate < fromDate) return false;
          if (toDate && modelDate > toDate) return false;
          return true;
        });
      }

      // File size filter
      if (searchCriteria.fileSize.min || searchCriteria.fileSize.max) {
        filteredModels = filteredModels.filter(model => {
          const size = model.file_size || 0;
          const minSize = searchCriteria.fileSize.min ? parseFloat(searchCriteria.fileSize.min) * 1024 * 1024 : 0;
          const maxSize = searchCriteria.fileSize.max ? parseFloat(searchCriteria.fileSize.max) * 1024 * 1024 : Infinity;
          
          return size >= minSize && size <= maxSize;
        });
      }

      // Sorting
      filteredModels.sort((a, b) => {
        let aValue, bValue;
        
        switch (searchCriteria.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'created_at':
            aValue = new Date(a.created_at);
            bValue = new Date(b.created_at);
            break;
          case 'updated_at':
            aValue = new Date(a.updated_at);
            bValue = new Date(b.updated_at);
            break;
          case 'file_size':
            aValue = a.file_size || 0;
            bValue = b.file_size || 0;
            break;
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
        }

        if (aValue < bValue) return searchCriteria.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return searchCriteria.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      setResults(filteredModels);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setSearchCriteria(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleTagToggle = (tagId) => {
    setSearchCriteria(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const clearFilters = () => {
    setSearchCriteria({
      query: '',
      category: '',
      tags: [],
      dateRange: { from: '', to: '' },
      fileSize: { min: '', max: '' },
      sortBy: 'name',
      sortOrder: 'asc'
    });
  };

  const applySearch = () => {
    onSearch(results, searchCriteria);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Advanced Search & Filter
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex max-h-[80vh]">
          {/* Search Criteria Panel */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Text Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Query
                </label>
                <input
                  type="text"
                  value={searchCriteria.query}
                  onChange={(e) => handleInputChange('query', e.target.value)}
                  placeholder="Search in name, description, author, notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={searchCriteria.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {tags.map(tag => (
                    <label
                      key={tag.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={searchCriteria.tags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-2">No tags available</p>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={searchCriteria.dateRange.from}
                    onChange={(e) => handleNestedInputChange('dateRange', 'from', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={searchCriteria.dateRange.to}
                    onChange={(e) => handleNestedInputChange('dateRange', 'to', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* File Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Size (MB)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={searchCriteria.fileSize.min}
                    onChange={(e) => handleNestedInputChange('fileSize', 'min', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={searchCriteria.fileSize.max}
                    onChange={(e) => handleNestedInputChange('fileSize', 'max', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={searchCriteria.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="created_at">Date Created</option>
                    <option value="updated_at">Date Modified</option>
                    <option value="file_size">File Size</option>
                  </select>
                  <select
                    value={searchCriteria.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Search Results
              </h3>
              <div className="text-sm text-gray-500">
                {searching ? 'Searching...' : `${results.length} models found`}
              </div>
            </div>

            {searching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map(model => (
                  <div
                    key={model.id}
                    className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{model.name}</h4>
                        <p className="text-sm text-gray-500">
                          {model.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">
                            {formatFileSize(model.file_size)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(model.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          {categories.find(c => c.id === model.category_id)?.name || 'No category'}
                        </div>
                        {model.tags && model.tags.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {model.tags.length} tags
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {results.length === 0 && !searching && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No models match your search criteria</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={applySearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Search ({results.length} results)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
