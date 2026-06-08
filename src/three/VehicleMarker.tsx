import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Vehicle, VehicleType } from '@/types';
import { vehicleTypeNames, permitTypeNames } from '@/data/vehicles';
import { useSceneStore } from '@/store/useSceneStore';
import { useVehicleStore } from '@/store/useVehicleStore';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  baseY?: number;
}

const typeColors: Record<VehicleType, string> = {
  sedan: '#3b82f6',
  suv: '#8b5cf6',
  truck: '#f59e0b',
  van: '#10b981',
  bus: '#ef4444',
  motorcycle: '#ec4899',
};

function getVehicleSize(type: VehicleType): { width: number; length: number; height: number } {
  switch (type) {
    case 'sedan':
      return { width: 1.8, length: 4.5, height: 1.4 };
    case 'suv':
      return { width: 2.0, length: 4.8, height: 1.7 };
    case 'truck':
      return { width: 2.5, length: 7.0, height: 3.0 };
    case 'van':
      return { width: 2.0, length: 5.0, height: 2.2 };
    case 'bus':
      return { width: 2.5, length: 10.0, height: 3.2 };
    case 'motorcycle':
      return { width: 0.8, length: 2.0, height: 1.2 };
    default:
      return { width: 2.0, length: 4.5, height: 1.5 };
  }
}

export function VehicleMarker({ vehicle, baseY = 0.1 }: VehicleMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const visibleLayers = useSceneStore((s) => s.visibleLayers);
  const selectVehicle = useVehicleStore((s) => s.selectVehicle);
  const selectedVehicleId = useVehicleStore((s) => s.selectedVehicleId);

  const color = typeColors[vehicle.type];
  const size = getVehicleSize(vehicle.type);
  const isSelected = selectedVehicleId === vehicle.id;
  const isVisible = visibleLayers.includes('vehicles');
  const shouldRender = isVisible && !!vehicle.position && vehicle.status !== 'outside';

  useFrame((state) => {
    if (groupRef.current && isSelected) {
      const bobble = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      groupRef.current.position.y = baseY + size.height / 2 + bobble;
    }
  });

  if (!shouldRender) return null;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectVehicle(vehicle.id);
  };

  return (
    <group
      ref={groupRef}
      position={[vehicle.position!.x, baseY + size.height / 2, vehicle.position!.z]}
    >
      <mesh
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
        castShadow
      >
        <boxGeometry args={[size.width, size.height, size.length]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.6 : 0.2}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, size.height * 0.3, size.length / 2 - 0.5]}>
        <boxGeometry args={[size.width * 0.9, size.height * 0.4, 0.2]} />
        <meshStandardMaterial color="#1e293b" emissive="#1e293b" emissiveIntensity={0.1} />
      </mesh>

      {vehicle.status === 'restricted' && (
        <mesh position={[0, size.height + 0.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
        </mesh>
      )}

      {(hovered || isSelected) && (
        <Billboard position={[0, size.height / 2 + 1.5, 0]}>
          <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-900/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-slate-600 shadow-xl min-w-[160px]">
              <div className="font-bold text-sm font-mono" style={{ color }}>
                {vehicle.plateNumber}
              </div>
              <div className="text-slate-400 mt-1">
                {vehicleTypeNames[vehicle.type]} · {vehicle.brand || '未知'}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-slate-500">车主：</span>
                <span className="text-white">{vehicle.ownerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">权限：</span>
                <span style={{ color }}>{permitTypeNames[vehicle.permitType]}</span>
              </div>
              {vehicle.enterTime && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">入场：</span>
                  <span className="text-green-400">{vehicle.enterTime.split(' ')[1]}</span>
                </div>
              )}
            </div>
          </Html>
        </Billboard>
      )}

      <mesh position={[0, -size.height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            Math.max(size.width, size.length) * 0.6,
            Math.max(size.width, size.length) * 0.8,
            32,
          ]}
        />
        <meshBasicMaterial
          color={isSelected ? '#00D4FF' : color}
          transparent
          opacity={isSelected ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function VehicleMarkers({ baseY = 0.1 }: { baseY?: number }) {
  const vehicles = useVehicleStore((s) => s.vehicles);
  const insideVehicles = vehicles.filter((v) => v.status === 'inside' && v.position);

  return (
    <group>
      {insideVehicles.map((vehicle) => (
        <VehicleMarker key={vehicle.id} vehicle={vehicle} baseY={baseY} />
      ))}
    </group>
  );
}
