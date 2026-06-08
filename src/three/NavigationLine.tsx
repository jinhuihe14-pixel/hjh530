import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useNavStore } from '@/store/useNavStore';

export function NavigationLine() {
  const arrowRef = useRef<THREE.Mesh>(null);
  const { route, isNavActive, navProgress } = useNavStore();

  const { points, pathLength } = useMemo(() => {
    if (!route || route.nodes.length < 2) {
      return { points: [], pathLength: 0 };
    }

    const pts = route.nodes.map(
      (n) => new THREE.Vector3(n.position.x, n.position.y + 0.5, n.position.z)
    );

    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);
    const sampledPoints = curve.getPoints(100);

    let length = 0;
    for (let i = 1; i < sampledPoints.length; i++) {
      length += sampledPoints[i].distanceTo(sampledPoints[i - 1]);
    }

    return { points: sampledPoints, pathLength: length };
  }, [route]);

  useFrame((state) => {
    if (arrowRef.current && route && route.nodes.length > 0 && points.length > 0) {
      const progress = isNavActive ? navProgress : 0;
      const pts = route.nodes.map(
        (n) => new THREE.Vector3(n.position.x, n.position.y + 0.5, n.position.z)
      );
      const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.3);
      const pos = curve.getPoint(Math.min(progress, 0.999));
      const tangent = curve.getTangent(Math.min(progress, 0.999));
      arrowRef.current.position.copy(pos);
      arrowRef.current.lookAt(pos.clone().add(tangent));
    }
  });

  if (!route || route.nodes.length < 2 || points.length === 0) return null;

  return (
    <group>
      <Line
        points={points}
        color="#00D4FF"
        lineWidth={3}
        transparent
        opacity={0.9}
      />

      <Line
        points={points}
        color="#00D4FF"
        lineWidth={8}
        transparent
        opacity={0.3}
      />

      {route.nodes[0] && (
        <mesh
          position={[
            route.nodes[0].position.x,
            route.nodes[0].position.y + 1,
            route.nodes[0].position.z,
          ]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.8} />
        </mesh>
      )}

      {route.nodes[route.nodes.length - 1] && (
        <mesh
          position={[
            route.nodes[route.nodes.length - 1].position.x,
            route.nodes[route.nodes.length - 1].position.y + 1,
            route.nodes[route.nodes.length - 1].position.z,
          ]}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.8} />
        </mesh>
      )}

      <mesh ref={arrowRef}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>

      {route.floorTransitions.map((t, i) => {
        const fromNode = route.nodes.find(
          (n) =>
            n.floorId === t.from &&
            (n.type === 'elevator' || n.type === 'escalator')
        );
        if (!fromNode) return null;
        return (
          <mesh
            key={i}
            position={[fromNode.position.x, fromNode.position.y + 2, fromNode.position.z]}
          >
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial
              color={t.type === 'elevator' ? '#8b5cf6' : '#f59e0b'}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}
