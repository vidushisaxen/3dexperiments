import React, { useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { TextureLoader } from "three";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@/lib";

const Plane = ({ image, text, index }) => {
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(TextureLoader, image);

  const isEven = index % 2 === 0;
  const planePosition = isEven ? [-2, 0, 0] : [2, 0, 0];
  const textPosition = isEven ? [8, 0, 0] : [-8, 0, 0];

  return (
    <group>
      <mesh
        position={planePosition}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      <Text position={textPosition} fontSize={1.2} color="white" maxWidth={2} textAlign="center">
        {text}
      </Text>
    </group>
  );
};

const ScrollContent = () => {
  const images = [
    { image: "/assets/listing/arrows-listing.png", text: "First" },
    { image: "/assets/listing/blur-sphere-listing.png", text: "Second" },
    { image: "/assets/listing/cars-listing.png", text: "Third" },
    { image: "/assets/listing/chroma-listing.png", text: "Fourth" },
    { image: "/assets/listing/arrows-listing.png", text: "Fifth" },
  ];

  return (
    <div className="w-full">
      {images.map((image, index) => (
        <div key={index} className="h-screen w-full relative" id={`section-${index}`}>
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8] }}>
              <Plane {...image} index={index} />
              <EffectComposer>
                <Fluid 
                  blend={5}
                  intensity={2}
                  force= {4}
                  distortion= {0.04}
                  curl= {0}
                  radius={0.3}
                  swirl={0.1}
                  pressure={0.4}
                  densityDissipation={ 0.96}
                  velocityDissipation={1.0}
                  fluidColor='#000000'
                  backgroundColor='#1a1a1a'
                  showBackground={true}
                  rainbow={ false}
                
                
                
                />
              </EffectComposer>
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
        <h1 className="text-white text-[5vw]">3D Image Gallery</h1>
      </div>
      <ScrollContent />
    </div>
  );
};

export default ScrollableGallery;
