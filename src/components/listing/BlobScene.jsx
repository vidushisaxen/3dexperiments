import { useState, useRef} from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import {ScrollControls, Text, useScroll } from "@react-three/drei";
import * as THREE from "three";
import { Image} from '@react-three/drei'
import { easing } from 'maath'
import '../util'
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@/lib";

const planeData = [
  { texture: "/assets/listing/blob-mixer-listing.png", text: "Blob Mixer", link: "/blobmixer" },
  { texture: "/assets/listing/chromotion-cursor-listing.png", text: "Chromotion Cursor", link: "/chromotion-cursor" },
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
  { texture: "/assets/listing/route-color-listing.png", text: "Route Color", link: "/routecolor/route-color-change" },
  { texture: "/assets/listing/blob-mixer-listing.png", text: "Blob Mixer", link: "/blobmixer" },
  { texture: "/assets/listing/chromotion-cursor-listing.png", text: "Chromotion Cursor", link: "/chromotion-cursor" },
  { texture: "/assets/listing/earth-listing.png", text: "Earth", link: "/earth" },
  { texture: "/assets/listing/night-earth-listing.png", text: "Night Earth", link: "/nightEarth" },
  

];
function Rig(props) {
  const ref = useRef();
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y = -scroll.offset * Math.PI * 4.0005;
      ref.current.position.y = THREE.MathUtils.lerp(0, 2.9, scroll.offset * 9.93
      );
      state.camera.lookAt(0, 0, 0); 
    }
  });

  return <group ref={ref} {...props} />;
}
function Carousel({ radius = 5, planeData = [] }) {
  return planeData.map((plane, i) => (
    <group key={i} rotation={[0, -1.6, 0]} position={[0, 3.5, 0]}>
      <Card
        url={plane.texture}
        text={plane.text}
        link={plane.link}
        position={[
          Math.sin((i / planeData.length) * Math.PI * 5) * radius,
          i * -1.8,
          Math.cos((i / planeData.length) * Math.PI * 5) * radius
        ]}
        rotation={[0  , Math.PI * 2 + (i / planeData.length) * Math.PI * 5, 0]}
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
        position={[0, -1.7, 0.3]}
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
      {/* <EffectComposer>
        <Fluid/>
      </EffectComposer> */}
      <ScrollControls pages={4} infinite>
        <Rig>
          <Carousel planeData={planeData} />
        </Rig>
      </ScrollControls>
    </Canvas>
    </>
  );
};

export default BlobScene;