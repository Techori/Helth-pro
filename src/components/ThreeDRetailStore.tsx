import { Float, useGLTF } from "@react-three/drei";
import React, { useRef, useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

const StoreModel = () => {
  const storeRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/hospital/hospital.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material) {
          const material = mesh.material as MeshStandardMaterial;
          material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <>
      {/* Consistent lighting setup */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group ref={storeRef} position={[0, 0, 0]} scale={0.1}>
          <primitive object={scene.clone()} />
        </group>
      </Float>
    </>
  );
};

useGLTF.preload("/models/hospital.glb");
export default StoreModel;
