import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Get data URL
        const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
        stopCamera();
        onCapture(imageSrc);
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <CameraOff className="w-16 h-16 text-red-500" />
        <p className="text-xl text-red-400">{error}</p>
        <button 
          onClick={onCancel}
          className="px-6 py-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in">
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {!isStreaming && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-slate-300">
               <span className="loading loading-spinner loading-md"></span>
               <span>Starting camera...</span>
            </div>
          </div>
        )}
        
        {/* Overlay Grid for visual aesthetics */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-full font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={capture}
          disabled={!isStreaming}
          className="group relative flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
        >
          <Camera className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          <span>Capture Mood</span>
        </button>
      </div>
      <p className="mt-4 text-sm text-slate-500">Center your face in the frame for best results.</p>
    </div>
  );
};

export default WebcamCapture;
