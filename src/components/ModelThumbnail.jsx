import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function ModelThumbnail({ modelPath, size = 80 }) {
  const [scene, setScene] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!modelPath) return;

    const loadThumbnail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const encodedPath = encodeURIComponent(modelPath);
        const url = `p3dv-models://file/${encodedPath}`;
        
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        
        const gltf = await new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });

        if (gltf && gltf.scene) {
          // Create a simple thumbnail scene
          const thumbnailScene = gltf.scene.clone();
          
          // Center and scale the model
          const box = new THREE.Box3().setFromObject(thumbnailScene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDimension = Math.max(size.x, size.y, size.z);
          if (maxDimension > 0) {
            const scale = 1.5 / maxDimension;
            thumbnailScene.scale.setScalar(scale);
            thumbnailScene.position.sub(center.multiplyScalar(scale));
          }
          
          setScene(thumbnailScene);
        }
      } catch (err) {
        console.error('Error loading thumbnail:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [modelPath]);

  if (loading) {
    return (
      <div 
        className="bg-gray-200 rounded-md flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !scene) {
    return (
      <div 
        className="bg-gray-200 rounded-md flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-gray-500 text-2xl">📦</div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-100 rounded-md overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Canvas
        camera={{ position: [0, 0, 2], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[1, 1, 1]} intensity={0.8} />
        <Environment preset="studio" />
        <primitive object={scene} />
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate={true}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}

export default ModelThumbnail;
