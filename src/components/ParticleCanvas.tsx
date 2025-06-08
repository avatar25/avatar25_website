"use client";
import { useRef, useEffect } from "react";

// Enhanced Configuration
const PARTICLE_COUNT = 800;
const BASE_SPEED = 0.12;
const BOOST_SPEED = 5;
const MOUSE_INFLUENCE = 0.15;
const GLOW_INTENSITY = 15;
const TRAIL_OPACITY = 0.08;
const FIELD_OF_VIEW = 400;
const DEPTH_RANGE = 2000;

// Enhanced color palette with more vibrant options
const PARTICLE_COLORS = [
  "#00D4FF", "#FF6B9D", "#C3F73A", "#FFB800", "#8B5CF6",
  "#06FFA5", "#FF4081", "#00E5FF", "#FFAB00", "#7C4DFF"
];

// Particle class for better organization and performance
class Particle {
  x: number;
  y: number;
  z: number;
  color: string;
  baseX: number;
  baseY: number;
  velocity: { x: number; y: number };
  size: number;
  pulsePhase: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.reset(canvasWidth, canvasHeight);
    this.velocity = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02
    };
    this.size = Math.random() * 2 + 1;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  reset(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * DEPTH_RANGE - DEPTH_RANGE / 2;
    this.y = Math.random() * DEPTH_RANGE - DEPTH_RANGE / 2;
    this.z = Math.random() * canvasWidth + canvasWidth;
    this.baseX = this.x;
    this.baseY = this.y;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  }

  update(speed: number, mouseX: number, mouseY: number, centerX: number, centerY: number, time: number) {
    // Move towards camera
    this.z -= speed;

    // Add subtle floating motion
    this.x = this.baseX + Math.sin(time * 0.001 + this.pulsePhase) * 20;
    this.y = this.baseY + Math.cos(time * 0.0008 + this.pulsePhase) * 15;

    // Mouse influence with distance-based falloff
    const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + this.z);
    const screenX = this.x * scale + centerX;
    const screenY = this.y * scale + centerY;
    
    const dx = mouseX - screenX;
    const dy = mouseY - screenY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxInfluence = 150;
    
    if (distance < maxInfluence) {
      const force = (1 - distance / maxInfluence) * MOUSE_INFLUENCE;
      this.x += dx * force;
      this.y += dy * force;
    }

    // Apply velocity for organic movement
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, canvasWidth: number, canvasHeight: number, time: number) {
    const scale = FIELD_OF_VIEW / (FIELD_OF_VIEW + this.z);
    const screenX = this.x * scale + centerX;
    const screenY = this.y * scale + centerY;
    
    // Skip if off-screen with buffer
    if (screenX < -50 || screenX > canvasWidth + 50 || screenY < -50 || screenY > canvasHeight + 50) {
      return;
    }

    // Dynamic size based on depth and pulse
    const depthFactor = Math.max(0, (1 - this.z / canvasWidth));
    const pulse = Math.sin(time * 0.003 + this.pulsePhase) * 0.3 + 0.7;
    const radius = Math.max(0.5, depthFactor * this.size * 3 * pulse);
    
    // Enhanced glow effect
    const alpha = depthFactor * 0.9 + 0.1;
    const glowSize = GLOW_INTENSITY * depthFactor;
    
    // Outer glow
    ctx.beginPath();
    ctx.fillStyle = this.color + '20';
    ctx.shadowBlur = glowSize * 2;
    ctx.shadowColor = this.color;
    ctx.arc(screenX, screenY, radius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner glow
    ctx.beginPath();
    ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = this.color;
    ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Core particle
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowBlur = glowSize * 0.5;
    ctx.arc(screenX, screenY, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function EnhancedParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const lastTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let particles: Particle[] = [];
    let animationFrameId: number;

    // Performance optimization
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const handleResize = () => {
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvasWidth, canvasHeight));
    };

    handleResize();

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const target = "touches" in e ? e.touches[0] : e;
      if (target) {
        mousePosition.current = { x: target.clientX, y: target.clientY };
      }
    };
    
    const handleMouseDown = () => { 
      isMouseDown.current = true;
      canvas.style.cursor = 'grabbing';
    };
    
    const handleMouseUp = () => { 
      isMouseDown.current = false;
      canvas.style.cursor = 'grab';
    };

    // Enhanced animation loop with time-based animations
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime.current;
      lastTime.current = currentTime;

      // Dynamic trail effect based on speed
      const trailIntensity = isMouseDown.current ? TRAIL_OPACITY * 0.5 : TRAIL_OPACITY;
      ctx.fillStyle = `rgba(0, 0, 0, ${trailIntensity})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const currentSpeed = isMouseDown.current ? BOOST_SPEED : BASE_SPEED;
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;

      // Smooth mouse following
      const smoothing = 0.1;
      const targetX = mousePosition.current.x;
      const targetY = mousePosition.current.y;

      particles.forEach(particle => {
        particle.update(currentSpeed, targetX, targetY, centerX, centerY, currentTime);

        // Reset particle if it's too close or too far
        if (particle.z <= 0 || particle.z > canvasWidth * 2) {
          particle.reset(canvasWidth, canvasHeight);
        }

        particle.draw(ctx, centerX, centerY, canvasWidth, canvasHeight, currentTime);
      });

      // Add subtle screen-wide glow effect when boosting
      if (isMouseDown.current) {
        ctx.fillStyle = 'rgba(0, 212, 255, 0.02)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown, { passive: true });
    window.addEventListener("touchend", handleMouseUp);

    // Set initial cursor
    canvas.style.cursor = 'grab';

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

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 bg-black transition-all duration-300" 
    />
  );
}