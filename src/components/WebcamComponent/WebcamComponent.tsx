'use client';

import React, { useRef, useEffect } from 'react';

interface WebcamComponentProps {
  roomId?: string;
}

export default function WebcamComponent({ roomId = 'default-room' }: WebcamComponentProps) {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const smallVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }

        // Note: Daily.co integration would go here
        // You can use the DAILY_API_KEY from environment variables
        // const DAILY_API_KEY = process.env.NEXT_PUBLIC_DAILY_API_KEY;

      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startWebcam();

    return () => {
      // Clean up the webcam stream when the component is unmounted
      const stream = webcamRef.current?.srcObject as MediaStream;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [roomId]);

  return (
    <div className="video-container">
      <div className="main-video">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', maxWidth: '800px', borderRadius: '8px' }}
        />
      </div>
      <div className="small-video">
        <video
          ref={smallVideoRef}
          autoPlay
          playsInline
          muted
          className="small-webcam"
          style={{ width: '200px', borderRadius: '8px' }}
        />
      </div>
    </div>
  );
}
