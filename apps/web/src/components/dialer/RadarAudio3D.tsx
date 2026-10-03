"use client";

import { useEffect, useRef } from 'react';

interface RadarAudio3DProps {
  isActive: boolean;
  isMuted?: boolean;
  isHeld?: boolean;
}

export function RadarAudio3D({ isActive, isMuted = false, isHeld = false }: RadarAudio3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;
    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const barCount = 36;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.28;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.04;

      // Draw radar background circles
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      [0.6, 0.85, 1.15, 1.45].forEach((mult) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * mult, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Rotating radar beam
      if (isActive && !isHeld) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(tick * 0.8);
        const grad = ctx.createLinearGradient(0, 0, baseRadius * 1.5, 0);
        grad.addColorStop(0, "rgba(212, 175, 55, 0.25)");
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, baseRadius * 1.5, -0.4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Draw 36 radial 3D frequency bars
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        let barHeight = 8;

        if (isActive && !isHeld && !isMuted) {
          const wave = Math.sin(tick * 3 + i * 0.8) * Math.cos(tick * 1.5 + i * 0.5);
          barHeight = 10 + Math.abs(wave) * 26;
        } else if (isHeld) {
          barHeight = 4 + Math.sin(tick * 2 + i) * 2;
        }

        const x1 = centerX + Math.cos(angle) * baseRadius;
        const y1 = centerY + Math.sin(angle) * baseRadius;
        const x2 = centerX + Math.cos(angle) * (baseRadius + barHeight);
        const y2 = centerY + Math.sin(angle) * (baseRadius + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineWidth = 2.5;

        if (isMuted) {
          ctx.strokeStyle = "rgba(245, 158, 11, 0.7)"; // Amber muted
        } else if (isHeld) {
          ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"; // Blue held
        } else {
          // Luxury Gold glow gradient
          const barGrad = ctx.createLinearGradient(x1, y1, x2, y2);
          barGrad.addColorStop(0, "#D4AF37");
          barGrad.addColorStop(1, "#FFF4CC");
          ctx.strokeStyle = barGrad;
          ctx.shadowColor = "#D4AF37";
          ctx.shadowBlur = barHeight > 18 ? 8 : 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Center Core
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = "#0C0E12";
      ctx.fill();
      ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isActive, isMuted, isHeld]);

  return (
    <div className="relative w-full h-44 flex items-center justify-center overflow-hidden rounded-2xl bg-dark-950/80 border border-white/[0.06]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Center Status Text */}
      <div className="relative z-10 text-center select-none pointer-events-none">
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-gold-400 block">
          {isHeld ? 'PAUSIERT (HOLD)' : isMuted ? 'STUMM (MUTED)' : 'HD WEBRTC STREAM'}
        </span>
        <span className="text-xs font-mono font-bold text-gray-200">
          Opus 48kHz • 24ms
        </span>
      </div>
    </div>
  );
}
