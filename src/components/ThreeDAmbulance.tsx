import { Float, useGLTF, useTexture } from "@react-three/drei";
import React, { useRef, useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

const AmbulanceModel = () => {
  const ambulanceRef = useRef<Group>(null);
  const { scene } = useGLTF("/models/ambulance/source/Ambulance_fbx.glb");
  const texture1 = useTexture("/models/ambulance/textures/gltf_embedded_0.png");
  const texture2 = useTexture(
    "/models/ambulance/textures/internal_ground_ao_texture.jpeg"
  );

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material) {
          const material = mesh.material as MeshStandardMaterial;
          material.map = texture1;
          material.aoMap = texture2;
          material.needsUpdate = true;
        }
      }
    });
  }, [scene, texture1, texture2]);

  return (
    <>
      {/* Consistent lighting setup */}
      <ambientLight intensity={0.8} />

      {/* Main directional lights from all six sides */}
      <directionalLight position={[10, 0, 0]} intensity={0.8} />
      <directionalLight position={[-10, 0, 0]} intensity={0.8} />
      <directionalLight position={[0, 10, 0]} intensity={0.6} />
      <directionalLight position={[0, -10, 0]} intensity={0.8} />
      <directionalLight position={[0, 0, 10]} intensity={0.8} />
      <directionalLight position={[0, 0, -10]} intensity={0.8} />

      <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={ambulanceRef} position={[0, 0, 0]} scale={3.0}>
          <primitive object={scene.clone()} />
        </group>
      </Float>
    </>
  );
};

useGLTF.preload("/models/ambulance/source/Ambulance_fbx.glb");
export default AmbulanceModel;
