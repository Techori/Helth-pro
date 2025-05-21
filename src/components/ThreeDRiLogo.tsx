import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  PresentationControls,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

// Create a texture with "Ri" text properly spaced at 120 degrees
function createTextTexture() {
  // Create alpha map (black background with white text)
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Fill with black (will be used as alpha)
    ctx.fillStyle = 'FFE0C2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw white "Ri" text (will be areas with no alpha)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 450px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw at 120-degree intervals
    ctx.fillText("Ri", canvas.width * 0.5, canvas.height / 2); // 0 degrees
    ctx.fillText("Ri", canvas.width * (1 / 6), canvas.height / 2); // 120 degrees
    ctx.fillText("Ri", canvas.width * (5 / 6), canvas.height / 2); // 240 degrees
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return texture;
}

function RiSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Simple continuous rotation
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005;
    }
  });

  // Create custom materials
  const materials = useMemo(() => {
    // Red base sphere material
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: "#ff7400", // Bright red color
      roughness: 0.2,
      metalness: 0.7,
      envMapIntensity: 0.6,
    });

    // White text material that will be applied on top
    const textMaterial = new THREE.MeshBasicMaterial({
      color: "#ffffff",
    });

    return { baseMaterial, textMaterial };
  }, []);

  return (
    <group>
      {/* Base red sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.1, 64, 64]} />
        <primitive object={materials.baseMaterial} />
      </mesh>

      {/* White text overlay */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.105, 64, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          alphaMap={createTextTexture()}
          alphaTest={0.5}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function ThreeDRiLogo() {
  return (
    <div className="h-96 w-full relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={["transparent"]} />
        <Environment preset="studio" />

        <ambientLight intensity={1.0} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={0.9}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="white" />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 6, Math.PI / 6]}
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <RiSphere />
        </PresentationControls>

        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.5}
          scale={3.5}
          blur={1.5}
          far={1.2}
          resolution={256}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
