import { useRef, useState, useEffect } from "react";
import MagicalMaterial from "./material/shaderMaterial";
import { useTexture } from "@react-three/drei";
import { animated, useSpring ,useScroll} from "@react-spring/three";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useFrame } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger);

const texturesArray = [
  "/assets/blobify/rainbow.jpeg",
  "/assets/blobify/deep-ocean.jpeg",
  "/assets/blobify/cosmic-fusion.jpeg",
  "/assets/blobify/passion.jpeg",
  "/assets/blobify/white.jpeg",
  "/assets/blobify/sunset-vibes.jpeg",
  "/assets/blobify/iridescent.jpeg",
  "/assets/blobify/cd.jpeg",
  "/assets/blobify/halloween.jpeg",
  "/assets/blobify/floyd.jpeg",
  "/assets/blobify/hollogram.jpeg",
  "/assets/blobify/imaginarium.jpeg",
];

const AnimatedMagicalMaterial = animated(MagicalMaterial);

const GalleryBlob = ({ material, map, geometry,length , rotationSpring }) => {
  const meshRef = useRef();

  const { scale, rotate } = geometry;

//   let isWheelEventTriggered = false;
//   let scrollTimeout = null;
  const data = useScroll();
  useFrame(()=>{
      console.log(data.offset)
  })

  const textures = useTexture(texturesArray);
  const texture = textures[map];
//   const [currentRotation, setCurrentRotation] = useState([0, 0, 0]);

//   const [rotationSpring, setRotationSpring] = useSpring(() => ({
//     rotation: currentRotation,
//     config: { tension: 50, friction: 14 },
//   }));

//   const handleWheel = (e) => {
//     const deltaY = e.deltaY;
//     const deltaX = e.deltaX;
// //    console.log(deltaX,deltaY)
//     if (!isWheelEventTriggered) {
//       setCurrentRotation((prevRotation) => {
//         let newRotation = [...prevRotation];

//         if (deltaY < 0 || deltaX < 0) {
//           if (deltaY < -4 || deltaX < -4) {
//             newRotation[1] += Math.PI/2 ;
//           }
//         } else if (deltaY > 0 || deltaX > 0) {
//           if (deltaY > 4 || deltaX > 4) {
//             newRotation[1] -= Math.PI/2 ;
//           }
//         }
//         setRotationSpring({ rotation: newRotation });

//         return newRotation; 
//       });

//       isWheelEventTriggered = true;

//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => {
//         isWheelEventTriggered = false;
//       }, 100);
//     }
//   };
  

//   useEffect(() => {
    
//     window.addEventListener("wheel", handleWheel);

//     return () => {
//       window.removeEventListener("wheel", handleWheel);
//       clearTimeout(scrollTimeout);
//     };
//   }, []);

  return (
    <animated.mesh
      ref={meshRef}
      scale={scale}
      rotation={rotationSpring.rotation}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 512, 512]} rotation={rotate}/>
      <AnimatedMagicalMaterial map={texture} {...material} />
    </animated.mesh>
  );
};


export default GalleryBlob;
