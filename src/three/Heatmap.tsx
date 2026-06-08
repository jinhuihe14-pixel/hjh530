import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { heatmapData } from '@/data/heatmapPatrol';
import { useSceneStore } from '@/store/useSceneStore';
import { getFloorById } from '@/data/floors';

interface HeatmapFloorProps {
  floorId: string;
}

function HeatmapFloor({ floorId }: HeatmapFloorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const data = heatmapData[floorId];
  const floor = getFloorById(floorId);
  const isVisible = useSceneStore((s) => s.visibleFloors.includes(floorId));

  useEffect(() => {
    if (!data || !floor) return;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, 512, 512);

    const { width, depth } = floor.dimensions;
    const scaleX = 512 / width;
    const scaleZ = 512 / depth;

    for (const point of data.points) {
      const x = 256 + point.x * scaleX;
      const y = 256 + point.z * scaleZ;
      const radius = 30 + point.intensity * 40;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

      const intensity = point.intensity;
      if (intensity > 0.7) {
        gradient.addColorStop(0, `rgba(255, 50, 50, ${intensity * 0.8})`);
        gradient.addColorStop(0.4, `rgba(255, 150, 50, ${intensity * 0.5})`);
        gradient.addColorStop(0.7, `rgba(255, 255, 50, ${intensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(50, 50, 255, 0)');
      } else if (intensity > 0.4) {
        gradient.addColorStop(0, `rgba(255, 200, 50, ${intensity * 0.7})`);
        gradient.addColorStop(0.5, `rgba(100, 255, 100, ${intensity * 0.4})`);
        gradient.addColorStop(1, 'rgba(50, 100, 255, 0)');
      } else {
        gradient.addColorStop(0, `rgba(50, 200, 255, ${intensity * 0.6})`);
        gradient.addColorStop(0.6, `rgba(50, 100, 255, ${intensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(50, 50, 255, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    textureRef.current = texture;

    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshBasicMaterial).map = texture;
      (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
    }
  }, [data, floor]);

  if (!floor || !isVisible) return null;

  return (
    <mesh
      ref={meshRef}
      position={[0, floor.baseY + 0.2, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[floor.dimensions.width, floor.dimensions.depth]} />
      <meshBasicMaterial
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function Heatmap() {
  const isHeatmapVisible = useSceneStore((s) => s.isHeatmapVisible);
  const visibleFloors = useSceneStore((s) => s.visibleFloors);

  if (!isHeatmapVisible) return null;

  return (
    <group>
      {visibleFloors.map((floorId) => (
        <HeatmapFloor key={floorId} floorId={floorId} />
      ))}
    </group>
  );
}
