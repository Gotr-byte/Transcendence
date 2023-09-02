import React, { useRef, useEffect, useState } from 'react';

const SimpleSwitch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isOn, setIsOn] = useState(false);

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw switch background
    ctx.fillStyle = '#ccc';
    ctx.fillRect(50, 50, 100, 50);

    // Draw switch handle
    ctx.fillStyle = isOn ? 'green' : 'red';
    ctx.beginPath();
    ctx.arc(isOn ? 125 : 75, 75, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        draw(context);
      }
    }
  }, [isOn]);

  return (
    <div>
      <canvas ref={canvasRef} width={200} height={200} onClick={toggleSwitch}></canvas>
    </div>
  );
};

export default SimpleSwitch;
