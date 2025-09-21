import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function ModelViewer({ modelPath }) {
  const [scene, setScene] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const modelRef = useRef();

  useEffect(() => {
    let isCancelled = false;
    
    // Reset state when modelPath changes
    setScene(null);
    setError(null);
    setLoading(false);

    if (!modelPath || typeof modelPath !== 'string' || !modelPath.trim() || modelPath.length <= 3) {
      return;
    }

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert the file path to use our custom protocol
        // For Windows, encode the path properly
        const encodedPath = encodeURIComponent(modelPath);
        const url = `p3dv-models://file/${encodedPath}`;
        console.log('ModelViewer - Original path:', modelPath);
        console.log('ModelViewer - Encoded path:', encodedPath);
        console.log('ModelViewer - Final URL:', url);
        
        // Use THREE.js GLTFLoader directly instead of useGLTF
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        
        const gltf = await new Promise((resolve, reject) => {
          loader.load(
            url,
            (gltf) => resolve(gltf),
            (progress) => {
              // Loading progress
            },
            (error) => reject(error)
          );
        });

        if (isCancelled) return;

        if (gltf && gltf.scene) {
          // Center and scale the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Scale the model to fit in a reasonable size
          const maxDimension = Math.max(size.x, size.y, size.z);
          if (maxDimension > 0) {
            const scale = 2 / maxDimension;
            gltf.scene.scale.setScalar(scale);
            
            // Center the model
            gltf.scene.position.sub(center.multiplyScalar(scale));
          }
          
          if (!isCancelled) {
            setScene(gltf.scene);
            setLoading(false);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error loading 3D model:', err);
          setError(err);
          setLoading(false);
        }
      }
    };

    loadModel();
    
    return () => {
      isCancelled = true;
    };
  }, [modelPath]);

  // Error state
  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
    );
  }

  // Loading state
  if (loading) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
    );
  }

  // No model loaded
  if (!scene) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    );
  }

  // Render the loaded model
  return (
    <primitive 
      ref={modelRef}
      object={scene.clone()} 
      dispose={null}
    />
  );
}

export default ModelViewer;