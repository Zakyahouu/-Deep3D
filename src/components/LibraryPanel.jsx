import React, { useState } from 'react';
import ModelList from './ModelList';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';
import SearchBar from './SearchBar';

function LibraryPanel({ 
  models, 
  categories, 
  tags, 
  selectedModel, 
  onModelSelect, 
  onModelAdd, 
  onCategoryAdd, 
  onTagAdd,
  onModelEdit,
  onBulkOperations,
  selectionMode,
  onSelectionChange,
  onSearch,
  searchQuery,
  onClearSearch
}) {
  const [activeTab, setActiveTab] = useState('models');
  const [filteredModels, setFilteredModels] = useState([]);

  const handleSearch = (query) => {
    if (onSearch) {
      onSearch(query);
    } else {
      // Local search fallback
      if (query.trim() === '') {
        setFilteredModels([]);
      } else {
        const filtered = models.filter(model =>
          model.name.toLowerCase().includes(query.toLowerCase()) ||
          (model.description && model.description.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredModels(filtered);
      }
    }
  };

  const displayModels = searchQuery ? filteredModels : models;

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search models..."
          value={searchQuery}
          onClear={onClearSearch}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('models')}
          className={`flex-1 px-3 py-2 text-sm font-medium ${
            activeTab === 'models'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Models ({models.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 px-3 py-2 text-sm font-medium ${
            activeTab === 'categories'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 px-3 py-2 text-sm font-medium ${
            activeTab === 'tags'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tags ({tags.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'models' && (
          <ModelList 
            models={displayModels}
            selectedModel={selectedModel}
            onModelSelect={onModelSelect}
            onModelEdit={onModelEdit}
            onBulkOperations={onBulkOperations}
            selectionMode={selectionMode}
            onSelectionChange={onSelectionChange}
            categories={categories}
            tags={tags}
          />
        )}
        
        {activeTab === 'categories' && (
          <CategoryManager 
            categories={categories}
            onCategoryAdd={onCategoryAdd}
          />
        )}
        
        {activeTab === 'tags' && (
          <TagManager 
            tags={tags}
            onTagAdd={onTagAdd}
          />
        )}
      </div>

      {/* Add Model Button */}
      {activeTab === 'models' && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onModelAdd}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Add Model
          </button>
        </div>
      )}
    </div>
  );
}

export default LibraryPanel;