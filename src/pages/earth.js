import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';

THREE.ColorManagement.enabled = true;

const params = {
  sunIntensity: 5.3,
  speedFactor: 2.0,
  metalness: 0.1,
  atmOpacity: 0.7,
  atmPowFactor: 4.1,
  atmMultiplier: 5.5,
  particleCount: 5000,
  particleSize: 0.08,
  galaxyRadius: 100,
};

function ParticleGalaxy() {
  const points = useRef();

  React.useEffect(() => {
    const positions = new Float32Array(params.particleCount * 3);
    const colors = new Float32Array(params.particleCount * 3);
    const alphas = new Float32Array(params.particleCount); 

    for (let i = 0; i < params.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = THREE.MathUtils.randFloat(20, params.galaxyRadius);

      const x = Math.cos(angle) * radius;
      const y = THREE.MathUtils.randFloatSpread(30);
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const color = new THREE.Color();
      color.setHSL(0.6, 0.8, THREE.MathUtils.randFloat(0.5, 1));

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      alphas[i] = Math.random(); // Initial alpha values
    }

    points.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    points.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    points.current.geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  }, []);

  useFrame((state, delta) => {
    const alphas = points.current.geometry.attributes.alpha.array;
    for (let i = 0; i < alphas.length; i++) {
      alphas[i] = Math.abs(Math.sin(state.clock.elapsedTime + i)); 
    }
    points.current.geometry.attributes.alpha.needsUpdate = true;
    points.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry />
      <pointsMaterial 
        size={params.particleSize}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={1}
      />
    </points>
  );
}
function PlaneWithText({ position, text, texturePath, rotation }) {
  const texture = useLoader(TextureLoader, texturePath);

  return (
     <mesh position={position} rotation={rotation}>
     <planeGeometry args={[1, 1]} />
     <meshBasicMaterial map={texture} transparent={true} />
     <Text fontSize={0.2} color="black" anchorX="center" anchorY="middle" position={[0, -0.1, 0.01]}>
       {text}
     </Text>
   </mesh>
  );
}

function EarthGroup() {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const envMapGroupRef = useRef();
  
  const [albedoMap, bumpMap, cloudsMap, oceanMap, lightsMap] = useLoader(TextureLoader, [
    '/assets/earth/albedo.jpg',
    '/assets/earth/bump.jpg',
    '/assets/earth/clouds.png',
    '/assets/earth/ocean.png',
    '/assets/earth/night-light.png'
  ]);

  React.useEffect(() => {
    albedoMap.colorSpace = THREE.SRGBColorSpace;
  }, [albedoMap]);

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
        <PlaneWithText position={[0, 11, -1]} text="NY"  texturePath={"/assets/location-sign.svg"} rotation={[-Math.PI/6, 0, 0]}/>
        <PlaneWithText position={[-9, 5, 3]} text="IN" texturePath={"/assets/location-sign.svg"} rotation={[-Math.PI/6, 0, 0]}/>
        <PlaneWithText position={[10, -2, 3]} text="UK" texturePath={"/assets/location-sign.svg"} rotation={[0, 0, 0]} />
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
        <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={45} near={1} far={1000} />
        <color attach="background" args={['#000000']} />
        
        <directionalLight position={[-50, 0, 30]} intensity={params.sunIntensity} />
        
        <OrbitControls
        dampingFactor={0.05}
          enablePan={false}
          enableZoom={true}
          minDistance={15}
          maxDistance={50}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
          // minPolarAngle={Math.PI/2} 
          // maxPolarAngle={Math.PI/2}
        />
        
        <Suspense fallback={null}>
          <ParticleGalaxy />
          <EarthGroup />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Earth;