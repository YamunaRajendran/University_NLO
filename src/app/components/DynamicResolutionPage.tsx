'use client';

import { useEffect, useState } from "react";

const DynamicResolutionPage = () => {
  const [scale, setScale] = useState<number>(1.25); // Default scale to 125%

  useEffect(() => {
    const updateScale = () => {
      const zoomLevel = window.devicePixelRatio; // Detect the current zoom level
      const scaleFactor = 1.25 / zoomLevel; // Adjust scale to maintain 125% default
      setScale(scaleFactor);
    };

    // Initial call to set the scale
    updateScale();

    // Update on window resize or zoom changes
    window.addEventListener("resize", updateScale);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    width: "1920px", // Set to the target resolution width
    height: "1080px", // Set to the target resolution height
    transform: `scale(${scale})`, // Scale dynamically
    transformOrigin: "top left", // Ensure scaling starts from the top-left corner
    overflow: "hidden", // Prevent any overflowing content
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <div style={containerStyle}>
        <h1>Dynamic Resolution Page</h1>
        <p>
          This page maintains a 1920x1080 resolution and starts with a default
          scale of 125%.
        </p>
      </div>
    </div>
  );
};

export default DynamicResolutionPage;
