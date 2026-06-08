import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Facility, FacilityType, FacilityStatus } from '@/types';
import { facilityTypeNames } from '@/data/facilities';
import { useSceneStore } from '@/store/useSceneStore';

interface FacilityMarkerProps {
  facility: Facility;
  floorY: number;
}

const typeColors: Record<FacilityType, string> = {
  escalator: '#f59e0b',
  elevator: '#8b5cf6',
  toilet: '#3b82f6',
  fire: '#ef4444',
  camera: '#10b981',
  exit: '#22c55e',
  electric: '#f97316',
  atm: '#06b6d4',
  information: '#ec4899',
};

const statusColors: Record<FacilityStatus, string> = {
  normal: '#22c55e',
  warning: '#f59e0b',
  fault: '#ef4444',
};

function getIconShape(type: FacilityType): number[] {
  switch (type) {
    case 'escalator':
    case 'elevator':
      return [0.8, 0.8, 0.3];
    case 'toilet':
      return [0.7, 0.7, 0.3];
    case 'fire':
      return [0.6, 0.6, 0.6];
    case 'camera':
      return [0.5, 0.5, 0.3];
    case 'exit':
      return [0.8, 0.5, 0.2];
    case 'electric':
      return [0.6, 0.6, 0.3];
    case 'atm':
      return [0.5, 0.8, 0.3];
    case 'information':
      return [0.6, 0.6, 0.3];
    default:
      return [0.6, 0.6, 0.3];
  }
}

export function FacilityMarker({ facility, floorY }: FacilityMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const visibleLayers = useSceneStore((s) => s.visibleLayers);

  const layerMap: Record<FacilityType, string> = {
    escalator: 'escalators',
    elevator: 'elevators',
    toilet: 'toilets',
    fire: 'fireEquipment',
    camera: 'cameras',
    exit: 'exits',
    electric: 'electric',
    atm: 'services',
    information: 'services',
  };

  const isVisible = visibleLayers.includes(layerMap[facility.type]);

  const baseColor = typeColors[facility.type];
  const statusColor = statusColors[facility.status];
  const [sx, sy, sz] = getIconShape(facility.type);

  const positionY = floorY + 1.5;

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(hovered ? 1.3 : pulse);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = hovered ? 0.8 : 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  if (!isVisible) return null;

  const handleClick = (e: any) => {
    e.stopPropagation();
    console.log('Facility clicked:', facility);
  };

  return (
    <group position={[facility.position.x, positionY, facility.position.z]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[sx, sy, sz]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {facility.status !== 'normal' && (
        <mesh position={[sx / 2 + 0.1, sy / 2 + 0.1, sz / 2]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color={statusColor} />
        </mesh>
      )}

      {hovered && (
        <Billboard position={[0, sy + 0.5, 0]}>
          <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-900/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-slate-600 shadow-xl">
              <div className="font-bold" style={{ color: baseColor }}>
                {facility.name}
              </div>
              <div className="text-gray-400">{facilityTypeNames[facility.type]}</div>
              {facility.status !== 'normal' && (
                <div className="text-xs mt-1" style={{ color: statusColor }}>
                  状态：{facility.status === 'warning' ? '预警' : '故障'}
                </div>
              )}
            </div>
          </Html>
        </Billboard>
      )}

      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 16]} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
