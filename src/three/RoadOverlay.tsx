import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { roadSegments } from '@/data/vehicles';
import { useSceneStore } from '@/store/useSceneStore';
import { useTrafficStore } from '@/store/useTrafficStore';

const congestionColors: Record<string, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

function RoadSegmentMesh({ segment, baseY = 0.05 }: { segment: typeof roadSegments[0]; baseY?: number }) {
  const lineRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const { startPoint, endPoint, length, lanes, congestionLevel } = segment;
  const color = congestionColors[congestionLevel];
  const width = lanes * 1.5;

  const midX = (startPoint.x + endPoint.x) / 2;
  const midZ = (startPoint.z + endPoint.z) / 2;

  const angle = Math.atan2(endPoint.z - startPoint.z, endPoint.x - startPoint.x);

  useFrame((state) => {
    if (glowRef.current) {
      const glow = Math.sin(state.clock.elapsedTime * 1.5) * 0.2 + 0.4;
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = glow * (congestionLevel === 'high' ? 1 : 0.5);
    }
  });

  return (
    <group position={[midX, baseY, midZ]} rotation={[0, -angle, 0]}>
      <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.8}
          metalness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, width * 0.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {[...Array(Math.floor(length / 10))].map((_, i) => (
        <mesh
          key={i}
          position={[-length / 2 + 5 + i * 10, 0.03, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[3, 0.2]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function RoadOverlay({ baseY = 0.05 }: { baseY?: number }) {
  const visibleLayers = useSceneStore((s) => s.visibleLayers);
  const segments = useTrafficStore((s) => s.roadSegments);

  const isVisible = visibleLayers.includes('roads');
  if (!isVisible) return null;

  return (
    <group>
      {segments.map((segment) => (
        <RoadSegmentMesh key={segment.id} segment={segment} baseY={baseY} />
      ))}
    </group>
  );
}
