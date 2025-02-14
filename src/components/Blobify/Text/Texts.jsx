import { Canvas } from "@react-three/fiber";
import React, { useEffect, useState } from "react";
import { Text, shaderMaterial } from "@react-three/drei";
import { Color, DoubleSide } from 'three';
import { extend } from '@react-three/fiber';
import useUsefulHooks from "../hooks/useWheel";

const TextMaterial = shaderMaterial(
  {
    time: 0,
    color: new Color(1, 1, 1),
    opacity: 1,
    fulltime: 0,
    heightFactor: 1,
  },
  // vertex shader
  `
      uniform float fulltime;
      uniform float heightFactor;

      #define M_PI 3.1415926538

      vec3 rotateAxis(vec3 p, vec3 axis, float angle) {
          return mix(dot(axis, p)*axis, p, cos(angle)) + cross(axis,p)*sin(angle);
      }

      void main() {
          vec3 pos = position;

          float progress = clamp(fulltime, 0.0, 1.0);

          // TWIRL
          float twistAmount = M_PI * 2.;
          float direction = sign(cos(M_PI * progress));

          float twirlPeriod = sin(progress * M_PI*2.);

          float rotateAngle = -direction * pow(sin(progress * M_PI), 1.5) * twistAmount;
          float twirlAngle = -sin(uv.x -.5) * pow(twirlPeriod, 2.0) * -4.;
          pos = rotateAxis(pos, vec3(1., 0., 0.), rotateAngle + twirlAngle);

          // SCALE on the sides
          float scale = pow(abs(cos(fulltime * M_PI)), 2.0) * .33;
          pos *= 1. - scale;
          pos.y -= scale * heightFactor * 0.35;
          pos.x += cos(fulltime * M_PI) * -.02;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
  // fragment shader
  `
      uniform float fulltime;
      uniform vec3 color;
      uniform float opacity;

      #define M_PI 3.1415926538

      void main() {
        gl_FragColor.rgba = vec4(color, max(sin((fulltime)*M_PI), 0.2) * opacity);
      }
    `
);

extend({ TextMaterial });

const Texts = () => {
  const { prevPage, updateToFalse, nextPage, lastAction } = useUsefulHooks();

  const [textMat, setTextMat] = useState();
  const [fullTime, setFullTime] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0); 
  const titles = ["Fomosphere", "Discobrain", "Twistertoy", "Fungible", "Metalness"];

  const handleWheel = (e) => {
    const deltaY = e.deltaY;                                                        
    setFullTime(deltaY/100);
    setScrollOffset(prev => (prev - deltaY * 0.01) % (titles.length )); 
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);

    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <>
      <textMaterial
        ref={setTextMat}
        depthTest={false}
        side={DoubleSide}
        opacity={1}
        time={1}
        heightFactor={10}
        fulltime={fullTime}
        transparent
      />
      {titles.map((title, index) => (
        <Text
          key={index}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontSize={5}
          material={textMat}
          position={[index * -5 + scrollOffset, 0.1, 0.5]} 
          scale={0.2}
        >
          {title}
        </Text>
      ))}
    </>
  );
};

export default Texts;
