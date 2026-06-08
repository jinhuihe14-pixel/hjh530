import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Shop } from '@/types';
import { useShopStore } from '@/store/useShopStore';
import { categoryNames } from '@/data/shops';
import { useSceneStore } from '@/store/useSceneStore';

interface ShopComponentProps {
  shop: Shop;
  floorY: number;
}

export function ShopComponent({ shop, floorY }: ShopComponentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectedShopId = useShopStore((s) => s.selectedShopId);
  const selectShop = useShopStore((s) => s.selectShop);
  const setActivePanel = useSceneStore((s) => s.setActivePanel);
  const searchQuery = useSceneStore((s) => s.searchQuery);

  const isSelected = selectedShopId === shop.id;
  const isHighlighted = searchQuery
    ? shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.brand.toLowerCase().includes(searchQuery.toLowerCase())
    : false;

  const { width, depth, height } = shop.dimensions;
  const { x, z } = shop.position;
  const y = floorY + height / 2;

  const displayColor = useMemo(() => {
    if (shop.status === 'vacant') return '#374151';
    if (isSelected) return '#00D4FF';
    if (hovered) return new THREE.Color(shop.color).multiplyScalar(1.3).getStyle();
    if (isHighlighted) return new THREE.Color(shop.color).multiplyScalar(1.2).getStyle();
    return shop.color;
  }, [shop, isSelected, hovered, isHighlighted]);

  const isExpiringSoon = useMemo(() => {
    if (!shop.leaseEndDate || shop.status !== 'operating') return false;
    const endDate = new Date(shop.leaseEndDate);
    const now = new Date();
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 90 && diffDays > 0;
  }, [shop.leaseEndDate, shop.status]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      } else if (hovered) {
        material.emissiveIntensity = 0.2;
      } else {
        material.emissiveIntensity = 0.05;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectShop(shop.id);
    setActivePanel('shops');
  };

  return (
    <group position={[x, y, z]}>
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
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={displayColor}
          transparent
          opacity={shop.status === 'vacant' ? 0.3 : 0.9}
          emissive={displayColor}
          emissiveIntensity={0.05}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {shop.status === 'operating' && (
        <mesh position={[0, height / 2 + 0.1, 0]}>
          <planeGeometry args={[width * 0.9, 0.8]} />
          <meshStandardMaterial
            color={shop.color}
            emissive={shop.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}

      {isExpiringSoon && (
        <mesh position={[0, height * 0.3, depth / 2 + 0.05]} rotation={[0, 0, 0]}>
          <planeGeometry args={[width * 0.8, 0.5]} />
          <meshBasicMaterial color="#FFB454" transparent opacity={0.9} />
        </mesh>
      )}

      {shop.status === 'vacant' && (
        <mesh position={[0, 0, depth / 2 + 0.05]}>
          <planeGeometry args={[width * 0.7, 0.8]} />
          <meshBasicMaterial color="#374151" transparent opacity={0.8} />
        </mesh>
      )}

      {(hovered || isSelected) && shop.status === 'operating' && (
        <Html
          position={[0, height + 1, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-slate-900/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-cyan-500/50 shadow-lg shadow-cyan-500/20">
            <div className="font-bold text-cyan-300">{shop.name}</div>
            <div className="text-xs text-gray-400">{categoryNames[shop.category]}</div>
          </div>
        </Html>
      )}

      {isHighlighted && searchQuery && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[width + 0.5, height + 0.5, depth + 0.5]} />
          <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}
