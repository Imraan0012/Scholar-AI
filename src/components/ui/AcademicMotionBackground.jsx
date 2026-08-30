import React, { useEffect, useRef } from 'react';

export default function AcademicMotionBackground() {
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

    // ── AUTHENTIC SCHOLARSHIP OPPORTUNITY CARDS ────────────────────────────
    const scholarshipCards = [
      {
        title: 'NSP Central Sector Scheme',
        provider: 'Ministry of Education, Govt. of India',
        amount: '₹20,000 / year',
        tag: 'Merit-cum-Means',
        x: width * 0.08,
        y: height * 0.22,
        baseX: width * 0.08,
        baseY: height * 0.22,
        vx: 0.12,
        vy: -0.08,
        badgeColor: '#2563eb'
      },
      {
        title: 'Tata Trust Scholarship',
        provider: 'Higher Education Grant',
        amount: 'Up to ₹2,00,000',
        tag: 'STEM & Medical',
        x: width * 0.76,
        y: height * 0.18,
        baseX: width * 0.76,
        baseY: height * 0.18,
        vx: -0.1,
        vy: 0.09,
        badgeColor: '#059669'
      },
      {
        title: 'AICTE Pragati Scheme',
        provider: 'Technical Education Ministry',
        amount: '₹50,000 / year',
        tag: 'Girl Students in STEM',
        x: width * 0.06,
        y: height * 0.65,
        baseX: width * 0.06,
        baseY: height * 0.65,
        vx: 0.09,
        vy: 0.11,
        badgeColor: '#7c3aed'
      },
      {
        title: 'MahaDBT Post-Matric Grant',
        provider: 'Govt. of Maharashtra',
        amount: '100% Tuition Waiver',
        tag: 'State Domicile',
        x: width * 0.78,
        y: height * 0.68,
        baseX: width * 0.78,
        baseY: height * 0.68,
        vx: -0.12,
        vy: -0.07,
        badgeColor: '#0284c7'
      },
      {
        title: 'Reliance Foundation Grant',
        provider: 'Undergraduate Excellence',
        amount: '₹2,00,000 Grant',
        tag: 'Merit-Based',
        x: width * 0.14,
        y: height * 0.88,
        baseX: width * 0.14,
        baseY: height * 0.88,
        vx: 0.08,
        vy: -0.09,
        badgeColor: '#ea580c'
      },
      {
        title: 'Aditya Birla Scholarship',
        provider: 'Premier Institutes Grant',
        amount: 'Full Course Fee',
        tag: 'Engineering / Law',
        x: width * 0.72,
        y: height * 0.86,
        baseX: width * 0.72,
        baseY: height * 0.86,
        vx: -0.09,
        vy: 0.08,
        badgeColor: '#059669'
      }
    ];

    // ── FLOATING ACADEMIC MOTIFS (Mortarboards, Scrolls, Books) ────────────
    const motifs = [];
    const motifTypes = ['mortarboard', 'scroll', 'book'];
    for (let i = 0; i < 14; i++) {
      const isLeft = i % 2 === 0;
      const px = isLeft ? width * (0.02 + Math.random() * 0.28) : width * (0.7 + Math.random() * 0.28);
      const py = height * (0.08 + Math.random() * 0.84);
      motifs.push({
        baseX: px,
        baseY: py,
        x: px,
        y: py,
        size: 22 + Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        floatPhase: Math.random() * Math.PI * 2,
        floatSpeed: 0.01 + Math.random() * 0.015,
        type: motifTypes[i % motifTypes.length],
        alpha: 0.08 + Math.random() * 0.12
      });
    }

    // ── DRAWING FUNCTIONS ──────────────────────────────────────────────────

    // Draw Realistic Floating Scholarship Application Card
    const drawScholarshipCard = (card, mouseShiftX, mouseShiftY) => {
      ctx.save();

      const cardW = width < 768 ? 200 : 250;
      const cardH = 88;
      const x = card.x + mouseShiftX;
      const y = card.y + mouseShiftY;

      // Soft Card Shadow
      ctx.shadowColor = 'rgba(15, 23, 42, 0.06)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;

      // Card Background (Frosted Glass Light Card)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.9)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Scholarship Tag / Category Badge
      ctx.fillStyle = card.badgeColor + '18'; // subtle tint
      ctx.beginPath();
      ctx.roundRect(x + 12, y + 10, cardW * 0.45, 18, 9);
      ctx.fill();

      ctx.font = '600 9px Inter, sans-serif';
      ctx.fillStyle = card.badgeColor;
      ctx.fillText(card.tag, x + 18, y + 22);

      // Amount / Reward pill on right
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'right';
      ctx.fillText(card.amount, x + cardW - 12, y + 23);

      ctx.textAlign = 'left';

      // Scholarship Title
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillStyle = '#1e293b';
      ctx.fillText(card.title, x + 12, y + 46);

      // Provider / Ministry
      ctx.font = '400 10px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(card.provider, x + 12, y + 62);

      // Verified green check indicator
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(x + cardW - 18, y + 68, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '700 8px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('✓', x + cardW - 18, y + 71);

      ctx.restore();
    };

    // Draw Minimal Mortarboard
    const drawMortarboard = (cx, cy, size, rot, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
      ctx.fillStyle = `rgba(37, 99, 235, ${alpha * 0.15})`;
      ctx.lineWidth = 1.2;

      const s = size * 0.65;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.4);
      ctx.lineTo(s * 0.75, 0);
      ctx.lineTo(0, s * 0.4);
      ctx.lineTo(-s * 0.75, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.35, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(s * 0.6, s * 0.35);
      ctx.lineTo(s * 0.6, s * 0.65);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Minimal Degree Scroll
    const drawScroll = (cx, cy, size, rot, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.15})`;
      ctx.lineWidth = 1.2;

      const w = size * 0.8;
      const h = size * 0.45;

      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 4);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-w * 0.12, -h / 2);
      ctx.lineTo(-w * 0.12, h / 2);
      ctx.moveTo(w * 0.12, -h / 2);
      ctx.lineTo(w * 0.12, h / 2);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Open Study Book
    const drawBook = (cx, cy, size, rot, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
      ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.15})`;
      ctx.lineWidth = 1.2;

      const s = size * 0.55;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.4);
      ctx.quadraticCurveTo(-s * 0.5, s * 0.1, -s, s * 0.3);
      ctx.lineTo(-s, -s * 0.5);
      ctx.quadraticCurveTo(-s * 0.5, -s * 0.7, 0, -s * 0.4);
      ctx.quadraticCurveTo(s * 0.5, -s * 0.7, s, -s * 0.5);
      ctx.lineTo(s, s * 0.3);
      ctx.quadraticCurveTo(s * 0.5, s * 0.1, 0, s * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -s * 0.4);
      ctx.lineTo(0, s * 0.4);
      ctx.stroke();

      ctx.restore();
    };

    // ── MAIN ANIMATION LOOP ────────────────────────────────────────────────
    const render = () => {
      time += 1;

      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      const mouseShiftX = (mouse.x / width - 0.5) * 35;
      const mouseShiftY = (mouse.y / height - 0.5) * 25;

      // 1. Soft Crisp Light Campus Canvas
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      // 2. Sunlight Atmosphere Glows
      const sunGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.1,
        20,
        width * 0.5,
        height * 0.1,
        width * 0.65
      );
      sunGrad.addColorStop(0, 'rgba(254, 243, 199, 0.35)'); // Morning Sunlight
      sunGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.25)'); // Sky Blue
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Subtle Academic Motifs (Mortarboards, Scrolls, Books)
      motifs.forEach((m) => {
        m.floatPhase += m.floatSpeed;
        m.rotation += m.rotSpeed;

        const fx = m.baseX + Math.sin(m.floatPhase) * 12 + mouseShiftX * 0.4;
        const fy = m.baseY + Math.cos(m.floatPhase * 0.8) * 14 + mouseShiftY * 0.4;

        if (m.type === 'mortarboard') drawMortarboard(fx, fy, m.size, m.rotation, m.alpha);
        else if (m.type === 'scroll') drawScroll(fx, fy, m.size, m.rotation, m.alpha);
        else drawBook(fx, fy, m.size, m.rotation, m.alpha);
      });

      // 4. Floating Real Scholarship Opportunity Cards
      scholarshipCards.forEach((card, i) => {
        // Floating gentle sinusoidal oscillation
        const floatOffset = Math.sin(time * 0.015 + i * 1.5) * 10;
        card.x = card.baseX + Math.cos(time * 0.01 + i) * 8;
        card.y = card.baseY + floatOffset;

        drawScholarshipCard(card, mouseShiftX * 0.6, mouseShiftY * 0.6);
      });

      // 5. Clean Center Readability Vignette
      const centerClarity = ctx.createRadialGradient(
        width / 2,
        height * 0.42,
        width * 0.1,
        width / 2,
        height * 0.42,
        width * 0.58
      );
      centerClarity.addColorStop(0, 'rgba(248, 250, 252, 0.78)');
      centerClarity.addColorStop(0.6, 'rgba(248, 250, 252, 0.35)');
      centerClarity.addColorStop(1, 'transparent');
      ctx.fillStyle = centerClarity;
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
