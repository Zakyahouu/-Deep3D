import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import ModelViewer from './ModelViewer';
import ErrorBoundary from './ErrorBoundary';

function ModelViewerPanel({ selectedModel, onModelAdd }) {
  return (
    <div className="h-full bg-gray-900 relative">
      {/* 3D Viewer */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Environment preset="studio" />
        <Grid 
          position={[0, -2, 0]} 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#6b7280" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#9ca3af" 
          fadeDistance={30} 
          fadeStrength={1} 
          followCamera={false} 
          infiniteGrid={true} 
        />
        
        <ErrorBoundary>
          <ModelViewer modelPath={selectedModel?.file_path} />
        </ErrorBoundary>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={20}
        />
      </Canvas>

      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Model Info */}
        {selectedModel ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h3 className="font-semibold text-gray-900">{selectedModel.name}</h3>
            {selectedModel.description && (
              <p className="text-sm text-gray-600 mt-1">{selectedModel.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {selectedModel.category_name && (
                <span 
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{ 
                    backgroundColor: selectedModel.category_color + '20',
                    color: selectedModel.category_color 
                  }}
                >
                  {selectedModel.category_name}
                </span>
              )}
              {selectedModel.file_size && (
                <span className="text-xs text-gray-500">
                  {(selectedModel.file_size / (1024 * 1024)).toFixed(1)} MB
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Model Selected</h3>
            <p className="text-gray-600 mb-4">Choose a model from the library to view it here</p>
            <button
              onClick={onModelAdd}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Model
            </button>
          </div>
        )}

        {/* View Controls */}
        <div className="flex flex-col gap-2">
          <button
            className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
            title="Reset View"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:bg-white transition-colors"
            title="Toggle Grid"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Ready to view 3D models</span>
            <div className="flex items-center gap-4">
              <span>Mouse: Rotate • Scroll: Zoom • Right-click: Pan</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelViewerPanel;
