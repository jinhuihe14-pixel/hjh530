import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Lights() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime * 0.1;
      lightRef.current.position.x = Math.sin(t) * 50;
      lightRef.current.position.z = Math.cos(t) * 50;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} color="#8899aa" />
      <directionalLight
        ref={lightRef}
        position={[30, 50, 30]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#ffddaa" distance={100} />
      <pointLight position={[-30, 5, -20]} intensity={0.5} color="#ffaa66" distance={40} />
      <pointLight position={[30, 5, 20]} intensity={0.5} color="#66aaff" distance={40} />
      <hemisphereLight args={['#87ceeb', '#1a1a2e', 0.3]} />
    </>
  );
}
