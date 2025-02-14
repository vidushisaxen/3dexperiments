import { shaderMaterial, useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { DoubleSide, MathUtils, PlaneGeometry } from "three";
import useUsefulHooks from "../hooks/useWheel";

const imagePaths = {
  fomosphere: "/assets/01-fomosphere.png",
  disco: "/assets/02-discobrain.png",
  twistertoy: "/assets/04-twistertoy.png",
  fungible: "/assets/05-fungible.png",
  metalness: "/assets/06-metalness.png",
};

export default function SpiralPlane({ setChange }) {
  const { prevPage, updateToFalse, nextPage, lastAction } = useUsefulHooks();
  const [pages, setPages] = useState([
    { name: "fomosphere", title: "Image 1", position: -8 },
    { name: "disco", title: "Image 2", position: -4 },
    { name: "twistertoy", title: "Image 1", position: 0 },
    { name: "fungible", title: "Image 2", position: 4 },
    { name: "metalness", title: "Image 3", position: 8 },
  ]);

  useEffect(() => {
    if (lastAction) {
      const updatedPages = pages.map((page) => ({
        ...page,
        position: page.position === -28 ? 24 : page.position - 4,
      }));
      setPages(updatedPages);
    }
  }, [nextPage]);

  useEffect(() => {
    if (lastAction) {
      const updatedPages = pages.map((page) => ({
        ...page,
        position: page.position === 24 ? -28 : page.position + 4,
      }));
      setPages(updatedPages);
    }
  }, [prevPage]);

  return (
    <group position={[0, 0.1, 1.5]}>
      {pages.map((data, index) => (
        <M
          key={index}
          position={data.position}
          texture={imagePaths[data.name]}
          name={data.name}
          id={index}
          nextPage={nextPage}
          prevPage={prevPage}
          pageToFalse={() => updateToFalse()}
          page={pages[index]}
        />
      ))}
    </group>
  );
}

const M = ({
  id,
  name,
  position,
  texture,
  pageToFalse,
  setChange,
  page,
}) => {
  const { viewport } = useThree();
  const [colorMap] = useTexture([texture]);
  const { prevPage, updateToFalse, nextPage, lastAction, deltaX, wheelOrArrow } = useUsefulHooks();

  const geometry = new PlaneGeometry(2, 0.5, 20, 20);
  const shape = useRef();
  const shader = useRef();

  geometry.computeBoundingBox();

  useFrame((state, delta) => {
    if (wheelOrArrow === "arrow") {
      shader.current.time = MathUtils.lerp(shader.current.time, 0.5, 0.04);
    }
  });

  useEffect(() => {
    if (wheelOrArrow === "arrow") {
      shader.current.time = 0;
    }
    if (lastAction) {
      if (page.position >= -8 && page.position <= 8) {
        gsap.to(shape.current.position, {
          x: page.position,
          duration: 2,
        });
      } else {
        if (lastAction === "next") {
          shape.current.position.x = page.position === -28 ? 24 : page.position - 4;
        } else if (lastAction === "prev") {
          shape.current.position.x = page.position === 24 ? -28 : page.position + 4;
        }
      }
    }
  }, [page]);

  useEffect(() => {
    if (page.position >= -8 && page.position <= 8) {
      if (deltaX < 0) {
        shape.current.position.x += 0.05;
        shader.current.time += 0.004;
      } else if (deltaX > 0) {
        shape.current.position.x -= 0.05;
        shader.current.time += 0.004;
      }
    }
  }, [deltaX]);

  return (
    <motion.mesh
      key={id}
      geometry={geometry}
      ref={shape}
      position={[position, 0, 0]}
    >
      <shading
        ref={shader}
        time={0}
        uMin={geometry.boundingBox.min}
        uMax={geometry.boundingBox.max}
        texture1={colorMap}
        side={DoubleSide}
        toneMapped={false}
        heightFactor={viewport.width * 0.04}
        transparent={true}
      />
    </motion.mesh>
  );
};

const Shading = shaderMaterial(
  {
    time: 0,
    amplitude: 0.1,
    frequency: 0.0,
    uMin: null,
    uMax: null,
    texture1: null,
    shaper: false,
    heightFactor: 1,
  },

  // vertexShader
  /*glsl*/ `
    uniform float time;
    uniform float heightFactor;
    varying vec2 vUv;

    #define M_PI 3.1415926538

    vec3 rotateAxis(vec3 p, vec3 axis, float angle) {
        return mix(dot(axis, p)*axis, p, cos(angle)) + cross(axis,p)*sin(angle);
    }

    void main() {
        vec3 pos = position;
        float progress = clamp(time, 0.0, 1.0);
        float twistAmount = M_PI * 2.0;
        float direction = sign(cos(M_PI * progress));
        float twirlPeriod = sin(progress * M_PI*2.0);
        float rotateAngle = -direction * pow(sin(progress * M_PI), 1.5) * twistAmount;
        float twirlAngle = -sin(uv.x - 0.5) * pow(twirlPeriod, 2.0) * -6.0;
        pos = rotateAxis(pos, vec3(1.0, 0.0, 0.0), rotateAngle + twirlAngle);
        float scale = pow(abs(cos(time * M_PI)), 2.0) * 0.33;
        pos *= 1.0 - scale;
        pos.y -= scale * heightFactor * 0.35;
        pos.x += cos(time * M_PI) * -0.02;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        vUv = uv;
    }
  `,

  // fragment shader
  /*glsl*/ `
    uniform float time;
    uniform sampler2D texture1;
    varying vec2 vUv;

    void main() {
        vec2 cuv = vUv;
        vec4 textureColor = texture2D(texture1, cuv);
        gl_FragColor = textureColor;
    }
  `
);

extend({ Shading });
