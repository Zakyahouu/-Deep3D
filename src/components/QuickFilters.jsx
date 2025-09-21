import React, { useState } from 'react';

function QuickFilters({ 
  categories, 
  tags, 
  onFilterChange, 
  activeFilters = {} 
}) {
  const [expanded, setExpanded] = useState(false);

  const handleCategoryFilter = (categoryId) => {
    const newFilters = { ...activeFilters };
    if (newFilters.category === categoryId) {
      delete newFilters.category;
    } else {
      newFilters.category = categoryId;
    }
    onFilterChange(newFilters);
  };

  const handleTagFilter = (tagId) => {
    const newFilters = { ...activeFilters };
    const currentTags = newFilters.tags || [];
    if (currentTags.includes(tagId)) {
      newFilters.tags = currentTags.filter(id => id !== tagId);
    } else {
      newFilters.tags = [...currentTags, tagId];
    }
    if (newFilters.tags.length === 0) {
      delete newFilters.tags;
    }
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Quick Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Categories */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Categories</h4>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-xs transition-colors ${
                    activeFilters.category === category.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="flex-1 text-left">{category.name}</span>
                  <span className="text-gray-400">({category.model_count || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Tags</h4>
            <div className="space-y-1">
              {tags.slice(0, 5).map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagFilter(tag.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-xs transition-colors ${
                    activeFilters.tags?.includes(tag.id)
                      ? 'bg-purple-50 text-purple-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  ></div>
                  <span className="flex-1 text-left">{tag.name}</span>
                  <span className="text-gray-400">({tag.model_count || 0})</span>
                </button>
              ))}
              {tags.length > 5 && (
                <p className="text-xs text-gray-500 text-center py-1">
                  +{tags.length - 5} more tags
                </p>
              )}
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div>
            <h4 className="text-xs font-medium text-gray-600 mb-2">Quick Filters</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onFilterChange({ ...activeFilters, recent: true })}
                className={`p-2 rounded-md text-xs transition-colors ${
                  activeFilters.recent
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => onFilterChange({ ...activeFilters, large: true })}
                className={`p-2 rounded-md text-xs transition-colors ${
                  activeFilters.large
                    ? 'bg-orange-50 text-orange-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Large Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {activeFilters.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Category
                <button
                  onClick={() => handleCategoryFilter(activeFilters.category)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {activeFilters.tags?.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag ? (
                <span key={tagId} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {tag.name}
                  <button
                    onClick={() => handleTagFilter(tagId)}
                    className="text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
            {activeFilters.recent && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Recent
                <button
                  onClick={() => onFilterChange({ ...activeFilters, recent: false })}
                  className="text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            )}
            {activeFilters.large && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                Large Files
                <button
                  onClick={() => onFilterChange({ ...activeFilters, large: false })}
                  className="text-orange-500 hover:text-orange-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickFilters;
