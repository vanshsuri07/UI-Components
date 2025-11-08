"use client";

import { useState, useRef, Suspense, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random";
import * as THREE from "three";

// Memoized Stars component to prevent unnecessary re-renders
const Stars = memo(() => {
  const ref = useRef<THREE.Points>(null);
  // Reduced from 5000 to 2000 particles for better performance
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(2000), { radius: 1.2 }) as Float32Array
  );

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#ffa0e4"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
});

Stars.displayName = "Stars";

// Memoized canvas component
const StarsCanvas = memo(() => {
  return (
    <div className="absolute inset-0 z-[0] w-full h-full bg-gradient-to-b from-[#05050f] via-[#090913] to-[#000000]">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
});

StarsCanvas.displayName = "StarsCanvas";

export default StarsCanvas;
