"use client";
import { useRef, useEffect } from "react";

// --- Configuration ---
// The total number of particles to render.
const PARTICLE_COUNT = 500;
// The base speed of the particles.
const BASE_SPEED = 0.1;
// The speed of the particles when the mouse is held down.
const BOOST_SPEED = 4;
// A vibrant color palette for the particles.
const PARTICLE_COLORS = ["#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630", "#FA6900"];
// The field of view for the 3D projection.
const FIELD_OF_VIEW = 300;


/**
 * @typedef {object} Particle
 * @property {number} x - The x-coordinate in 3D space.
 * @property {number} y - The y-coordinate in 3D space.
 * @property {number} z - The z-coordinate (depth) in 3D space.
 * @property {string} color - The color of the particle.
 */
type Particle = { x: number; y: number; z: number; color: string };

/**
 * Creates a single particle with random properties.
 * @param {number} canvasWidth - The width of the canvas.
 * @returns {Particle} A new particle object.
 */
const createParticle = (canvasWidth: number): Particle => ({
  x: Math.random() * 2000 - 1000,
  y: Math.random() * 2000 - 1000,
  z: Math.random() * canvasWidth,
  color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
});

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let particles: Particle[] = [];
    let animationFrameId: number;

    /**
     * Resizes the canvas and re-initializes particles.
     */
    const handleResize = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvasWidth));
    };

    // Initial setup
    handleResize();

    /**
     * Updates the mouse position from mouse or touch events.
     * @param {MouseEvent | TouchEvent} e - The event object.
     */
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const target = "touches" in e ? e.touches[0] : e;
      if (target) {
        mousePosition.current = { x: target.clientX, y: target.clientY };
      }
    };
    
    const handleMouseDown = () => { isMouseDown.current = true; };
    const handleMouseUp = () => { isMouseDown.current = false; };


    /**
     * The main animation loop.
     */
    const animate = () => {
      // Create a trailing effect by filling the canvas with a semi-transparent color
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const currentSpeed = isMouseDown.current ? BOOST_SPEED : BASE_SPEED;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      
      // Move mouse influence point towards the actual mouse position for a smoother follow effect
      const targetX = (mousePosition.current.x - centerX);
      const targetY = (mousePosition.current.y - centerY);


      particles.forEach(p => {
        // Update particle position
        p.z -= currentSpeed;

        // Reset particle if it's moved behind the viewer
        if (p.z <= 0) {
          Object.assign(p, createParticle(canvasWidth));
        }

        // Project 3D coordinates to 2D screen
        const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + p.z);
        const screenX = p.x * scale + centerX + targetX * 0.1 * scale;
        const screenY = p.y * scale + centerY + targetY * 0.1 * scale;
        const radius = Math.max(0, (1 - p.z / canvasWidth) * 4);
        
        // Skip drawing if particle is off-screen
        if (screenX < 0 || screenX > canvasWidth || screenY < 0 || screenY > canvasHeight) {
            return;
        }

        // Draw the particle with a glow effect
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- Event Listeners and Cleanup ---
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown, { passive: true });
    window.addEventListener("touchend", handleMouseUp);


    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-black" />;
}
