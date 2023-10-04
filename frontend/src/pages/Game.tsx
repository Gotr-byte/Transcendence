import { useRef, useEffect, useState } from 'react';
import { TwoFAComponent } from '../components/TwoFAComponent'
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

  const handle2FASuccess = () => {
    console.log('2FA verified successfully.');
    // Redirect the user to the main page or reload the current page
    // window.location.href = '/main-page-url'; 
  };
  return (
    <div>
      <canvas ref={canvasRef} width={200} height={200} onClick={toggleSwitch}></canvas>
      {/* <TwoFAComponent onVerify={handle2FASuccess}></TwoFAComponent> */}
    </div>
  );
};

export default SimpleSwitch;
