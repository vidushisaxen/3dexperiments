import Image from "next/image";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
uniform sampler2D uTexture;
uniform vec2 uOffset;
varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795
 
vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
   position.x = position.x + (sin(uv.y * M_PI) * offset.x);
   position.y = position.y + (sin(uv.x * M_PI) * offset.y);
   return position;
}

void main() {
   vUv = uv;
   vec3 newPosition = deformationCurve(position, uv, uOffset);
   gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset;
varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
   float r = texture2D(textureImage, uv + offset.x).r;
   vec2 gb = texture2D(textureImage, uv).gb;
   return vec3(r, gb);
}

void main() {
   vec3 color = rgbShift(uTexture, vUv, uOffset);
   gl_FragColor = vec4(color, uAlpha);
}
`;

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const DistortionCanvas = () => {
  const containerRef = useRef(null);
  const scrollableRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const easeRef = useRef(0.075);

  useEffect(() => {
    const container = containerRef.current;
    const scrollable = scrollableRef.current;

    function initHeight() {
      if (!scrollable) return;
      document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
    }
    initHeight();
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const perspective = 1000;
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, perspective);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    function onWindowResize() {
      initHeight();
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    const images = Array.from(document.querySelectorAll("img"));
    const meshItems = images.map((img) => createMeshItem(img, scene));

    function smoothScroll() {
      targetRef.current = window.scrollY;
      currentRef.current = lerp(currentRef.current, targetRef.current, easeRef.current);
      scrollable.style.transform = `translate3d(0, ${-currentRef.current/1.1}px , 0)`;
    }

    function render() {
      smoothScroll();
      meshItems.forEach((item) => item.render());
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  function createMeshItem(imgElement, scene) {
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
    const imageTexture = new THREE.TextureLoader().load(imgElement.src, () => {
      imageTexture.needsUpdate = true;
    });

    const uniforms = {
      uTexture: { value: imageTexture },
      uOffset: { value: new THREE.Vector2(0, 0) },
      uAlpha: { value: 1.0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    let offset = new THREE.Vector2(0, 0);
    let sizes = new THREE.Vector2(0, 0);

    function getDimensions() {
      const { width, height, top, left } = imgElement.getBoundingClientRect();
      sizes.set(width, height);
      offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
    }

    getDimensions();
    mesh.position.set(offset.x, offset.y, 0);
    mesh.scale.set(sizes.x, sizes.y, 1);
    scene.add(mesh);

    return {
      mesh,
      uniforms,
      render() {
        getDimensions();
        mesh.position.set(offset.x, offset.y, 0);
        mesh.scale.set(sizes.x, sizes.y, 1);
        uniforms.uOffset.value.set(0, -(targetRef.current - currentRef.current) * 0.0005);
      },
    };
  }

  const images = [
    "/assets/curveplane/sci-fi1.jpg",
    "/assets/curveplane/sci-fi2.jpeg",
    "/assets/curveplane/sci-fi3.jpg",
    "/assets/curveplane/sci-fi4.jpg",
  ];

  return (
    <>
      <main ref={containerRef} style={{ position: "fixed", width: "100vw", height: "100vh" }} className="w-screen  curveplane-bg">
        <div className="scrollable absolute top-0 left-0 w-full will-change-transform" ref={scrollableRef} style={{ position: "absolute", top: 0, left: 0, width: "100vw", overflow:"hidden" }}>
          <div className="flex flex-col items-center justify-center">
            
            <section className="h-[58vw] w-screen flex items-center justify-center relative">
              <div className="image-container relative w-full h-full overflow-hidden flex items-center justify-center">
                <Image src={"/assets/curveplane/hero.jpg"} className="curve-plane-img absolute w-[60%] h-[60%]" alt="hero" fill />
              </div>
              <div className="absolute bottom-[42%] left-1/2 -translate-x-1/2 flex flex-col">
                <p className="text-[5.5vw] text-white font-medium leading-[1.2]">Beyond Reality,</p>
                <p className="text-[5.5vw] text-white font-medium leading-[1.2]">Into Innovation</p>
              </div>
            </section>

            <section className="w-screen h-[60vw] flex items-center justify-center py-[5vw] px-[3vw]">
              <div className="flex items-center justify-center w-full h-full gap-[3vw]">
                <div className="w-[35vw]">
                  <h2 className="text-[3.5vw] text-[#222222] font-medium  leading-[1.1]">Experience Innovation Like Never Before.</h2>
                  <p className="text-[1.7vw] leading-[1.2] text-black">We blend cutting-edge technology with captivating design to create immersive experiences. Here&apos;s what makes us stand out:</p>
                </div>
              </div>
              <div className="image-container w-[80vw] h-[80%] relative overflow-hidden flex items-center justify-center">
                <Image src={"/assets/curveplane/sci-fi-portal.avif"} className="curve-plane-img absolute " alt="hero" fill />
              </div>
            </section> 

            <section className="w-screen h-[50vw] px-[3vw] py-[5vw] ">
              <div className="flex items-center justify-center">
                {images.map((src, index) => (
                  <div className="image-container relative w-[25%] h-full" key={index}>
                    <Image src={src} alt={`Image ${index + 1}`} className="curve-plane-img !w-[22vw] !h-[35vw]" fill />
                  </div>
                ))}
              </div>
            </section>
            <section className="w-screen h-full flex items-center justify-center  duration-500 transition-all ease py-[5vw] pb-[15vw]">
  <div className="!h-[40vw] !w-[70vw] relative image-container group">
    <Image src={"/assets/curveplane/scifi-zone.jpg"} alt="scifi-zone" fill className="curve-plane-img" />
    <span className="h-full w-full bg-black/50 absolute group-hover:scale-x-0 origin-right duration-500 transition-all ease" />
  </div>
</section>


<section className="w-screen h-full flex items-center justify-center px-[3vw] pb-[10vw] overflow-hidden">
  
  <div className="h-[30vw] w-[80vw] rounded-[10px] drop-shadow-xl shadow-xl flex flex-col justify-center text-center gap-[4vw] items-center bg-black/50 z-10 relative">
  <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0 rounded-[10px]">
    <source src="/assets/curveplane/bg-video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
    <p className="text-[3vw] text-[#f5f5f5] absolute top-[20%]">Be a part of the future today.</p>
    <button className="rounded-[40px] bg-blue-600 text-white text-[1.2vw] w-[15vw] py-[1.5vw] relative group duration-500 ease transition-all top-[20%]">
      <p>Request Demo</p>
      <span className="w-full h-full absolute bg-white/10 scale-0 top-0 left-0 rounded-full group-hover:scale-[1] origin-center duration-700 ease transition-all" />
    </button>
  </div>
</section>

            <footer className="bg-black text-white pt-8 flex flex-col items-center justify-center mt-10 w-screen">
              <div className="text-[3vw] font-medium mb-4">Ecliptica</div>
              <ul className="flex space-x-6 mb-4">
                <li><a href="/" className="hover:text-red-500">About</a></li>
                <li><a href="/" className="hover:text-red-500">Work</a></li>
                <li><a href="/" className="hover:text-red-500">Gallery</a></li>
                <li><a href="/" className="hover:text-red-500">Contact</a></li>
              </ul>
              <div className="flex space-x-4 mb-10">
                <a href="/" rel="noopener noreferrer" className="hover:text-red-500 transition-transform transform hover:scale-105">Twitter</a>
                <a href="/" rel="noopener noreferrer" className="hover:text-red-500 transition-transform transform hover:scale-105">LinkedIn</a>
                <a href="/" rel="noopener noreferrer" className="hover:text-red-500 transition-transform transform hover:scale-105">GitHub</a>
              </div>
              <div className="text-[1.2vw] text-gray-400">© 2025 Ecliptica. All rights reserved.</div>
            </footer>
          </div>
        </div>
      </main>
    </>
  );

};

export default DistortionCanvas;
