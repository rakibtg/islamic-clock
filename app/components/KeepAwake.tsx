"use client";

import React, { useEffect, useRef } from "react";

interface KeepAwakeVideoProps {
  children: React.ReactNode;
}

const KeepAwake: React.FC<KeepAwakeVideoProps> = ({ children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Create a 1-byte black video
    const blob = new Blob(
      [
        new Uint8Array([
          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        ]),
      ],
      { type: "video/mp4" }
    );
    const url = URL.createObjectURL(blob);

    if (videoRef.current) {
      videoRef.current.src = url;
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        autoPlay
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "1px",
          height: "1px",
          pointerEvents: "none",
        }}
      />
      {children}
    </>
  );
};

export default KeepAwake;
