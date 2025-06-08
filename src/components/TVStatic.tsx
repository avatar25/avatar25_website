"use client";
import React, { useEffect, useRef } from 'react';

/**
 * @interface TVStaticProps
 * @description Props for the TVStatic component.
 * @property {string} [className] - Optional CSS class to apply to the canvas element.
 * @property {number} [noiseIntensity=0.2] - Controls the density of the static noise. Range: 0 to 1.
 * @property {number} [scanlineIntensity=0.05] - Controls the visibility of the dark scan lines. Range: 0 to 1.
 * @property {number} [glitchIntensity=0.05] - Controls the visibility of random horizontal glitch lines. Range: 0 to 1.
 * @property {number} [animationSpeed=30] - The target frames per second for the animation.
 */
interface TVStaticProps {
  className?: string;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  glitchIntensity?: number;
  animationSpeed?: number;
}

/**
 * A React component that renders a subtle, animated TV static effect on a <canvas> element.
 * It's designed to be a background element and does not interact with pointer events.
 */
const TVStatic: React.FC<TVStaticProps> = ({
  className = '',
  noiseIntensity = 0.001,
  scanlineIntensity = 0.05,
  glitchIntensity = 0.2,
  animationSpeed = 60,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // --- Canvas Resizing ---
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Animation Loop ---
    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastFrameTimeRef.current;
      const frameInterval = 1000 / animationSpeed;

      if (elapsed > frameInterval) {
        lastFrameTimeRef.current = currentTime;

        const w = canvas.width;
        const h = canvas.height;
        
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;

        // --- Generate Noise ---
        for (let i = 0; i < data.length; i += 4) {
          const noiseValue = Math.random() > noiseIntensity ? 0 : Math.floor(Math.random() * 255);
          data[i] = noiseValue;
          data[i + 1] = noiseValue;
          data[i + 2] = noiseValue;
          data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);

        // --- Draw Scan Lines ---
        if (scanlineIntensity > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${scanlineIntensity})`;
            for (let y = 0; y < h; y += 4) { // Increased spacing for subtlety
                ctx.fillRect(0, y, w, 1);
            }
        }

        // --- Draw Random Horizontal Glitch Lines ---
        if (glitchIntensity > 0) {
            const numGlitches = Math.floor(Math.random() * 8);
            for (let i = 0; i < numGlitches; i++) {
                const y = Math.random() * h;
                const height = Math.random() * 2 + 1;
                const alpha = Math.random() * glitchIntensity;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fillRect(0, y, w, height);
            }
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // --- Cleanup Function ---
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [noiseIntensity, scanlineIntensity, glitchIntensity, animationSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default TVStatic;
