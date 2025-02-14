import { useState, useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import R3FCanvas from "./View";
import { EffectComposer } from "@react-three/postprocessing";
import { Fluid } from "@/lib";
import { Html } from "@react-three/drei";


const planeData = [
  { id:1,url: "/earth", texture: "/assets/listing/earth-listing.png", text: "Earth", },
    {id:2, url: "/nightEarth", texture: "/assets/listing/night-earth-listing.png", text: "Night Earth" },
    {id:3, url: "/arrows", texture: "/assets/listing/arrows-listing.png", text: "Arrows"},
    {id:4, url: "/cars", texture: "/assets/listing/cars-listing.png", text: "Cars" },
    {id:5, url: "/chroma", texture: "/assets/listing/chroma-listing.png", text: "Chroma"},
    {id:6, url: "/curveplane", texture: "/assets/listing/curve-plane-listing.png", text: "Curve Plane" },
    {id:7, url: "/noise", texture: "/assets/listing/noise-listing.png", text: "Noise"},
    {id:8, url: "/mouse-pixelation", texture: "/assets/listing/mouse-pixelation-listing.png", text: "Mouse Pixelation" },
    {id:9, url: "/glowingorbs", texture: "/assets/listing/glowing-orbs-listing.png", text: "Glowing Orbs" },
    {id:10, url: "/blurspheremoving", texture: "/assets/listing/blur-sphere-listing.png", text: "Blur Sphere"},
    {id:11, url: "/furniverse", texture: "/assets/listing/furniverse-listing.png", text: "Furniverse" },
    {id:12, url: "/modelrotation", texture: "/assets/listing/model-rotation-listing.png", text: "Model Rotation" },
    {id:13, url: "/color-changing-background", texture: "/assets/listing/color-changing-listing.png", text: "Color Changing Background" },
    {id:14, url: "/route-color-change", texture: "/assets/listing/route-color-listing.png", text: "Route Color Changing "},
  // { id:15,url: "/earth", texture: "/assets/listing/earth-listing.png", text: "Earth", },

    
];

const Plane = ({ texture, text, url, position, index }) => {
  const ref = useRef();
  const materialRef = useRef();
  const textureMap = useTexture(texture);
  const [hovered, setHovered] = useState(false);
  const [planeSize, setPlaneSize] = useState([8, 6]);

  const isEven = index % 2 === 0;

  useEffect(() => {
    if (textureMap.image) {
      const { width, height } = textureMap.image;
      const aspectRatio = width / height;

      const baseHeight = 6; 
      const newWidth = baseHeight * aspectRatio;

      setPlaneSize([newWidth, baseHeight]);
    }
  }, [textureMap]);

  useEffect(() => {
    if (!ref.current) return;

    if (hovered) {
      gsap.to(ref.current.scale, {
        x: 1.05,
        y: 1.05,
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(materialRef.current.color, {
        r: 1,
        g: 1,
        b: 1,
        duration: 0.3,
      });
    } else {
      gsap.to(ref.current.scale, {
        x: 1,
        y: 1,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(materialRef.current.color, {
        r: 0.5,
        g: 0.5,
        b: 0.5,
        duration: 0.3,
      });
    }
  }, [hovered]);

  const handleClick = () => {
    window.open(url, "_self");
  };

  return (
    <>
      <group position={position}>
        <mesh
          ref={ref}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={planeSize} />
          <meshStandardMaterial
            ref={materialRef}
            map={textureMap}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
      <Html
  position={[position[0] - planeSize[0] / 3 +1.5, position[1] - planeSize[1] / 2 + 0.8, position[2] + 0.01]}
  transform
  pointerEvents="none"
>
  <h2 className="text-white text-[1.1vw] leading-[1.2] w-[15vw]">{text}</h2>
</Html>
    </>
  );
};


const Gallery = () => {
  const scrollRef = useRef(0);
  const { camera } = useThree();
  const verticalSpacing = 8;
  const totalPlanes = planeData.length;

  useEffect(() => {
    const handleWheel = (e) => {
      scrollRef.current += e.deltaY * 0.0025;
  
      if (scrollRef.current < 0) {
        scrollRef.current += totalPlanes; 
      }
      if (scrollRef.current >= totalPlanes) {
        scrollRef.current -= totalPlanes; 
      }
  
      gsap.to(camera.position, {
        y: -scrollRef.current * verticalSpacing,
        duration: 0.5, 
        ease: "power3.out",
        delay:-2,
      });
    };
  
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [camera]);
  

  return (
    <group>
      {planeData.concat([planeData[0]]).map((plane, index) => {
        const yPosition = -index * verticalSpacing;
        return (
          <Plane
            key={`${plane.id}-${index}`}
            texture={plane.texture}
            text={plane.text}
            url={plane.url}
            position={[0, yPosition, 0]}
            index={index}
          />
        );
      })}
    </group>
  );
};

const ViewScene = () => {
  return (
    <div className="w-screen h-full">
      <R3FCanvas>
        <Gallery />
        <EffectComposer>
            <Fluid/>
        </EffectComposer>
      </R3FCanvas>
    </div>
  );
};

export default ViewScene;