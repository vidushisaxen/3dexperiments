"use client";
import { EffectComposer } from '@react-three/postprocessing';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Fluid } from '@/lib';

gsap.registerPlugin(ScrollTrigger);

const Model = ({ modelPath, isTransitioning, onModelChangeComplete }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  const rotationSpeedRef = useRef(0.01);
  const opacityRef = useRef({ value: 1 });
  const scaleRef = useRef({ value: 1.2 });

  const updateMaterialOpacity = (opacity) => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          if (child.material.length) {
            child.material.forEach((mat) => {
              mat.transparent = true;
              mat.opacity = opacity;
            });
          } else {
            child.material.transparent = true;
            child.material.opacity = opacity;
          }
        }
      });
    }
  };
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const delta = window.scrollY - lastScrollY;
      rotationSpeedRef.current = Math.min(0.2, Math.abs(delta) * 0.01); 
      if (delta !== 0) {
        rotationSpeedRef.current *= delta > 0 ? 1 : -1; 
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isTransitioning && modelRef.current) {
      rotationSpeedRef.current = 0.2;
      opacityRef.current.value = 1;
      scaleRef.current.value = 1.2;
  
      const tl = gsap.timeline({
        onComplete: () => {
          if (onModelChangeComplete) {
            onModelChangeComplete();
          }
          rotationSpeedRef.current = 0.01;
          updateMaterialOpacity(1);
        },
      });
      tl.to(opacityRef.current, {
        value: 0,
        duration: 0.2,
        onUpdate: () => {
          updateMaterialOpacity(opacityRef.current.value);
        },
      })
        .to(
          scaleRef.current,
          {
            value: 0.8,
            duration: 0.2,
            onUpdate: () => {
              if (modelRef.current) {
                modelRef.current.scale.set(
                  scaleRef.current.value,
                  scaleRef.current.value,
                  scaleRef.current.value
                );
              }
            },
          },
          0 
        )
        .to(
          modelRef.current.rotation,
          {
            y: "+=" + Math.PI*2,
            duration: 0.2,
            ease: "power3.out",
            paused:true,
          },
          0 
        );
  
     
      if (onModelChangeComplete) {
        setTimeout(onModelChangeComplete, 100); 
      }
    }
  
    if (!isTransitioning && modelRef.current) {
      const tl = gsap.timeline();
      updateMaterialOpacity(0);
      modelRef.current.scale.set(0.5, 0.5, 0.5);
      modelRef.current.rotation.y = 0;
  
      tl.to(opacityRef.current, {
        value: 1,
        duration: 0.2,
        onUpdate: () => {
          updateMaterialOpacity(opacityRef.current.value);
        },
      })
        .to(
          scaleRef.current,
          {
            value: 1.2,
            duration: 0.2,
            onUpdate: () => {
              if (modelRef.current) {
                modelRef.current.scale.set(
                  scaleRef.current.value,
                  scaleRef.current.value,
                  scaleRef.current.value
                );
              }
            },
          },
          0
        )
        .to(
          modelRef.current.rotation,
          {
            y: Math.PI,
            duration: 0.2,
            ease: "power3.out",
          },
          0
        );
    }
  }, [isTransitioning, onModelChangeComplete]);
  

  useFrame(({ clock }) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += rotationSpeedRef.current;
      modelRef.current.position.y = Math.sin(clock.elapsedTime * 2) * 0.15;

      rotationSpeedRef.current *= 0.95;
      if (Math.abs(rotationSpeedRef.current) < 0.01) {
        rotationSpeedRef.current = 0.01; 
      }
    }
  });
  

  return (
    <mesh>
<primitive ref={modelRef} object={scene} scale={1.2} />;
    </mesh>
  )
  
};
const Blur = ({ modelType, onModelChangeComplete }) => {
  const [currentModel, setCurrentModel] = useState(modelType);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (modelType !== currentModel && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentModel(modelType);
      }, 500); 
    }
  }, [modelType, currentModel, isTransitioning]);

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (onModelChangeComplete) {
      onModelChangeComplete();
    }
  };

  return (
    <Canvas
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents:'none'
      }}
      camera={{ position: [0, 2, 5], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={1} />
      <Model
        modelPath={currentModel}
        isTransitioning={isTransitioning}
        onModelChangeComplete={handleTransitionComplete}
      />
      <OrbitControls enableZoom={false} />
      <EffectComposer>
        <Fluid/>
      </EffectComposer>
    </Canvas>
  );
};

export default Blur;
