import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { getFloorById } from '@/data/floors';

export function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const currentFloor = useSceneStore((s) => s.currentFloor);
  const visibleFloors = useSceneStore((s) => s.visibleFloors);
  const resetViewTrigger = useSceneStore((s) => s.resetViewTrigger);
  const zoomInTrigger = useSceneStore((s) => s.zoomInTrigger);
  const zoomOutTrigger = useSceneStore((s) => s.zoomOutTrigger);
  const targetRef = useRef(new THREE.Vector3(0, 5, 0));
  const initialPosition = useRef(new THREE.Vector3(80, 60, 80));
  const initialTarget = useRef(new THREE.Vector3(0, 5, 0));

  useEffect(() => {
    if (resetViewTrigger > 0 && controlsRef.current) {
      camera.position.copy(initialPosition.current);
      controlsRef.current.target.copy(initialTarget.current);
      targetRef.current.copy(initialTarget.current);
      controlsRef.current.update();
    }
  }, [resetViewTrigger, camera]);

  useEffect(() => {
    if (zoomInTrigger > 0 && controlsRef.current) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.addScaledVector(direction, 10);
      controlsRef.current.update();
    }
  }, [zoomInTrigger, camera]);

  useEffect(() => {
    if (zoomOutTrigger > 0 && controlsRef.current) {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.addScaledVector(direction, -10);
      controlsRef.current.update();
    }
  }, [zoomOutTrigger, camera]);

  useEffect(() => {
    const floor = getFloorById(currentFloor);
    if (floor) {
      const targetY = floor.baseY + floor.height / 2;
      targetRef.current.set(0, targetY, 0);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetRef.current, 0.1);
      }
    }
  }, [currentFloor]);

  useFrame((state, delta) => {
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetRef.current, delta * 2);
    }
  });

  const minY = -5;
  const maxY = 25;

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={10}
      maxDistance={150}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 5, 0]}
      makeDefault
    />
  );
}
