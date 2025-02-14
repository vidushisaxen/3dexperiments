import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useState, useEffect } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// Shader material with smooth vertical modification
const TrapeziumMaterial = shaderMaterial(
  { uWindowWidth: 1920, uPlaneX: 0, uSmoothFactor: 0.3, uTime: 0 }, // Added uSmoothFactor & uTime
  `
  varying vec2 vUv;
  uniform float uWindowWidth;
  uniform float uPlaneX;
  uniform float uSmoothFactor;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 modifiedPosition = position;

    // Normalize screen width value
    float screenCenter = uWindowWidth / 2.0;
    float planeFactor = (uPlaneX - screenCenter) / screenCenter; // -1 (left) to +1 (right)

    float scaleFactor;

    if (planeFactor < -0.7) { 
      scaleFactor = mix(1.0, 0.7, smoothstep(0.0, 1.0, uv.x));
    } else if (planeFactor < -0.35) {
      scaleFactor = mix(0.7, 0.5, smoothstep(0.0, 1.0, uv.x));
    } else if (planeFactor > 0.7) { 
      scaleFactor = mix(0.7, 1.0, smoothstep(0.0, 1.0, uv.x));
    } else if (planeFactor > 0.25) {
      scaleFactor = mix(0.5, 0.7, smoothstep(0.0, 1.0, uv.x));
    } else { 
      scaleFactor = 0.45;
    }

    // **Smooth vertical movement animation using sine wave**
    float verticalOffset = sin(uTime * 0.8) * 0.5; // Smooth Y-motion animation

    // **Apply smoothstep to make it more natural**
    float smoothY = mix(modifiedPosition.y, modifiedPosition.y * scaleFactor, smoothstep(0.0, 1.0, uSmoothFactor));
    
    // **Add the sine-based wave effect**
    modifiedPosition.y = smoothY + verticalOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(modifiedPosition, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
  }
  `
);

// Extend Drei's custom material
extend({ TrapeziumMaterial });

// Plane Component with smooth shader transformations
const MovingPlane = ({ initialX }) => {
  const ref = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const elapsedTime = useRef(0);

  // Handle Window Resize Event
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY * 0.01); // Adjust scroll speed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      let newX = initialX - scrollPosition;

      // **Wrap around when it moves past the left boundary**
      if (newX < -8) {
        newX += 15; // Move to the rightmost position
      }

      ref.current.position.x = newX;

      // Update shader uniforms dynamically
      ref.current.material.uniforms.uWindowWidth.value = windowWidth;
      ref.current.material.uniforms.uPlaneX.value =
        ((ref.current.position.x + 8) / 16) * windowWidth; // Normalized screen position

      // **Update time uniform for smooth vertical motion**
      elapsedTime.current += state.clock.getDelta();
      ref.current.material.uniforms.uTime.value = elapsedTime.current;
    }
  });

  return (
    <mesh ref={ref} position={[initialX, 0, 0]}>
      <planeGeometry args={[2, 2, 50, 50]} />
      <trapeziumMaterial uWindowWidth={windowWidth} uPlaneX={0} uSmoothFactor={0.3} uTime={0} />
    </mesh>
  );
};

const Test = () => {
  const positions = [-6, -3, 0, 3, 6]; // Initial positions

  return (
    <div className="w-screen h-[150vw]">
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        {positions.map((pos, i) => (
          <MovingPlane key={i} initialX={pos} />
        ))}
      </Canvas>
    </div>
  );
};

export default Test;
