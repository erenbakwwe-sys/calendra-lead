"use client";

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
  highlight?: boolean;
}

export function Card3D({
  children,
  className = "",
  glowColor = "rgba(212, 175, 55, 0.25)",
  intensity = 15,
  highlight = false,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -intensity;
    const rY = ((x - centerX) / centerX) * intensity;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${glarePos.opacity > 0 ? 1.02 : 1}, ${glarePos.opacity > 0 ? 1.02 : 1}, 1)`,
          transformStyle: "preserve-3d",
          transition: glarePos.opacity === 0 ? "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
        }}
        className={cn(
          "relative rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer",
          highlight
            ? "bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border-gold-500/60 shadow-gold-md"
            : "bg-dark-900/90 border-white/[0.08] hover:border-gold-500/40 shadow-card-dark",
          className
        )}
        {...props}
      >
        {/* Holographic Specular Glare following mouse */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 80%)`,
          }}
        />

        {/* Ambient Top Glow Line */}
        <div className="pointer-events-none absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

        {/* Inner Content with 3D Depth */}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
