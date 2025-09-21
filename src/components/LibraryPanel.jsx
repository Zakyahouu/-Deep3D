import React, { useState } from 'react';
import ModelList from './ModelList';
import AddModelDialog from './AddModelDialog';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';
import SearchBar from './SearchBar';

function LibraryPanel({ 
  isOpen, 
  models, 
  categories, 
  tags, 
  selectedModel, 
  onModelSelect, 
  onModelAdd, 
  onCategoryAdd, 
  onTagAdd 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAddModel, setShowAddModel] = useState(false);
  const [activeTab, setActiveTab] = useState('models');

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || model.category_id === selectedCategory;
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tagId => 
        model.tags && model.tags.split(',').some(tag => 
          tags.find(t => t.id === tagId && t.name === tag.trim())
        )
      );
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex bg-gray-50 p-1 rounded-md">
          <button 
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'models' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('models')}
          >
            Models
          </button>
          <button 
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'categories' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button 
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'tags' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('tags')}
          >
            Tags
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {activeTab === 'models' && (
          <>
            <div className="p-4 border-b border-gray-200 space-y-3">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search models..."
              />
              
              <div className="space-y-3">
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                          selectedTags.includes(tag.id) 
                            ? 'text-white border-transparent' 
                            : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                        onClick={() => handleTagToggle(tag.id)}
                        style={{ 
                          backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined
                        }}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
                
                {(searchQuery || selectedCategory || selectedTags.length > 0) && (
                  <button 
                    className="w-full px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <button 
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                onClick={() => setShowAddModel(true)}
              >
                Add Model
              </button>
            </div>

            <ModelList 
              models={filteredModels}
              selectedModel={selectedModel}
              onModelSelect={onModelSelect}
            />
          </>
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

      {showAddModel && (
        <AddModelDialog
          categories={categories}
          tags={tags}
          onClose={() => setShowAddModel(false)}
          onModelAdd={onModelAdd}
        />
      )}
    </div>
  );
}

export default LibraryPanel;
