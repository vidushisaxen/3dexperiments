import React, { useEffect, useRef, useState } from 'react';

const Points = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const mouseEnteredRef = useRef(false); 
  const [lineLength, setLineLength] = useState(0); 
  const maxLineLength = 20; 
  const easingSpeed = 0.05; 

  class Point {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }

    draw(ctx, mouseX, mouseY) {
      if (mouseEnteredRef.current) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;

       
        const distance = Math.sqrt(dx * dx + dy * dy);
        const unitX = dx / distance;
        const unitY = dy / distance;

        
        const lineEndX = this.x + unitX * lineLength;
        const lineEndY = this.y + unitY * lineLength;

        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
      }
    }
  }

  const initializePoints = (canvas) => {
    const points = [];
    const spacing = 50;
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);

    const xPadding = (canvas.width - (cols * spacing)) / 2;
    const yPadding = (canvas.height - (rows * spacing)) / 2;

    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        points.push(new Point(
          x * spacing + xPadding,
          y * spacing + yPadding
        ));
      }
    }
    return points;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pointsRef.current = initializePoints(canvas);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseEnter = () => {
    mouseEnteredRef.current = true; }

  const handleMouseLeave = () => {
    mouseEnteredRef.current = false; 
  };

  const updateLineLength = () => {
    if (mouseEnteredRef.current && lineLength < maxLineLength) {
      setLineLength(prevLength => Math.min(prevLength + easingSpeed, maxLineLength));
    } else if (!mouseEnteredRef.current && lineLength > 0) {
      setLineLength(prevLength => Math.max(prevLength - easingSpeed, 0));
    }
  };

  const main = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const points = pointsRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateLineLength();

    points.forEach(point => {
      point.draw(ctx, mouse.x, mouse.y);
    });

    animationFrameRef.current = requestAnimationFrame(main);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    pointsRef.current = initializePoints(canvas);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    main();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lineLength]);

  return (
    <div className="w-full h-full bg-white">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'none' }}
      />
    </div>
  );
};

export default Points;
