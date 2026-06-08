import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Platform } from '@/types';
import { platformStatusNames, platformStatusColors } from '@/data/platforms';
import { useSceneStore } from '@/store/useSceneStore';
import { usePlatformStore } from '@/store/usePlatformStore';

interface PlatformMarkerProps {
  platform: Platform;
  baseY?: number;
}

export function PlatformMarker({ platform, baseY = 0.1 }: PlatformMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const visibleLayers = useSceneStore((s) => s.visibleLayers);
  const selectPlatform = usePlatformStore((s) => s.selectPlatform);
  const selectedPlatformId = usePlatformStore((s) => s.selectedPlatformId);

  const color = platformStatusColors[platform.status];
  const isSelected = selectedPlatformId === platform.id;
  const isVisible = visibleLayers.includes('platforms');
  const width = 6;
  const depth = 4;
  const height = 0.5;
  const shouldAnimate = platform.status === 'overtime' || isSelected;

  useFrame((state) => {
    if (groupRef.current && shouldAnimate) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      groupRef.current.scale.setScalar(pulse);
    }
  });

  if (!isVisible) return null;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectPlatform(platform.id);
  };

  return (
    <group ref={groupRef} position={[platform.position.x, baseY + height / 2, platform.position.z]}>
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
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.5, depth - 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh position={[0, height + 0.3, 0]}>
        <boxGeometry args={[0.3, 0.6, 0.3]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {(hovered || isSelected) && (
        <Billboard position={[0, height + 2, 0]}>
          <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-900/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-slate-600 shadow-xl min-w-[160px]">
              <div className="font-bold text-sm" style={{ color }}>
                {platform.name}
              </div>
              <div
                className="mt-1 px-2 py-0.5 rounded inline-block text-xs"
                style={{ backgroundColor: `${color}30`, color }}
              >
                {platformStatusNames[platform.status]}
              </div>
              {platform.currentPlateNumber && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-slate-500">当前车辆：</span>
                  <span className="font-mono text-white">{platform.currentPlateNumber}</span>
                </div>
              )}
              {platform.remainingTime !== undefined && platform.status === 'occupied' && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">剩余时间：</span>
                  <span className={platform.remainingTime < 0 ? 'text-red-400' : 'text-green-400'}>
                    {platform.remainingTime < 0
                      ? `超时 ${Math.abs(platform.remainingTime)} 分钟`
                      : `${platform.remainingTime} 分钟`}
                  </span>
                </div>
              )}
              {platform.reservedBy && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">预约人：</span>
                  <span className="text-white">{platform.reservedBy}</span>
                </div>
              )}
            </div>
          </Html>
        </Billboard>
      )}

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.max(width, depth) * 0.6, Math.max(width, depth) * 0.8, 32]} />
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

export function PlatformMarkers({ baseY = 0.1 }: { baseY?: number }) {
  const platforms = usePlatformStore((s) => s.platforms);

  return (
    <group>
      {platforms.map((platform) => (
        <PlatformMarker key={platform.id} platform={platform} baseY={baseY} />
      ))}
    </group>
  );
}
