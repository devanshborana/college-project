import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from '@vladmandic/face-api';
import CodingEnvironment from '../components/CodingEnvironment';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function TestMode() {
  const { subjectId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasConsent, setHasConsent] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [violations, setViolations] = useState<number>(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      } catch (err) {
        console.error("Failed to load face-api models:", err);
      }
    };
    loadModels();
  }, []);

  const startTest = async () => {
    // Request camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasConsent(true);
      
      // Start Backend Session
      const res = await fetch('http://localhost:8000/test-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ subject_id: parseInt(subjectId || '1') })
      });
      const data = await res.json();
      setSessionId(data.id);
    } catch (err) {
      alert("Camera permission is required for Test Mode.");
    }
  };

  const logViolation = async (type: string, details?: string) => {
    if (!sessionId || isEnded) return;
    
    setViolations(v => v + 1);
    
    await fetch(`http://localhost:8000/test-sessions/${sessionId}/violation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ type, details })
    });
  };

  // Face detection loop
  useEffect(() => {
    if (!hasConsent || !videoRef.current || isEnded) return;

    const interval = setInterval(async () => {
      if (videoRef.current) {
        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );

          if (detections.length === 0) {
            logViolation('no_face_detected', 'No face detected in webcam feed');
          } else if (detections.length > 1) {
            logViolation('multiple_faces', `${detections.length} faces detected`);
          }
        } catch (e) {
            // models might not be loaded yet
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [hasConsent, sessionId, isEnded]);

  // Tab switching loop
  useEffect(() => {
    if (!hasConsent || !sessionId || isEnded) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation('tab_switch', 'User switched tabs or minimized window');
      }
    };

    const handleBlur = () => {
      logViolation('window_blur', 'Window lost focus');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [hasConsent, sessionId, isEnded]);

  // Handle max violations
  useEffect(() => {
    if (violations === 3) {
      setShowWarningModal(true);
    } else if (violations >= 5 && !isEnded) {
      endTest('auto_submit');
      alert("Maximum violations reached. Your test has been auto-submitted.");
    }
  }, [violations]);

  const endTest = async (reason = 'user_submit') => {
    setIsEnded(true);
    if (sessionId) {
      await fetch(`http://localhost:8000/test-sessions/${sessionId}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      });
    }
    // Stop camera
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    navigate(`/subject/${subjectId}/practice`);
  };

  if (!hasConsent) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg mx-auto mt-10 shadow-sm text-center">
        <ShieldAlert size={48} className="mx-auto text-accent mb-4" />
        <h2 className="text-2xl font-bold text-text mb-4">Proctored Test Mode</h2>
        <p className="text-gray-600 mb-6 text-sm">
          This test requires webcam access to ensure academic integrity. 
          Your environment will be monitored for:
        </p>
        <ul className="text-left text-sm text-gray-500 space-y-2 mb-8 bg-gray-50 p-4 rounded-md">
          <li>• Face presence (no multiple people)</li>
          <li>• Tab switching or leaving the window</li>
          <li>• Copy-pasting code</li>
        </ul>
        <button onClick={startTest} className="px-6 py-2 bg-accent text-white rounded-md hover:bg-opacity-90 font-medium text-sm transition-colors">
          I Understand, Start Test
        </button>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative"
      onCopy={(e) => { e.preventDefault(); alert("Copying is disabled."); }} 
      onPaste={(e) => { e.preventDefault(); alert("Pasting is disabled."); }} 
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Proctor Header */}
      <div className="bg-red-50 border-b border-red-200 p-3 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="font-semibold text-red-800 text-sm tracking-wide">PROCTORING ACTIVE</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-red-700">Violations: {violations}/5</span>
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-24 h-16 bg-black rounded-md border border-red-200 object-cover shadow-sm" 
          />
          <button onClick={() => endTest('user_submit')} className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors">
            End Test
          </button>
        </div>
      </div>

      <div className="flex-1 pointer-events-auto">
        <CodingEnvironment />
      </div>

      {showWarningModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm text-center shadow-xl">
            <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Warning</h3>
            <p className="text-sm text-gray-600 mb-6">You have accumulated 3 violations. At 5 violations, your test will be automatically submitted.</p>
            <button onClick={() => setShowWarningModal(false)} className="px-6 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-opacity-90">
              Return to Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
