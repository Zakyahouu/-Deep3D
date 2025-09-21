import React, { useState } from 'react';

const BulkOperations = ({ 
  selectedModels, 
  onBulkDelete, 
  onBulkMove, 
  onBulkExport, 
  onBulkTag,
  categories, 
  tags,
  onClose 
}) => {
  const [activeOperation, setActiveOperation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Operation-specific state
  const [moveToCategory, setMoveToCategory] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState([]);
  const [tagsToRemove, setTagsToRemove] = useState([]);
  const [exportFormat, setExportFormat] = useState('collection');

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedModels.length} models? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onBulkDelete(selectedModels.map(m => m.id));
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to delete models');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkMove = async () => {
    if (!moveToCategory) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onBulkMove(selectedModels.map(m => m.id), parseInt(moveToCategory) || null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to move models');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkTag = async () => {
    if (tagsToAdd.length === 0 && tagsToRemove.length === 0) {
      setError('Please select tags to add or remove');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onBulkTag(selectedModels.map(m => m.id), tagsToAdd, tagsToRemove);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update tags');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = async () => {
    setLoading(true);
    setError('');

    try {
      await onBulkExport(selectedModels.map(m => m.id), exportFormat);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to export models');
    } finally {
      setLoading(false);
    }
  };

  const toggleTagForAdd = (tagId) => {
    setTagsToAdd(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const toggleTagForRemove = (tagId) => {
    setTagsToRemove(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };

  const totalSize = selectedModels.reduce((sum, model) => sum + (model.file_size || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Bulk Operations
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

        <div className="p-6">
          {/* Selection Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">Selected Models</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">{selectedModels.length}</span>
                <span className="text-blue-600 ml-1">models selected</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">{formatFileSize(totalSize)}</span>
                <span className="text-blue-600 ml-1">total size</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">
                  {new Set(selectedModels.map(m => m.category_id)).size}
                </span>
                <span className="text-blue-600 ml-1">categories</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Operation Selection */}
          {!activeOperation && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveOperation('move')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Move to Category</h3>
                </div>
                <p className="text-gray-600">Move selected models to a different category</p>
              </button>

              <button
                onClick={() => setActiveOperation('tag')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Manage Tags</h3>
                </div>
                <p className="text-gray-600">Add or remove tags from selected models</p>
              </button>

              <button
                onClick={() => setActiveOperation('export')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Export Models</h3>
                </div>
                <p className="text-gray-600">Export selected models as a collection or archive</p>
              </button>

              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="p-6 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
              >
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">Delete Models</h3>
                </div>
                <p className="text-gray-600">Permanently delete selected models</p>
              </button>
            </div>
          )}

          {/* Move Operation */}
          {activeOperation === 'move' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Move to Category</h3>
                <button
                  onClick={() => setActiveOperation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Target Category
                </label>
                <select
                  value={moveToCategory}
                  onChange={(e) => setMoveToCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActiveOperation(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkMove}
                  disabled={loading || !moveToCategory}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Moving...' : `Move ${selectedModels.length} Models`}
                </button>
              </div>
            </div>
          )}

          {/* Tag Operation */}
          {activeOperation === 'tag' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Manage Tags</h3>
                <button
                  onClick={() => setActiveOperation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-green-700">Tags to Add</h4>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {tags.map(tag => (
                      <label
                        key={`add-${tag.id}`}
                        className="flex items-center p-2 hover:bg-green-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={tagsToAdd.includes(tag.id)}
                          onChange={() => toggleTagForAdd(tag.id)}
                          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-red-700">Tags to Remove</h4>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {tags.map(tag => (
                      <label
                        key={`remove-${tag.id}`}
                        className="flex items-center p-2 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={tagsToRemove.includes(tag.id)}
                          onChange={() => toggleTagForRemove(tag.id)}
                          className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActiveOperation(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkTag}
                  disabled={loading || (tagsToAdd.length === 0 && tagsToRemove.length === 0)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Updating...' : `Update ${selectedModels.length} Models`}
                </button>
              </div>
            </div>
          )}

          {/* Export Operation */}
          {activeOperation === 'export' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Export Models</h3>
                <button
                  onClick={() => setActiveOperation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="collection">P3DV Collection (JSON + Models)</option>
                  <option value="archive">ZIP Archive (Models Only)</option>
                  <option value="metadata">Metadata Only (JSON)</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Export Details</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {selectedModels.length} models will be exported</li>
                  <li>• Total size: {formatFileSize(totalSize)}</li>
                  <li>• {exportFormat === 'collection' ? 'Includes metadata and model files' : 
                         exportFormat === 'archive' ? 'Model files only' : 'Metadata only'}</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActiveOperation(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkExport}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Exporting...' : `Export ${selectedModels.length} Models`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;
