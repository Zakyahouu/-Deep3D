import React, { useState } from 'react';

function CategoryManager({ categories, onCategoryAdd }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#6B7280'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      setLoading(true);
      await onCategoryAdd(formData);
      setFormData({ name: '', color: '#6B7280' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const predefinedColors = [
    '#6B7280', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <button 
          className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          onClick={() => setShowAddForm(true)}
        >
          Add Category
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 1v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 1v4" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No categories yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center gap-3 p-3 rounded-md bg-gray-50 border border-gray-200">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Category</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="categoryName" className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                id="categoryName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Color</label>
              <div className="flex gap-2 items-center flex-wrap">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      formData.color === color 
                        ? 'border-gray-800 scale-110' 
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
                <input
                  type="color"
                  className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Category'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CategoryManager;