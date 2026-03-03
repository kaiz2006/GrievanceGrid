"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";

function GridPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -Math.PI / 2.5 + Math.sin(clock.elapsedTime * 0.1) * 0.02;
      meshRef.current.rotation.z = clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -5]}>
      <planeGeometry args={[40, 40, 40, 40]} />
      <meshBasicMaterial
        color="#1E40AF"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.015;
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60A5FA"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function GlowOrbs() {
  const orb1 = useRef<THREE.Mesh>(null);
  const orb2 = useRef<THREE.Mesh>(null);
  const orb3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (orb1.current) {
      orb1.current.position.x = Math.sin(t * 0.3) * 5;
      orb1.current.position.y = Math.cos(t * 0.2) * 3 + 1;
    }
    if (orb2.current) {
      orb2.current.position.x = Math.cos(t * 0.25) * 6 - 2;
      orb2.current.position.y = Math.sin(t * 0.15) * 2 - 1;
    }
    if (orb3.current) {
      orb3.current.position.x = Math.sin(t * 0.2) * 4 + 3;
      orb3.current.position.y = Math.cos(t * 0.3) * 2.5;
    }
  });

  return (
    <>
      <mesh ref={orb1} position={[3, 1, -8]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#1E40AF" transparent opacity={0.06} />
      </mesh>
      <mesh ref={orb2} position={[-4, -1, -10]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.04} />
      </mesh>
      <mesh ref={orb3} position={[0, 2, -6]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

function DataLines() {
  const linesRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const result = [];
    for (let i = 0; i < 12; i++) {
      const points = [];
      const startX = (Math.random() - 0.5) * 20;
      const startY = (Math.random() - 0.5) * 10;
      const startZ = -Math.random() * 15 - 3;
      points.push(new THREE.Vector3(startX, startY, startZ));
      points.push(
        new THREE.Vector3(
          startX + (Math.random() - 0.5) * 8,
          startY + (Math.random() - 0.5) * 4,
          startZ - Math.random() * 5
        )
      );
      result.push(points);
    }
    return result;
  }, []);

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((linePoints, i) => (
        <Line
          key={i}
          points={linePoints}
          color="#1E40AF"
          transparent
          opacity={0.1 + Math.random() * 0.1}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <GridPlane />
        <FloatingParticles count={600} />
        <GlowOrbs />
        <DataLines />
      </Canvas>

      {/* CSS gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/40 via-transparent to-bg-primary pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </div>
  );
}
