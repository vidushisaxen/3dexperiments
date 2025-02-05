import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap"; // Import GSAP

const BlobsShader = ({ color }) => {
  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 blobColor;
    varying vec2 vUv;

    vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x = a0.x * x0.x + h.x * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    float morphingCircle(vec2 uv, vec2 center, float time) {
        vec2 d = uv - center * 1.5;
        float angle = atan(d.y, d.x);
        float baseRadius = 2.5;
        float radius = baseRadius + 
                       0.0001 * snoise(vec2(angle * 2.0 + time * 0.3, time * 0.3)) +
                       0.02 * sin(angle * 3.0 + time * 0.7) + 
                       0.05 * sin(angle * 4.0 - time * 0.5);
        return length(d) / radius * 0.9;
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        uv.x -= 0.4;
        uv.x *= uResolution.x / uResolution.y;

        // Subtle movement range for the center
        vec2 center = vec2(
            0.5 + snoise(vec2(uTime * 0.02, 0.0)) * 0.5,
            0.5 + snoise(vec2(uTime * 0.02 + 10.0, 0.0)) * 0.2
        );

        float dist = morphingCircle(uv, center, uTime / 1.5);
 
        vec3 color = mix(vec3(0.0), blobColor, smoothstep(0.1, 1.0, 0.9 - dist));

        gl_FragColor = vec4(color, 1.0);
    }
`;

  const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

  const meshRef = useRef();
  const materialRef = useRef();
  const { size } = useThree();

  const uniforms = useRef({
    uResolution: { value: new THREE.Vector2(4, 4) },
    uTime: { value: 0 },
    blobColor: { value: new THREE.Vector3(0.0, 0.0, 1.0) },
  });

  useEffect(() => {
    uniforms.current.uResolution.value.set(size.width, size.height);
  }, [size]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.blobColor.value = new THREE.Color(color);
    }
  }, [color]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
};

const VanaBg = () => {
  const [color, setColor] = useState(new THREE.Color(0x6900eb));

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const sectionHeight = window.innerHeight;
    const sectionIndex = Math.floor(scrollY / sectionHeight);

    let newColor;
    switch (sectionIndex) {
      case 0:
        newColor = new THREE.Color(0x6900eb);
        break;
      case 1:
        newColor = new THREE.Color(0x6900eb);
        break;
      case 2:
        newColor = new THREE.Color(0x000000);
        break;
      case 3:
        newColor = new THREE.Color(0xdd5001);
        break;
      case 4:
        newColor = new THREE.Color(0xdd5001);
        break;
      case 5:
        newColor = new THREE.Color(0x000000);
        break;
      case 6:
        newColor = new THREE.Color(0x8e030a);
        break;
      case 7:
        newColor = new THREE.Color(0x8e030a);
        break;
      case 8:
        newColor = new THREE.Color(0x000000);
        break;
      default:
        newColor = new THREE.Color(0x6900eb);
    }

    gsap.to(color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
      duration: 1.5,
      ease: "power3.out",
      onUpdate: () => setColor(new THREE.Color(color.r, color.g, color.b)),
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Background Shader Canvas */}
      <div
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
      >
        <Canvas>
          <BlobsShader color={color} />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative w-full min-h-[800vh]">
        {Array.from({ length: 9 }).map((_, index) => (
          <section
            key={index}
            className="w-full h-screen flex items-center justify-center"
          >
            <h1 className="text-4xl font-bold text-white">Section {index + 1}</h1>
          </section>
        ))}
      </div>
    </>
  );
};

export default VanaBg;

