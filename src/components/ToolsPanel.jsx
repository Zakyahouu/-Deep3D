import React, { useState } from 'react';
import QuickActions from './QuickActions';
import RecentModels from './RecentModels';
import ModelStats from './ModelStats';
import QuickFilters from './QuickFilters';

function ToolsPanel({ 
  onAdvancedSearch, 
  onToggleSelection, 
  selectionMode, 
  selectedCount,
  onBulkOperations,
  onOpenSettings,
  onExportAll,
  onImportModels,
  selectedModel,
  onModelEdit,
  onModelDelete,
  onModelSelect,
  models,
  categories,
  tags,
  onFilterChange,
  activeFilters
}) {
  const [activeSection, setActiveSection] = useState('quick');

  const tools = [
    {
      id: 'quick',
      name: 'Quick',
      icon: '⚡',
      component: (
        <div className="space-y-4">
          <QuickActions
            selectedModel={selectedModel}
            onEdit={onModelEdit}
            onDelete={onModelDelete}
            onDuplicate={(model) => console.log('Duplicate:', model)}
            onExport={(model) => console.log('Export:', model)}
            onViewDetails={(model) => onModelEdit(model)}
          />
          <RecentModels
            models={models}
            onModelSelect={onModelSelect}
          />
        </div>
      )
    },
    {
      id: 'stats',
      name: 'Stats',
      icon: '📊',
      component: (
        <ModelStats
          models={models}
          categories={categories}
          tags={tags}
        />
      )
    },
    {
      id: 'filters',
      name: 'Filters',
      icon: '🔍',
      component: (
        <QuickFilters
          categories={categories}
          tags={tags}
          onFilterChange={onFilterChange}
          activeFilters={activeFilters}
        />
      )
    },
    {
      id: 'view',
      name: 'View',
      icon: '👁️',
      tools: [
        { name: 'Advanced Search', icon: '🔍', action: onAdvancedSearch },
        { name: 'Toggle Selection', icon: selectionMode ? '✅' : '☑️', action: onToggleSelection },
        { name: 'Reset View', icon: '🔄', action: () => console.log('Reset view') },
        { name: 'Fullscreen', icon: '⛶', action: () => console.log('Fullscreen') }
      ]
    },
    {
      id: 'edit',
      name: 'Edit',
      icon: '✏️',
      tools: [
        { name: 'Bulk Operations', icon: '📦', action: onBulkOperations, disabled: selectedCount === 0 },
        { name: 'Select All', icon: '☑️', action: () => console.log('Select all') },
        { name: 'Clear Selection', icon: '❌', action: () => console.log('Clear selection') }
      ]
    },
    {
      id: 'data',
      name: 'Data',
      icon: '💾',
      tools: [
        { name: 'Export All', icon: '📤', action: onExportAll },
        { name: 'Import Models', icon: '📥', action: onImportModels },
        { name: 'Backup Library', icon: '💾', action: () => console.log('Backup') },
        { name: 'Restore Library', icon: '🔄', action: () => console.log('Restore') }
      ]
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: '⚙️',
      tools: [
        { name: 'App Settings', icon: '⚙️', action: onOpenSettings },
        { name: 'Preferences', icon: '🎨', action: () => console.log('Preferences') },
        { name: 'Keyboard Shortcuts', icon: '⌨️', action: () => console.log('Shortcuts') },
        { name: 'About', icon: 'ℹ️', action: () => console.log('About') }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Tools & Actions</h3>
        {selectionMode && selectedCount > 0 && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {selectedCount} model{selectedCount !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200">
        {tools.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 px-2 py-2 text-xs font-medium ${
              activeSection === section.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg">{section.icon}</span>
              <span>{section.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {(() => {
          const activeTool = tools.find(s => s.id === activeSection);
          if (activeTool?.component) {
            return activeTool.component;
          } else if (activeTool?.tools) {
            return (
              <div className="p-3">
                {activeTool.tools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={tool.action}
                    disabled={tool.disabled}
                    className={`w-full flex items-center gap-3 p-2 rounded-md text-sm transition-colors mb-1 ${
                      tool.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span className="flex-1 text-left">{tool.name}</span>
                    {tool.disabled && (
                      <span className="text-xs text-gray-400">(0 selected)</span>
                    )}
                  </button>
                ))}
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Quick Stats */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Models:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span>Categories:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-medium">0 MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolsPanel;
