//CHROMA - Control the noise direction with mouse movement + smooth transition

import React, { useRef, useEffect } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * We'll define a CustomShaderMaterial that has iDir uniform
 * in addition to iTime, iResolution, etc.
 */
class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        iTime:       { value: 0 },
        iResolution: { value: new THREE.Vector2(1, 1) },
        iDir:        { value: new THREE.Vector2(0, 0) }, // direction offset
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv= uv;
          gl_Position= projectionMatrix* modelViewMatrix* vec4(position,1.0);
        }
      `,
      // We'll incorporate iDir in the snippet by adding a shift or rotation in the N(...) calls
      fragmentShader: `
        uniform vec2 iResolution;
        uniform float iTime;
        uniform vec2 iDir;

        varying vec2 vUv;

        #define R iResolution.xy
        #define T iTime
        #define S smoothstep

        // Inigo Quilez's 3D Simplex noise
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 -0.85373472095314* r;}

        float snoise(vec3 v){ 
          const vec2  C= vec2(1.0/6.0,1.0/3.0);
          const vec4  D= vec4(0.0,0.4,1.0,1.0);
          vec3 i= floor(v+ dot(v,C.yyy));
          vec3 x0= v- i+ dot(i,C.xxx);
          vec3 g= step(x0.yzx, x0.xyz);
          vec3 l= 1.0- g;
          vec3 i1= min(g.xyz,l.zxy);
          vec3 i2= max(g.xyz,l.zxy);
          vec3 x1= x0- i1+ 1.0*C.xxx;
          vec3 x2= x0- i2+ 2.0*C.xxx;
         vec3 x3= x0-1.0+ 3.0*C.xxx;
          i= mod(i,289.0);
          vec4 p= permute( permute( permute(
            i.z+ vec4(0.0,i1.z, i2.z,1.0))
            + i.y+ vec4(0.0,i1.y, i2.y,1.0))
            + i.x+ vec4(0.0,i1.x,i2.x,1.0));
          float n_= 1.0/7.0;
          vec3 ns= n_* D.wyz- D.xzx;
          vec4 j= p- 49.0* floor(p* ns.z* ns.z);
          vec4 x_= floor(j* ns.z);
          vec4 y_= floor(j-7.0* x_);
          vec4 x= x_* ns.x+ ns.yyyy;
          vec4 y= y_* ns.x+ ns.yyyy;
          vec4 h= 1.0- abs(x)- abs(y);
          vec4 b0= vec4(x.xy,y.xy);
          vec4 b1= vec4(x.zw,y.zw);
          vec4 s0= floor(b0)*2.0+1.0;
          vec4 s1= floor(b1)*2.0+1.0;
          vec4 sh= -step(h,vec4(0.0));
          vec4 a0= b0.xzyw+ s0.xzyw* sh.xxyy;
          vec4 a1= b1.xzyw+ s1.xzyw* sh.zzww;
          vec3 p0= vec3(a0.xy,h.x);
          vec3 p1= vec3(a0.zw,h.y);
          vec3 p2= vec3(a1.xy,h.z);
          vec3 p3= vec3(a1.zw,h.w);
          vec4 norm= taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
          p0*= norm.x;
          p1*= norm.y;
          p2*= norm.z;
          p3*= norm.w;
          vec4 m= max(0.6- vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
          m= m*m;
          return 42.0* dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
        }

        // We'll define a function that references iDir => shift or rotate the uv in the noise
        // We'll just shift uv by iDir:
        float myNoise(vec2 uv, float time, float offset){
          // shift the uv by iDir => changes direction
          vec2 uvShifted= uv + iDir* 1.5; // scale iDir if you want bigger effect
          float t= (time+ offset)* 0.1;
          float n1= snoise(vec3(uvShifted.x* 0.9+ t, uvShifted.y* 0.9- t, t));
          return snoise(vec3(n1*0.2, n1*0.7, t*0.1));
        }

        // The "C(...)" function from snippet
        float C(vec2 u, float n, float s, float z){
          // s = threshold range, z= scale in y
          return S(S(0.1,s,length(u)),0.0, length(u* vec2(z*0.8,z)+ n*0.3)- 0.3);
        }

        void main(){
          vec2 I= vUv* iResolution;
          vec2 uv= (I- 0.5* R)/ R.y;

          float c1= C(uv, myNoise(uv, iTime, 1.0), 1.2, 1.1);
          // float c2= C(uv, myNoise(uv, iTime, -9.0), 1.5, 1.4);

          float n= 0.08* snoise(vec3(uv*300.0, iTime*0.2));

          vec3 finalC= mix(
            vec3(n*0.1+ 0.9),
            n+ mix(
              vec3(0.7,0.3,0.3)*1.3,
              vec3(uv.x+0.95,0.2,1.0)*1.0,
              clamp(-0.14,0.9, c1)
            ),
            clamp(0.0,1.0, c1 )
          );

          gl_FragColor= vec4(finalC,1.0);
        }
      `
    })
  }
}

extend({ CustomShaderMaterial })

const ShaderPlane = () => {
  const shaderRef = useRef()
  
  // We'll keep track of mouse in [-1..1], then do a small lerp to iDir
  const pointerTarget = useRef(new THREE.Vector2(0,0))
  const pointerLerped = useRef(new THREE.Vector2(0,0))

  // handle pointer moves => store in pointerTarget
  const onPointerMove= (e)=>{
    let x= (e.clientX / window.innerWidth)*2. -1.
    let y= (e.clientY / window.innerHeight)*2. -1.
    y= -y // invert if you want up to be positive
    pointerTarget.current.set(x,y)
  }

  useEffect(()=>{
    // set iResolution
    const handleResize= ()=>{
      if(shaderRef.current){
        shaderRef.current.uniforms.iResolution.value.set(
          window.innerWidth, window.innerHeight
        )
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return ()=> window.removeEventListener('resize', handleResize)
  },[])

  // each frame => iTime => plus we lerp pointer => iDir
  useFrame((state)=>{
    if(!shaderRef.current) return
    shaderRef.current.uniforms.iTime.value= state.clock.elapsedTime

    // small smoothing => lerp
    pointerLerped.current.lerp(pointerTarget.current, 0.005)
    // pass to iDir
    shaderRef.current.uniforms.iDir.value.copy(pointerLerped.current)
  })

  return (
    <mesh onPointerMove={onPointerMove}>
      <planeGeometry args={[15,8]} />
      <customShaderMaterial ref={shaderRef} />
    </mesh>
  )
}

export default function ChromaMouseDirection(){
  return (
    <Canvas style={{ width:"100vw", height:"100vh" }}>
      <ShaderPlane/>
    </Canvas>
  )
}