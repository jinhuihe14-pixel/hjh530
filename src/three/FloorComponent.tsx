import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Floor } from '@/types';
import { getShopsByFloor } from '@/data/shops';
import { getFacilitiesByFloor } from '@/data/facilities';
import { ShopComponent } from './ShopComponent';
import { FacilityMarker } from './FacilityMarker';
import { useSceneStore } from '@/store/useSceneStore';

interface FloorComponentProps {
  floor: Floor;
}

export function FloorComponent({ floor }: FloorComponentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const visibleFloors = useSceneStore((s) => s.visibleFloors);
  const shops = useMemo(() => getShopsByFloor(floor.id), [floor.id]);
  const facilities = useMemo(() => getFacilitiesByFloor(floor.id), [floor.id]);

  const isVisible = visibleFloors.includes(floor.id);
  const currentFloor = useSceneStore((s) => s.currentFloor);
  const isCurrent = currentFloor === floor.id;

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetOpacity = isVisible ? 1 : 0;
      const firstChild = groupRef.current.children[0] as THREE.Mesh;
      const firstMaterial = firstChild?.material as THREE.MeshStandardMaterial;
      const currentOpacity = firstMaterial?.opacity ?? 0;
      const newOpacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, delta * 5);

      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            if (mat && 'transparent' in mat) {
              (mat as THREE.MeshStandardMaterial).opacity = newOpacity;
            }
          });
        }
      });

      const targetY = isVisible ? floor.baseY : floor.baseY - 10;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        delta * 3
      );
    }
  });

  const { width, depth } = floor.dimensions;
  const floorY = floor.baseY;

  return (
    <group ref={groupRef} position={[0, floor.baseY, 0]}>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
          color={floor.color}
          transparent
          opacity={0.9}
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0, floor.height / 2, -depth / 2]}>
        <boxGeometry args={[width, floor.height, 0.3]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, floor.height / 2, depth / 2]}>
        <boxGeometry args={[width, floor.height, 0.3]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-width / 2, floor.height / 2, 0]}>
        <boxGeometry args={[0.3, floor.height, depth]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[width / 2, floor.height / 2, 0]}>
        <boxGeometry args={[0.3, floor.height, depth]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      <gridHelper
        args={[width, 20, '#2a3f5f', '#1a2f4f']}
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {shops.map((shop) => (
        <ShopComponent key={shop.id} shop={shop} floorY={floorY} />
      ))}

      {facilities.map((facility) => (
        <FacilityMarker key={facility.id} facility={facility} floorY={floorY} />
      ))}

      {isCurrent && (
        <mesh position={[0, floor.height - 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.min(width, depth) / 2 - 2, Math.min(width, depth) / 2, 64]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 2, depth - 2]} />
        <meshStandardMaterial
          color="#0a1628"
          transparent
          opacity={0.5}
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}
