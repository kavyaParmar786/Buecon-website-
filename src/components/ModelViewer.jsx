'use client';

/* ═══════════════════════════════════════════
   BUECON — 3D Model Viewer
   Lazy-loaded only when user clicks "View 3D"
   Uses @react-three/fiber + @react-three/drei
   ═══════════════════════════════════════════ */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';

/* Loads and renders the .glb model */
function Model({ path }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1.4} position={[0, -0.5, 0]} />;
}

/* Fallback shown while model is loading */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#C5A46D" wireframe />
    </mesh>
  );
}

export default function ModelViewer({ modelPath }) {
  return (
    <div style={{ width: '100%', height: '100%', background: '#060F18', borderRadius: '12px' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={{ borderRadius: '12px' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={3} color="#FFE8B0" />
        <directionalLight position={[-5, -1, 3]} intensity={1.5} color="#8AACCC" />
        <pointLight position={[0, 2, 3]} intensity={2} color="#C5A46D" />

        {/* Environment for metallic reflections */}
        <Environment preset="studio" />

        {/* Model with Suspense for lazy loading */}
        <Suspense fallback={<LoadingFallback />}>
          <Model path={modelPath} />
        </Suspense>

        {/* Subtle ground shadow */}
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.3}
          scale={4}
          blur={2}
        />

        {/* Mouse drag to rotate, scroll to zoom */}
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>

      <div style={{
        position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
        fontSize: '11px', color: 'rgba(191,199,213,0.4)', letterSpacing: '0.1em',
        pointerEvents: 'none',
      }}>
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
