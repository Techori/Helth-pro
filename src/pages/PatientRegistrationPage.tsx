import { useEffect } from 'react';
import * as faceapi from 'face-api.js';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PatientRegistration from '@/components/PatientRegistration';

const PatientRegistrationPage = () => {
  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        console.log('Face-api models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };

    loadModels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Patient Registration</h1>
            <PatientRegistration />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PatientRegistrationPage; 