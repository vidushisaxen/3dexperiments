import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Circle, Environment, OrbitControls, PerspectiveCamera, Plane, Text, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";

const models = [
    {
      name: "BMW - M8",
      path: "/assets/models/bmw-m8.glb",
      scale: [1, 1, 1],
      rotation: [0, -Math.PI / 2, 0],
      position: [0, -1, 1.5],
    },
    {
      name: "Bugatti Divo",
      path: "/assets/models/bugatti-divo.glb",
      scale: [100, 100, 100],
      rotation: [0, Math.PI / 2, 0],
      position: [0, -1, 1.5],
    },
    {
      name: "Lexus LFA",
      path: "/assets/models/lexus-lfa.glb",
      scale: [100, 100, 100],
      rotation: [0, Math.PI / 2, 0],
      position: [0, -1, 1.5],
    },
    {
      name: "Bugatti LA",
      path: "/assets/models/bugatti-la.glb",
      scale: [120, 120, 120],
      rotation: [0, Math.PI / 2, 0],
      position: [0, -1, 1.5],
    },
    {
      name: "Pagani Huayra",
      path: "/assets/models/pagani-huayra.glb",
      scale: [100, 100, 100],
      rotation: [0, Math.PI / 2, 0],
      position: [0, -1, 1.5],
    },
    {
      name: "Pagani Zonda",
      path: "/assets/models/pagani-zonda.glb",
      scale: [1, 1, 1],
      rotation: [0, Math.PI / 2, 0],
      position: [0, -1, 1.5],
    },
  ];

  const Stage=()=>{
    return(
        <>
        <mesh rotation={[-Math.PI/2,0,0]} position={[-0.2,-1.1,0.5]}>
        <Circle args={[2.8,64,64]}>
        <meshStandardMaterial color="" roughness={0.1} metalness={0.9} />
        </Circle>
        </mesh>
        </>
    )
  }

const Platform = () => {
  return (
    <mesh>
      <Plane
        args={[15,9]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.5, 1]}
        receiveShadow
      >
        <meshStandardMaterial color="#2a2a2a" />
      </Plane>
    </mesh>
  );
};

const Texts = ({ modelName, props }) => {
    const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/assets/text-video.mp4', crossOrigin: 'Anonymous', loop: true, muted: true }))
    useEffect(() => void video.play(), [video])
    return (
      <Text font="/assets/Inter-Bold.woff" fontSize={2.5} letterSpacing={-0.06} {...props} position={[0,3.5,-2]}>
        {modelName}
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]}  />
        </meshBasicMaterial>
      </Text>
    )
};

const Cars = ({ model, isAnimating, isTransitioning, position, nextCarPosition }) => {
  const { scene } = useGLTF(model.path);
  const modelRef = useRef();
  
  useEffect(() => {
    if (isAnimating && modelRef.current) {
      const tl = gsap.timeline({
        defaults: { duration: 5, ease: "power1.inOut" }
      });

      tl.to(modelRef.current.rotation, {
        y: modelRef.current.rotation.y - Math.PI*2,
        repeat: 1,
        yoyo: true
      });

      tl.to(modelRef.current.position, {
        z: modelRef.current.position.z + 3,
        repeat: 1,
        yoyo: true
      }, "-=8.5");
    }

    if (isTransitioning && modelRef.current) {
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "power1.inOut" }
      });

      tl.to(modelRef.current.position, {
        x: 10, 
        onComplete: () => {
          modelRef.current.position.x = -10; 
        }
      });
      tl.to(modelRef.current.position, {
        x: nextCarPosition, 
      });
    }
  }, [isAnimating, isTransitioning, nextCarPosition]);

  return (
    <mesh
      ref={modelRef}
      rotation={model.rotation}
      position={[position.x, position.y, position.z]}
      scale={model.scale}
    >
      <primitive object={scene} />
    </mesh>
  );
};

const MotionEffect = ({ children }) => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const groupRef = useRef();
  
    useEffect(() => {
      const handleMouseMove = (event) => {
        setMouse({
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);
  
    useFrame(() => {
      if (groupRef.current) {
        groupRef.current.position.x = mouse.x * 0.03;
        groupRef.current.position.y = mouse.y * 0.03;
      }
    });
  
    return <group ref={groupRef}>{children}</group>;
  };

const Motion = () => {
    const [currentModelIndex, setCurrentModelIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: -1, z: 1.5 });
    const [nextCarPosition, setNextCarPosition] = useState(0); 
  
    const handlePrevious = () => {
      if (isTransitioning) return;
      
      setIsTransitioning(true);
      setNextCarPosition(0); 
  
      setTimeout(() => {
        setCurrentModelIndex((prevIndex) =>
          prevIndex === 0 ? models.length - 1 : prevIndex - 1
        );
        
        setPosition({ x: 5, y: -1, z: 1.5 });
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      }, 2000);
    };
  
    const handleNext = () => {
      if (isTransitioning) return;
      
      setIsTransitioning(true);
      setNextCarPosition(0);
  
      setTimeout(() => {
        setCurrentModelIndex((prevIndex) =>
          prevIndex === models.length - 1 ? 0 : prevIndex + 1
        );
        
       
        setPosition({ x: 5, y: -1, z: 1.5 });
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      }, 2000);
    };

  const handleExplore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 11000);
  };

  return (
    <>
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          backgroundColor:"#000000",
          top: 0,
          left: 0,
        }}
      >
        <PerspectiveCamera position={[0,0,-2]}/>
        <ambientLight intensity={1} color={0xffffff} />
        
        <directionalLight position={[-5, 5, 5]} intensity={1} color={0xffffff} castShadow />
        <directionalLight position={[5, 5, 5]} intensity={1} color={0xffffff} castShadow />
        <directionalLight position={[-5, -5, 5]} intensity={1} color={0xffffff} castShadow />
        <directionalLight position={[5, -5, 5]} intensity={1} color={0xffffff} castShadow />
        <MotionEffect>
        {/* <Environment preset="warehouse"/> */}
        <Texts modelName={models[currentModelIndex].name} />
        <Platform />
        <Cars 
          model={models[currentModelIndex]} 
          isAnimating={isAnimating} 
          isTransitioning={isTransitioning} 
          position={position} 
          nextCarPosition={nextCarPosition}
        />
        <Stage/>
        </MotionEffect>
        
        {/* <OrbitControls enabled={!isAnimating} enableZoom={false}/> */}
      </Canvas>

      <div 
        style={{
          position: 'absolute',
          bottom: "10%",
          left: '45%',
          transform: "translateX(50%)",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <button 
          onClick={handleExplore}
          disabled={isAnimating}
          style={{
            padding: "10px 20px",
            backgroundColor: isAnimating ? '#cccccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isAnimating ? 'default' : 'pointer'
          }}
        >
          {isAnimating ? 'Exploring...' : 'Explore'}
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "40%",
          padding:"0px 40px",
          width:"100vw",
          display: "flex",
          justifyContent:"space-between",
          gap: "10px",
        }}
      >
        <button 
          onClick={handlePrevious} 
          style={{ padding: "15px 20px",
            backgroundColor:'#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',}}
          disabled={isAnimating || isTransitioning}
        >
          &lt;
        </button>
        <button 
          onClick={handleNext} 
          style={{ padding: "15px 20px",
            backgroundColor:'#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',}}
          disabled={isAnimating || isTransitioning}
        >
          &gt;
        </button>
      </div>
    </>
  );
};

export default Motion;
