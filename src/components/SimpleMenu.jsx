import React, { useState } from 'react';

const SimpleMenu = ({ 
  onAdvancedSearch,
  onBulkOperations,
  onSettings,
  onExportAll,
  onImportModels,
  onManageCategories,
  onManageTags,
  selectedCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: 'search',
      label: 'Advanced Search',
      icon: '🔍',
      action: onAdvancedSearch,
      description: 'Search with filters and criteria'
    },
    {
      id: 'bulk',
      label: 'Bulk Operations',
      icon: '📦',
      action: onBulkOperations,
      disabled: selectedCount === 0,
      description: `Manage ${selectedCount} selected models`
    },
    {
      id: 'export',
      label: 'Export All',
      icon: '📤',
      action: onExportAll,
      description: 'Export your entire library'
    },
    {
      id: 'import',
      label: 'Import Models',
      icon: '📥',
      action: onImportModels,
      description: 'Import models from files'
    },
    {
      id: 'categories',
      label: 'Manage Categories',
      icon: '📁',
      action: onManageCategories,
      description: 'Organize your models'
    },
    {
      id: 'tags',
      label: 'Manage Tags',
      icon: '🏷️',
      action: onManageTags,
      description: 'Add and organize tags'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      action: onSettings,
      description: 'App preferences and options'
    }
  ];

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="More Options"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-2">
                Advanced Features
              </div>
              
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                  {item.disabled && (
                    <span className="text-xs text-gray-400">(0 selected)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleMenu;
