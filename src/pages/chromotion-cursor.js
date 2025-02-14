import React, { useEffect, useRef } from 'react';

const Chromotion = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const circlesRef = useRef([]);
  const requestRef = useRef();
  const programRef = useRef(null);
  const uniformLocationsRef = useRef({});

  const circleColors = [
      [250/255, 129/255, 47/255],
      [250/255, 177/255, 47/255],
      [250/255, 64/255, 50/255],
    [200 / 255, 50 / 255, 50 / 255],
    [180 / 255, 180 / 255, 50 / 255],
    [140 / 255, 100 / 255, 1.0],
  ];

  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main(void) {
      v_uv = a_position * 0.5 + 0.5; 
      v_uv.y = 1.0 - v_uv.y; 
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_uv;

    uniform vec2 u_resolution;
    uniform bool u_darkMode;
    uniform int u_circleCount;
    uniform vec3 u_circlesColor[6];
    uniform vec3 u_circlesPosRad[6];
    uniform vec2 u_mouse;

    void main(void) {
        vec2 st = v_uv * u_resolution;

        vec3 topColor = vec3(1.0, 1.0, 1.0);
        vec3 bottomColor = vec3(1.0, 1.0, 1.0);
        vec3 bgColor = mix(topColor, bottomColor, st.y / u_resolution.y);

        float fieldSum = 0.0;
        vec3 weightedColorSum = vec3(0.0);
        
        for (int i = 0; i < 6; i++) {
            if (i >= u_circleCount) { break; }
            vec3 posRad = u_circlesPosRad[i];
            vec2 cPos = vec2(posRad.r, posRad.g);
            float radius = posRad.b;
            float dist = length(st - cPos);
            float sigma = radius * 0.5;
            float val = exp(- (dist * dist) / (2.0 * sigma * sigma));
            fieldSum += val;
            weightedColorSum += u_circlesColor[i] * val;
        }

        vec3 finalCirclesColor = vec3(0.0);
        if (fieldSum > 0.0) {
          finalCirclesColor = weightedColorSum / fieldSum;
        }

        float intensity = pow(fieldSum, 1.4);
        vec3 finalColor = mix(bgColor, finalCirclesColor, clamp(intensity, 0.0, 1.0));
        gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initCircles = (width, height) => {
    const circles = [];
    const baseRadius = (width + height) * 0.2;
    
    for (let i = 0; i < 2; i++) {
      const radius = baseRadius;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const speedMultiplier = Math.random() * 9 ;
    
      const vx = (Math.random() - 0.5) * speedMultiplier;
      const vy = (Math.random() - 0.5) * speedMultiplier;
      
      circles.push({
        x,
        y,
        radius,
        color: circleColors[i],
        vx,
        vy,
        interactive: false,
      });
    }

    const interactiveRadius = (width + height) * 0.2;
    circles.push({
      x: width / 2,
      y: height / 2,
      radius: interactiveRadius,
      color: circleColors[2],
      vx: 0,
      vy: 0,
      interactive: true,
    });

    return circles;
  };

  const initGL = (canvas, width, height) => {
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return null;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return null;
    }

    gl.useProgram(program);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

    const uniformLocations = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_darkMode: gl.getUniformLocation(program, "u_darkMode"),
      u_circleCount: gl.getUniformLocation(program, "u_circleCount"),
      u_circlesColor: gl.getUniformLocation(program, "u_circlesColor"),
      u_circlesPosRad: gl.getUniformLocation(program, "u_circlesPosRad"),
      u_mouse: gl.getUniformLocation(program, "u_mouse"),
    };

    gl.uniform2f(uniformLocations.u_resolution, width, height);

    return { gl, program, uniformLocations };
  };

  const updateCircles = (circles, width, height, mouse) => {
    return circles.map(c => {
      if (!c.interactive) {
        let x = c.x + c.vx ;
        let y = c.y + c.vy;

        if (x - c.radius > width) x = -c.radius;
        if (x + c.radius < 0) x = width + c.radius;
        if (y - c.radius > height) y = -c.radius;
        if (y + c.radius < 0) y = height + c.radius;

        return { ...c, x, y };
      } else {
        const x = c.x + (mouse.x - c.x) * 0.1;
        const y = c.y + (mouse.y - c.y) * 0.1;
        return { ...c, x, y };
      }
    });
  };

  const render = () => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    const { uniformLocations } = uniformLocationsRef.current;

    circlesRef.current = updateCircles(
      circlesRef.current,
      canvas.width,
      canvas.height,
      mouseRef.current
    );

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const colorsArr = [];
    const posRadArr = [];
    
    for (let i = 0; i < 6; i++) {
      if (i < circlesRef.current.length) {
        const c = circlesRef.current[i];
        colorsArr.push(c.color[0], c.color[1], c.color[2]);
        posRadArr.push(c.x, c.y, c.radius);
      } else {
        colorsArr.push(0, 0, 0);
        posRadArr.push(0, 0, 0);
      }
    }

    gl.uniform1i(uniformLocations.u_circleCount, circlesRef.current.length);
    gl.uniform2f(uniformLocations.u_resolution, canvas.width, canvas.height);
    gl.uniform2f(uniformLocations.u_mouse, mouseRef.current.x, mouseRef.current.y);
    gl.uniform3fv(uniformLocations.u_circlesColor, new Float32Array(colorsArr));
    gl.uniform3fv(uniformLocations.u_circlesPosRad, new Float32Array(posRadArr));

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const gl = canvas.getContext("webgl");
      gl.viewport(0, 0, canvas.width, canvas.height);
      circlesRef.current = initCircles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouseRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const glContext = initGL(canvas, canvas.width, canvas.height);
    if (glContext) {
      const { program, uniformLocations } = glContext;
      programRef.current = program;
      uniformLocationsRef.current = { uniformLocations };
      circlesRef.current = initCircles(canvas.width, canvas.height);
      
      window.addEventListener("resize", handleResize);
      window.addEventListener("mousemove", handleMouseMove);
      
      requestRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
    />
  );
};

export default Chromotion;