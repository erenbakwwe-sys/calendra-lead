"use client";

import { useEffect, useRef } from 'react';

interface Canvas3DNetworkProps {
  className?: string;
  particleCount?: number;
  interactive?: boolean;
}

export function Canvas3DNetwork({ className = "", particleCount = 45, interactive = true }: Canvas3DNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Point definitions on a sphere
    interface Point3D {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      radius: number;
      speed: number;
      pulse: number;
      isHub?: boolean;
      label?: string;
    }

    const radius = Math.min(width, height) * 0.42;
    const points: Point3D[] = [];

    // Create Hubs: Frankfurt (Gateway), Berlin, Istanbul, Izmir
    points.push({
      x: 0, y: 0, z: 0,
      baseX: -radius * 0.35, baseY: -radius * 0.3, baseZ: radius * 0.4,
      radius: 4.5, speed: 0.005, pulse: 0, isHub: true, label: "Frankfurt SIP"
    });
    points.push({
      x: 0, y: 0, z: 0,
      baseX: -radius * 0.1, baseY: -radius * 0.45, baseZ: radius * 0.35,
      radius: 3.5, speed: 0.005, pulse: 0, isHub: true, label: "Berlin Hub"
    });
    points.push({
      x: 0, y: 0, z: 0,
      baseX: radius * 0.4, baseY: radius * 0.25, baseZ: radius * 0.25,
      radius: 4, speed: 0.005, pulse: 0, isHub: true, label: "Istanbul Ops"
    });
    points.push({
      x: 0, y: 0, z: 0,
      baseX: radius * 0.3, baseY: radius * 0.45, baseZ: radius * 0.3,
      radius: 3.5, speed: 0.005, pulse: 0, isHub: true, label: "Izmir CC"
    });

    // Create cloud points around sphere
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * (0.8 + Math.random() * 0.35);

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = r * Math.sin(phi) * Math.sin(theta);
      const pz = r * Math.cos(phi);

      points.push({
        x: px, y: py, z: pz,
        baseX: px, baseY: py, baseZ: pz,
        radius: Math.random() * 2 + 1,
        speed: 0.004 + Math.random() * 0.003,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Packet transmission simulation
    interface Packet {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
    }
    const packets: Packet[] = [
      { fromIndex: 0, toIndex: 2, progress: 0, speed: 0.015 },
      { fromIndex: 0, toIndex: 3, progress: 0.5, speed: 0.012 },
      { fromIndex: 1, toIndex: 0, progress: 0.2, speed: 0.018 },
      { fromIndex: 2, toIndex: 3, progress: 0.7, speed: 0.014 }
    ];

    let angleX = 0.2;
    let angleY = 0;
    let targetAngleX = 0.2;
    let targetAngleY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / width - 0.5;
      const my = (e.clientY - rect.top) / height - 0.5;
      targetAngleY = mx * 1.2;
      targetAngleX = -my * 1.2;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      angleY += (targetAngleY - angleY) * 0.05 + 0.003; // continuous gentle spin
      angleX += (targetAngleX - angleX) * 0.05;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 380;

      // Project 3D to 2D
      const projected = points.map((p) => {
        // Rotate around Y
        let x1 = p.baseX * cosY - p.baseZ * sinY;
        let z1 = p.baseZ * cosY + p.baseX * sinY;

        // Rotate around X
        let y2 = p.baseY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.baseY * sinX;

        // Perspective scale
        const scale = fov / (fov + z2);
        const x2D = centerX + x1 * scale;
        const y2D = centerY + y2 * scale;
        const alpha = Math.max(0.15, Math.min(1, (z2 + radius) / (radius * 1.8)));

        return { x2D, y2D, z: z2, scale, alpha, p };
      });

      // Sort by Z for realistic depth
      projected.sort((a, b) => a.z - b.z);

      // Draw connection lines between nearby points
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x2D - p2.x2D;
          const dy = p1.y2D - p2.y2D;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = (p1.p.isHub || p2.p.isHub) ? 140 : 75;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * Math.min(p1.alpha, p2.alpha) * 0.45;
            ctx.beginPath();
            ctx.moveTo(p1.x2D, p1.y2D);
            ctx.lineTo(p2.x2D, p2.y2D);

            if (p1.p.isHub && p2.p.isHub) {
              // Golden Telephony Trunk Connection
              ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha * 1.6})`;
              ctx.lineWidth = 1.8;
            } else {
              ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha * 0.6})`;
              ctx.lineWidth = 0.8;
            }
            ctx.stroke();
          }
        }
      }

      // Draw traveling packet bursts between hubs
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) pkt.progress = 0;

        const from = projected.find((item) => item.p === points[pkt.fromIndex]);
        const to = projected.find((item) => item.p === points[pkt.toIndex]);

        if (from && to) {
          const curX = from.x2D + (to.x2D - from.x2D) * pkt.progress;
          const curY = from.y2D + (to.y2D - from.y2D) * pkt.progress;

          // Glowing data packet
          ctx.beginPath();
          ctx.arc(curX, curY, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#FFF0BA";
          ctx.shadowColor = "#D4AF37";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw 3D nodes
      projected.forEach(({ x2D, y2D, alpha, scale, p }) => {
        ctx.beginPath();
        const r = p.radius * scale;
        ctx.arc(x2D, y2D, Math.max(1, r), 0, Math.PI * 2);

        if (p.isHub) {
          // Hub node with outer pulsing glow
          ctx.fillStyle = `rgba(255, 230, 130, ${alpha})`;
          ctx.shadowColor = "#D4AF37";
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw label
          if (p.label && alpha > 0.4) {
            ctx.font = "bold 9px JetBrains Mono, monospace";
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.fillText(p.label, x2D + 8, y2D + 3);
          }
        } else {
          ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.75})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block pointer-events-auto ${className}`}
    />
  );
}
