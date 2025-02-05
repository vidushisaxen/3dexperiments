import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { PerspectiveCamera, Environment, OrbitControls, Html } from '@react-three/drei';
import Image from 'next/image';

THREE.ColorManagement.enabled = true;

const params = {
  sunIntensity: 5.3,
  speedFactor: 2.0,
  metalness: 0.1,
  atmOpacity: 0.7,
  atmPowFactor: 4.1,
  atmMultiplier: 9.5,
};

function EarthGroup() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const envMapGroupRef = useRef();
  const { scene } = useThree();
  
  const [albedoMap, bumpMap, cloudsMap, oceanMap, lightsMap, envMap] = useLoader(TextureLoader, [
    '/assets/earth/albedo.jpg',
    '/assets/earth/bump.jpg',
    '/assets/earth/clouds.png',
    '/assets/earth/ocean.png',
    '/assets/earth/night-light.png',
    '/assets/earth/galaxy.png'
  ]);

  React.useEffect(() => {
    albedoMap.colorSpace = THREE.SRGBColorSpace;
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
  }, [albedoMap, envMap, scene]);

 
  useFrame(() => {
    if (envMapGroupRef.current) {
      envMapGroupRef.current.rotation.y += 0.001; 
    }
  });

  useFrame((state, delta) => {
    cloudsRef.current.rotateY(delta * 0.01 * params.speedFactor);
  });

  const atmosphereShader = {
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float atmOpacity;
      uniform float atmPowFactor;
      uniform float atmMultiplier;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), atmPowFactor);
        gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * atmMultiplier * atmOpacity * 0.1;
      }
    `,
    uniforms: {
      atmOpacity: { value: params.atmOpacity },
      atmPowFactor: { value: params.atmPowFactor },
      atmMultiplier: { value: params.atmMultiplier }
    }
  };

  return (
    <group rotation-z={23.5 * (Math.PI / 180)}>
      <group ref={envMapGroupRef}>
        <mesh ref={earthRef} rotation-y={-0.3}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshStandardMaterial 
            map={albedoMap}
            bumpMap={bumpMap}
            bumpScale={0.03}
            roughnessMap={oceanMap}
            metalness={params.metalness}
            metalnessMap={oceanMap}
            emissiveMap={lightsMap}
            emissive={new THREE.Color(0xffff88)}
            emissiveIntensity={1}
          />
        </mesh>
        <mesh ref={cloudsRef} rotation-y={-0.3}>
          <sphereGeometry args={[10.05, 64, 64]} />
          <meshStandardMaterial
            alphaMap={cloudsMap}
            transparent={true}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[12.5, 64, 64]} />
          <shaderMaterial
            vertexShader={atmosphereShader.vertexShader}
            fragmentShader={atmosphereShader.fragmentShader}
            uniforms={atmosphereShader.uniforms}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            transparent={true}
          />
        </mesh>
      </group>
    </group>
  );
}
function CameraSetup() {
  const { camera, size } = useThree();
  
  React.useEffect(() => {
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}

const Earth = () => {
  return (
    <div className="w-full h-screen">
      <Canvas
        gl={{
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <CameraSetup />
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={45} near={1} far={1000} />
        
        <directionalLight position={[-50, 0, 30]} intensity={params.sunIntensity} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={15}
          maxDistance={50}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          minPolarAngle={Math.PI/2} 
          maxPolarAngle={Math.PI/2}
        />
        
        <Suspense fallback={null}>
          <EarthGroup />
        </Suspense>
      </Canvas>
      
    </div>
  );
};

export default Earth;
