import { useState, useEffect } from 'react';

export default function RiLogo3D() {
  const [rotation, setRotation] = useState(0);
  const [hover, setHover] = useState(false);
  const [bounce, setBounce] = useState(0);
  
  // Continuous rotation animation
  useEffect(() => {
    const timer = setInterval(() => {
      setRotation(prevRotation => (prevRotation + 1) % 360);
    }, 30);
    
    return () => clearInterval(timer);
  }, []);
  
  // Bounce effect
  useEffect(() => {
    const bounceTimer = setInterval(() => {
      setBounce(prev => Math.sin(Date.now() / 500) * 5);
    }, 50);
    
    return () => clearInterval(bounceTimer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-96 w-full bg-transparent p-8">
      <div 
        className="relative"
        style={{
          transform: `perspective(800px) rotateY(${rotation}deg) translateY(${bounce}px)`,
          transition: 'transform 0.05s ease',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Back of the coin (when rotated) */}
        <div 
          className="absolute w-64 h-64 rounded-full flex items-center justify-center"
          style={{
            opacity: (Math.sin(rotation * Math.PI / 180) + 1) / 2,
            transform: `rotateY(180deg) scale(${0.95 + Math.sin(rotation * Math.PI / 180) * 0.05})`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            background: '#d66902'
          }}
        >
          <div className="text-white font-bold text-9xl">Ri</div>
        </div>

        {/* Front of the coin */}
        <div 
          className="w-64 h-64 rounded-full flex items-center justify-center"
          style={{
            opacity: (Math.sin((rotation + 180) * Math.PI / 180) + 1) / 2,
            transform: `scale(${0.95 + Math.sin((rotation + 180) * Math.PI / 180) * 0.05})`,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            background: '#d66902'
          }}
        >
          <div className="text-white font-bold text-9xl">Ri</div>
        </div>
      </div>
      
      {/* Shadow */}
      <div 
        className="w-40 h-8 bg-black mt-8 rounded-full opacity-20"
        style={{
          transform: `scaleX(${0.7 + Math.abs(Math.sin(rotation * Math.PI / 180)) * 0.3})`,
          filter: 'blur(8px)'
        }}
      ></div>
    </div>
  );
}