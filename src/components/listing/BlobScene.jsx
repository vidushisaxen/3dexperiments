import { useState, useRef} from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import {ScrollControls, Text, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { Image} from '@react-three/drei'
import { easing } from 'maath'
import '../util'
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@/lib";
import { Providers } from "../Blobify/providers";
import Home from "../Blobify/Home";

const planeData = [
  { texture: "/assets/listing/earth-listing.png", text: "Earth", link: "/earth" },
  { texture: "/assets/listing/night-earth-listing.png", text: "Night Earth", link: "/nightEarth" },
  { texture: "/assets/listing/arrows-listing.png", text: "Arrows", link: "/arrows" },
  { texture: "/assets/listing/cars-listing.png", text: "Cars", link: "/cars" },
  { texture: "/assets/listing/chroma-listing.png", text: "Chroma", link: "/chroma" },
  { texture: "/assets/listing/curve-plane-listing.png", text: "Curve Plane", link: "/curveplane" },
  { texture: "/assets/listing/noise-listing.png", text: "Noise", link: "/noise" },
  { texture: "/assets/listing/mouse-pixelation-listing.png", text: "Mouse Pixelation", link: "/mouse-pixelation" },
  { texture: "/assets/listing/glowing-orbs-listing.png", text: "Glowing Orbs", link: "/glowingorbs" },
  { texture: "/assets/listing/blur-sphere-listing.png", text: "Blur Sphere", link: "/blurspheremoving" },
  { texture: "/assets/listing/furniverse-listing.png", text: "Furniverse", link: "/furniverse" },
  { texture: "/assets/listing/model-rotation-listing.png", text: "Model Rotation", link: "/modelrotation" },
  { texture: "/assets/listing/color-changing-listing.png", text: "Color Changing", link: "/color-changing-background" },
  { texture: "/assets/listing/route-color-listing.png", text: "Route Color", link: "/route-color-change" },
  { texture: "/assets/listing/blob-mixer-listing.png", text: "Blob Mixer Color", link: "/blobmixer" },

  
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
        link={plane.link}
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

function Card({ url, text, link, ...props }) {
  const ref = useRef();
  const [hovered, hover] = useState(false);

  const pointerOver = (e) => (e.stopPropagation(), hover(true));
  const pointerOut = () => hover(false);
  const handleClick = () => {
    if (link) window.open(link, "_self"); 
  };

  useFrame((state, delta) => {
    easing.damp(ref.current.material, "radius", hovered ? 0.1 : 0.1, 0.2, delta);
  });

  return (
    <group {...props} onClick={handleClick} onPointerOver={pointerOver} onPointerOut={pointerOut}>
      <Image
        ref={ref}
        url={url}
        transparent
        side={THREE.DoubleSide}
      >
        <bentPlaneGeometry args={[0.5, 4, 3, 20, 20]} />
      </Image>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="top"
      >
        {text}
      </Text>
    </group>
  );
}

const BlobScene = () => {
  return (
    <>
    <Canvas
      camera={{ position: [0, 0, 30], fov: 15 }}
      style={{ width: "100vw", height: "100vh", zIndex:"5", position:"fixed", top:"0", left:"0", pointerEvents:"auto" }}
    >
      <EffectComposer>
        <Fluid/>
      </EffectComposer>
      <ScrollControls pages={4}>
        <Rig>
          <Carousel planeData={planeData} />
        </Rig>
      </ScrollControls>
    </Canvas>
    {/* <Providers>
    <Home/>
    </Providers> */}
    </>
  );
};

export default BlobScene;