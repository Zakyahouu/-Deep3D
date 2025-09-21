import React from 'react';

function ModelList({ models, selectedModel, onModelSelect }) {
  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
        <div className="text-4xl mb-4">📦</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No models found</h3>
        <p className="text-sm">Add your first 3D model to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {models.map(model => (
        <div
          key={model.id}
          className={`flex gap-3 p-3 rounded-md cursor-pointer transition-colors border ${
            selectedModel?.id === model.id 
              ? 'bg-gray-50 border-gray-300' 
              : 'border-transparent hover:bg-gray-50'
          }`}
          onClick={() => onModelSelect(model)}
        >
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
            {model.thumbnail_path ? (
              <img 
                src={model.thumbnail_path} 
                alt={model.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="text-lg text-gray-400"
              style={{ display: model.thumbnail_path ? 'none' : 'flex' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate mb-1">{model.name}</h4>
            {model.category_name && (
              <div 
                className="text-xs font-medium mb-1"
                style={{ color: model.category_color || '#6b7280' }}
              >
                {model.category_name}
              </div>
            )}
            {model.tags && (
              <div className="flex flex-wrap gap-1">
                {model.tags.split(',').slice(0, 2).map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                    {tag.trim()}
                  </span>
                ))}
                {model.tags.split(',').length > 2 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                    +{model.tags.split(',').length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ModelList;
