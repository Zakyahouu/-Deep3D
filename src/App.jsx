// App.js - Main App Component
import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import ModelViewer from './components/ModelViewer';
import ErrorBoundary from './components/ErrorBoundary';
import LibraryPanel from './components/LibraryPanel';
import Header from './components/Header';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (!window.electronAPI) {
        throw new Error('Electron API not available');
      }
      
      const [modelsData, categoriesData, tagsData] = await Promise.all([
        window.electronAPI.getModels(),
        window.electronAPI.getCategories(),
        window.electronAPI.getTags()
      ]);
      
      setModels(modelsData || []);
      setCategories(categoriesData || []);
      setTags(tagsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  const handleModelAdd = async () => {
    try {
      await loadData(); // Reload all data after model is added
    } catch (error) {
      console.error('Error reloading data after model add:', error);
    }
  };

  const handleCategoryAdd = async (categoryData) => {
    try {
      await window.electronAPI.addCategory(categoryData);
      await loadData(); // Reload all data
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleTagAdd = async (tagData) => {
    try {
      await window.electronAPI.addTag(tagData);
      await loadData(); // Reload all data
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading Presentation 3D Viewer...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden bg-white rounded-t-lg mt-2 mx-2 border border-gray-200">
        <LibraryPanel
          isOpen={sidebarOpen}
          models={models}
          categories={categories}
          tags={tags}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
          onModelAdd={handleModelAdd}
          onCategoryAdd={handleCategoryAdd}
          onTagAdd={handleTagAdd}
        />
        
        <div className="flex-1 relative bg-white rounded-r-lg overflow-hidden">
          <Canvas
            camera={{ position: [5, 5, 5], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="studio" />
            <Grid 
              position={[0, -1, 0]} 
              args={[10, 10]} 
              cellSize={1} 
              cellThickness={0.5} 
              cellColor="#f3f4f6"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#e5e7eb"
            />
            
            {selectedModel && selectedModel.file_path ? (
              <ErrorBoundary>
                <ModelViewer modelPath={selectedModel.file_path} />
              </ErrorBoundary>
            ) : (
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#6b7280" />
              </mesh>
            )}
            
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={20}
            />
          </Canvas>
          
          {!selectedModel && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white bg-opacity-95 p-8 rounded-lg border border-gray-200 max-w-md">
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Welcome to Presentation 3D Viewer
              </h2>
              <p className="text-gray-600">
                Select a model from the library to view it in 3D
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;