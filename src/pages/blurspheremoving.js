import React, { useRef, useEffect } from 'react';

const BlurSphere = () => {
  const canvasRef = useRef(null);

  // Define fixed circle properties
  const circles = useRef([
    { x: 200, y: 200, color: '#669fe59b', dx: 1, dy: 1, baseRadius: 200 },
    { x: 600, y: 400, color: '#d467d79b', dx: -1.5, dy: 1.2, baseRadius: 200 },
    { x: 400, y: 600, color: '#669fe59b', dx: 1.2, dy: -1, baseRadius: 150 },
  ]);

  useEffect(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to the window dimensions
    canvas.width = W;
    canvas.height = H;

    // Random offsets for each blob
    const randomOffsets = circles.current.map(() => Math.random() * 20);

    const updateOffsets = () => {
      circles.current.forEach((circle, index) => {
        // Smoothly transition offsets using interpolation
        randomOffsets[index] += (Math.random() * 20 - randomOffsets[index]) * 0.1;
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = `blur(60px)`;

      // Loop through each circle (blob) and draw them
      circles.current.forEach((circle, index) => {
        const time = Date.now() * 0.0001;

        // Compute blob radius (fixed oscillation)
        const blobRadius = circle.baseRadius + Math.sin(time);

        // Number of sides for shape
        const sides = 60;

        ctx.beginPath();

        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * 2 * Math.PI;
          const offset = Math.sin(time + i) * randomOffsets[index]; 
          const depthFactor = 1 + Math.random() *0.0005;
          const xOffset = Math.cos(angle) * (blobRadius * depthFactor + offset);
          const yOffset = Math.sin(angle) * (blobRadius * depthFactor + offset);

          if (i === 0) {
            ctx.moveTo(circle.x + xOffset, circle.y + yOffset);
          } else {
            ctx.lineTo(circle.x + xOffset, circle.y + yOffset);
          }
        }

        ctx.closePath();
        ctx.fillStyle = circle.color;
        ctx.fill();

        circle.x += circle.dx;
        circle.y += circle.dy;

        if (circle.x + circle.baseRadius > W || circle.x - circle.baseRadius < 0) {
          circle.dx *= -1;
        }
        if (circle.y + circle.baseRadius > H || circle.y - circle.baseRadius < 0) {
          circle.dy *= -1;
        }
      });

      updateOffsets();

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default BlurSphere;
