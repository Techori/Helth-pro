import { useRef, useState, useEffect, useMemo, FC } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PresentationControls,
  Environment,
  ContactShadows,
  Text,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

interface ThreeDHealthCardProps {
  cardName: string;
  cardColor?: string;
  holderName?: string;
  size?: "small" | "large";
}

interface LogoProps {
  cardColor: string;
  position?: [number, number, number];
  scale?: number;
}

const Logo: FC<LogoProps> = ({
  cardColor,
  position = [-0.8, 0.7, 0.03],
  scale = 1.0,
}) => {
  // Load RI logo texture
  const riLogoTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw circle background
      ctx.fillStyle = "#e67817"; // orange
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();

      // Draw "RI" text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 160px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Ri", 128, 128);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  // Create plus sign texture
  const plusSignTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw plus sign - now red instead of orange
      ctx.fillStyle = cardColor; // red plus sign

      // Horizontal bar
      ctx.fillRect(20, 50, 88, 28);

      // Vertical bar
      ctx.fillRect(50, 20, 28, 88);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }, []);

  return (
    <group position={position}>
      {/* Ri logo in orange circle */}
      <mesh position={[-0.6 * scale, 0, 0]} scale={0.8 * scale}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={riLogoTexture} transparent />
      </mesh>

      {/* Medicare text */}
      <Text
        position={[-0.4 * scale, 0, 0]}
        fontSize={0.22 * scale}
        color="white"
        anchorX="left"
        anchorY="middle"
      >
        Medicare
      </Text>

      {/* Red plus sign */}
      <mesh position={[0.6 * scale, 0.08 * scale, 0]} scale={0.15 * scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={plusSignTexture} transparent />
      </mesh>
    </group>
  );
};

