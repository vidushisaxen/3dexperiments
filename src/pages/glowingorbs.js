import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GlowingOrbMaterial = ({ color1, color2, position1, position2 }) => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.iResolution.value.set(
        state.size.width,
        state.size.height,
        1
      );
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={{
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(1, 1, 1) },
        color1: { value: new THREE.Color(color1) },
        color2: { value: new THREE.Color(color2) },
        position1: { value: new THREE.Vector2(position1[0], position1[1]) },
        position2: { value: new THREE.Vector2(position2[0], position2[1]) },
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float iTime;
        uniform vec3 iResolution;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec2 position1;
        uniform vec2 position2;
        varying vec2 vUv;
      
        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
      
          float time = iTime * 0.5;
          vec2 center1 = position1 + vec2(cos(time) * 0.3, sin(time * 0.7) * 0.2);
          float radius1 = length(uv - center1);
          float glow1 = exp(-radius1 * 3.0);
          glow1 *= 0.8 + 0.3 * sin(time * 2.0);
          vec3 colorFinal1 = color1 * glow1;
          colorFinal1 += color1 * 0.1 * pow(glow1, 3.0);
          colorFinal1 *= smoothstep(1.0, 0.2, length(uv));
      
          vec2 center2 = position2 + vec2(cos(time * 1.3) * 0.3, sin(time * 0.9) * 0.2);
          float radius2 = length(uv - center2);
          float glow2 = exp(-radius2 * 3.0);
          glow2 *= 0.8 + 0.3 * sin(time * 2.0);
          vec3 colorFinal2 = color2 * glow2;
          colorFinal2 += color2 * 0.1 * pow(glow2, 3.0);
          colorFinal2 *= smoothstep(1.0, 0.2, length(uv));
      
          float mixFactor = smoothstep(0.0, 1.0, abs(radius1 - radius2)); 
          vec3 finalColor = mix(colorFinal1, colorFinal2, mixFactor);
    
          fragColor = vec4(mix(vec3(1.0), finalColor, 1.0), 1.0);
        }
      
        void main() {
          vec2 fragCoord = vUv * iResolution.xy;
          mainImage(gl_FragColor, fragCoord);
        }
      `}
      
      
    />
  );
};

// Main component
const GlowingOrbsOnPlane = () => {
  return (
    <div className="w-full h-screen">
      <Canvas style={{background:"white"}}>
        <mesh>
          <planeGeometry args={[14, 8]}/>
          <GlowingOrbMaterial 
            color1="rgb(255, 165, 0)" 
            color2="rgb(0, 255, 255)"  
            position1={[-0.3, 0.3]}     
            position2={[0.3, -0.3]}
                      />
        </mesh>
      </Canvas>
    </div>
  );
};

export default GlowingOrbsOnPlane;
