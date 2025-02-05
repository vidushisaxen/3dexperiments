import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";

const models = [
    {
        name: "BMW - M8",
        path: "/assets/models/bmw-m8.glb",
        scale: [1, 1, 1],
        rotation: [0, Math.PI / 2, 0],
        position: [0, -0.5, 0],
        description: "A high-performance luxury sports coupe with a twin-turbo V8 engine, offering a blend of aggressive power and refined comfort.",
        rating: "4.5",
        specs: ["Twin-turbo V8", " High-performance", "Strong torque", "Rapid acceleration", "Limited top speed"]
    },
    {
        name: "Bugatti Divo",
        path: "/assets/models/bugatti-divo.glb",
        scale: [100, 100, 100],
        rotation: [0, -Math.PI / 2, 0],
        position: [0, -0.5, 0],
        description: " A hypercar built for track performance, with a 1,479-hp W16 engine and enhanced aerodynamics, providing exceptional cornering ability and speed. ",
        rating: "4.8",
        specs: ["Quad-turbo W16", "Extreme power", "High torque", "Quick acceleration", "High top speed"]
    },
    {
        name: "Lexus LFA",
        path: "/assets/models/lexus-lfa.glb",
        scale: [100, 100, 100],
        rotation: [0, -Math.PI / 2, 0],
        position: [0, -0.5, 0],
        description: "A limited-production supercar powered by a naturally aspirated V10 engine, delivering sharp handling and a unique exhaust note. ",
        rating: "4.7",
        specs: ["V10", "High output", "Smooth torque", "Fast acceleration", "High top speed"]
    },
    {
        name: "Bugatti LA",
        path: "/assets/models/bugatti-la.glb",
        scale: [120, 120, 120],
        rotation: [0, -Math.PI / 2, 0],
        position: [0, -0.5, 0],
        description: "A one-off hypercar featuring a 1,479-hp quad-turbo W16 engine and a stunning design. ",
        rating: "4.9",
        specs: ["Quad-turbo W16", "Maximum power", "Very high torque", "Extremely fast", "Ultra-high top speed"]
    },
    {
        name: "Pagani Huayra",
        path: "/assets/models/pagani-huayra.glb",
        scale: [100, 100, 100],
        rotation: [0, -Math.PI / 2, 0],
        position: [0, -0.5, 0],
        description: "A hypercar with a 730-hp twin-turbo V12 engine, delivering extraordinary performance and distinctive design. ",
        rating: "4.6",
        specs: ["Twin-turbo V12", "High power", "Responsive torque", "Rapid acceleration", "High top speed"]
    },
    {
        name: "Pagani Zonda",
        path: "/assets/models/pagani-zonda.glb",
        scale: [1, 1, 1],
        rotation: [0, -Math.PI / 2, 0],
        position: [0, -0.5, 0],
        description: "A legendary supercar known for its striking design and a range of V12 engine options. ",
        rating: "4.5",
        specs: ["Naturally aspirated V12", "Exceptional power", "Strong torque", "Quick acceleration", "Very high top speed"]
    },
];

const Slide = ({ model, status, onAnimationComplete, isModalOpen }) => {
    const { scene } = useGLTF(model.path);
    const modelRef = useRef();
    const materialsRef = useRef([]);

    useFrame(() => {
        if (isModalOpen && modelRef.current) {
            modelRef.current.rotation.y += 0.005;
        }
    });


    useEffect(() => {
        if (!modelRef.current) return;
        const animationConfig = {
            duration: 0.5,
            ease: "power1.out",
        };

        switch (status) {
            case 'entering':

                gsap.set(modelRef.current.position, { z: 2.5 });
                materialsRef.current.forEach(material => {
                    gsap.set(material, { opacity: 1 });
                });
                gsap.to(modelRef.current.position, {
                    z: 0,
                    ...animationConfig,
                    delay: 0.1,
                    onComplete: onAnimationComplete
                });
                break;
            case 'leaving':
                gsap.to(modelRef.current.position, {
                    z: -3,
                    duration: 0.5,

                });

                materialsRef.current.forEach(material => {
                    gsap.to(material, {
                        opacity: 0,
                        duration: 0.5,
                        ease: "power1.out",
                        onComplete: onAnimationComplete
                    });
                });
                break;


            case 'current':
                gsap.set(modelRef.current.position, { z: 0 });
                materialsRef.current.forEach(material => {
                    gsap.set(material, { opacity: 1 });
                });
                break;

            default:
                modelRef.current.visible = false;
                return;
        }
        if (status !== 'hidden') {
            modelRef.current.visible = true;
        }

        return () => {
            gsap.killTweensOf(modelRef.current.position);
            materialsRef.current.forEach(material => {
                gsap.killTweensOf(material);
            });
        };
    }, [status, onAnimationComplete, scene]);

    return (
        <mesh
            ref={modelRef}
            rotation={model.rotation}
            position={[model.position[0], model.position[1], model.position[2]]}
            scale={model.scale}
            visible={status !== 'hidden'}
        >
            <primitive object={scene} />
        </mesh>
    );
};

