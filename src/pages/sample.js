"use client"; // For Next.js App Router or add dynamic import below

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import NormalizeWheel from "normalize-wheel";

// ESM imports from ogl
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from "ogl";

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------
function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function map(num, min1, max1, min2, max2, round = false) {
  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;
  return round ? Math.round(num2) : num2;
}

// Simple AutoBind: binds all prototype methods to the instance.
function AutoBind(self) {
  const properties = new Set();
  let obj = self.constructor.prototype;
  while (obj && obj !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      if (key !== "constructor") properties.add(key);
    }
    obj = Object.getPrototypeOf(obj);
  }
  for (const key of properties) {
    const descriptor = Object.getOwnPropertyDescriptor(
      self.constructor.prototype,
      key
    );
    if (descriptor && typeof descriptor.value === "function") {
      self[key] = self[key].bind(self);
    }
  }
}

// -----------------------------------------------------------------------------
// GLSL Shaders
// -----------------------------------------------------------------------------
const VERTEX_SHADER = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  
  return mat4(
    oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.x * axis.z + axis.y * s,  0.0,
    oc * axis.x * axis.y + axis.z * s,    oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
    oc * axis.x * axis.z - axis.y * s,    oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
    0.0,                                  0.0,                                0.0,                                1.0
  );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? +16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;
  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm/2.0) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1.0 - 0.01 * uDistortion),
    0.0,
    2.0
  );
  localprogress = qinticInOut(localprogress) * PI;

  // The basic rotation (for this example) is applied uniformly:
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  gl_FragColor.rgb = texture2D(tMap, uv).rgb;
  gl_FragColor.a = 1.0;
}
`;

// -----------------------------------------------------------------------------
// Media class
// -----------------------------------------------------------------------------
class Media {
  constructor({ gl, geometry, scene, renderer, screen, viewport, image, length, index }) {
    this.extra = 0;
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.renderer = renderer;
    this.screen = screen;
    this.viewport = viewport;
    // Image is now an object with src and link.
    this.image = image.src;
    this.link = image.link;
    this.length = length;
    this.index = index;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    const program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: 3 },
        uTime: { value: 0 },
      },
      cullFace: false,
    });

    this.program = program;

    const img = new Image();
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  setScale(x = 720, y = 500) {
    this.plane.scale.x = (this.viewport.width * x) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * y) / this.screen.height;
    this.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;

    this.setScale();
    this.padding = 0.8;
    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.length;
    this.y = this.height * this.index;
  }

  update(scroll, direction) {
    this.plane.position.y = this.y - scroll.current - this.extra;

    const position = map(
      this.plane.position.y,
      -this.viewport.height,
      this.viewport.height,
      5,
      15
    );

    // Distortion
    this.program.uniforms.uPosition.value = position;

    // Speed/time
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current;

    const planeOffset = this.plane.scale.y / 2;
    const viewportOffset = this.viewport.height;
    this.isBefore = this.plane.position.y + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.y - planeOffset > viewportOffset;

    // Infinity scroller logic
    if (direction === "up" && this.isBefore) {
      this.extra -= this.heightTotal;
      this.isBefore = false;
      this.isAfter = false;
    } else if (direction === "down" && this.isAfter) {
      this.extra += this.heightTotal;
      this.isBefore = false;
      this.isAfter = false;
    }
  }
}

// -----------------------------------------------------------------------------
// Canvas Class
// -----------------------------------------------------------------------------
class Canvas {
  constructor() {
    // Initialize medias as an empty array.
    this.medias = [];

    // Images now are objects with src and link.
    this.images = [
      { src: "/assets/listing/night-earth-listing.png", link: "/nightEarth" },
      { src: "/assets/listing/arrows-listing.png", link: "/arrows" },
      { src: "/assets/listing/cars-listing.png", link: "/cars" },
      { src: "/assets/listing/chroma-listing.png", link: "/chroma" },
      { src: "/assets/listing/curve-plane-listing.png", link: "/curveplane" },
      { src: "/assets/listing/noise-listing.png", link: "/noise" },
      { src: "/assets/listing/mouse-pixelation-listing.png", link: "/mouse-pixelation" },
      { src: "/assets/listing/glowing-orbs-listing.png", link: "/glowingorbs" },
      { src: "/assets/listing/blur-sphere-listing.png", link: "/blurspheremoving" },
      { src: "/assets/listing/furniverse-listing.png", link: "/furniverse" },
      { src: "/assets/listing/model-rotation-listing.png", link: "/modelrotation" },
      { src: "/assets/listing/color-changing-listing.png", link: "/color-changing-background" },
      { src: "/assets/listing/route-color-listing.png", link: "/route-color-change" },
    ];

    this.scroll = { ease: 0.01, current: 0, target: 0, last: 0 };
    AutoBind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.addEventListeners();
    this.createPreloader();
    this.update();
  }

  createPreloader() {
    this.loaded = 0;
    this.images.forEach((source) => {
      const img = new Image();
      img.src = source.src;
      img.onload = () => {
        this.loaded++;
        if (this.loaded === this.images.length) {
          document.documentElement.classList.remove("loading");
          document.documentElement.classList.add("loaded");
        }
      };
    });
  }

  createRenderer() {
    this.renderer = new Renderer({
      canvas: document.querySelector("#gl"),
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    this.gl = this.renderer.gl;
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 15;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 1,
      widthSegments: 100,
    });
  }

  createMedias() {
    this.medias = this.images.map((image, index) => {
      return new Media({
        gl: this.gl,
        geometry: this.planeGeometry,
        scene: this.scene,
        renderer: this.renderer,
        screen: this.screen,
        viewport: this.viewport,
        image,
        length: this.images.length,
        index,
      });
    });
  }

  onResize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });

    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { height, width };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  // REVERSE: invert sign so that it moves "forward"
  onWheel(event) {
    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY;
    this.scroll.target -= speed * 0.05;
  }

  onTouchDown(event) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchMove(event) {
    if (!this.isDown) return;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const distance = (y - this.start) * 0.1;
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
  }

  // New: When clicking on the canvas, check if a media is clicked.
  onClick(event) {
    const rect = this.renderer.gl.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const scaleX = this.screen.width / this.viewport.width;
    const scaleY = this.screen.height / this.viewport.height;

    for (const media of this.medias) {
      const worldPos = media.plane.position;
      const screenX = this.screen.width / 2 + worldPos.x * scaleX;
      const screenY = this.screen.height / 2 - worldPos.y * scaleY;
      const mediaWidth = media.plane.scale.x * scaleX;
      const mediaHeight = media.plane.scale.y * scaleY;

      if (
        mouseX >= screenX - mediaWidth / 2 &&
        mouseX <= screenX + mediaWidth / 2 &&
        mouseY >= screenY - mediaHeight / 2 &&
        mouseY <= screenY + mediaHeight / 2
      ) {
        if (media.link) {
          window.location.href = media.link;
        }
        break;
      }
    }
  }

  // New: Change cursor style based on whether the pointer is over an image.
  onCanvasMouseMove(event) {
    const rect = this.renderer.gl.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const scaleX = this.screen.width / this.viewport.width;
    const scaleY = this.screen.height / this.viewport.height;
    let hovered = false;
    for (const media of this.medias) {
      const worldPos = media.plane.position;
      const screenX = this.screen.width / 2 + worldPos.x * scaleX;
      const screenY = this.screen.height / 2 - worldPos.y * scaleY;
      const mediaWidth = media.plane.scale.x * scaleX;
      const mediaHeight = media.plane.scale.y * scaleY;
      if (
        mouseX >= screenX - mediaWidth / 2 &&
        mouseX <= screenX + mediaWidth / 2 &&
        mouseY >= screenY - mediaHeight / 2 &&
        mouseY <= screenY + mediaHeight / 2
      ) {
        hovered = true;
        break;
      }
    }
    this.renderer.gl.canvas.style.cursor = hovered ? "pointer" : "default";
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "up" : "down";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    window.requestAnimationFrame(() => this.update());
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("wheel", this.onWheel);
    window.addEventListener("mousewheel", this.onWheel);

    window.addEventListener("mousedown", this.onTouchDown);
    window.addEventListener("mousemove", this.onTouchMove);
    window.addEventListener("mouseup", this.onTouchUp);

    window.addEventListener("touchstart", this.onTouchDown);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchUp);

    // Add click and mousemove events to the canvas element.
    this.renderer.gl.canvas.addEventListener("click", this.onClick);
    this.renderer.gl.canvas.addEventListener("mousemove", this.onCanvasMouseMove);
  }
}

// We wrap the component in dynamic(..., { ssr: false }) to ensure it runs client-side only.
const OGLSingleFileApp = () => {
  useEffect(() => {
    new Canvas(); // eslint-disable-line no-new
  }, []);

  return (
    <canvas id="gl" style={{ width: "100%", height: "100%", display: "block" }} />
  );
};

export default dynamic(() => Promise.resolve(OGLSingleFileApp), { ssr: false });
