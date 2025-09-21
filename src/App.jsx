// App.js - Main App Component with New Multi-Panel Layout
import React, { useState, useEffect } from 'react';
import SimpleLayout from './components/SimpleLayout';
import SimpleLibraryPanel from './components/SimpleLibraryPanel';
import SimpleViewerPanel from './components/SimpleViewerPanel';
import SimpleInfoPanel from './components/SimpleInfoPanel';
import SimpleMenu from './components/SimpleMenu';
import ModelDetailsDialog from './components/ModelDetailsDialog';
import AdvancedSearch from './components/AdvancedSearch';
import BulkOperations from './components/BulkOperations';
import SettingsDialog from './components/SettingsDialog';
import AddModelDialog from './components/AddModelDialog';
import errorHandler from './utils/errorHandler';

function App() {
  // Core state
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI state
  const [modelDetailsOpen, setModelDetailsOpen] = useState(false);
  const [selectedModelForDetails, setSelectedModelForDetails] = useState(null);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [bulkOperationsOpen, setBulkOperationsOpen] = useState(false);
  const [selectedModelsForBulk, setSelectedModelsForBulk] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addModelOpen, setAddModelOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (!errorHandler.isElectronAPIReady()) {
        throw new Error('Electron API not available');
      }
      
      const [modelsData, categoriesData, tagsData] = await Promise.all([
        errorHandler.safeElectronCall('getModels'),
        errorHandler.safeElectronCall('getCategories'),
        errorHandler.safeElectronCall('getTags')
      ]);
      
      // Ensure data is always an array with validation
      setModels(errorHandler.safeArrayOperation(modelsData, (arr) => arr, []));
      setCategories(errorHandler.safeArrayOperation(categoriesData, (arr) => arr, []));
      setTags(errorHandler.safeArrayOperation(tagsData, (arr) => arr, []));
    } catch (error) {
      console.error('Error loading data:', error);
      alert(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    if (model && typeof model === 'object' && model.id) {
      setSelectedModel(model);
    } else {
      console.warn('Invalid model selected:', model);
    }
  };

  const handleModelAdd = async () => {
    setAddModelOpen(true);
  };

  const handleModelAdded = async () => {
    await loadData();
    setAddModelOpen(false);
  };

  const handleCategoryAdd = async (categoryData) => {
    try {
      await errorHandler.safeElectronCall('addCategory', categoryData);
      await loadData();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleTagAdd = async (tagData) => {
    try {
      await errorHandler.safeElectronCall('addTag', tagData);
      await loadData();
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  // Enhanced CRUD handlers
  const handleModelEdit = (model) => {
    setSelectedModelForDetails(model);
    setModelDetailsOpen(true);
  };

  const handleModelSave = async (updatedModel) => {
    try {
      if (!errorHandler.isElectronAPIReady()) {
        throw new Error('Electron API not available');
      }
      if (!updatedModel || !updatedModel.id) {
        throw new Error('Invalid model data');
      }
      await errorHandler.safeElectronCall('updateModel', updatedModel.id, updatedModel);
      await loadData();
      console.log('Model updated successfully');
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  };

  const handleModelDelete = async (modelId) => {
    try {
      if (!errorHandler.isElectronAPIReady()) {
        throw new Error('Electron API not available');
      }
      if (!modelId) {
        throw new Error('Invalid model ID');
      }
      await errorHandler.safeElectronCall('deleteModel', modelId);
      await loadData();
      if (selectedModel?.id === modelId) {
        setSelectedModel(null);
      }
      console.log('Model deleted successfully');
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  };

  const handleAdvancedSearch = (results, criteria) => {
    setFilteredModels(results);
    setSearchActive(true);
    console.log('Search applied:', criteria, 'Results:', results.length);
  };

  const clearSearch = () => {
    setFilteredModels([]);
    setSearchActive(false);
    setSearchQuery('');
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedModelsForBulk([]);
    }
  };

  const handleSelectionChange = (selectedModels) => {
    setSelectedModelsForBulk(selectedModels);
  };

  const handleBulkOperations = (selectedModels) => {
    setSelectedModelsForBulk(selectedModels);
    setBulkOperationsOpen(true);
  };

  const handleBulkDelete = async (modelIds) => {
    try {
      if (!errorHandler.isElectronAPIReady()) {
        throw new Error('Electron API not available');
      }
      if (!Array.isArray(modelIds) || modelIds.length === 0) {
        throw new Error('No models selected for deletion');
      }
      await errorHandler.safeElectronCall('bulkDeleteModels', modelIds);
      await loadData();
      setSelectionMode(false);
      setSelectedModelsForBulk([]);
      console.log(`${modelIds.length} models deleted successfully`);
    } catch (error) {
      console.error('Error bulk deleting models:', error);
      throw error;
    }
  };

  const handleBulkMove = async (modelIds, categoryId) => {
    try {
      await errorHandler.safeElectronCall('bulkMoveModels', modelIds, categoryId);
      await loadData();
      setSelectionMode(false);
      setSelectedModelsForBulk([]);
      console.log(`${modelIds.length} models moved successfully`);
    } catch (error) {
      console.error('Error bulk moving models:', error);
      throw error;
    }
  };

  const handleBulkTag = async (modelIds, tagsToAdd, tagsToRemove) => {
    try {
      await errorHandler.safeElectronCall('bulkTagModels', modelIds, tagsToAdd, tagsToRemove);
      await loadData();
      setSelectionMode(false);
      setSelectedModelsForBulk([]);
      console.log(`${modelIds.length} models tagged successfully`);
    } catch (error) {
      console.error('Error bulk tagging models:', error);
      throw error;
    }
  };

  const handleBulkExport = async (modelIds, format) => {
    try {
      await errorHandler.safeElectronCall('exportModels', modelIds, format);
      console.log(`${modelIds.length} models exported successfully`);
    } catch (error) {
      console.error('Error exporting models:', error);
      throw error;
    }
  };

  const handleSettingsSave = (settings) => {
    setSettingsOpen(false);
    console.log('Settings saved:', settings);
  };

  const handleExportAll = async () => {
    try {
      await errorHandler.safeElectronCall('exportModels', models.map(m => m.id), 'collection');
      console.log('All models exported successfully');
    } catch (error) {
      console.error('Error exporting all models:', error);
    }
  };

  const handleImportModels = () => {
    // TODO: Implement import functionality
    console.log('Import models clicked');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      clearSearch();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Presentation 3D Viewer</h2>
          <p className="text-gray-600 font-medium">Initializing your 3D model library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <SimpleLayout
        leftPanel={
          <SimpleLibraryPanel
            models={searchActive ? filteredModels : models}
            categories={categories}
            tags={tags}
            selectedModel={selectedModel}
            onModelSelect={handleModelSelect}
            onModelAdd={handleModelAdd}
          />
        }
        centerPanel={
          <SimpleViewerPanel
            selectedModel={selectedModel}
            onModelEdit={handleModelEdit}
            onModelDelete={handleModelDelete}
          />
        }
        rightPanel={
          <SimpleInfoPanel
            selectedModel={selectedModel}
            onModelEdit={handleModelEdit}
            onModelDelete={handleModelDelete}
            categories={categories}
            tags={tags}
          />
        }
        topMenu={
          <SimpleMenu
            onAdvancedSearch={() => setAdvancedSearchOpen(true)}
            onBulkOperations={() => handleBulkOperations(selectedModelsForBulk)}
            onSettings={() => setSettingsOpen(true)}
            onExportAll={handleExportAll}
            onImportModels={handleImportModels}
            onManageCategories={() => console.log('Manage categories')}
            onManageTags={() => console.log('Manage tags')}
            selectedCount={selectedModelsForBulk.length}
          />
        }
      />

      {/* Dialogs */}
      <AddModelDialog
        isOpen={addModelOpen}
        onClose={() => setAddModelOpen(false)}
        onModelAdd={handleModelAdded}
        categories={categories}
        tags={tags}
      />

      <ModelDetailsDialog
        isOpen={modelDetailsOpen}
        onClose={() => {
          setModelDetailsOpen(false);
          setSelectedModelForDetails(null);
        }}
        model={selectedModelForDetails}
        categories={categories}
        tags={tags}
        onSave={handleModelSave}
        onDelete={handleModelDelete}
      />

      <AdvancedSearch
        isOpen={advancedSearchOpen}
        onClose={() => setAdvancedSearchOpen(false)}
        onSearch={handleAdvancedSearch}
        categories={categories}
        tags={tags}
        models={models}
      />

      {bulkOperationsOpen && (
        <BulkOperations
          selectedModels={selectedModelsForBulk}
          onBulkDelete={handleBulkDelete}
          onBulkMove={handleBulkMove}
          onBulkExport={handleBulkExport}
          onBulkTag={handleBulkTag}
          categories={categories}
          tags={tags}
          onClose={() => {
            setBulkOperationsOpen(false);
            setSelectedModelsForBulk([]);
          }}
        />
      )}

      <SettingsDialog
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  );
}

export default App;