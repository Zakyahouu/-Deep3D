import React from 'react';
import ModelThumbnail from './ModelThumbnail';

function RecentModels({ models, onModelSelect, maxItems = 5 }) {
  // Sort models by updated_at and take the most recent
  const recentModels = models
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, maxItems);

  if (recentModels.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="text-4xl mb-2">🕒</div>
        <p className="text-sm">No recent models</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Models</h3>
      <div className="space-y-2">
        {recentModels.map(model => (
          <button
            key={model.id}
            onClick={() => onModelSelect(model)}
            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ModelThumbnail modelPath={model.file_path} size={40} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {model.name}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(model.updated_at).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default RecentModels;
