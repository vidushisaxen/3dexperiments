import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import {useFrame } from "@react-three/fiber";
import { Sphere, shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import R3FCanvas from "@/components/listing/View";

// Shader Material with Perlin Noise & Blended Red Sphere
const NoiseShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(0, 0),
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader (with fixed Perlin Noise & red blended sphere)
  `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;
  varying vec3 vPosition;

  // Generate pseudo-random gradient vector
  vec3 randomGradient(vec3 pos) {
    return normalize(vec3(
        fract(sin(dot(pos, vec3(12.9898, 78.233, 45.164))) * 43758.5453),
        fract(sin(dot(pos, vec3(93.9898, 67.345, 98.233))) * 43758.5453),
        fract(sin(dot(pos, vec3(78.233, 45.164, 12.9898))) * 43758.5453)
    ) * 2.0 - 1.0);
  }

  // Perlin noise function
  float perlinNoise(vec3 P) {
    vec3 Pi = floor(P);
    vec3 Pf = fract(P);

    vec3 G000 = randomGradient(Pi);
    vec3 G001 = randomGradient(Pi + vec3(0, 0, 1));
    vec3 G010 = randomGradient(Pi + vec3(0, 1, 0));
    vec3 G011 = randomGradient(Pi + vec3(0, 1, 1));
    vec3 G100 = randomGradient(Pi + vec3(1, 0, 0));
    vec3 G101 = randomGradient(Pi + vec3(1, 0, 1));
    vec3 G110 = randomGradient(Pi + vec3(1, 1, 0));
    vec3 G111 = randomGradient(Pi + vec3(1, 1, 1));

    float w000 = dot(G000, Pf);
    float w100 = dot(G100, Pf - vec3(1, 0, 0));
    float w010 = dot(G010, Pf - vec3(0, 1, 0));
    float w110 = dot(G110, Pf - vec3(1, 1, 0));
    float w001 = dot(G001, Pf - vec3(0, 0, 1));
    float w101 = dot(G101, Pf - vec3(1, 0, 1));
    float w011 = dot(G011, Pf - vec3(0, 1, 1));
    float w111 = dot(G111, Pf - vec3(1, 1, 1));

    vec3 fade_xyz = Pf * Pf * (3.0 - 2.0 * Pf);
    
    float xa = mix(w000, w100, fade_xyz.x);
    float xb = mix(w010, w110, fade_xyz.x);
    float xc = mix(w001, w101, fade_xyz.x);
    float xd = mix(w011, w111, fade_xyz.x);

    float ya = mix(xa, xb, fade_xyz.y);
    float yb = mix(xc, xd, fade_xyz.y);

    return mix(ya, yb, fade_xyz.z);
  }

  void main() {
    // Apply Perlin noise
    float noise = perlinNoise(vec3(vUv * 30.0, uTime * 0.3));

    // Define a red sphere with smooth blending
    vec2 circlePos = vec2(0.5, 0.5); // Adjust the position
    float circleSize = 0.45;
    float dist = length(vUv - circlePos);
    

    float blackMask = smoothstep(circleSize - 0.03, circleSize - 0.04, dist);

    vec3 noiseColor = mix(vec3(0.1, 0.1, 0.1), vec3(0.9, 0.9, 0.9), noise);

    vec3 finalColor = mix(vec3(0.1,0.1,0.1), noiseColor, blackMask);

    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

extend({ NoiseShaderMaterial });

// Noise Sphere Component
const NoiseSphere = ({ uResolution }) => {
  const materialRef = useRef();
  const sphereRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uTime = clock.getElapsedTime();
      materialRef.current.uResolution = uResolution;
    }

   
  });

  return (
    <mesh ref={sphereRef} rotation={[0,-1,0]} position={[0,-0.5,0]}>
      <Sphere args={[4.5, 128, 128]}>
        <noiseShaderMaterial ref={materialRef} uResolution={uResolution} side={THREE.DoubleSide} />
      </Sphere>
    </mesh>
  );
};

// Red Sphere with Smoothstep
const RedSphere = () => {
  return (
    <mesh position={[2, -1, 0]}>
      <Sphere args={[1.5, 64, 64]}>
        <meshStandardMaterial color="red" transparent opacity={0.8} />
      </Sphere>
    </mesh>
  );
};

// Main App Component
const Noise = () => {
  const [resolution, setResolution] = useState(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleResize = () => setResolution(new THREE.Vector2(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-screen h-screen fixed top-0 left-0">
      <R3FCanvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 0]} intensity={1} />
        <NoiseSphere uResolution={resolution} />
        <RedSphere />
      </R3FCanvas>
    </div>
  );
};

export default Noise;