import { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Button } from "@/components/ui/button";
import { Camera, Check, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { verifyFace } from "@/services/faceAuthService";

interface FaceAuthVerificationProps {
  emailId: string;
  onVerificationComplete: (success: boolean) => void;
}

const FaceAuthVerification = ({
  emailId,
  onVerificationComplete,
}: FaceAuthVerificationProps) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoMounted, setVideoMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading face-api models for verification...");

        // Load from public/models
        const modelPath = "./models";
        console.log(`Attempting to load models from: ${modelPath}`);

        await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);

        console.log("Models loaded successfully");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models:", error);
        setCameraError(
          `Model loading error: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        toast({
          title: "Error",
          description:
            "Failed to load face detection models. Please try again later.",
          variant: "destructive",
        });
      }
    };

    loadModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Effect to handle when videoRef is mounted/unmounted
  useEffect(() => {
    if (videoRef.current) {
      setVideoMounted(true);
      console.log("Video element mounted");
    } else {
      setVideoMounted(false);
    }
  }, [videoRef.current]);

  // Debug function to check if video dimensions exist
  const debugVideoElement = () => {
    if (videoRef.current) {
      console.log("Video element properties:");
      console.log(`- readyState: ${videoRef.current.readyState}`);
      console.log(`- videoWidth: ${videoRef.current.videoWidth}`);
      console.log(`- videoHeight: ${videoRef.current.videoHeight}`);
      console.log(`- offsetWidth: ${videoRef.current.offsetWidth}`);
      console.log(`- offsetHeight: ${videoRef.current.offsetHeight}`);
      console.log(`- style.display: ${videoRef.current.style.display}`);
    } else {
      console.log("Video element not available");
    }
  };

  // Function to check devices
  const checkMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log(`Available video devices: ${videoDevices.length}`);
      videoDevices.forEach((device, i) => {
        console.log(`Camera ${i + 1}: ${device.label || "Unnamed camera"}`);
      });
      return videoDevices.length > 0;
    } catch (err) {
      console.error("Error checking media devices:", err);
      return false;
    }
  };

  // Start video capture
  const startCapture = async () => {
    if (!isModelLoaded) {
      toast({
        title: "Please Wait",
        description: "Face detection models are still loading...",
      });
      return;
    }

    setCameraError(null);
    setIsCapturing(true); // Set capturing to true to show the video container

    try {
      // Check for available cameras
      const hasCameras = await checkMediaDevices();
      if (!hasCameras) {
        setCameraError("No cameras detected on your device");
        toast({
          title: "Camera Not Found",
          description: "No video input devices detected.",
          variant: "destructive",
        });
        return;
      }

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      console.log("Requesting camera access for verification...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      console.log("Camera access granted!");

      // Wait a moment for the video element to be fully mounted in the DOM
      setTimeout(() => {
        if (videoRef.current) {
          console.log("Setting video source...");

          // Important: First set the video element to be visible
          videoRef.current.style.display = "block";

          // Set srcObject
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraStream(stream);

          // Start capturing
          setCapturedImage(null);

          // Handle video loaded event
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            if (videoRef.current) {
              videoRef.current
                .play()
                .then(() => {
                  console.log("Camera started successfully");
                  setVideoLoaded(true);
                  setTimeout(debugVideoElement, 1000);
                })
                .catch((err) => {
                  console.error("Error playing video:", err);
                  setCameraError(`Error playing video: ${err.message}`);
                });
            }
          };

          // Add error handling for video
          videoRef.current.onerror = (event: Event) => {
            console.error("Video error:", event);
            setCameraError(`Video error: ${event.type || "unknown"}`);
          };
        } else {
          console.error("Video reference not available");
          setCameraError(
            "Video reference not available. Please try refreshing the page."
          );
        }
      }, 300); // Small delay to ensure DOM is updated
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(
        `Camera access error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      toast({
        title: "Camera Error",
        description:
          "Unable to access camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  // Capture photo from video
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas reference not available");
      setCameraError(
        "Video or canvas reference not available. Please try again."
      );
      return;
    }

    const videoEl = videoRef.current;
    const canvas = canvasRef.current;

    try {
      // Check if video dimensions are available
      if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
        console.error("Video dimensions not available");
        debugVideoElement();
        throw new Error("Video stream not properly initialized");
      }

      // Match canvas dimensions to video
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;

      // Draw video frame to canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      console.log(`Capturing frame ${canvas.width}x${canvas.height}`);
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

      // Detect face in captured image
      console.log("Detecting faces for verification...");
      const detections = await faceapi.detectAllFaces(
        canvas,
        new faceapi.TinyFaceDetectorOptions()
      );
      console.log(`Detected ${detections.length} faces`);

      if (detections.length === 0) {
        toast({
          title: "No Face Detected",
          description:
            "Please position your face clearly in the frame and try again.",
        });
        return;
      } else if (detections.length > 1) {
        toast({
          title: "Multiple Faces Detected",
          description: "Please ensure only your face is visible in the frame.",
        });
        return;
      }

      // Convert canvas to image data URL
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);

      // Stop video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }

      setIsCapturing(false);
      setVideoLoaded(false);
    } catch (error) {
      console.error("Error during face detection:", error);
      toast({
        title: "Detection Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during detection",
        variant: "destructive",
      });
    }
  };

  // Reset the capture process
  const resetCapture = () => {
    setCapturedImage(null);
    setCameraError(null);
    setVideoLoaded(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setCameraStream(null);
    setIsCapturing(false);
  };

  // Verify face with backend
  const handleFaceVerification = async () => {
    if (!capturedImage) {
      toast({
        title: "Missing Face Data",
        description: "Please capture a clear image of your face first.",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Get full face description for verification
      if (!canvasRef.current) {
        throw new Error(
          "Canvas reference lost. Please try capturing the image again."
        );
      }

      console.log("Getting face descriptor for verification...");
      const fullFaceDescription = await faceapi
        .detectSingleFace(
          canvasRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!fullFaceDescription) {
        throw new Error("Could not generate face descriptor");
      }

      console.log("Face descriptor generated successfully");

      // Create verification data for MongoDB
      const verificationData = {
        emailId,
        faceImage: capturedImage,
        descriptor: Array.from(fullFaceDescription.descriptor),
      };

      // Send to API for verification using our service
      console.log("Sending face data to verification API...");
      const data = await verifyFace(verificationData);

      if (data.success) {
        console.log("Face verification successful");
        toast({
          title: "Verification Successful",
          description: "Your identity has been verified.",
        });
        onVerificationComplete(true);
      } else {
        console.log("Face verification failed:", data.message);
        toast({
          title: "Verification Failed",
          description: data.message || "Unable to verify your identity.",
          variant: "destructive",
        });
        onVerificationComplete(false);
      }
    } catch (error) {
      console.error("Face verification error:", error);
      toast({
        title: "Verification Error",
        description: `There was a problem verifying your identity: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
      onVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">Face Authentication</h2>
        <p className="text-muted-foreground">
          Please verify your identity to proceed with payment
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center">
          {!isCapturing && !capturedImage ? (
            <div
              className="w-full max-w-md h-64 bg-gray-100 rounded-lg flex items-center justify-center"
              onClick={startCapture}
              style={{ cursor: isModelLoaded ? "pointer" : "not-allowed" }}
            >
              <div className="text-center text-gray-500">
                <Camera className="h-10 w-10 mx-auto mb-2" />
                <p>Click to start camera and verify your identity</p>
              </div>
            </div>
          ) : (
            <>
              {isCapturing && (
                <div className="relative w-full max-w-md h-[360px] border border-primary rounded-lg overflow-hidden">
                  {cameraError && (
                    <div className="absolute inset-0 bg-red-50 flex items-center justify-center p-4 z-10">
                      <div className="text-center">
                        <p className="text-red-500 font-medium">Camera Error</p>
                        <p className="text-sm text-red-400 mt-2">
                          {cameraError}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            resetCapture();
                            setTimeout(() => startCapture(), 500);
                          }}
                        >
                          Retry Camera
                        </Button>
                      </div>
                    </div>
                  )}

                  <video
                    ref={videoRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block", // Important: Always display the video element
                    }}
                    autoPlay
                    playsInline
                    muted
                  />

                  <div className="absolute inset-0 border-4 border-dashed border-primary/40 pointer-events-none" />

                  {!videoLoaded && !cameraError && (
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-primary animate-pulse">
                          Loading camera...
                        </p>
                      </div>
                    </div>
                  )}

                  {videoLoaded && (
                    <Button
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white"
                      onClick={capturePhoto}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Photo
                    </Button>
                  )}
                </div>
              )}

              <canvas
                ref={canvasRef}
                className={
                  capturedImage
                    ? "rounded-lg w-full max-w-md border border-primary"
                    : "hidden"
                }
              />

              {capturedImage && (
                <div className="mt-4 w-full max-w-md">
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm text-green-700">
                      Face detected successfully
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={resetCapture}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Retake
                    </Button>

                    <Button
                      onClick={handleFaceVerification}
                      disabled={isVerifying}
                      className="flex-1"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Identity"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Camera status debugging info - useful during development */}
        <div className="text-xs text-muted-foreground border-t pt-2">
          <p>
            Camera status: {cameraStream ? "Active" : "Inactive"}
            {videoLoaded ? " (video loaded)" : ""}
          </p>
          <p>Models loaded: {isModelLoaded ? "Yes" : "No"}</p>
          <p>Video mounted: {videoMounted ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
};

export default FaceAuthVerification;