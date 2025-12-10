import React, { useEffect, useRef, useState } from "react";

export default function InteractiveWebGrid() {
  const canvasRef = useRef(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollPos = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let nodes = [];
    const nodeCount = 50;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1
        });
      }
    };

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };

    const handleScroll = () => {
      scrollPos.current = window.scrollY;
    };

    const handleOrientation = (e) => {
      setDeviceOrientation({
        beta: e.beta || 0,
        gamma: e.gamma || 0
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions based on inputs
      nodes.forEach((node) => {
        // Mouse attraction
        const dx = mousePos.current.x - node.x;
        const dy = mousePos.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 300) {
          const force = (300 - dist) / 300;
          node.vx += (dx / dist) * force * 0.05;
          node.vy += (dy / dist) * force * 0.05;
        }

        // Device tilt effect (mobile)
        node.vx += deviceOrientation.gamma * 0.001;
        node.vy += deviceOrientation.beta * 0.001;

        // Scroll effect
        node.vy += scrollPos.current * 0.0001;

        // Apply velocity
        node.x += node.vx;
        node.y += node.vy;

        // Damping
        node.vx *= 0.95;
        node.vy *= 0.95;

        // Boundary wrap
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;
      });

      // Draw connections (web lines)
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const opacity = 1 - dist / 200;
            
            // Royal blue to indigo to violet gradient
            const hue = 220 + (dist / 200) * 60; // 220 (royal blue) to 280 (violet)
            const saturation = 70 + (opacity * 30);
            const lightness = 50 + (opacity * 20);
            
            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity * 0.4})`;
            ctx.lineWidth = opacity * 1.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw nodes with glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // Royal blue
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)'); // Indigo
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)'); // Violet fade
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core node
        ctx.fillStyle = 'rgba(147, 197, 253, 0.9)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("deviceorientation", handleOrientation);

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("deviceorientation", handleOrientation);
      cancelAnimationFrame(animationFrameId);
    };
  }, [deviceOrientation]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 0,
        mixBlendMode: "screen",
        opacity: 0.6
      }}
    />
  );
}