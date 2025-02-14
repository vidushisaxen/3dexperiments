import { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap"; // Import GSAP
import R3FCanvas from "@/components/listing/View";
import Link from "next/link";
import Image from "next/image";
import { ReactLenis } from 'lenis/react'


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
        newColor = new THREE.Color(0x6900eb);
        break;
      case 3:
        newColor = new THREE.Color(0xdd5001);
        break;
      case 4:
        newColor = new THREE.Color(0xdd5001);
        break;
      case 5:
        newColor = new THREE.Color(0xdd5001);
        break;
      case 6:
        newColor = new THREE.Color(0x8e030a);
        break;
      case 7:
        newColor = new THREE.Color(0x8e030a);
        break;
      case 8:
        newColor = new THREE.Color(0x8e030a);
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
    <ReactLenis root options={{lerp: 0.07}}>
    <>
      {/* Background Shader Canvas */}
      <div
        className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none"
      >
        <R3FCanvas>
          <BlobsShader color={color} />
        </R3FCanvas>
      </div>
      <header className="w-screen flex items-center justify-between text-white text-[1.3vw] bg-black/30 py-[1.5vw] px-[2vw] fixed top-0 left-0 z-[99]">

        <Link href={"/"} >
          <p className="text-[1.5vw] font-medium tracking-wider">Designverse</p>
        </Link>

        <div>
          <ul className="flex items-center justify-center gap-[3vw]">
            <Link href={"#"}><li>Home</li></Link>
            <Link href={"#"}><li>About</li></Link>
            <Link href={"3"}><li>Work</li></Link>
            <Link href={"#"}><li>Contact</li></Link>
          </ul>
        </div>
        <div>
          <button className="border-[2px] border-white text-white px-[2vw] py-[0.6vw] rounded-[30px] relative group">
            <span className="w-full h-full bg-white/20  scale-x-0 duration-300 transition-all ease absolute group-hover:scale-x-[1] top-0 left-0 rounded-full "/>
            <p>Contact</p>
          </button>
        </div>

      </header>
      <section className="h-[53vw] w-screen flex items-center justify-center px-[5vw]">
        <div className="w-full">
          <h1 className="text-[9.5vw] text-white font-medium uppercase w-full leading-[1.2]">The Birth of Digital Design</h1>
        </div>
        <div className="h-full w-full flex items-end justify-end pb-[6vw]">
          <p className="text-[1.2vw] text-white w-[30vw]">From the first pixel to the earliest websites, digital design began as a tool for communication and creativity. Explore the roots of an ever-evolving art form that transformed how we interact with technology.</p>
        </div>
      </section>
      <section className="w-screen h-[60vw] py-[5vw]">
        <div className="w-full h-full relative">
          <Image src={"/assets/designverse/img-1.jpg"} fill alt="img-1" />
        </div>
      </section>
      <section className="w-screen h-full flex flex-col items-center justify-center">
        <h2 className="text-[5vw] text-white text-center">
          The Rise of User Experience
        </h2>
        <div className="flex items-center justify-between w-full py-[5vw] px-[8vw]">
          <p className="text-[2vw] text-white text-center w-[35vw]">As the digital world grew, so did the need for intuitive interfaces. User experience became a cornerstone, ensuring that design not only looked good but also felt seamless and engaging.</p>
          <div className="w-[40vw] h-[30vw] relative">
            <Image src={"/assets/designverse/img-2.png"} alt="img-2" fill className="rounded-[10px]" />
          </div>
        </div>
      </section>
      <section className="h-full w-full px-[8vw] py-[5vw]">
        <div className="border-[2px] border-white w-[30vw] h-full px-[3vw] py-[2vw] rounded-[10px]">
          <h3 className="text-[4vw] text-white leading-[1.2]">
            The Age of Motion and Interactivity
          </h3>
          <p className="text-[1.2vw] text-white mt-[3vw]">With advancements in technology, animation and interactivity became essential. Designers began crafting experiences that responded to users, adding depth and dynamism to digital platforms.</p>

        </div>

      </section>
      <section className="w-full h-full flex items-end justify-end px-[5vw] py-[5vw]">
        <div className="relative h-[30vw] w-[40vw] border border-white rounded-[10px]">
          <Image src={"/assets/designverse/img-3.jpg"} fill alt="image" className="rounded-[10px] p-3" />
        </div>
      </section>
      <section className="w-screen h-full text-center">
        <div>
          <h3 className="text-[4vw] text-white leading-[1.2]">
            The Age of Motion and Interactivity
          </h3>
        </div>
        <div className="flex items-center justify-center gap-[7vw] py-[8vw]">
          <div className="border border-white rounded-[10px] w-[25vw] p-[2vw]">
            <h4 className="text-[3vw] text-white">Typography</h4>
            <p className="text-[1.2vw] text-white mt-[3vw]">Typography shapes the voice of digital content, blending readability with aesthetics to enhance user experience.</p>

          </div>
          <div className="border border-white rounded-[10px] w-[25vw] p-[2vw]">
            <h4 className="text-[3vw] text-white">Color Theory</h4>
            <p className="text-[1.2vw] text-white mt-[3vw]">Colors evoke emotions and guide users through digital spaces, making design both functional and visually appealing.</p>

          </div>
          <div className="border border-white rounded-[10px] w-[25vw] p-[2vw]">
            <h4 className="text-[3vw] text-white">Motion Design</h4>
            <p className="text-[1.2vw] text-white mt-[3vw]">Animations and transitions bring designs to life, adding depth and engagement to user interactions.</p>

          </div>

        </div>

      </section>
      <section className="w-screen h-full flex flex-col items-end justify-start gap-[3vw] px-[5vw]">
        <p className="stroke-text text-[8vw]  font-medium">INSPIRE</p>
        <p className="stroke-text text-[8vw]  font-medium">INNOVATE</p>
        <p className="stroke-text text-[8vw]  font-medium">IMAGINE</p>
        <p className="stroke-text text-[8vw]  font-medium">CREATE</p>
        <p className="stroke-text text-[8vw]  font-medium">EVOLVE</p>
        <p className="stroke-text text-[8vw]  font-medium">DESIGN</p>
        <p className="stroke-text text-[8vw]  font-medium">CRAFT</p>
        <p className="stroke-text text-[8vw]  font-medium">TRANSFORM</p>

      </section>
      <section className="h-full w-full px-[8vw] py-[5vw]">
        <div className="border-[2px] border-white w-[30vw] h-full px-[3vw] py-[2vw] rounded-[10px]">
          <h3 className="text-[4vw] text-white leading-[1.2]">
            Minimalism and Beyond
          </h3>
          <p className="text-[1.2vw] text-white mt-[3vw]">The modern era saw a shift towards simplicity, with clean lines and functional design. But digital design continues to evolve, blending minimalism with bold experimentation and immersive experiences.</p>
        </div>

      </section>
      <section className="w-screen h-[65vw] py-[5vw] flex items-center justify-center">
        <div className="w-[90%] h-full relative">
          <Image src={"/assets/designverse/img-4.png"} fill alt="img-1" className="rounded-[20px]" />
        </div>
      </section>
      <section className="w-screen h-full flex flex-col items-center justify-center">
        <h2 className="text-[5vw] text-white text-center">
          The Fusion of Creativity and Code
        </h2>
        <div className="flex items-center justify-between w-full py-[5vw] px-[8vw]">
          <p className="text-[2vw] text-white text-center w-[35vw]">Digital design today is where creativity meets technology. Artists and developers collaborate to build immersive experiences, pushing the boundaries of what’s possible in the digital realm.</p>
          <div className="w-[35vw] h-[25vw] relative">
            <Image src={"/assets/designverse/img-5.png"} alt="img-2" fill className="rounded-[10px]" />
          </div>
        </div>
      </section>
      <section className="w-screen h-full py-[5vw]">
        <p className="text-[7.5vw] stroke-text">Crafting Tomorrow's Designs</p>

      </section>

      <footer className="w-screen flex items-center justify-between text-white text-[1.3vw] bg-black/30 py-[1.5vw] px-[2vw] ">

        <Link href={"/"} >
          <p className="text-[1.5vw] font-medium tracking-wider">Designverse</p>
        </Link>
        <div>
          <p className="text-[1.2vw] text-white">
            © 2025 Digital Design Journey
          </p>
        </div>
        <div>
          <ul className="flex items-center justify-center gap-[3vw]">
            <Link href={"#"}><li>Twitter</li></Link>
            <Link href={"#"}><li>Github</li></Link>
            <Link href={"3"}><li>Linkedin</li></Link>
          </ul>
        </div>
      </footer>


    </>
    </ReactLenis>
  );
};

export default VanaBg;

