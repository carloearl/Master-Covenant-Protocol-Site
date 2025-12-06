/**
 * GlyphLock Cursor Orb - Always-On-Top Glow Ball
 * Tracks cursor site-wide with smooth easing
 * Guaranteed z-index: 9999999
 */

import React, { useEffect, useRef } from 'react';

export default function CursorOrb() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      mouseRef.current.x = canvas.width / 2;
      mouseRef.current.y = canvas.height / 2;
      mouseRef.current.targetX = canvas.width / 2;
      mouseRef.current.targetY = canvas.height / 2;
    };

    const handlePointerMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      const y = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (x !== undefined && y !== undefined) {
        mouseRef.current.targetX = x;
        mouseRef.current.targetY = y;
      }
    };

    function animate() {
      timeRef.current += 0.005;
      
      // INSTANT tracking - no lag
      mouseRef.current.x = mouseRef.current.targetX;
      mouseRef.current.y = mouseRef.current.targetY;

      const x = mouseRef.current.x;
      const y = mouseRef.current.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animate color (cyan → blue spectrum)
      const hue = 190 + Math.sin(timeRef.current * 2) * 40;

      // Outer glow (smaller - 60px diameter)
      const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, 60);
      outerGlow.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.7)`);
      outerGlow.addColorStop(0.4, `hsla(${hue}, 95%, 65%, 0.45)`);
      outerGlow.addColorStop(0.7, `hsla(${hue + 15}, 90%, 60%, 0.2)`);
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(x, y, 60, 0, Math.PI * 2);
      ctx.fill();

      // Mid glow (35px diameter)
      const midGlow = ctx.createRadialGradient(x, y, 0, x, y, 35);
      midGlow.addColorStop(0, `hsla(${hue}, 100%, 75%, 0.85)`);
      midGlow.addColorStop(0.5, `hsla(${hue}, 95%, 70%, 0.55)`);
      midGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = midGlow;
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fill();

      // Bright center core (smaller - 12px)
      const centerGlow = ctx.createRadialGradient(x, y, 0, x, y, 12);
      centerGlow.addColorStop(0, `hsla(${hue}, 100%, 85%, 1)`);
      centerGlow.addColorStop(0.6, `hsla(${hue}, 100%, 75%, 0.75)`);
      centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 9999999,
        mixBlendMode: 'screen'
      }}
    />
  );
}