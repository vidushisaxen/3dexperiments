import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text, useVideoTexture } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from '@/lib';

const Plane = ({ video, text, index }) => {
    const [hovered, setHovered] = useState(false);
    const videoTexture = useVideoTexture(video, {
      start: false, // Prevents autoplay
      muted: true, // Ensures it plays when interacted with
      loop: false, // Prevents continuous play
      playsInline: true, // Ensures proper play behavior
    });
  
    const isEven = index % 2 === 0;
    const planePosition = isEven ? [-2, 0, 0] : [2, 0, 0];
    const textPosition = isEven ? [8, 0, 0] : [-8, 0, 0];
  
    return (
      <group>
        <mesh
          position={planePosition}
          onPointerOver={() => {
            setHovered(true);
            if (videoTexture.image) {
              videoTexture.image.play();
            }
          }}
          onPointerOut={() => {
            setHovered(false);
            if (videoTexture.image) {
              videoTexture.image.pause();
            }
          }}
        >
          <planeGeometry args={[14, 10]} />
          <meshBasicMaterial map={videoTexture} />
        </mesh>
        <Text position={textPosition} fontSize={1.2} color="white" maxWidth={2} textAlign="center">
          {text}
        </Text>
      </group>
    );
  };
  

const ScrollContent = () => {
  const videos = [
    { video: "/assets/preview.mp4", text: "First" },
    { video: "/assets/drei.mp4", text: "Second" },
    { video: "/assets/preview.mp4", text: "Third" },
    { video: "/assets/drei.mp4", text: "Fourth" },
    { video: "/assets/preview.mp4", text: "Fifth" },
  ];

  return (
    <div className="w-full">
      {videos.map((video, index) => (
        <div key={index} className="h-screen w-full relative" id={`section-${index}`}>
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <Plane {...video} index={index} />
              {/* <EffectComposer>
                <Fluid />
              </EffectComposer> */}
            </Canvas>
          </div>
        </div>
      ))}
    </div>
  );
};

const ScrollableGallery = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-black flex flex-col items-center justify-center">
      <div className="p-[3vw]">
        <h1 className="text-white text-[5vw]">3D Experiments</h1>
      </div>
      <ScrollContent />
    </div>
  );
};

export default ScrollableGallery;