function Card({
  cardName,
  cardColor = "#e67817",
  holderName = "Card Holder",
  size = "large",
}: ThreeDHealthCardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const hologramRef = useRef<THREE.Mesh>(null);
  const isSmall = size === "small";
  const [flipped, setFlipped] = useState(false);

  // Dark navy color for card background - slightly deeper for professional look
  const darkNavy = new THREE.Color("#121a26");

  // Create holographic texture
  const [hologramTexture, setHologramTexture] = useState<THREE.Texture | null>(
    null
  );

  // Create EMV chip texture with circuit pattern
  const chipTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Background color
      ctx.fillStyle = "#D4AF37"; // Base gold color
      ctx.fillRect(0, 0, 256, 256);

      // Draw circuit pattern
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 4;

      // Horizontal lines
      for (let i = 0; i < 5; i++) {
        const y = 40 + i * 40;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(236, y);
        ctx.stroke();
      }

      // Vertical connections
      for (let i = 0; i < 4; i++) {
        const x = 60 + i * 50;
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 200);
        ctx.stroke();
      }

      // Add contact points
      ctx.fillStyle = "#222222";
      for (let i = 0; i < 8; i++) {
        const x = 40 + i * 30;
        const y = i % 2 === 0 ? 80 : 160;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    return texture;
  }, []);

  useEffect(() => {
    // Create canvas for holographic effect
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, 64, 64);
      gradient.addColorStop(0, "#8A2387");
      gradient.addColorStop(0.5, "#E94057");
      gradient.addColorStop(1, "#F27121");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      // Add subtle pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * 64,
          Math.random() * 64,
          Math.random() * 5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 16;
      setHologramTexture(texture);
    }
  }, []);

  useFrame((state) => {
    if (cardRef.current) {
      // More subtle floating animation
      cardRef.current.position.y =
        Math.sin(state.clock.getElapsedTime() * 0.4) * (isSmall ? 0.01 : 0.03);

      // Animate card rotation based on flipped state
      cardRef.current.rotation.y = THREE.MathUtils.lerp(
        cardRef.current.rotation.y,
        flipped ? Math.PI : 0,
        0.1
      );

      // Only apply mouse-based rotation when not flipped
      if (!flipped) {
        cardRef.current.rotation.x = THREE.MathUtils.lerp(
          cardRef.current.rotation.x,
          (state.mouse.y * Math.PI) / (isSmall ? 80 : 25),
          0.5
        );

        if (!isSmall) {
          cardRef.current.rotation.z = THREE.MathUtils.lerp(
            cardRef.current.rotation.z,
            (state.mouse.x * Math.PI) / 40,
            0.05
          );
        }
      }
    }

    // Animate hologram
    if (hologramRef.current && hologramTexture) {
      hologramTexture.offset.x = state.clock.getElapsedTime() * 0.05;
      hologramTexture.offset.y = Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  // Generate a random 16-digit card number
  const cardNumber = "4896 XXXX XXXX 7865";
  const expiryDate = "12/28";
  const cvv = "***";

  // Create embossed text effect by duplicating with slight offset
  const createEmbossedText = (
    text: string,
    position: [number, number, number],
    fontSize: number,
    anchorX: "left" | "center" | "right" = "left"
  ) => {
    return (
      <group>
        {/* Shadow layer */}
        <Text
          position={[
            position[0] - 0.005,
            position[1] - 0.005,
            position[2] - 0.001,
          ]}
          fontSize={fontSize}
          color="#111620"
          anchorX={anchorX}
        >
          {text}
          <meshBasicMaterial transparent opacity={0.6} />
        </Text>
        {/* Main text */}
        <Text
          position={position}
          fontSize={fontSize}
          color="white"
          anchorX={anchorX}
        >
          {text}
        </Text>
        {/* Highlight layer */}
        <Text
          position={[
            position[0] + 0.003,
            position[1] + 0.003,
            position[2] + 0.001,
          ]}
          fontSize={fontSize}
          color="#cedcf2"
          anchorX={anchorX}
        >
          {text}
          <meshBasicMaterial transparent opacity={0.3} />
        </Text>
      </group>
    );
  };

  return (
    <group
      ref={cardRef}
      onClick={() => setFlipped(!flipped)}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      {/* Card front */}
      <group visible={!flipped}>
        {/* Card base with slightly rounded corners - front side */}
        <RoundedBox args={[3.4, 2, 0.05]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial
            color={darkNavy}
            metalness={0.95}
            roughness={0.02}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            reflectivity={1.0}
            envMapIntensity={1.2}
          />
        </RoundedBox>

        {/* Sharp edge highlight for better definition */}
        <RoundedBox args={[3.42, 2.02, 0.051]} radius={0.04} smoothness={4}>
          <meshBasicMaterial color="#3a4b65" transparent opacity={0.3} />
        </RoundedBox>

        {/* "Ri Medicare+" logo */}
        <Logo cardColor={cardColor} />

        {/* Golden EMV chip */}
        <group position={[1.1, 0, 0.03]}>
          {/* Chip base - golden metallic rectangle */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.55, 0.4, 0.02]} />
            <meshPhysicalMaterial
              color="#D4AF37"
              metalness={1.0}
              roughness={0.1}
              clearcoat={0.8}
              reflectivity={1.0}
              envMapIntensity={2.0}
            />
          </mesh>

          {/* Chip circuit pattern */}
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[0.5, 0.35]} />
            <meshStandardMaterial
              map={chipTexture}
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>

          {/* Add subtle bevel around the chip */}
          <mesh position={[0, 0, -0.005]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.58, 0.43, 0.01]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.3}
              roughness={0.8}
            />
          </mesh>
        </group>

        {/* Card number with embossed effect */}
        {createEmbossedText(cardNumber, [-1.3, 0.1, 0.03], 0.14)}

        {/* Expiry date */}
        <Text
          position={[-1.3, -0.1, 0.03]}
          fontSize={0.09}
          color="#aaaaaa"
          anchorX="left"
        >
          VALID THRU
        </Text>
        <Text
          position={[-0.7, -0.1, 0.03]}
          fontSize={0.12}
          color="white"
          anchorX="left"
        >
          {expiryDate}
        </Text>

        {/* Card holder */}
        <Text
          position={[-1.3, 0.3, 0.03]}
          fontSize={0.09}
          color="#aaaaaa"
          anchorX="left"
        >
          CARD HOLDER NAME
        </Text>

        {/* Card holder name with embossed effect */}
        {createEmbossedText(
          holderName || "Card Holder",
          [-1.3, -0.65, 0.03],
          0.15
        )}
      </group>

      {/* Card back */}
      <group visible={flipped} rotation={[0, Math.PI, 0]}>
        {/* Card base with slightly rounded corners - back side */}
        <RoundedBox args={[3.4, 2, 0.05]} radius={0.04} smoothness={4}>
          <meshPhysicalMaterial
            color={darkNavy}
            metalness={0.95}
            roughness={0.02}
            clearcoat={1.0}
            clearcoatRoughness={0.01}
            reflectivity={1.0}
            envMapIntensity={1.2}
          />
        </RoundedBox>

        {/* Sharp edge highlight for better definition */}
        <RoundedBox args={[3.42, 2.02, 0.051]} radius={0.04} smoothness={4}>
          <meshBasicMaterial color="#3a4b65" transparent opacity={0.3} />
        </RoundedBox>

        {/* Magnetic strip - more realistic with texture */}
        <mesh position={[0, 0.7, 0.03]} rotation={[0, 0, 0]}>
          <boxGeometry args={[3.4, 0.4, 0.01]} />
          <meshStandardMaterial
            color="#222222"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        {/* Signature strip - improved look */}
        <mesh position={[0, -0.2, 0.03]} rotation={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.3, 0.01]} />
          <meshStandardMaterial
            color="#F5F5F5"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* CVV label */}
        <Text
          position={[1.2, -0.2, 0.04]}
          fontSize={0.08}
          color="#333333"
          anchorX="right"
        >
          CVV
        </Text>

        {/* CVV number */}
        <Text
          position={[1.37, -0.2, 0.04]}
          fontSize={0.1}
          color="#333333"
          anchorX="right"
          fontWeight="bold"
        >
          {cvv}
        </Text>

        {/* "Ri Medicare+" logo on back */}
        <Logo cardColor={cardColor} position={[0, 0.2, 0.03]} scale={0.7} />

        {/* Back logo text */}
        <Text
          position={[0, -0.70, 0.03]}
          fontSize={0.08}
          color="white"
          anchorX="center"
        >
          For customer service, please call 1-800-MEDICARE
        </Text>

        {/* Card name on back */}
        <Text
          position={[0, -0.5, 0.03]}
          fontSize={0.14}
          color="white"
          anchorX="center"
          fontWeight="bold"
        >
          {cardName}
        </Text>

      </group>
    </group>
  );
}

export default function ThreeDHealthCard({
  cardName = "Health PayLater Card",
  cardColor = "#e67817",
  holderName,
  size = "large",
}: ThreeDHealthCardProps) {
  return (
    <div className={`w-full ${size === "small" ? "h-full" : "aspect-[4/3]"}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: size === "small" ? 30 : 35 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
          precision: "highp",
          stencil: false,
          depth: true,
        }}
        dpr={window.devicePixelRatio || 2} // Use device ratio for best clarity
        flat // Improved antialiasing
        legacy={false} // Use modern rendering features
      >
        <color attach="background" args={["transparent"]} />
        <ambientLight intensity={0.6} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1.0}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="white" />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-0.2, 0.2]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 4, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
          enabled={size === "large"}
        >
          <Card
            cardName={cardName}
            cardColor={cardColor}
            holderName={holderName}
            size={size}
          />
        </PresentationControls>

        <Environment preset="city" />
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.4}
          scale={5}
          blur={2.5}
          far={1.5}
          resolution={512}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}
