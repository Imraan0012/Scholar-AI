import React, { useEffect, useRef } from 'react';

export default function LightScholarshipBackground() {
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

    // Mouse parallax
    const mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    // ── FLOATING ACADEMIC STUDY & MERIT ELEMENTS ───────────────────────────
    const elements = [];
    const elementCount = width < 768 ? 10 : 18;
    const types = ['book', 'mortarboard', 'scroll', 'award', 'document'];

    for (let i = 0; i < elementCount; i++) {
      // Keep mostly towards the sides/periphery to maintain clean center
      const side = i % 2 === 0;
      const posX = side ? width * (0.04 + Math.random() * 0.25) : width * (0.72 + Math.random() * 0.24);
      const posY = height * (0.1 + Math.random() * 0.8);

      elements.push({
        baseX: posX,
        baseY: posY,
        x: posX,
        y: posY,
        size: 26 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.012 + Math.random() * 0.015,
        type: types[i % types.length],
        color: i % 3 === 0 ? 'rgba(37, 99, 235, ' : i % 3 === 1 ? 'rgba(16, 185, 129, ' : 'rgba(245, 158, 11, ',
        alpha: 0.08 + Math.random() * 0.12
      });
    }

    // ── ETHEREAL LIGHT RIBBONS / EDUCATION WAVES ───────────────────────────
    const ribbons = [
      {
        baseY: 0.3,
        amplitude: 80,
        freq: 0.0016,
        speed: 0.0007,
        phase: 0,
        colorStart: 'rgba(59, 130, 246, 0.14)',
        colorMid: 'rgba(147, 197, 253, 0.08)',
        colorEnd: 'transparent'
      },
      {
        baseY: 0.52,
        amplitude: 110,
        freq: 0.0012,
        speed: 0.0005,
        phase: Math.PI * 0.5,
        colorStart: 'rgba(16, 185, 129, 0.12)',
        colorMid: 'rgba(167, 243, 208, 0.06)',
        colorEnd: 'transparent'
      },
      {
        baseY: 0.75,
        amplitude: 90,
        freq: 0.0018,
        speed: 0.0008,
        phase: Math.PI * 0.9,
        colorStart: 'rgba(245, 158, 11, 0.10)',
        colorMid: 'rgba(253, 230, 138, 0.05)',
        colorEnd: 'transparent'
      }
    ];

    // ── DRAWING SILHOUETTE GLYPHS ──────────────────────────────────────────

    // Draw Minimal Open Book
    const drawBook = (cx, cy, size, rot, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = color + alpha + ')';
      ctx.fillStyle = color + alpha * 0.2 + ')';
      ctx.lineWidth = 1.2;

      const s = size * 0.6;
      ctx.beginPath();
      // Left page curve
      ctx.moveTo(0, s * 0.4);
      ctx.quadraticCurveTo(-s * 0.5, s * 0.1, -s, s * 0.3);
      ctx.lineTo(-s, -s * 0.5);
      ctx.quadraticCurveTo(-s * 0.5, -s * 0.7, 0, -s * 0.4);
      // Right page curve
      ctx.quadraticCurveTo(s * 0.5, -s * 0.7, s, -s * 0.5);
      ctx.lineTo(s, s * 0.3);
      ctx.quadraticCurveTo(s * 0.5, s * 0.1, 0, s * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spine
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.4);
      ctx.lineTo(0, s * 0.4);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Minimal Graduation Mortarboard
    const drawMortarboard = (cx, cy, size, rot, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = color + alpha + ')';
      ctx.fillStyle = color + alpha * 0.22 + ')';
      ctx.lineWidth = 1.2;

      const s = size * 0.7;
      // Diamond top
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.4);
      ctx.lineTo(s * 0.7, 0);
      ctx.lineTo(0, s * 0.4);
      ctx.lineTo(-s * 0.7, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cap skull base
      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.35, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Tassel
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(s * 0.6, s * 0.35);
      ctx.lineTo(s * 0.6, s * 0.65);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Minimal Scholarship Scroll
    const drawScroll = (cx, cy, size, rot, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = color + alpha + ')';
      ctx.fillStyle = color + alpha * 0.18 + ')';
      ctx.lineWidth = 1.2;

      const w = size * 0.8;
      const h = size * 0.5;

      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 4);
      ctx.fill();
      ctx.stroke();

      // Ribbon wrap in center
      ctx.beginPath();
      ctx.moveTo(-w * 0.1, -h / 2);
      ctx.lineTo(-w * 0.1, h / 2);
      ctx.moveTo(w * 0.1, -h / 2);
      ctx.lineTo(w * 0.1, h / 2);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Minimal Scholarship Document Card
    const drawDocument = (cx, cy, size, rot, color, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = color + alpha + ')';
      ctx.fillStyle = color + alpha * 0.16 + ')';
      ctx.lineWidth = 1.2;

      const w = size * 0.7;
      const h = size * 0.9;
      const r = 3;

      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, r);
      ctx.fill();
      ctx.stroke();

      // Text lines
      ctx.beginPath();
      ctx.moveTo(-w * 0.3, -h * 0.25);
      ctx.lineTo(w * 0.3, -h * 0.25);
      ctx.moveTo(-w * 0.3, -h * 0.05);
      ctx.lineTo(w * 0.2, -h * 0.05);
      ctx.moveTo(-w * 0.3, h * 0.15);
      ctx.lineTo(w * 0.3, h * 0.15);
      ctx.stroke();

      // Rupee seal
      ctx.beginPath();
      ctx.arc(w * 0.2, h * 0.25, 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    // ── ANIMATION LOOP ─────────────────────────────────────────────────────
    const render = () => {
      time += 1;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const mouseShiftX = (mouse.x / width - 0.5) * 40;
      const mouseShiftY = (mouse.y / height - 0.5) * 30;

      // 1. Soft Pearl Light Canvas
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Soft Sunlit Watercolor Blobs (Education Aura)
      // Top-Left Royal Blue Glow
      const grad1 = ctx.createRadialGradient(
        width * 0.15 + mouseShiftX,
        height * 0.25 + mouseShiftY,
        30,
        width * 0.15,
        height * 0.25,
        width * 0.45
      );
      grad1.addColorStop(0, 'rgba(59, 130, 246, 0.16)');
      grad1.addColorStop(0.6, 'rgba(219, 234, 254, 0.08)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Bottom-Right Mint Green (Opportunity/Success) Glow
      const grad2 = ctx.createRadialGradient(
        width * 0.85 - mouseShiftX,
        height * 0.65 - mouseShiftY,
        30,
        width * 0.85,
        height * 0.65,
        width * 0.45
      );
      grad2.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
      grad2.addColorStop(0.6, 'rgba(209, 250, 229, 0.06)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Top-Right Warm Amber (Achievement/Graduation) Glow
      const grad3 = ctx.createRadialGradient(
        width * 0.78 + mouseShiftX * 0.5,
        height * 0.2 - mouseShiftY * 0.5,
        20,
        width * 0.78,
        height * 0.2,
        width * 0.38
      );
      grad3.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      grad3.addColorStop(0.6, 'rgba(254, 243, 199, 0.05)');
      grad3.addColorStop(1, 'transparent');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // 3. Ethereal Flowing Light Ribbons
      ribbons.forEach((rib, index) => {
        const curY = height * rib.baseY + Math.sin(time * 0.0012 + index) * 20 + mouseShiftY;
        const curAmp = rib.amplitude + Math.cos(time * 0.0016 + index) * 15;
        const curSpeed = time * rib.speed;

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, curY);

        const step = Math.max(14, Math.floor(width / 60));
        for (let x = 0; x <= width + step; x += step) {
          const y1 = Math.sin(x * rib.freq + curSpeed + rib.phase) * curAmp;
          const y2 = Math.cos(x * rib.freq * 1.5 - curSpeed * 0.6 + rib.phase) * (curAmp * 0.35);
          ctx.lineTo(x, curY + y1 + y2);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const ribGrad = ctx.createLinearGradient(0, curY - curAmp, width, curY + curAmp * 2);
        ribGrad.addColorStop(0, rib.colorStart);
        ribGrad.addColorStop(0.6, rib.colorMid);
        ribGrad.addColorStop(1, rib.colorEnd);

        ctx.fillStyle = ribGrad;
        ctx.fill();

        // Delicate crest line
        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          const y1 = Math.sin(x * rib.freq + curSpeed + rib.phase) * curAmp;
          const y2 = Math.cos(x * rib.freq * 1.5 - curSpeed * 0.6 + rib.phase) * (curAmp * 0.35);
          const y = curY + y1 + y2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rib.colorStart;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 4. Render Subtle Floating Academic & Scholarship Glyphs
      elements.forEach((el) => {
        el.floatPhase += el.floatSpeed;
        el.rotation += el.rotSpeed;

        const floatX = el.baseX + Math.sin(el.floatPhase) * 12 + mouseShiftX * 0.4;
        const floatY = el.baseY + Math.cos(el.floatPhase * 0.8) * 14 + mouseShiftY * 0.4;

        if (el.type === 'book') {
          drawBook(floatX, floatY, el.size, el.rotation, el.color, el.alpha);
        } else if (el.type === 'mortarboard') {
          drawMortarboard(floatX, floatY, el.size, el.rotation, el.color, el.alpha);
        } else if (el.type === 'scroll') {
          drawScroll(floatX, floatY, el.size, el.rotation, el.color, el.alpha);
        } else {
          drawDocument(floatX, floatY, el.size, el.rotation, el.color, el.alpha);
        }
      });

      // 5. Center Clean Clarity Mask
      // Keeps the center foreground crystal clear for hero headings and search inputs
      const centerMask = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        width * 0.08,
        width / 2,
        height * 0.45,
        width * 0.55
      );
      centerMask.addColorStop(0, 'rgba(248, 250, 252, 0.7)');
      centerMask.addColorStop(0.6, 'rgba(248, 250, 252, 0.3)');
      centerMask.addColorStop(1, 'transparent');
      ctx.fillStyle = centerMask;
      ctx.fillRect(0, 0, width, height);

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
      style={{ background: '#F8FAFC' }}
    />
  );
}
