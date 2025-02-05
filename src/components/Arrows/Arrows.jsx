import React, { useEffect, useRef } from 'react';

const Arrows = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const arrowsRef = useRef([]);
  const animationFrameRef = useRef(null);

  class Point {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
  }

  class Arrow {
    constructor(position) {
      this.pos = position;
      this.dx = 0;
      this.dy = 0;
      this.angle = 0;
    }

    update(mouseX, mouseY) {
      this.dx = mouseX - this.pos.x;
      this.dy = mouseY - this.pos.y;
      this.angle = Math.atan2(this.dy, this.dx);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.pos.x, this.pos.y);
      ctx.rotate(this.angle);
      ctx.beginPath();

    
      ctx.moveTo(20, 0);
      ctx.lineTo(-20, 0);
      ctx.moveTo(20, 0);
      ctx.lineTo(5, -15);
      ctx.moveTo(20, 0);
      ctx.lineTo(5, 15);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black'; 
      ctx.stroke();

      ctx.restore();
    }
  }

  const initializeArrows = (canvas) => {
    const arrows = [];
    const spacing = 50; 
    
   
    const cols = Math.floor(canvas.width / spacing);
    const rows = Math.floor(canvas.height / spacing);
    
    
    const xPadding = (canvas.width - (cols * spacing)) / 2;
    const yPadding = (canvas.height - (rows * spacing)) / 2;
    
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        arrows.push(
          new Arrow(
            new Point(
              x * spacing + xPadding,
              y * spacing + yPadding
            )
          )
        );
      }
    }
    return arrows;
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      arrowsRef.current = initializeArrows(canvas);
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
  
  

  const main = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const arrows = arrowsRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    arrows.forEach(arrow => {
      arrow.update(mouse.x, mouse.y);
      arrow.draw(ctx);
    });

    animationFrameRef.current = requestAnimationFrame(main);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    arrowsRef.current = initializeArrows(canvas);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    main();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: 'none' }}
      />
    </div>
  );
};

export default Arrows;