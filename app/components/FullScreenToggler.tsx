"use client";

import React, { useState, useCallback, useEffect } from "react";

interface ToggleFullScreenProps {
  children: React.ReactNode;
}

const FullScreenToggler: React.FC<ToggleFullScreenProps> = ({ children }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const fullScreenChangeHandler = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullScreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullScreenChangeHandler);
    };
  }, []);

  return (
    <div onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
};

export default FullScreenToggler;
