import React, { useEffect, useRef } from 'react';

export default function LiquidSilkBackground() {
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

    let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    // ── HARMONIOUS AURORA LIGHT WAVES ─────────────────────────────────────
    const waves = [
      {
        baseY: 0.32,
        amplitude: 150,
        frequency: 0.0016,
        speed: 0.0009,
        colorStart: 'rgba(37, 99, 235, 0.32)',   // Royal Blue
        colorMid: 'rgba(56, 189, 248, 0.24)',    // Cyan Sky
        colorEnd: 'transparent',
        phase: 0
      },
      {
        baseY: 0.52,
        amplitude: 190,
        frequency: 0.0012,
        speed: 0.0007,
        colorStart: 'rgba(79, 70, 229, 0.28)',   // Deep Indigo
        colorMid: 'rgba(13, 148, 136, 0.20)',    // Emerald / Teal
        colorEnd: 'transparent',
        phase: Math.PI * 0.45
      },
      {
        baseY: 0.74,
        amplitude: 170,
        frequency: 0.0018,
        speed: 0.001,
        colorStart: 'rgba(13, 148, 136, 0.24)',   // Cyan / Teal
        colorMid: 'rgba(37, 99, 235, 0.18)',     // Bright Blue
        colorEnd: 'transparent',
        phase: Math.PI * 0.85
      },
      {
        baseY: 0.22,
        amplitude: 130,
        frequency: 0.002,
        speed: 0.0008,
        colorStart: 'rgba(99, 102, 241, 0.22)',   // Electric Indigo
        colorMid: 'rgba(56, 189, 248, 0.16)',    // Soft Cyan
        colorEnd: 'transparent',
        phase: Math.PI * 1.3
      }
    ];

    const render = () => {
      time += 1;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const mouseShiftX = (mouse.x / width - 0.5) * 60;
      const mouseShiftY = (mouse.y / height - 0.5) * 45;

      // 1. Deep Midnight Base Background
      ctx.fillStyle = '#030d17';
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Soft Glowing Nebulae (Deep Layer)
      const gradLeft = ctx.createRadialGradient(
        width * 0.2 + mouseShiftX,
        height * 0.3 + mouseShiftY,
        30,
        width * 0.2,
        height * 0.3,
        width * 0.6
      );
      gradLeft.addColorStop(0, 'rgba(30, 58, 138, 0.38)');
      gradLeft.addColorStop(0.5, 'rgba(15, 23, 42, 0.2)');
      gradLeft.addColorStop(1, 'transparent');
      ctx.fillStyle = gradLeft;
      ctx.fillRect(0, 0, width, height);

      const gradRight = ctx.createRadialGradient(
        width * 0.82 - mouseShiftX,
        height * 0.62 - mouseShiftY,
        30,
        width * 0.82,
        height * 0.62,
        width * 0.55
      );
      gradRight.addColorStop(0, 'rgba(13, 148, 136, 0.28)');
      gradRight.addColorStop(0.5, 'rgba(30, 27, 75, 0.15)');
      gradRight.addColorStop(1, 'transparent');
      ctx.fillStyle = gradRight;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Fluid Aurora Waves
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      waves.forEach((w, index) => {
        const currentBaseY = height * w.baseY + Math.sin(time * 0.001 + index) * 28 + mouseShiftY;
        const currentAmp = w.amplitude + Math.cos(time * 0.0014 + index) * 22;
        const currentFreq = w.frequency;
        const currentSpeed = time * w.speed;

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, currentBaseY);

        const step = Math.max(12, Math.floor(width / 70));
        for (let x = 0; x <= width + step; x += step) {
          const y1 = Math.sin(x * currentFreq + currentSpeed + w.phase) * currentAmp;
          const y2 = Math.cos(x * currentFreq * 1.5 - currentSpeed * 0.7 + w.phase) * (currentAmp * 0.45);
          const y3 = Math.sin(x * currentFreq * 0.6 + currentSpeed * 1.1) * (currentAmp * 0.35);

          const y = currentBaseY + y1 + y2 + y3;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, currentBaseY - currentAmp, width, currentBaseY + currentAmp * 1.8);
        waveGrad.addColorStop(0, w.colorStart);
        waveGrad.addColorStop(0.55, w.colorMid);
        waveGrad.addColorStop(1, w.colorEnd);

        ctx.fillStyle = waveGrad;
        ctx.fill();

        // Glowing Crest Stroke
        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          const y1 = Math.sin(x * currentFreq + currentSpeed + w.phase) * currentAmp;
          const y2 = Math.cos(x * currentFreq * 1.5 - currentSpeed * 0.7 + w.phase) * (currentAmp * 0.45);
          const y3 = Math.sin(x * currentFreq * 0.6 + currentSpeed * 1.1) * (currentAmp * 0.35);
          const y = currentBaseY + y1 + y2 + y3;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w.colorMid.replace(/[\d.]+\)$/, '0.35)');
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      ctx.restore();

      // 4. Center Vignette Mask for Perfect Contrast
      const centerVignette = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        width * 0.08,
        width / 2,
        height * 0.45,
        width * 0.6
      );
      centerVignette.addColorStop(0, 'rgba(3, 13, 23, 0.75)');
      centerVignette.addColorStop(0.6, 'rgba(3, 13, 23, 0.35)');
      centerVignette.addColorStop(1, 'transparent');
      ctx.fillStyle = centerVignette;
      ctx.fillRect(0, 0, width, height);

      // Top Header Soft Gradient
      const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.2);
      topFade.addColorStop(0, 'rgba(3, 13, 23, 0.85)');
      topFade.addColorStop(1, 'transparent');
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, width, height * 0.2);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: '#030d17' }}
    />
  );
}
