import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import useRouteChange from './hooks/useRouteChange';

const BlobsShader = ({ colors, scrollSpeed }) => {
  const fragmentShader = `
   uniform float uTime;
uniform vec2 uResolution;
uniform vec3 baseBlue;
uniform vec3 baseYellowGreen;
varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float morphingCircle(vec2 uv, vec2 center, float time) {
    vec2 d = uv - center * 1.5;
    float angle = atan(d.y, d.x);
    
    // Create a smooth base radius that pulses over time
    float baseRadius = 1.0 + 0.2 * sin(time * 0.5);
    
    // Add subtle variations to make it more organic
    float radius = baseRadius + 
                   0.0001 * snoise(vec2(angle * 2.0 + time * 0.3, time * 0.3)) +
                   0.01 * sin(angle * 3.0 + time * 0.7) +
                   0.03 * sin(angle * 4.0 - time * 0.5);
    
    return length(d) / radius * 0.9;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.x -= 0.4;
    uv.x *= uResolution.x / uResolution.y;

    vec3 white = vec3(1.0);
    
    float blueMixValue = 0.3 + 0.4 * abs(snoise(vec2(uTime * 0.2, 0.0)));
    float yellowGreenMixValue = 0.3 + 0.4 * abs(snoise(vec2(uTime * 0.25, 4.0)));
    
    vec3 blue = mix(white, baseBlue, blueMixValue);
    vec3 yellowGreen = mix(white, baseYellowGreen, yellowGreenMixValue);

    vec2 centerBlue = vec2(
        snoise(vec2(uTime * 0.1, 0.0)) * 0.9 + 0.5,
        snoise(vec2(uTime * 0.1 + 10.0, 0.0)) * 0.9 + 0.5
    );
    
    vec2 centerYellowGreen = vec2(
        snoise(vec2(uTime * 0.15 + 5.0, 0.0)) * 0.9 + 0.5,
        snoise(vec2(uTime * 0.15 + 15.0, 0.0)) * 0.9 + 0.5
    );

    float distBlue = morphingCircle(uv, centerBlue, uTime/1.5);
    float distYellowGreen = morphingCircle(uv, centerYellowGreen, uTime/1.5);

    vec3 color = white;
    
    color = mix(color, blue, smoothstep(0.3, 0.8, 0.9 - distBlue));
    color = mix(color, yellowGreen, smoothstep(0.2, 0.8, 1.0 - distYellowGreen));

    gl_FragColor = vec4(color, 1.0);
}
  `;

  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const meshRef = useRef();
  const materialRef = useRef();
  const { size } = useThree();

  const uniforms = useRef({
    uResolution: { value: new THREE.Vector2(4, 4) },
    uTime: { value: 0 },
    baseBlue: { value: new THREE.Vector3(...colors.baseBlue) },
    baseYellowGreen: { value: new THREE.Vector3(...colors.baseYellowGreen) },
  });

  useEffect(() => {
    uniforms.current.baseBlue.value.set(...colors.baseBlue);
    uniforms.current.baseYellowGreen.value.set(...colors.baseYellowGreen);
  }, [colors]);

  useEffect(() => {
    uniforms.current.uResolution.value.set(size.width, size.height);
  }, [size]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime() + scrollSpeed;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
};

const AnimatedBlobs = () => {
    const { colors, scrollSpeed } = useRouteChange(); 
  
    return (
      <div className="w-full h-full fixed top-0 left-0 z-[-1] canvas-animation">
        <Canvas style={{ height: '100%', width: '100vw' }}>
          <BlobsShader colors={colors} scrollSpeed={scrollSpeed} />
        </Canvas>
      </div>
    );
  };
  
  export default AnimatedBlobs;
