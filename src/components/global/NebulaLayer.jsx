/**
 * GlyphLock Nebula Layer - Site-Wide Background System
 * Renders behind all cards/content
 * z-index: 0-1 (starfield + animated layer)
 */

import React, { useEffect, useRef, useState } from 'react';

export default function NebulaLayer({ intensity = 0.5 }) {
  const canvasRef = useRef(null);
  const starsCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isSlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    setIsLowPower(isMobile || isSlowDevice);

    const canvas = canvasRef.current;
    const starsCanvas = starsCanvasRef.current;
    if (!canvas || !starsCanvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const starsCtx = starsCanvas.getContext('2d', { alpha: true });
    
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsCanvas.width = window.innerWidth;
      starsCanvas.height = window.innerHeight;
      
      initNodes();
      renderStarfield();
    };

    let nodes = [];
    const nodeCount = isLowPower ? 60 : 100;
    
    class NebulaNode {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.radius = Math.random() * 1.8 + 0.8;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
        
        const colorIndex = Math.random();
        if (colorIndex > 0.7) {
          this.color = 'rgba(6, 182, 212, ';
        } else if (colorIndex > 0.4) {
          this.color = 'rgba(59, 130, 246, ';
        } else {
          this.color = 'rgba(30, 64, 175, ';
        }
      }

      update() {
        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX < -50) this.baseX = canvas.width + 50;
        if (this.baseX > canvas.width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = canvas.height + 50;
        if (this.baseY > canvas.height + 50) this.baseY = -50;

        const dx = mouseX - this.baseX;
        const dy = mouseY - this.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 400) {
          const force = (400 - dist) / 400;
          const smoothForce = force * force * 0.8;
          this.x += (this.baseX + dx * smoothForce - this.x) * 0.25;
          this.y += (this.baseY + dy * smoothForce - this.y) * 0.25;
        } else {
          this.x += (this.baseX - this.x) * 0.08;
          this.y += (this.baseY - this.y) * 0.08;
        }

        this.pulse += this.pulseSpeed;
      }

      draw() {
        const pulseIntensity = Math.sin(this.pulse) * 0.4 + 0.6;
        const currentRadius = this.radius * pulseIntensity;

        const glowGradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, currentRadius * 4
        );
        glowGradient.addColorStop(0, this.color + (0.6 * intensity) + ')');
        glowGradient.addColorStop(0.4, this.color + (0.3 * intensity) + ')');
        glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color + (0.8 * intensity) + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new NebulaNode());
      }
    }

    function renderStarfield() {
      starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
      const starCount = isLowPower ? 150 : 250;
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * starsCanvas.width;
        const y = Math.random() * starsCanvas.height;
        const radius = Math.random() * 1.2;
        const opacity = Math.random() * 0.4 + 0.1;

        starsCtx.fillStyle = `rgba(255, 255, 255, ${opacity * intensity})`;
        starsCtx.beginPath();
        starsCtx.arc(x, y, radius, 0, Math.PI * 2);
        starsCtx.fill();

        if (Math.random() > 0.95) {
          const glowGradient = starsCtx.createRadialGradient(x, y, 0, x, y, radius * 3);
          glowGradient.addColorStop(0, `rgba(6, 182, 212, ${opacity * 0.6 * intensity})`);
          glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          starsCtx.fillStyle = glowGradient;
          starsCtx.beginPath();
          starsCtx.arc(x, y, radius * 3, 0, Math.PI * 2);
          starsCtx.fill();
        }
      }
    }

    const handlePointerMove = (e) => {
      const x = e.clientX || (e.touches && e.touches[0]?.clientX);
      const y = e.clientY || (e.touches && e.touches[0]?.clientY);
      if (x !== undefined && y !== undefined) {
        mouseX = x;
        mouseY = y;
      }
    };

    function animate() {
      time += 0.005;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Nebula clouds
      const nebula1 = ctx.createRadialGradient(
        canvas.width * 0.25 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.3 + Math.cos(time * 0.3) * 80,
        0,
        canvas.width * 0.25,
        canvas.height * 0.3,
        canvas.width * 0.6
      );
      nebula1.addColorStop(0, `rgba(30, 58, 138, ${0.12 * intensity})`);
      nebula1.addColorStop(0.4, `rgba(59, 130, 246, ${0.08 * intensity})`);
      nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const nebula2 = ctx.createRadialGradient(
        canvas.width * 0.75 + Math.cos(time * 0.4) * 120,
        canvas.height * 0.65 + Math.sin(time * 0.6) * 90,
        0,
        canvas.width * 0.75,
        canvas.height * 0.65,
        canvas.width * 0.5
      );
      nebula2.addColorStop(0, `rgba(6, 182, 212, ${0.1 * intensity})`);
      nebula2.addColorStop(0.5, `rgba(59, 130, 246, ${0.06 * intensity})`);
      nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node) => {
        node.update();
        node.draw();
      });

      // Neural connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < (isLowPower ? 120 : 160)) {
            const opacity = (1 - distance / (isLowPower ? 120 : 160)) * 0.4 * intensity;
            
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            );
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(6, 182, 212, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

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
  }, [intensity, isLowPower]);

  return (
    <>
      <canvas
        ref={starsCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: 0,
          background: '#000000'
        }}
      />
      
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
}