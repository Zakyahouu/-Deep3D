import React, { useState, useEffect } from 'react';

const SettingsDialog = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    autoSave: true,
    showThumbnails: true,
    defaultView: 'list',
    maxFileSize: 100, // MB
    enableAnimations: true,
    autoBackup: false,
    backupInterval: 24, // hours
    compressionLevel: 'medium',
    language: 'en',
    showHints: true,
    confirmDelete: true
  });

  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (isOpen) {
      // Load settings from localStorage or electron store
      loadSettings();
    }
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('p3dv-settings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('p3dv-settings', JSON.stringify(settings));
      }
      if (onSave && typeof onSave === 'function') {
        onSave(settings);
      }
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const resetToDefaults = () => {
    setSettings({
      theme: 'light',
      autoSave: true,
      showThumbnails: true,
      defaultView: 'list',
      maxFileSize: 100,
      enableAnimations: true,
      autoBackup: false,
      backupInterval: 24,
      compressionLevel: 'medium',
      language: 'en',
      showHints: true,
      confirmDelete: true
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'general', label: 'General', icon: '⚙️' },
              { id: 'appearance', label: 'Appearance', icon: '🎨' },
              { id: 'performance', label: 'Performance', icon: '⚡' },
              { id: 'backup', label: 'Backup', icon: '💾' },
              { id: 'advanced', label: 'Advanced', icon: '🔧' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Auto-save changes</span>
                    <p className="text-xs text-gray-500">Automatically save model changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Show confirmation on delete</span>
                    <p className="text-xs text-gray-500">Ask for confirmation before deleting models</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.confirmDelete}
                    onChange={(e) => handleSettingChange('confirmDelete', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Show hints and tips</span>
                    <p className="text-xs text-gray-500">Display helpful hints throughout the app</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showHints}
                    onChange={(e) => handleSettingChange('showHints', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default view mode
                </label>
                <select
                  value={settings.defaultView}
                  onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="list">List View</option>
                  <option value="grid">Grid View</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Show thumbnails</span>
                    <p className="text-xs text-gray-500">Display model thumbnails in lists</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showThumbnails}
                    onChange={(e) => handleSettingChange('showThumbnails', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Enable animations</span>
                    <p className="text-xs text-gray-500">Use smooth transitions and animations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enableAnimations}
                    onChange={(e) => handleSettingChange('enableAnimations', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum file size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum size for imported model files</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compression level
                </label>
                <select
                  value={settings.compressionLevel}
                  onChange={(e) => handleSettingChange('compressionLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">No Compression</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Higher compression saves space but takes more time</p>
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Enable automatic backup</span>
                    <p className="text-xs text-gray-500">Automatically backup your model library</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </label>
              </div>

              {settings.autoBackup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup interval (hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={settings.backupInterval}
                    onChange={(e) => handleSettingChange('backupInterval', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">How often to create automatic backups</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Create Backup Now
                </button>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Advanced Settings</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>These settings are for advanced users only. Changing them may affect application performance or stability.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  Clear Cache
                </button>
                
                <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                  Reset Database Indexes
                </button>
                
                <button 
                  onClick={resetToDefaults}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Reset All Settings to Default
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Application Info</h4>
                <dl className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <dt>Version:</dt>
                    <dd>1.0.0</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Build:</dt>
                    <dd>2024.09.21</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Electron:</dt>
                    <dd>{window.electronAPI?.versions?.electron || 'Unknown'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Node:</dt>
                    <dd>{window.electronAPI?.versions?.node || 'Unknown'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;
