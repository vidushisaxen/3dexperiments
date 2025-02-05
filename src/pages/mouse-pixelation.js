import React, { useRef, useEffect } from "react"
import { Canvas, extend, useFrame } from "@react-three/fiber"
import * as THREE from "three"

/*********************
1) A custom ShaderMaterial that:
   - 2 circles c1, c2
   - each circle's center moves randomly
   - pixelation near mouse
   - displacement
   - no textures
*********************/
class PixelCirclesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        // Time-based
        uTime:          { value: 0 },
        // Mouse-based
        uMouse:         { value: new THREE.Vector2(0.5,0.5) },
        // "Hover" approach if you want
        uHover:         { value: 0.7 },
        // Pixelation/displacement parameters
        uBasePixels:    { value: 35.0 },
        uDynamicRange:  { value: 0.02 },
        uNoiseStrength: { value: 0.05 },
        uDisplacement:  { value: 0.02 },
        uColorBoost:    { value: 0.0 },
        uVignette:      { value: 0.6 },
        // resolution
        uResolution:    { value: new THREE.Vector2(2,2) },
        // circle centers
        uCircle1Center: { value: new THREE.Vector2(0.3,0.5) },
        uCircle2Center: { value: new THREE.Vector2(0.7,0.5) },
      },
      vertexShader: /* glsl */`
        varying vec2 vUv;
        void main(){
          vUv = uv; 
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform float uTime;
        uniform vec2  uMouse;
        uniform float uHover;

        uniform float uBasePixels;
        uniform float uDynamicRange;
        uniform float uNoiseStrength;
        uniform float uDisplacement;
        uniform float uColorBoost;
        uniform float uVignette;
        uniform vec2  uResolution;

        uniform vec2  uCircle1Center; // dynamic
        uniform vec2  uCircle2Center;

        varying vec2 vUv;

        // basic 2D noise
        float noise2D(vec2 p){
          vec2 ip= floor(p);
          vec2 f = fract(p);
          f= f*(3.0 - 2.0*f);

          float n00= sin(dot(ip, vec2(12.9898,78.233)));
          float n10= sin(dot(ip + vec2(1.,0.), vec2(12.9898,78.233)));
          float n01= sin(dot(ip + vec2(0.,1.), vec2(12.9898,78.233)));
          float n11= sin(dot(ip + vec2(1.,1.), vec2(12.9898,78.233)));

          float nx0= mix(n00,n10,f.x);
          float nx1= mix(n01,n11,f.x);
          return mix(nx0,nx1,f.y)* 0.1+ 0.5;
        }

        // pixelate => modifies uv
        vec2 pixelate(vec2 uv, float pixels){
          // chunk the uv
          vec2 pixelUV= floor(uv* pixels)/ pixels;
          // add noise => "shake"
          float n= sin(dot(floor(pixelUV*10.),vec2(12.9898,78.233))) * 43758.5453;
          n= fract(n)* uNoiseStrength*0.9;
          return pixelUV + n* uHover;
        }

        void main(){
          vec2 uv= vUv;
          
          // distance from mouse => effect
          float dist= distance(uv, uMouse);

          // dynamic pixelation => wave 
          float time= uTime* 2.0;
          float dynamicPixels= uBasePixels*(1.0 + sin(time)* uDynamicRange);
          float finalPixels= mix(uBasePixels, dynamicPixels, smoothstep(0.5,0.0, dist)* uHover);

          // displacement
          vec2 disp= vec2(
            noise2D(uv*1.0 + time),
            noise2D(uv*3.0 + time +1.0)
          )* uDisplacement* uHover;
          vec2 displacedUV= uv + disp;

          // pixelation near mouse
          vec2 pixelatedUV= mix(
            displacedUV,
            pixelate(displacedUV, finalPixels),
            smoothstep(0.20,0.0, dist)* 3.0*uHover
          );

          // c1 => circle around "uCircle1Center"
          float r1= distance(pixelatedUV, uCircle1Center);
          float c1= smoothstep(0.5, 0.0, r1);

          // c2 => circle around "uCircle2Center"
          float r2= distance(pixelatedUV, uCircle2Center);
          float c2= smoothstep(0.5, 0.0, r2);

          // color for c1, c2
          vec3 color1= vec3(1.0, 0.3, 0.3); 
          vec3 color2= vec3(0.3, 0.6, 1.0);

          // black background
          vec3 base= vec3(0.0);
          vec3 color= mix(base, color1, c1);
          color= mix(color, color2, c2);

          // // near mouse => color boost
          // float boost= smoothstep(1.0,0.0, dist)* uHover* uColorBoost;
          // color= mix(color, color*2.2, boost);

          // optional "vignette"
          float vig= 1.0- smoothstep(0.3,3.2, length(uv-0.5)*2.0);
          color*= mix(1.0, vig, uVignette);

          gl_FragColor= vec4(color,1.0);
        }
      `
    })
  }
}

