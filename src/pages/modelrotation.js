import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    model: { pos: [0, 0, 0], rot: [0, 0, 0] },
  },
  {
    model: { pos: [2, 0, 0], rot: [0, Math.PI / 2, 0] },
  },
  {
    model: { pos: [0, -0.5, 0], rot: [Math.PI / 4, 0, 0] },
  },
  {
    model: { pos: [-1.5, 0, 0], rot: [0, -Math.PI / 2, 0] },
  },
  {
    model: { pos: [1, 0, -1], rot: [0, Math.PI, 0] },
  },
  {
    model: { pos: [0, -1, 0], rot: [-Math.PI / 4, 0, 0] },
  },
];

function Scene() {
  const { scene } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf');
  const modelRef = useRef();

  useEffect(() => {
    const totalSections = SECTIONS.length - 1;

    ScrollTrigger.create({
      trigger: '.sections-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress * totalSections;
        const currentIndex = Math.floor(progress);
        const nextIndex = Math.min(currentIndex + 1, totalSections);

        const sectionProgress = progress - currentIndex;

        // Interpolating position and rotation
        const currentSection = SECTIONS[currentIndex];
        const nextSection = SECTIONS[nextIndex];

        const interpolate = (start, end) => start + (end - start) * sectionProgress;

        if (modelRef.current) {
          modelRef.current.position.set(
            interpolate(currentSection.model.pos[0], nextSection.model.pos[0]),
            interpolate(currentSection.model.pos[1], nextSection.model.pos[1]),
            interpolate(currentSection.model.pos[2], nextSection.model.pos[2])
          );

          modelRef.current.rotation.set(
            interpolate(currentSection.model.rot[0], nextSection.model.rot[0]),
            interpolate(currentSection.model.rot[1], nextSection.model.rot[1]),
            interpolate(currentSection.model.rot[2], nextSection.model.rot[2])
          );
        }
      },
    });
  }, []);

  return <primitive ref={modelRef} object={scene} position={[0, 0, 0]} />;
}

export default function modelrotation() {
  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full h-screen bg-[#222222]">
        <Canvas
          gl={{
            antialias: true,
            toneMapping: 3,
            outputEncoding: 3,
            toneMappingExposure: 1,
          }}
        >
          <Suspense fallback={null}>
            <PerspectiveCamera 
              makeDefault 
              position={[0, 0, 5]} 
              fov={45} 
              near={0.25} 
              far={20} 
            />
            <ambientLight intensity={4} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 5, 5]} intensity={0.8} />
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 sections-container">
        {SECTIONS.map((section, index) => (
          <div
            key={index}
            id={`section-${index}`}
            className="h-screen flex items-center justify-center"
          >
            <div className="max-w-lg mx-4">
              <div className="bg-black/60 bg-opacity-90 p-8 rounded-lg text-white shadow-xl">
                <h2 className="text-4xl font-bold mb-4">Section {index + 1}</h2>
                <p className="text-lg">Description for section {index + 1}.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
