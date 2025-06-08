"use client";
import { useRef, useEffect } from "react";

// --- Configuration ---
// Reduced for better performance on a wider range of devices.
const PARTICLE_COUNT = 300;
// Base speed of particles moving towards the viewer.
const BASE_SPEED = 0.2;
// Speed when the user interacts (mouse down).
const BOOST_SPEED = 2;
// How much the particle field shifts based on mouse position (parallax effect).
const MOUSE_INFLUENCE = 0.03;
// Intensity of the particle's neon glow.
const GLOW_INTENSITY = 10;
// Opacity of the motion trail effect.
const TRAIL_OPACITY = 0.1;
// Field of view for the 3D projection. Affects perspective.
const FIELD_OF_VIEW = 300;

// A vibrant, high-contrast color palette for the neon balls.
const PARTICLE_COLORS = [
  "#00D4FF", "#FF6B9D", "#C3F73A", "#FFB800", "#8B5CF6",
  "#06FFA5", "#FF4081", "#00E5FF", "#FFAB00", "#7C4DFF"
];

// --- Particle Class ---
// Simplified for performance, focusing on core properties.
class Particle {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;

  constructor(canvasWidth: number) {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.color = '';
    this.size = 0;
    this.reset(canvasWidth);
  }

  // Resets a particle to a new random position in 3D space.
  reset(canvasWidth: number) {
    this.x = Math.random() * 2000 - 1000;
    this.y = Math.random() * 2000 - 1000;
    this.z = Math.random() * canvasWidth;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    this.size = Math.random() * 2.5 + 0.5;
  }

  // Updates the particle's position.
  update(speed: number) {
    this.z -= speed;
  }

  // Draws the particle on the canvas.
  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, canvasWidth: number) {
    // Project the 3D position to a 2D screen coordinate.
    const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + this.z);
    const screenX = this.x * scale + centerX;
    const screenY = this.y * scale + centerY;

    // Skip drawing if the particle is off-screen.
    if (screenX < 0 || screenX > canvasWidth || screenY < 0 || screenY > window.innerHeight) {
      return;
    }
    
    // Calculate size and opacity based on depth.
    const depthFactor = Math.max(0, (1 - this.z / canvasWidth));
    const radius = depthFactor * this.size;
    
    // Simplified drawing with a single path and shadow for a performant glow effect.
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = depthFactor * 0.8 + 0.1;
    ctx.shadowBlur = GLOW_INTENSITY * depthFactor;
    ctx.shadowColor = this.color;
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- React Component ---
export default function EnhancedParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Using { alpha: false } can improve performance as the browser doesn't need to blend with page content.
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let particles: Particle[] = [];

    const handleResize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w;
      canvas.height = h;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(w));
    };

    handleResize();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const target = "touches" in e ? e.touches[0] : e;
      if (target) {
        mousePosition.current = { x: target.clientX, y: target.clientY };
      }
    };
    
    const handleMouseDown = () => { isMouseDown.current = true; };
    const handleMouseUp = () => { isMouseDown.current = false; };

    const animate = () => {
      // Clear the canvas with a semi-transparent black for a trailing effect.
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_OPACITY})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reset canvas context properties that change per particle.
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;

      const currentSpeed = isMouseDown.current ? BOOST_SPEED : BASE_SPEED;
      
      // Calculate a global offset based on mouse position for a parallax effect.
      const mouseOffsetX = (mousePosition.current.x - canvas.width / 2) * MOUSE_INFLUENCE;
      const mouseOffsetY = (mousePosition.current.y - canvas.height / 2) * MOUSE_INFLUENCE;
      
      const centerX = canvas.width / 2 + mouseOffsetX;
      const centerY = canvas.height / 2 + mouseOffsetY;

      particles.forEach(p => {
        p.update(currentSpeed);
        // Reset particle when it moves behind the camera.
        if (p.z <= 0) p.reset(canvas.width);
        p.draw(ctx, centerX, centerY, canvas.width);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // --- Event Listeners and Cleanup ---
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 bg-black block"
    />
  );
}