// Extend for R3F
extend({ PixelCirclesMaterial })

/*********************
2) The R3F plane => uses PixelCirclesMaterial => 2 circles
   that we move around randomly each frame
**********************/
function PixelCirclesPlane() {
  const matRef= useRef()

  // pointer => track
  const pointerTarget= useRef({ x:0.5, y:0.5 })
  const pointerCurrent= useRef({ x:0.5, y:0.5 })
  const hover= useRef(false)

  // We'll keep random velocities for circle1 & circle2
  const circle1Pos= useRef({ x:0.3, y:0.5 })
  const circle1Vel= useRef({ x: (Math.random()*0.2-0.1), y:(Math.random()*0.2-0.1)})
  const circle2Pos= useRef({ x:0.7, y:0.5 })
  const circle2Vel= useRef({ x: (Math.random()*0.2-0.1), y:(Math.random()*0.2-0.1)})

  // pointer events
  const onPointerEnter= ()=> hover.current= true
  const onPointerLeave= ()=> hover.current= false
  const onPointerMove= (e)=>{
    const [u,v] = e.uv
    pointerTarget.current.x= u
    pointerTarget.current.y= v
  }

  // handle window resize => update uniform resolution
  useEffect(()=>{
    function onResize(){
      if(matRef.current){
        matRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener("resize", onResize)
    onResize()
    return ()=> window.removeEventListener("resize", onResize)
  },[])

  // each frame => animate time, pointer smoothing, circle positions
  useFrame((state)=>{
    if(!matRef.current) return
    const dt= state.clock.getDelta()

    // time
    matRef.current.uniforms.uTime.value += dt

    // pointer smoothing
    pointerCurrent.current.x += (pointerTarget.current.x- pointerCurrent.current.x)* 0.1
    pointerCurrent.current.y += (pointerTarget.current.y- pointerCurrent.current.y)* 0.1
    matRef.current.uniforms.uMouse.value.set(pointerCurrent.current.x, pointerCurrent.current.y)

    // hover
    const hv= matRef.current.uniforms.uHover.value
    const target= hover.current? 1:0
    matRef.current.uniforms.uHover.value += (target- hv)* 0.05

    // now randomly move circle1, circle2 in uv space => [0..1], bounce at edges
    // circle1
    circle1Pos.current.x += circle1Vel.current.x* dt
    circle1Pos.current.y += circle1Vel.current.y* dt

    // bounce if out of [0..1]
    if(circle1Pos.current.x<0.0|| circle1Pos.current.x>1.0){
      circle1Vel.current.x*= -1.0
    }
    if(circle1Pos.current.y<0.0|| circle1Pos.current.y>1.0){
      circle1Vel.current.y*= -1.0
    }

    // circle2
    circle2Pos.current.x += circle2Vel.current.x* dt
    circle2Pos.current.y += circle2Vel.current.y* dt
    if(circle2Pos.current.x<0.0|| circle2Pos.current.x>1.0){
      circle2Vel.current.x*= -1.0
    }
    if(circle2Pos.current.y<0.0|| circle2Pos.current.y>1.0){
      circle2Vel.current.y*= -1.0
    }

    // pass positions to shader
    matRef.current.uniforms.uCircle1Center.value.set(
      circle1Pos.current.x, circle1Pos.current.y
    )
    matRef.current.uniforms.uCircle2Center.value.set(
      circle2Pos.current.x, circle2Pos.current.y
    )
  })

  return (
    <mesh
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
    >
      <planeGeometry args={[15,12]}/>
      <pixelCirclesMaterial ref={matRef}/>
    </mesh>
  )
}

/*********************
3) The main scene => a full screen Canvas + PixelCirclesPlane
**********************/
export default function MousePixelation() {
  return (
    <Canvas style={{ width:"100vw", height:"100vh"}}>
      <PixelCirclesPlane/>
    </Canvas>
  )
}