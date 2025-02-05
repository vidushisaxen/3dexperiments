import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Vertex Shader
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

// Fragment Shader
const fragmentShader = `
uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset;
varying vec2 vUv;

vec3 rgbShift(sampler2D textureImage, vec2 uv, vec2 offset) {
   float r = texture2D(textureImage, uv + offset).r;
   vec2 gb = texture2D(textureImage, uv).gb;
   return vec3(r, gb);
}

void main() {
   vec3 color = rgbShift(uTexture, vUv, uOffset);
   gl_FragColor = vec4(color, uAlpha);
}
`;

// Smooth interpolation function
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

const DistortionCanvas = () => {
  const containerRef = useRef(null);
  const scrollableRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Scroll states
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

    // Three.js Setup
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
      scrollable.style.transform = `translate3d(0, ${-currentRef.current}px, 0)`;
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
        uniforms.uOffset.value.set(0, -(targetRef.current - currentRef.current) * 0.0003);
      },
    };
  }

  return (
    <main ref={containerRef} style={{ position: "fixed", width: "100%", height: "100vh" }}>
      <div className="scrollable" ref={scrollableRef} style={{ position: "absolute", top: 0, left: 0, width: "100%" }}>
        <div className="container flex flex-col items-center justify-center">
          <div className="image-container">
            <img src="/assets/curveplane/space.png" alt="Space" className="curve-plane-img" />
          </div>
          <div className="image-container">
            <img src="/assets/curveplane/texture.jpg" alt="Texture" className="curve-plane-img"/>
          </div>
          <div className="image-container">
            <img src="/assets/curveplane/portal.webp" alt="Portal" className="curve-plane-img"/>
          </div>
          <div className="image-container">
            <img src="/assets/curveplane/portal-stars.webp" alt="Stars" className="curve-plane-img"/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DistortionCanvas;
