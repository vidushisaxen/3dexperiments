"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";

const R3FCanvas = ({ children, height = "100vh" }) => {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-y-auto"
      style={{ height }}
    >
      <div className="relative w-full h-full">
        <Canvas 
          eventSource={containerRef} 
          eventPrefix="client"
          className="w-full h-full"
          style={{ position: "fixed", top:"0", left:"0" }}
        > 
          <Suspense fallback={null}>
            {children}
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 5, 3]} intensity={1} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default R3FCanvas;