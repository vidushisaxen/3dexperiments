import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  forwardRef
} from 'react';
import { Text, shaderMaterial } from '@react-three/drei';
import { MathUtils, Color, DoubleSide, FrontSide } from 'three';
import { useFrame, extend } from '@react-three/fiber';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

const TextMaterial = shaderMaterial(
  {
    time: 0,
    color: new Color(1, 1, 1),
    opacity: 1,
    fulltime: 0,
    heightFactor: 1,
  },
  // Vertex Shader
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
        float twistAmount = M_PI * 2.0;
        float direction = sign(cos(M_PI * progress));

        float twirlPeriod = sin(progress * M_PI * 2.0);

        float rotateAngle = -direction * pow(sin(progress * M_PI), 1.5) * twistAmount;
        float twirlAngle = -sin(uv.x - 0.5) * pow(twirlPeriod, 2.0) * -4.0;
        pos = rotateAxis(pos, vec3(1.0, 0.0, 0.0), rotateAngle + twirlAngle);

        // SCALE on the sides
        float scale = pow(abs(cos(fulltime * M_PI)), 2.0) * 0.33;
        pos *= 1.0 - scale;
        pos.y -= scale * heightFactor * 0.35;
        pos.x += cos(fulltime * M_PI) * -0.02;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float fulltime;
    uniform vec3 color;
    uniform float opacity;

    void main() {
      gl_FragColor = vec4(color, max(sin(fulltime * M_PI), 0.2) * opacity);
    }
  `
);

extend({ TextMaterial });

function mod(n, m) {
  return ((n % m) + m) % m;
}

const TextCarousel = forwardRef(({ y, visible }, ref) => {
  const textRef = useRef();
  const [textMat, setTextMat] = useState();

  const loader = new FontLoader();
const fontSrc = loader.load("/assets/font.json");

  const titles = [
    'Title 1',
    'Title 2',
    'Title 3',
    'Title 4',
    'Title 5'
  ];

  const pageWidth = window.innerWidth;
  const totalDistance = pageWidth * titles.length;
  const margin = (window.innerWidth - pageWidth) * 0.5;

  const getMyPos = (page) => {
    const shift = pageWidth * Math.floor(titles.length / 2);
    const x = mod(window.scrollX - page * pageWidth + shift, totalDistance) - shift;
    return x / pageWidth;
  };

  useEffect(() => {
    const handleScroll = () => {
      textRef.current.children.forEach((child, index) => {
        const pos = getMyPos(index);
        child.position.x = pos;
        child.position.y = y;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [y]);

  useFrame(({ clock }) => {
    if (textMat) {
      const scrollPos = window.scrollX / window.innerWidth;
      const fulltime = MathUtils.mapLinear(scrollPos, 0, titles.length, 0, 1);
      textMat.fulltime = MathUtils.lerp(textMat.fulltime, fulltime, 0.05);

      textRef.current.children.forEach((child) => {
        child.material.opacity = MathUtils.lerp(child.material.opacity, visible ? 1 : 0, 0.05);
      });
    }
  });

  console.log(textRef.current);

  return (
    <mesh ref={ref}>
      <textMaterial
        ref={setTextMat}
        depthTest={false}
        side={FrontSide}
        opacity={1}
        heightFactor={window.innerWidth * 0.04}
        transparent
      />
      {titles.map((title, index) => (
        <Text
          key={index}
          ref={(el) => {
            if (el) {
              textRef.current = textRef.current || { children: [] };
              textRef.current.children[index] = el;
            }
          }}
          anchorX="center"
          anchorY="middle"
          color={'white'}
          fontSize={window.innerWidth * 0.1}
          letterSpacing={-0.06}
          position={[0, 0, 5]}
          font={fontSrc}
          material={textMat}
          glyphGeometryDetail={20}
          transparent
        >
          {title}
        </Text>
      ))}
    </mesh>
  );
});

export default memo(TextCarousel);
