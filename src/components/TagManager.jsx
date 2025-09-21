import React, { useState } from 'react';

function TagManager({ tags, onTagAdd }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#6B7280'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter a tag name');
      return;
    }

    try {
      setLoading(true);
      await onTagAdd(formData);
      setFormData({ name: '', color: '#6B7280' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding tag:', error);
      alert('Error adding tag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const predefinedColors = [
    '#6B7280', '#3B82F6', '#EF4444', '#10B981', 
    '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'
  ];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Tags</h3>
        <button 
          className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
          onClick={() => setShowAddForm(true)}
        >
          Add Tag
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <div className="text-3xl mb-2">🏷️</div>
            <p className="text-sm">No tags yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div 
                key={tag.id} 
                className="px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
                style={{ 
                  backgroundColor: tag.color
                }}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="mt-5 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Add New Tag</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tagName" className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
              <input
                type="text"
                id="tagName"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter tag name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Color</label>
              <div className="flex gap-2 items-center flex-wrap">
                {predefinedColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                      formData.color === color 
                        ? 'border-gray-800 scale-110 shadow-md' 
                        : 'border-transparent hover:scale-105'
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

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-3 py-1.5 bg-gradient-primary text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Tag'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TagManager;
