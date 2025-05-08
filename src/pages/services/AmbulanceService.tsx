import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Float } from '@react-three/drei';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Ambulance, Clock, Shield, PhoneCall } from 'lucide-react';
import * as THREE from 'three';

// 3D Ambulance Model Component
const AmbulanceModel = () => {
  const ambulanceRef = useRef<THREE.Group>(null);
  
  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.5} 
      floatIntensity={0.5}
    >
      <group ref={ambulanceRef} position={[0, 0, 0]}>
        {/* Ambulance body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 1.4, 4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Ambulance front (driver cabin) */}
        <mesh position={[0, -0.2, -2.5]}>
          <boxGeometry args={[2.5, 1, 1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Front windshield */}
        <mesh position={[0, 0.5, -1.8]} rotation={[-Math.PI / 6, 0, 0]}>
          <planeGeometry args={[2.3, 0.8]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Red cross on sides */}
        <mesh position={[1.26, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3, 0.6]} />
          <meshStandardMaterial color="#d10b0b" />
        </mesh>
        
        {/* Red cross symbol - vertical */}
        <mesh position={[1.27, 0.2, 0]}>
          <boxGeometry args={[0.01, 0.6, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Red cross symbol - horizontal */}
        <mesh position={[1.27, 0.2, 0]}>
          <boxGeometry args={[0.01, 0.2, 0.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Same for other side */}
        <mesh position={[-1.26, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3, 0.6]} />
          <meshStandardMaterial color="#d10b0b" />
        </mesh>
        
        <mesh position={[-1.27, 0.2, 0]}>
          <boxGeometry args={[0.01, 0.6, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        <mesh position={[-1.27, 0.2, 0]}>
          <boxGeometry args={[0.01, 0.2, 0.6]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Wheels - Fixed the rotation property by moving it to the mesh component */}
        <mesh position={[-1, -0.7, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[1, -0.7, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-1, -0.7, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[1, -0.7, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Emergency lights */}
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[1.5, 0.2, 0.8]} />
          <meshStandardMaterial color="#2a52be" />
        </mesh>
      </group>
    </Float>
  );
};

// AmbulanceService component
const AmbulanceService = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-brand-600" />,
      title: 'Quick Response Time',
      description: 'Our ambulances reach you within minutes, ensuring critical care when time matters most.',
    },
    {
      icon: <Shield className="h-8 w-8 text-brand-600" />,
      title: 'Advanced Life Support',
      description: 'Fully equipped ambulances with modern life-saving equipment and technologies.',
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-brand-600" />,
      title: 'Easy Accessibility',
      description: 'Simple phone call or app-based booking for immediate emergency response.',
    },
    {
      icon: <Check className="h-8 w-8 text-brand-600" />,
      title: 'Trained Paramedics',
      description: 'Skilled medical professionals to provide immediate care during transit.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with 3D Ambulance */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-red-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                  <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full font-medium text-sm mb-4">
                      Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight">
                      Quick <span className="text-brand-600">Ambulance</span> Service
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Emergency ambulance services with advanced life support systems and trained medical professionals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                        Get Notified at Launch
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 h-80 md:h-96">
                  <div className={`w-full h-full transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
                      <ambientLight intensity={0.7} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                      <pointLight position={[-10, -10, -10]} />
                      <PresentationControls
                        global
                        snap={{ mass: 1, tension: 170 }}
                        zoom={1.2}
                        rotation={[0, 0, 0]}
                        polar={[-Math.PI / 3, Math.PI / 3]}
                        azimuth={[-Math.PI / 1.4, Math.PI / 2]}
                      >
                        <AmbulanceModel />
                      </PresentationControls>
                      <OrbitControls 
                        enableZoom={false} 
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.5}
                      />
                    </Canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Service Features
              </h2>
              <p className="text-xl text-gray-600">
                Emergency care with speed, precision, and compassion
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-5">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-brand-500 to-red-600 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Be the First to Know When We Launch
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Register now to get notified when our ambulance service becomes available in your area.
              </p>
              <form className="max-w-lg mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                  />
                  <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100">
                    Get Notified
                  </Button>
                </div>
              </form>
              <p className="text-sm text-white/80">
                Your safety is our priority. We're working hard to bring this life-saving service to you soon.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AmbulanceService;
