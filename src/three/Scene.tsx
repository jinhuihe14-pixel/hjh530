import { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Sky, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { floors } from '@/data/floors';
import { FloorComponent } from './FloorComponent';
import { CameraRig } from './CameraRig';
import { Lights } from './Lights';
import { NavigationLine } from './NavigationLine';
import { Heatmap } from './Heatmap';
import { VehicleMarkers } from './VehicleMarker';
import { PlatformMarkers } from './PlatformMarker';
import { AnnotationMarkers } from './AnnotationMarker';
import { RoadOverlay } from './RoadOverlay';
import { useSceneStore } from '@/store/useSceneStore';

function Building() {
  return (
    <group>
      {floors.map((floor) => (
        <FloorComponent key={floor.id} floor={floor} />
      ))}
    </group>
  );
}

function Ground() {
  return (
    <mesh position={[0, -5.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color="#0a0f1a" metalness={0.1} roughness={0.9} />
    </mesh>
  );
}

function OutdoorGround() {
  return (
    <group>
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[120, 64]} />
        <meshStandardMaterial color="#0d1421" metalness={0.1} roughness={0.8} />
      </mesh>

      {[...Array(20)].map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 70 + Math.random() * 30;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, -4, Math.sin(angle) * radius]}>
            <cylinderGeometry args={[1, 1.2, 3, 8]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
        );
      })}
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <Lights />
      <CameraRig />
      <Building />
      <Ground />
      <OutdoorGround />
      <RoadOverlay baseY={-3.9} />
      <VehicleMarkers baseY={-3.9} />
      <PlatformMarkers baseY={-3.9} />
      <AnnotationMarkers baseY={-3.9} />
      <NavigationLine />
      <Heatmap />
      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.5} darkness={0.5} />
      </EffectComposer>
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [80, 60, 80], fov: 50, near: 0.1, far: 1000 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 100, 300]} />
      <SceneContent />
    </Canvas>
  );
}
