
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeJsCardProps {
  className?: string;
  style?: React.CSSProperties;
}

const ThreeJsCard: React.FC<ThreeJsCardProps> = ({ className, style }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardRef = useRef<THREE.Mesh | null>(null);
  // Store the resize handler as a ref so it can be accessed in the cleanup function
  const resizeHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(300, 300);
    rendererRef.current = renderer;
    
    // Add renderer to the DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
      
      // Update renderer size to match container
      const resizeRenderer = () => {
        if (mountRef.current && renderer) {
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;
          renderer.setSize(width, height);
          if (cameraRef.current) {
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
          }
        }
      };
      
      // Store the resize handler in the ref for cleanup
      resizeHandlerRef.current = resizeRenderer;
      
      resizeRenderer();
      window.addEventListener('resize', resizeRenderer);
    }
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Create card geometry
    const cardGeometry = new THREE.BoxGeometry(2, 1.4, 0.05);
    
    // Create materials for front and back of card
    const frontMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.5,
    });
    
    const backMaterial = new THREE.MeshStandardMaterial({
      color: 0x33C3F0,
      metalness: 0.3,
      roughness: 0.5,
    });
    
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0xD6BCFA,
      metalness: 0.3,
      roughness: 0.5,
    });
    
    const materials = [
      sideMaterial, // right side
      sideMaterial, // left side
      sideMaterial, // top side
      sideMaterial, // bottom side
      frontMaterial, // front side
      backMaterial  // back side
    ];
    
    // Create card mesh with all materials
    const card = new THREE.Mesh(cardGeometry, materials);
    scene.add(card);
    cardRef.current = card;
    
    // Add logo texture (simplified for this example)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/Ri-medicare_logo.png', (texture) => {
      const logoPlaneMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
      });
      
      const logoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.6),
        logoPlaneMaterial
      );
      
      logoPlane.position.z = 0.03; // Slightly in front of the card
      card.add(logoPlane);
    });
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (cardRef.current) {
        // Gentle floating animation
        cardRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.3;
        cardRef.current.rotation.x = Math.sin(Date.now() * 0.0015) * 0.2;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      // Use the stored resize handler for removal
      if (resizeHandlerRef.current) {
        window.removeEventListener('resize', resizeHandlerRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className={className || "w-full h-full min-h-[300px]"}
      style={style}
    />
  );
};

export default ThreeJsCard;
