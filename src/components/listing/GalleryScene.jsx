import { useState, useRef, Suspense, useEffect } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import { Html, OrbitControls, ScrollControls, Text, useGLTF, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { Image, Environment } from '@react-three/drei'
import { easing } from 'maath'
import '../util'
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@/lib";

const planeData = [
  { texture: "/assets/listing/earth-listing.png", text:"Earth" },
  { texture: "/assets/listing/night-earth-listing.png",text:"Night Earth"  },
  { texture: "/assets/listing/arrows-listing.png",text:"Arrows"  },
  { texture: "/assets/listing/cars-listing.png",text:"Cars"  },
  { texture: "/assets/listing/chroma-listing.png" ,text:"Chroma" },
  { texture: "/assets/listing/curve-plane-listing.png",text:"Curve Plane"  },
  { texture: "/assets/listing/noise-listing.png",text:"Noise"  },
  { texture: "/assets/listing/mouse-pixelation-listing.png",text:"Mouse Pixelation"  },
  { texture: "/assets/listing/glowing-orbs-listing.png" ,text:"Glowing Orbs" },
  { texture: "/assets/listing/blur-sphere-listing.png",text:"Blur Sphere"  },
  { texture: "/assets/listing/furniverse-listing.png",text:"Furniverse"  },
  { texture: "/assets/listing/model-rotation-listing.png" ,text:"Model Rotation" },
  { texture: "/assets/listing/color-changing-listing.png" ,text:"Color Changing" },
  { texture: "/assets/listing/route-color-listing.png" , text:"Route Color"},
];

function Rig(props) {
  const ref = useRef();
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = -scroll.offset * Math.PI * 4;
      ref.current.position.y = THREE.MathUtils.lerp(0, 2.5, scroll.offset * 8.35);

      state.camera.lookAt(0, 0, 0);
    }
  });

  return <group ref={ref} {...props} />;
}
function Carousel({ radius = 5, planeData = [] }) {
  return planeData.map((plane, i) => (
    <group key={i}>
      <Card
        url={plane.texture}
        text={plane.text}
        position={[
          Math.sin((i / planeData.length) * Math.PI * 4) * radius,
          i * -1.5,
          Math.cos((i / planeData.length) * Math.PI * 4) * radius
        ]}
        rotation={[0, Math.PI * 2 + (i / planeData.length) * Math.PI * 4, 0]}
      />
    </group>
  ));
}


function Card({ url, text, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);

  useFrame((state, delta) => {
    easing.damp(ref.current.material, "radius", hovered ? 0.1 : 0.1, 0.2, delta);
  });

  return (
    <group {...props}>
      <Image
        ref={ref}
        url={url}
        transparent
        side={THREE.DoubleSide}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
      >
        <bentPlaneGeometry args={[0.5, 4, 3, 20, 20]} />
      </Image>
      <Text
        position={[0, -1.5, 0]} 
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="top"
      >
        {text}
      </Text>
    </group>
  );
}


function Scene() {
  const { scene } = useGLTF("/model.glb");
  const modelRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ 
          color: child.material.color,
          metalness: 1,   
          roughness: 0, 
          transparent:true,
        });
      }
    });
  }, [scene]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x += 0.03; 
      modelRef.current.rotation.y += 0.03;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, 5]} intensity={1} />
      <Environment preset="city" />

      <primitive ref={modelRef} object={scene} position={[0, 0, -5]} scale={0.01} />
    </>
  );
}
const GalleryScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 15 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Scene/>
      <Environment preset="studio" />
      <EffectComposer>
        <Fluid/>
      </EffectComposer>
      <ScrollControls pages={4}>
        <Rig>
          <Carousel planeData={planeData} />
        </Rig>

      </ScrollControls>
    </Canvas>
  );
};

export default GalleryScene;