const TextContent = ({ content, status }) => {
    const textRef = useRef();

    useEffect(() => {
        if (!textRef.current) return;

        gsap.killTweensOf(textRef.current);

        const animationConfig = {
            duration: 0.5,
            ease: "power1.out",
        };

        switch (status) {
            case 'entering':
                gsap.fromTo(
                    textRef.current,
                    {
                        z: 3,
                        scale: 1.5,
                        opacity: 0,
                    },
                    {
                        z: 0,
                        scale: 1,
                        opacity: 1,
                        ...animationConfig,
                        delay: 0.2,
                    }
                );
                break;
            case 'leaving':
                gsap.fromTo(textRef.current, {
                    z: 0,
                    scale: 1,
                    opacity: 1,
                    ...animationConfig,
                }, {
                    z: -3,
                    scale: 0,
                    opacity: 0,
                    ...animationConfig,
                });
                break;

            case 'current':
                gsap.set(textRef.current, {
                    z: 0,
                    scale: 1,
                    opacity: 1,
                });
                break;

            default:
                gsap.set(textRef.current, {
                    opacity: 0,
                });
        }

        return () => {
            gsap.killTweensOf(textRef.current);
        };
    }, [status]);


    return <div ref={textRef}>{content}</div>;
};

const Motion = () => {
    const [currentModelIndex, setCurrentModelIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [transitionState, setTransitionState] = useState({
        entering: null,
        leaving: null,
    });
    const [isExploring, setIsExploring] = useState(false);
    const modelRef = useRef();
    const modelRefs = useRef([]);

    useEffect(() => {
        modelRefs.current = models.map((_, i) => modelRefs.current[i] ?? React.createRef());
    }, [models]);

    // Previous handlers remain the same...
    const handleScroll = (event) => {
        if (isAnimating || isExploring) return;
        setIsAnimating(true);

        const direction = event.deltaY > 0 ? 1 : -1;
        const nextIndex = (currentModelIndex + direction + models.length) % models.length;
        setTransitionState({
            entering: null,
            leaving: currentModelIndex,
        });
        setTimeout(() => {
            setTransitionState({
                entering: nextIndex,
                leaving: currentModelIndex,
            });
        }, 300);

        setTimeout(() => {
            setCurrentModelIndex(nextIndex);
            setTransitionState({ entering: null, leaving: null });
            setIsAnimating(false);
        }, 1500);
    };

    const handleExploreClick = () => {
        setIsExploring(true);

        const currentModelRef = modelRefs.current[currentModelIndex]?.current;
        if (currentModelRef) {
            // Kill existing animations
            gsap.killTweensOf(currentModelRef.rotation);
            gsap.killTweensOf(currentModelRef.scale);
            gsap.killTweensOf(currentModelRef.position);

            // Animate rotation, scale, and position
            gsap.to(currentModelRef.rotation, {
                duration: 1,
                x: Math.PI * 2,
                ease: "power2.inOut",
                onComplete: () => {
                    gsap.to(currentModelRef.rotation, {
                        duration: 3,
                        x: "+=6.28319",
                        repeat: -1,
                        ease: "none",
                    });
                },
            });
            gsap.to(currentModelRef.scale, {
                duration: 1,
                x: 1.5,
                y: 1.5,
                z: 1.5,
                ease: "power2.inOut",
            });
            gsap.to(currentModelRef.position, {
                duration: 1,
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.inOut",
            });
        }
    };

    const handleExitExplore = () => {
        setIsExploring(false);

        const currentModelRef = modelRefs.current[currentModelIndex]?.current;
        if (currentModelRef) {
            // Kill ongoing animations
            gsap.killTweensOf(currentModelRef.rotation);
            gsap.killTweensOf(currentModelRef.scale);
            gsap.killTweensOf(currentModelRef.position);

            // Reset to original state
            gsap.to(currentModelRef.rotation, {
                duration: 1,
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.inOut",
            });
            gsap.to(currentModelRef.scale, {
                duration: 1,
                x: 1,
                y: 1,
                z: 1,
                ease: "power2.inOut",
            });
            gsap.to(currentModelRef.position, {
                duration: 1,
                x: 0,
                y: 0,
                z: 0,
                ease: "power2.inOut",
            });
        }
    };

    useEffect(() => {
        return () => {
            if (modelRef.current) {
                gsap.killTweensOf(modelRef.current.rotation);
                gsap.killTweensOf(modelRef.current.scale);
                gsap.killTweensOf(modelRef.current.position);
            }
        };
    }, []);

    const getSlideStatus = (index) => {
        if (index === transitionState.entering) return 'entering';
        if (index === transitionState.leaving) return 'leaving';
        if (index === currentModelIndex && !transitionState.leaving) return 'current';
        return 'hidden';
    };

    return (
        <div
            onWheel={handleScroll}
            style={{ height: "100vh", width: "100vw", overflow: "hidden", backgroundColor:"#000000", color:"#d1d1d1" }}
        >
            <Canvas
                style={{
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    zIndex: 5,
                    top: 0,
                    left: 0,
                }}
            >
                <PerspectiveCamera position={[0, 3, 5]} />
                <ambientLight intensity={1} color={0xffffff} />
                <directionalLight position={[-5, 5, 5]} intensity={1} />
                <Environment preset="warehouse" />

                {models.map((model, index) => (
                    <Slide
                        key={model.name}
                        model={model}
                        status={getSlideStatus(index)}
                        ref={modelRefs.current[index]}
                    />
                ))}
                
                {isExploring && (
                    <>
                        <OrbitControls />
                        <Html>
                            <button
                                onClick={handleExitExplore}
                                className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
                                aria-label="Exit explore mode"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </Html>
                    </>
                )}

                {!isExploring && (
                    <Html className="">
                        <div className="w-[135vw] mt-[-10vw] flex items-center justify-between px-[5%] ml-[-45vw]">
                            <div className="flex flex-col w-[15%]">
                                <ul className="space-y-[0.5vw]">
                                    <li className="text-[3vw] font-semibold transition-all duration-500 ease uppercase leading-[1.2] tracking-wide flex items-center">
                                        <TextContent
                                            content={models[currentModelIndex].name}
                                            status={transitionState.entering !== null ? 'entering' : 'current'}
                                        />
                                    </li>
                                    <li className="text-[1vw] text-gray-300 font-light h-[5vw]">
                                        <TextContent
                                            content={<p>{models[currentModelIndex].description}</p>}
                                            status={transitionState.entering !== null ? 'entering' : 'current'}
                                        />
                                    </li>
                                    <li className="text-[4vw] font-medium text-white">
                                        <TextContent
                                            content={models[currentModelIndex].rating}
                                            status={transitionState.entering !== null ? 'entering' : 'current'}
                                        />
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col w-[45%] text-[1.5vw] tracking-wider gap-[1vw]">
                                <TextContent
                                    content={<>
                                        <p className="text-[2.5vw] font-bold text-white">Specs</p>
                                        <ul className="list-disc">
                                            {models[currentModelIndex].specs.map((spec, index) => (
                                                <li key={index}>{spec}</li>
                                            ))}
                                        </ul>
                                    </>}
                                    status={transitionState.entering !== null ? 'entering' : 'current'}
                                />
                            </div>
                        </div>

                        <div className="translate-x-[50%] z-[50] absolute bottom-[-10vw] left-[-10vw]">
                            <button
                                className="text-white text-[1.5vw] border border-white py-[0.5vw] px-[2vw] rounded-[2vw] !cursor-pointer"
                                onClick={handleExploreClick}
                            >
                                Explore
                            </button>
                        </div>
                    </Html>
                )}
            </Canvas>        
        </div>
    );
};

export default Motion;
