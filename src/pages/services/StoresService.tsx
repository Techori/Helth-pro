
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Float } from '@react-three/drei';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Store, Pill, Users, MapPin } from 'lucide-react';
import * as THREE from 'three';

// 3D Store Model Component
const StoreModel = () => {
  const storeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (storeRef.current) {
      storeRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float
      speed={1} 
      rotationIntensity={0.3} 
      floatIntensity={0.3}
    >
      <group ref={storeRef} position={[0, -1, 0]}>
        {/* Store Building */}
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[4, 2, 3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Store Front Glass */}
        <mesh position={[0, 1, 1.51]}>
          <boxGeometry args={[3.5, 1.5, 0.1]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.7} />
        </mesh>
        
        {/* Store Sign */}
        <mesh position={[0, 2.3, 0]}>
          <boxGeometry args={[4.2, 0.6, 3.2]} />
          <meshStandardMaterial color="#9b87f5" />
        </mesh>
        
        {/* RI Medicare Text */}
        <mesh position={[0, 2.3, 1.7]}>
          <planeGeometry args={[3, 0.4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Door */}
        <mesh position={[0, 0.5, 1.51]}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.8} />
        </mesh>
        
        {/* Window Left */}
        <mesh position={[-1.25, 1.3, 1.51]}>
          <boxGeometry args={[1, 0.8, 0.05]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.9} />
        </mesh>
        
        {/* Window Right */}
        <mesh position={[1.25, 1.3, 1.51]}>
          <boxGeometry args={[1, 0.8, 0.05]} />
          <meshStandardMaterial color="#a0d8ef" transparent opacity={0.9} />
        </mesh>
        
        {/* Medical Cross */}
        <mesh position={[0, 2.3, 1.71]}>
          <boxGeometry args={[0.8, 0.15, 0.05]} />
          <meshStandardMaterial color="#d10b0b" />
        </mesh>
        
        <mesh position={[0, 2.3, 1.71]}>
          <boxGeometry args={[0.15, 0.8, 0.05]} />
          <meshStandardMaterial color="#d10b0b" />
        </mesh>
        
        {/* Store Base/Ground */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 5]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      </group>
    </Float>
  );
};

// Medical Products Display
const ProductsDisplay = () => {
  const displayRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (displayRef.current) {
      displayRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.4} 
      floatIntensity={0.4}
    >
      <group ref={displayRef} position={[3, 0, 0]}>
        {/* Display Cabinet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 2, 0.5]} />
          <meshStandardMaterial color="#f1f1f1" />
        </mesh>
        
        {/* Shelves */}
        {[-0.5, 0, 0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0.1]}>
            <boxGeometry args={[1.3, 0.05, 0.4]} />
            <meshStandardMaterial color="#e5e5e5" />
          </mesh>
        ))}
        
        {/* Products - Pills Bottles */}
        <mesh position={[-0.4, -0.5, 0.25]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#f97316" />
        </mesh>
        
        <mesh position={[0, -0.5, 0.25]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
        
        <mesh position={[0.4, -0.5, 0.25]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#9b87f5" />
        </mesh>
        
        {/* Products - Boxes */}
        <mesh position={[-0.4, 0, 0.25]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#e5deff" />
        </mesh>
        
        <mesh position={[0, 0, 0.25]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#fde1d3" />
        </mesh>
        
        <mesh position={[0.4, 0, 0.25]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#d3e4fd" />
        </mesh>
        
        {/* Products - Medical Supplies */}
        <mesh position={[-0.4, 0.5, 0.25]}>
          <boxGeometry args={[0.25, 0.1, 0.3]} />
          <meshStandardMaterial color="#ffdee2" />
        </mesh>
        
        <mesh position={[0.4, 0.5, 0.25]}>
          <boxGeometry args={[0.25, 0.1, 0.3]} />
          <meshStandardMaterial color="#f2fce2" />
        </mesh>
      </group>
    </Float>
  );
};

const StoresService = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    "Wide range of healthcare products",
    "In-store pharmacist consultation",
    "Health checkup facilities",
    "Loyalty program benefits",
    "Genuine medicines and products",
    "Competitive pricing"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with 3D Store */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                  <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full font-medium text-sm mb-4">
                      Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight">
                      RI Medicare <span className="text-brand-600">Retail Stores</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Physical retail stores offering medicines, healthcare products and consultation services across India.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
                        Get Notified at Launch
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button size="lg" variant="outline">
                        Partnership Inquiries
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2 h-80 md:h-96">
                  <div className={`w-full h-full transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
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
                        <StoreModel />
                        <ProductsDisplay />
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
                What to Expect at Our Stores
              </h2>
              <p className="text-xl text-gray-600">
                A new approach to pharmacy retail experience
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-6 rounded-xl bg-white shadow-sm border border-gray-100 flex items-start space-x-3 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Check className="h-5 w-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Store Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Our Store Formats
              </h2>
              <p className="text-xl text-gray-600">
                Designed to serve diverse community needs
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Store className="h-10 w-10 text-brand-600" />,
                    title: "RI Medicare Express",
                    description: "Compact stores in high-traffic areas focusing on essential medicines and healthcare products."
                  },
                  {
                    icon: <Pill className="h-10 w-10 text-brand-600" />,
                    title: "RI Medicare Plus",
                    description: "Full-service pharmacy stores with extensive product range and basic health checkup facilities."
                  },
                  {
                    icon: <Users className="h-10 w-10 text-brand-600" />,
                    title: "RI Medicare Premium",
                    description: "Flagship stores with pharmacy, healthcare products, diagnostic services, and wellness consultation."
                  }
                ].map((store, index) => (
                  <div 
                    key={index}
                    className={`glassmorphism p-8 rounded-2xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mb-6">
                        {store.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{store.title}</h3>
                      <p className="text-gray-600">{store.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Locations Map Placeholder */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Coming to Your City
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Our first phase of stores will launch in these cities
              </p>
              <div className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
                Coming Soon
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm h-80 flex items-center justify-center bg-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center p-6">
                  <MapPin className="h-12 w-12 text-brand-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Store Locations Map</h3>
                  <p className="text-gray-500">Our store network map will be available here once we launch.</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Initial locations: Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-brand-500 to-green-600 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Join Us in Transforming Healthcare Retail
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Register to receive updates about our store openings in your city.
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
                We'll notify you as soon as an RI Medicare store opens in your vicinity.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StoresService;
