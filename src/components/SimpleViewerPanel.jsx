import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import ModelViewer from './ModelViewer';

const SimpleViewerPanel = ({ selectedModel, onModelEdit, onModelDelete }) => {
  return (
    <div className="h-full relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="studio" />
        <Grid 
          position={[0, -1, 0]} 
          args={[10, 10]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor="#6f6f6f" 
          sectionSize={3} 
          sectionThickness={1} 
          sectionColor="#9d4edd" 
          fadeDistance={30} 
          fadeStrength={1} 
          followCamera={false} 
          infiniteGrid={true} 
        />
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />
        <ModelViewer 
          modelPath={selectedModel?.file_path} 
          onModelEdit={onModelEdit}
          onModelDelete={onModelDelete}
        />
      </Canvas>

      {/* Overlay Controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        {selectedModel && (
          <>
            <button
              onClick={() => onModelEdit(selectedModel)}
              className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition-colors"
              title="Edit Model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onModelDelete(selectedModel)}
              className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-lg shadow-lg transition-colors"
              title="Delete Model"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-2-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* No Model Selected State */}
      {!selectedModel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Model Selected</h3>
            <p className="text-sm opacity-75">Choose a model from the library to view it here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleViewerPanel;
