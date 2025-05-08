
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PresentationControls, Float } from '@react-three/drei';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Pill, Store, Clock, MapPin } from 'lucide-react';
import * as THREE from 'three';

// 3D Medicine Bottles Component
const MedicineBottles = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  // Create bottles with different heights, colors and positions
  const bottles = [
    { position: [0, 0, 0], height: 2, radius: 0.5, color: "#9b87f5" },
    { position: [1.5, 0, 1], height: 1.8, radius: 0.4, color: "#f97316" },
    { position: [-1.5, 0, 1], height: 1.6, radius: 0.45, color: "#0ea5e9" },
    { position: [0.8, 0, -1.2], height: 1.7, radius: 0.4, color: "#d946ef" },
    { position: [-1.2, 0, -0.8], height: 1.9, radius: 0.4, color: "#8b5cf6" }
  ];

  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.5} 
      floatIntensity={0.5}
    >
      <group ref={groupRef}>
        {bottles.map((bottle, index) => (
          <group key={index} position={new THREE.Vector3(...bottle.position)}>
            {/* Bottle Body */}
            <mesh position={[0, bottle.height / 2, 0]}>
              <cylinderGeometry args={[bottle.radius, bottle.radius, bottle.height, 32]} />
              <meshStandardMaterial 
                color={bottle.color}
                transparent
                opacity={0.9}
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
            
            {/* Bottle Cap */}
            <mesh position={[0, bottle.height + 0.2, 0]}>
              <cylinderGeometry args={[bottle.radius * 0.8, bottle.radius * 0.8, 0.4, 32]} />
              <meshStandardMaterial 
                color="#ffffff"
                roughness={0.5}
              />
            </mesh>
            
            {/* Bottle Label */}
            <mesh position={[0, bottle.height / 2, bottle.radius + 0.01]} rotation={[0, 0, 0]}>
              <planeGeometry args={[bottle.radius * 1.5, bottle.height * 0.6]} />
              <meshStandardMaterial 
                color="#ffffff"
                roughness={0.5}
              />
            </mesh>
            
            {/* Label Symbol */}
            <mesh position={[0, bottle.height / 2, bottle.radius + 0.02]} rotation={[0, 0, 0]}>
              <planeGeometry args={[bottle.radius * 0.8, bottle.height * 0.2]} />
              <meshStandardMaterial 
                color="#f1f0fb"
                roughness={0.5}
              />
            </mesh>
          </group>
        ))}
        
        {/* Base */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3, 32]} />
          <meshStandardMaterial 
            color="#f1f0fb"
            roughness={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
};

// 3D Pills Component
const PillsDisplay = () => {
  const pillsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (pillsRef.current) {
      pillsRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });
  
  const pills = [
    { position: [0, 0.2, 0], rotation: [0, 0, 0], color: "#f97316" },
    { position: [0.6, 0.2, 0.4], rotation: [0, Math.PI / 4, 0], color: "#9b87f5" },
    { position: [-0.6, 0.2, 0.3], rotation: [0, -Math.PI / 6, 0], color: "#0ea5e9" },
    { position: [0.3, 0.2, -0.6], rotation: [0, Math.PI / 2, 0], color: "#8b5cf6" },
    { position: [-0.4, 0.2, -0.5], rotation: [0, Math.PI / 3, 0], color: "#d946ef" },
  ];

  return (
    <Float
      speed={1} 
      rotationIntensity={0.3} 
      floatIntensity={0.3}
    >
      <group ref={pillsRef} position={[4, 0, 0]}>
        {pills.map((pill, index) => (
          <mesh key={index} position={new THREE.Vector3(...pill.position)} rotation={new THREE.Euler(...pill.rotation)}>
            <capsuleGeometry args={[0.2, 0.8, 16, 32]} />
            <meshStandardMaterial 
              color={pill.color}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
        ))}
        
        {/* Display Surface */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial 
            color="#ffffff"
            roughness={0.5}
          />
        </mesh>
      </group>
    </Float>
  );
};

const PharmacyService = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const features = [
    {
      icon: <Store className="h-8 w-8 text-brand-600" />,
      title: 'Multiple Store Locations',
      description: 'Conveniently located pharmacy outlets across the city for easy access.',
    },
    {
      icon: <Pill className="h-8 w-8 text-brand-600" />,
      title: 'Complete Medication Range',
      description: 'Extensive inventory of prescription drugs, OTC medicines, and healthcare products.',
    },
    {
      icon: <Clock className="h-8 w-8 text-brand-600" />,
      title: '24/7 Service',
      description: 'Round-the-clock pharmacy services for emergency medication needs.',
    },
    {
      icon: <Check className="h-8 w-8 text-brand-600" />,
      title: 'Licensed Pharmacists',
      description: 'Qualified professionals to provide medication counseling and advice.',
    },
  ];

  const serviceTypes = [
    {
      title: "Prescription Fulfillment",
      items: [
        "Quick processing of prescriptions",
        "Digital prescription uploads",
        "Automatic refill reminders",
        "Insurance claim assistance"
      ]
    },
    {
      title: "Medication Management",
      items: [
        "Personalized dosage packaging",
        "Medication adherence programs",
        "Drug interaction checks",
        "Comprehensive medication reviews"
      ]
    },
    {
      title: "Health Services",
      items: [
        "Vaccination services",
        "Basic health screenings",
        "Medication therapy management",
        "Health education resources"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section with 3D Elements */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brand-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:w-1/2">
                  <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full font-medium text-sm mb-4">
                      Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 mb-6 leading-tight">
                      RI Medicare <span className="text-brand-600">Pharmacy</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Modern pharmacy services with comprehensive medication solutions and healthcare expertise.
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
                        <MedicineBottles />
                        <PillsDisplay />
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
                Our Pharmacy Services
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive medication solutions for all your healthcare needs
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
        
        {/* Service Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-4">
                Comprehensive Pharmacy Solutions
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We offer a wide range of services to meet your healthcare needs
              </p>
              
              <div className="inline-block bg-brand-100 text-brand-600 px-4 py-2 rounded-full text-sm font-medium mb-2">
                Coming Soon
              </div>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {serviceTypes.map((service, index) => (
                  <div 
                    key={index}
                    className={`glassmorphism p-8 rounded-2xl transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 flex items-center justify-center mb-6">
                        <Pill className="h-8 w-8 text-brand-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                      <ul className="space-y-3">
                        {service.items.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-center gap-2">
                            <Check className="h-4 w-4 text-brand-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
                Pharmacy Locations
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Find an RI Medicare Pharmacy near you
              </p>
              <div className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full font-medium">
                Coming Soon
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-xl overflow-hidden border border-gray-200 shadow-sm h-80 flex items-center justify-center bg-gray-100 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center p-6">
                  <MapPin className="h-12 w-12 text-brand-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Interactive Location Map</h3>
                  <p className="text-gray-500">Our pharmacy location map will be available here once we launch.</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Initial locations will include major cities across India, with plans for rapid expansion.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-brand-500 to-blue-600 text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Stay Updated on Our Launch
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Register your interest to be notified when RI Medicare Pharmacy services become available in your area.
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
                Your health is our priority. We're excited to bring modern pharmacy services to you soon.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PharmacyService;
