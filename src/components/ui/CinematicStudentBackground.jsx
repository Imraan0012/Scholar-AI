import React, { useEffect, useRef } from 'react';

export default function CinematicStudentBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle atmospheric dust/stardust particles in the light beam
    const particles = [];
    const particleCount = width < 768 ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.8 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.25, // Gentle upward drift
        alpha: 0.1 + Math.random() * 0.4,
        baseAlpha: 0.1 + Math.random() * 0.4,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'rgba(251, 191, 36, ' : 'rgba(56, 189, 248, ' // Warm gold or cool blue
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Wrap around screen
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const currentAlpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha + ')';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030712]">
      {/* ── CINEMATIC PHOTOGRAPHIC SCENE ─────────────────────────────────── */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[12000ms] ease-in-out scale-100 hover:scale-105"
        style={{
          backgroundImage: 'url(/images/scholar_student_cinematic_bg.jpg)',
          filter: 'brightness(0.72) contrast(1.08)'
        }}
      />

      {/* ── AMBIENT ATMOSPHERIC DUST & LIGHT PARTICLES ────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* ── CINEMATIC MULTI-LAYER DARK VEIL & GRADIENT OVERLAYS ──────────── */}
      {/* 1. Deep Midnight Base Tint */}
      <div className="absolute inset-0 bg-[#030712]/45 mix-blend-multiply pointer-events-none" />

      {/* 2. Top Navigation Veil */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#030712]/95 via-[#030712]/60 to-transparent pointer-events-none" />

      {/* 3. Center Negative Space (Guarantees 100% Crisp Headline Contrast) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 38%, rgba(3, 7, 18, 0.78) 0%, rgba(3, 7, 18, 0.45) 50%, rgba(3, 7, 18, 0.2) 100%)'
        }}
      />

      {/* 4. Bottom Fade for Page Continuation */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#030712] via-[#030712]/80 to-transparent pointer-events-none" />
    </div>
  );
}
