import React from 'react';

function ModelStats({ models, categories, tags }) {
  const totalSize = models.reduce((sum, model) => sum + (model.file_size || 0), 0);
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const newestModel = models.length > 0 
    ? models.reduce((newest, model) => 
        new Date(model.created_at) > new Date(newest.created_at) ? model : newest
      )
    : null;

  const stats = [
    {
      label: 'Total Models',
      value: models.length,
      icon: '📦',
      color: 'blue'
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: '📁',
      color: 'green'
    },
    {
      label: 'Tags',
      value: tags.length,
      icon: '🏷️',
      color: 'purple'
    },
    {
      label: 'Total Size',
      value: formatSize(totalSize),
      icon: '💾',
      color: 'orange'
    }
  ];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Library Statistics</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              stat.color === 'blue' ? 'bg-blue-50' :
              stat.color === 'green' ? 'bg-green-50' :
              stat.color === 'purple' ? 'bg-purple-50' :
              'bg-orange-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{stat.icon}</span>
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className={`text-sm font-semibold ${
                  stat.color === 'blue' ? 'text-blue-700' :
                  stat.color === 'green' ? 'text-green-700' :
                  stat.color === 'purple' ? 'text-purple-700' :
                  'text-orange-700'
                }`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {newestModel && (
        <div className="border-t border-gray-200 pt-3">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Latest Addition</h4>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs">📦</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {newestModel.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(newestModel.created_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Quick Tips</h4>
        <div className="space-y-1 text-xs text-gray-500">
          <p>• Use categories to organize models</p>
          <p>• Add tags for better search</p>
          <p>• Export collections for backup</p>
        </div>
      </div>
    </div>
  );
}

export default ModelStats;
