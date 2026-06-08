import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Annotation, AnnotationCategory } from '@/types';
import {
  annotationCategoryNames,
  annotationCategoryColors,
  annotationPriorityNames,
  annotationPriorityColors,
  annotationStatusNames,
} from '@/data/annotations';
import { useSceneStore } from '@/store/useSceneStore';
import { useAnnotationStore } from '@/store/useAnnotationStore';

interface AnnotationMarkerProps {
  annotation: Annotation;
  baseY?: number;
}

export function AnnotationMarker({ annotation, baseY = 0.1 }: AnnotationMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const visibleLayers = useSceneStore((s) => s.visibleLayers);
  const selectAnnotation = useAnnotationStore((s) => s.selectAnnotation);
  const selectedAnnotationId = useAnnotationStore((s) => s.selectedAnnotationId);

  const color = annotationCategoryColors[annotation.category];
  const priorityColor = annotationPriorityColors[annotation.priority];
  const isSelected = selectedAnnotationId === annotation.id;
  const isVisible = visibleLayers.includes('annotations');
  const isResolved = annotation.status === 'resolved';
  const shouldAnimate = !isResolved;

  useFrame((state) => {
    if (groupRef.current && shouldAnimate) {
      const bobble = Math.sin(state.clock.elapsedTime * 2 + annotation.position.x) * 0.2;
      groupRef.current.position.y = baseY + 1.5 + bobble;
    }
  });

  if (!isVisible) return null;

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    selectAnnotation(annotation.id);
  };

  return (
    <group ref={groupRef} position={[annotation.position.x, baseY + 1.5, annotation.position.z]}>
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
      >
        <coneGeometry args={[0.5, 2, 4]} />
        <meshStandardMaterial
          color={isResolved ? '#6b7280' : color}
          emissive={isResolved ? '#6b7280' : color}
          emissiveIntensity={isSelected ? 0.6 : 0.3}
          transparent
          opacity={isResolved ? 0.5 : 0.9}
        />
      </mesh>

      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color={priorityColor} transparent opacity={isResolved ? 0.3 : 0.9} />
      </mesh>

      {(hovered || isSelected) && (
        <Billboard position={[0, 2.5, 0]}>
          <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
            <div className="bg-slate-900/95 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap border border-slate-600 shadow-xl min-w-[180px]">
              <div className="font-bold text-sm" style={{ color: isResolved ? '#6b7280' : color }}>
                {annotation.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: `${color}30`,
                    color: isResolved ? '#6b7280' : color,
                  }}
                >
                  {annotationCategoryNames[annotation.category as AnnotationCategory]}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: `${priorityColor}30`,
                    color: isResolved ? '#6b7280' : priorityColor,
                  }}
                >
                  {annotationPriorityNames[annotation.priority]}
                </span>
              </div>
              <div className="mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    annotation.status === 'resolved'
                      ? 'bg-green-500/20 text-green-400'
                      : annotation.status === 'processing'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {annotationStatusNames[annotation.status]}
                </span>
              </div>
              <div className="mt-2 text-slate-400 text-xs line-clamp-2">{annotation.description}</div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">上报人：</span>
                <span className="text-white">{annotation.reporter}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">上报时间：</span>
                <span className="text-slate-300">{annotation.createdAt.split(' ')[0]}</span>
              </div>
            </div>
          </Html>
        </Billboard>
      )}

      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#00D4FF' : isResolved ? '#6b7280' : color}
          transparent
          opacity={isSelected ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export function AnnotationMarkers({ baseY = 0.1 }: { baseY?: number }) {
  const annotations = useAnnotationStore((s) => s.annotations);

  return (
    <group>
      {annotations.map((annotation) => (
        <AnnotationMarker key={annotation.id} annotation={annotation} baseY={baseY} />
      ))}
    </group>
  );
}
