import React, { useEffect, useRef } from 'react';

export default function ScholarOpportunityNetwork() {
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
      initNetwork();
    };

    window.addEventListener('resize', handleResize);

    // Mouse parallax
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── DATA ARRAYS FOR SCHOLAR AI NETWORK ──────────────────────────

    let nodes = [];
    let connections = [];
    let academicSymbols = [];

    const initNetwork = () => {
      nodes = [];
      connections = [];
      academicSymbols = [];

      const isMobile = width < 768;

      // 1. Student Profile Nodes (Concentrated on Left / Bottom-Left)
      const studentNodes = [
        { label: 'Academic Merit', subLabel: '10th/12th & CGPA', x: width * 0.12, y: height * 0.28, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' },
        { label: 'Income Slabs', subLabel: 'Means-tested < ₹8L', x: width * 0.08, y: height * 0.52, color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
        { label: 'State Domicile', subLabel: '28 States & UTs', x: width * 0.18, y: height * 0.72, color: '#818cf8', glow: 'rgba(129, 140, 248, 0.4)' },
        { label: 'Category Quota', subLabel: 'OBC / SC / ST / EWS', x: width * 0.14, y: height * 0.88, color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.4)' },
        { label: 'Degree Stream', subLabel: 'UG / PG / STEM', x: width * 0.24, y: height * 0.38, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' },
      ];

      // 2. Scholarship Opportunity Hubs (Concentrated on Right / Top-Right)
      const scholarshipHubs = [
        { label: 'NSP Central Portal', subLabel: 'Ministry Schemes', x: width * 0.85, y: height * 0.22, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.45)' },
        { label: 'MahaDBT & State SSP', subLabel: 'State Domicile Grants', x: width * 0.88, y: height * 0.48, color: '#34d399', glow: 'rgba(52, 211, 153, 0.45)' },
        { label: 'Corporate Trust Funds', subLabel: 'Tata, Reliance & CSR', x: width * 0.78, y: height * 0.68, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
        { label: '100% Tuition Waiver', subLabel: 'Merit Endowments', x: width * 0.82, y: height * 0.88, color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)' },
        { label: 'AICTE Pragati / Swanath', subLabel: 'Technical Grants', x: width * 0.72, y: height * 0.35, color: '#818cf8', glow: 'rgba(129, 140, 248, 0.4)' },
      ];

      // 3. Ambient Secondary Data Flow Nodes (Peripheral)
      const peripheralCount = isMobile ? 8 : 16;
      for (let i = 0; i < peripheralCount; i++) {
        const side = i % 4;
        let px = 0;
        let py = 0;
        if (side === 0) {
          px = width * (0.05 + Math.random() * 0.9);
          py = height * (0.05 + Math.random() * 0.15);
        } else if (side === 1) {
          px = width * (0.05 + Math.random() * 0.9);
          py = height * (0.8 + Math.random() * 0.15);
        } else if (side === 2) {
          px = width * (0.02 + Math.random() * 0.22);
          py = height * (0.15 + Math.random() * 0.7);
        } else {
          px = width * (0.75 + Math.random() * 0.22);
          py = height * (0.15 + Math.random() * 0.7);
        }

        nodes.push({
          x: px,
          y: py,
          baseX: px,
          baseY: py,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 2 + Math.random() * 2,
          type: 'data',
          label: '',
          color: Math.random() > 0.5 ? '#38bdf8' : '#34d399',
          glowColor: 'rgba(56, 189, 248, 0.25)',
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03
        });
      }

      // Add main nodes
      studentNodes.forEach((sn) => {
        nodes.push({
          x: sn.x,
          y: sn.y,
          baseX: sn.x,
          baseY: sn.y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: 4.5,
          type: 'student',
          label: sn.label,
          subLabel: sn.subLabel,
          color: sn.color,
          glowColor: sn.glow,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.025
        });
      });

      scholarshipHubs.forEach((sh) => {
        nodes.push({
          x: sh.x,
          y: sh.y,
          baseX: sh.x,
          baseY: sh.y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: 5.5,
          type: 'scholarship',
          label: sh.label,
          subLabel: sh.subLabel,
          color: sh.color,
          glowColor: sh.glow,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03
        });
      });

      // 4. Build Match Pathway Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].baseX - nodes[j].baseX;
          const dy = nodes[i].baseY - nodes[j].baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const isCrossLink = (nodes[i].type === 'student' && nodes[j].type === 'scholarship') ||
                             (nodes[i].type === 'scholarship' && nodes[j].type === 'student');

          const maxDist = isCrossLink ? width * 0.85 : width * 0.28;

          if (dist < maxDist) {
            const midX = (nodes[i].baseX + nodes[j].baseX) / 2;
            const midY = (nodes[i].baseY + nodes[j].baseY) / 2;
            const centerDist = Math.hypot(midX - width / 2, midY - height / 2);
            const centerPenalty = Math.min(centerDist / (width * 0.35), 1.0);

            if (centerPenalty > 0.2 || !isCrossLink) {
              connections.push({
                from: i,
                to: j,
                alpha: (1 - dist / maxDist) * 0.35 * centerPenalty,
                speed: 0.003 + Math.random() * 0.005,
                progress: Math.random()
              });
            }
          }
        }
      }

      // 5. Minimal Academic & Opportunity Silhouettes
      const symbolTypes = ['cap', 'scroll', 'pillar', 'award', 'card'];
      const symbolCount = isMobile ? 6 : 12;

      for (let i = 0; i < symbolCount; i++) {
        const xPos = (i % 2 === 0) ? width * (0.05 + Math.random() * 0.22) : width * (0.73 + Math.random() * 0.22);
        const yPos = height * (0.12 + Math.random() * 0.76);

        academicSymbols.push({
          x: xPos,
          y: yPos,
          baseX: xPos,
          baseY: yPos,
          size: 24 + Math.random() * 20,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.004,
          type: symbolTypes[i % symbolTypes.length],
          alpha: 0.06 + Math.random() * 0.07,
          floatPhase: Math.random() * Math.PI * 2,
          floatSpeed: 0.015 + Math.random() * 0.015
        });
      }
    };

    initNetwork();

    // ── DRAWING UTILITIES ─────────────────────────────────────────────

    // Draw Minimal Graduation Cap Silhouette
    const drawGraduationCap = (cx, cy, size, rot, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.25})`;
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, -size * 0.45);
      ctx.lineTo(size * 0.75, 0);
      ctx.lineTo(0, size * 0.45);
      ctx.lineTo(-size * 0.75, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, size * 0.1, size * 0.4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.65, size * 0.35);
      ctx.lineTo(size * 0.65, size * 0.6);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Minimal Scholarship Application Card Silhouette
    const drawScholarshipCard = (cx, cy, size, rot, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(52, 211, 153, ${alpha})`;
      ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.4})`;
      ctx.lineWidth = 1.2;

      const w = size * 1.1;
      const h = size * 0.8;
      const r = 4;

      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, r);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-w / 2 + 6, -h / 2 + 7);
      ctx.lineTo(-w / 2 + size * 0.6, -h / 2 + 7);
      ctx.moveTo(-w / 2 + 6, -h / 2 + 13);
      ctx.lineTo(-w / 2 + size * 0.4, -h / 2 + 13);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2 - 10, 0, 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    };

    // Draw Classical Institution Pillars Silhouette
    const drawInstitutionPillars = (cx, cy, size, rot, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
      ctx.lineWidth = 1.2;

      const s = size * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.lineTo(s * 0.7, -s * 0.2);
      ctx.lineTo(-s * 0.7, -s * 0.2);
      ctx.closePath();
      ctx.stroke();

      [-s * 0.45, 0, s * 0.45].forEach((px) => {
        ctx.beginPath();
        ctx.moveTo(px, -s * 0.15);
        ctx.lineTo(px, s * 0.45);
        ctx.stroke();
      });

      ctx.beginPath();
      ctx.moveTo(-s * 0.7, s * 0.5);
      ctx.lineTo(s * 0.7, s * 0.5);
      ctx.stroke();

      ctx.restore();
    };

    // ── ANIMATION LOOP ────────────────────────────────────────────────

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseParallaxX = (mouse.x - width / 2) * 0.02;
      const mouseParallaxY = (mouse.y - height / 2) * 0.02;

      // 1. Clear background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Opportunity Clouds
      const gradLeft = ctx.createRadialGradient(width * 0.15, height * 0.4, 50, width * 0.15, height * 0.4, width * 0.45);
      gradLeft.addColorStop(0, 'rgba(56, 189, 248, 0.045)');
      gradLeft.addColorStop(1, 'transparent');
      ctx.fillStyle = gradLeft;
      ctx.fillRect(0, 0, width, height);

      const gradRight = ctx.createRadialGradient(width * 0.85, height * 0.55, 50, width * 0.85, height * 0.55, width * 0.45);
      gradRight.addColorStop(0, 'rgba(52, 211, 153, 0.04)');
      gradRight.addColorStop(1, 'transparent');
      ctx.fillStyle = gradRight;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Academic Silhouettes
      academicSymbols.forEach((sym) => {
        sym.floatPhase += sym.floatSpeed;
        sym.rotation += sym.rotSpeed;

        const floatX = sym.baseX + Math.sin(sym.floatPhase) * 12 + mouseParallaxX * 0.5;
        const floatY = sym.baseY + Math.cos(sym.floatPhase * 0.8) * 14 + mouseParallaxY * 0.5;

        if (sym.type === 'cap') {
          drawGraduationCap(floatX, floatY, sym.size, sym.rotation, sym.alpha);
        } else if (sym.type === 'card' || sym.type === 'scroll') {
          drawScholarshipCard(floatX, floatY, sym.size, sym.rotation, sym.alpha);
        } else {
          drawInstitutionPillars(floatX, floatY, sym.size, sym.rotation, sym.alpha);
        }
      });

      // 4. Update Node Positions
      nodes.forEach((node) => {
        node.pulsePhase += node.pulseSpeed;
        node.x = node.baseX + Math.sin(node.pulsePhase) * 6 + mouseParallaxX;
        node.y = node.baseY + Math.cos(node.pulsePhase * 0.8) * 6 + mouseParallaxY;
      });

      // 5. Draw Connection Lines & Data Stream Packets
      connections.forEach((conn) => {
        const n1 = nodes[conn.from];
        const n2 = nodes[conn.to];
        if (!n1 || !n2) return;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = `rgba(148, 163, 184, ${conn.alpha * 0.55})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        conn.progress = (conn.progress + conn.speed) % 1.0;

        const packetX = n1.x + (n2.x - n1.x) * conn.progress;
        const packetY = n1.y + (n2.y - n1.y) * conn.progress;
        const packetAlpha = Math.sin(conn.progress * Math.PI) * conn.alpha * 3.5;

        if (packetAlpha > 0.05) {
          ctx.beginPath();
          ctx.arc(packetX, packetY, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = conn.from % 2 === 0 ? `rgba(56, 189, 248, ${packetAlpha})` : `rgba(52, 211, 153, ${packetAlpha})`;
          ctx.fill();
        }
      });

      // 6. Draw Nodes & Labels
      nodes.forEach((node) => {
        const pulse = 1 + Math.sin(node.pulsePhase) * 0.15;
        const currentRadius = node.radius * pulse;

        // Outer Glow
        const glowGrad = ctx.createRadialGradient(node.x, node.y, currentRadius * 0.5, node.x, node.y, currentRadius * 3.5);
        glowGrad.addColorStop(0, node.glowColor);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Inner Highlight
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Labels
        if (node.label && width > 640) {
          ctx.font = '500 11px Inter, sans-serif';
          ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
          ctx.textAlign = node.x > width / 2 ? 'right' : 'left';

          const textOffsetX = node.x > width / 2 ? -12 : 12;
          ctx.fillText(node.label, node.x + textOffsetX, node.y - 2);

          if (node.subLabel) {
            ctx.font = '400 9px Inter, sans-serif';
            ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
            ctx.fillText(node.subLabel, node.x + textOffsetX, node.y + 11);
          }
        }
      });

      // 7. Center Negative-Space Vignette
      const centerVignette = ctx.createRadialGradient(
        width / 2,
        height * 0.42,
        width * 0.08,
        width / 2,
        height * 0.42,
        width * 0.55
      );
      centerVignette.addColorStop(0, 'rgba(3, 7, 18, 0.88)');
      centerVignette.addColorStop(0.5, 'rgba(3, 7, 18, 0.55)');
      centerVignette.addColorStop(1, 'transparent');
      ctx.fillStyle = centerVignette;
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
      style={{ background: '#030712' }}
    />
  );
}
