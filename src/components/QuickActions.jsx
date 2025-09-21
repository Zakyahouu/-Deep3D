import React from 'react';

function QuickActions({ 
  selectedModel, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onExport,
  onViewDetails 
}) {
  if (!selectedModel) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-2">⚡</div>
        <p className="text-sm">Select a model to see quick actions</p>
      </div>
    );
  }

  const actions = [
    {
      id: 'edit',
      name: 'Edit',
      icon: '✏️',
      action: () => onEdit(selectedModel),
      color: 'blue'
    },
    {
      id: 'duplicate',
      name: 'Duplicate',
      icon: '📋',
      action: () => onDuplicate(selectedModel),
      color: 'green'
    },
    {
      id: 'export',
      name: 'Export',
      icon: '📤',
      action: () => onExport(selectedModel),
      color: 'purple'
    },
    {
      id: 'details',
      name: 'Details',
      icon: 'ℹ️',
      action: () => onViewDetails(selectedModel),
      color: 'gray'
    },
    {
      id: 'delete',
      name: 'Delete',
      icon: '🗑️',
      action: () => onDelete(selectedModel.id),
      color: 'red'
    }
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={action.action}
            className={`w-full flex items-center gap-3 p-2 rounded-md text-sm transition-colors ${
              action.color === 'red' 
                ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                : action.color === 'blue'
                ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                : action.color === 'green'
                ? 'text-green-600 hover:bg-green-50 hover:text-green-700'
                : action.color === 'purple'
                ? 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <span className="text-lg">{action.icon}</span>
            <span className="flex-1 text-left">{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
