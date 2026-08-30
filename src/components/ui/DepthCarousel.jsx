import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './DepthCarousel.css';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const DepthCarousel = ({
  items = [],
  controlledIndex,
  cardWidth = 860,
  cardHeight = 520,
  radius = 24,
  tint = '#05060a',
  depth = 260,
  spread = 80,
  tilt = 18,
  tiltDirection = 'right',
  perspective = 1400,
  singleVisibleMode = true,
  visibleCards = 1,
  falloff = 0.25,
  blur = 6,
  duration = 550,
  ease = 'power3.out',
  autoplay = false,
  autoplayDelay = 3200,
  loop = false,
  showControls = false,
  showIndicators = false,
  onChange,
  renderCard,
  className = '',
  children
}) => {
  // If children passed, treat children as items
  const data = useMemo(() => {
    if (children && React.Children.count(children) > 0) {
      return React.Children.toArray(children).map((child, i) => ({
        id: i,
        content: child
      }));
    }
    return Array.isArray(items) ? items : [];
  }, [items, children]);

  const count = data.length;

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const overlayRefs = useRef([]);

  const posRef = useRef(controlledIndex !== undefined ? controlledIndex : 0);
  const focusRef = useRef(controlledIndex !== undefined ? controlledIndex : 0);
  const tweenRef = useRef(null);
  const scaleRef = useRef(1);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);

  const dragRef = useRef(null);
  const autoTimerRef = useRef(null);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(controlledIndex !== undefined ? controlledIndex : 0);

  onChangeRef.current = onChange;
  cfgRef.current = {
    count,
    depth,
    spread,
    tilt,
    tiltDirection,
    singleVisibleMode,
    visibleCards,
    falloff,
    blur,
    duration,
    ease,
    loop,
    cardWidth,
    autoplayDelay
  };

  const layout = useCallback(pos => {
    const cfg = cfgRef.current;
    const n = cfg.count;
    if (!n) return;
    const dir = cfg.tiltDirection === 'left' ? -1 : 1;
    const sc = scaleRef.current;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let d = i - pos;
      if (cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }

      const az = Math.abs(d);

      // Single visible mode: only the transitioning cards (|d| < 1.05) are rendered, resting cards outside have opacity 0
      const inWindow = az < 1.05;

      // 3D Depth transform math
      const tz = -cfg.depth * d;
      const tx = dir * cfg.spread * d;
      const ry = dir * cfg.tilt * clamp(d, -1, 1);

      // Opacity: 1 when centered (d == 0), fading out as it moves into 3D depth
      const opacity = inWindow ? Math.max(0, 1 - az) : 0;
      const isCurrentActive = az < 0.15;
      const blurPx = inWindow && az > 0.05 ? Math.min(cfg.blur, az * cfg.blur) : 0;
      const zi = Math.round(2000 - az * 50);

      el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = blurPx > 0 ? `blur(${blurPx.toFixed(2)}px)` : 'none';
      el.style.zIndex = String(zi);
      el.style.pointerEvents = isCurrentActive ? 'auto' : 'none';
      el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';

      const ov = overlayRefs.current[i];
      if (ov) ov.style.opacity = inWindow ? clamp(az * cfg.falloff * 1.5, 0, 0.85).toFixed(3) : '0';
    }
  }, []);

  const notify = useCallback(
    idx => {
      setActive(idx);
      onChangeRef.current?.(idx, data[idx]);
    },
    [data]
  );

  const tweenTo = useCallback(
    (target, animate) => {
      tweenRef.current?.kill();
      const cfg = cfgRef.current;
      const proxy = { p: posRef.current };
      const dur = animate && !reducedRef.current ? cfg.duration / 1000 : 0;
      tweenRef.current = gsap.to(proxy, {
        p: target,
        duration: dur,
        ease: cfg.ease,
        onUpdate: () => {
          posRef.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: () => {
          const n = cfg.count;
          if (n > 0 && cfg.loop) posRef.current = ((posRef.current % n) + n) % n;
          layout(posRef.current);
        }
      });
    },
    [layout]
  );

  const setFocus = useCallback(
    (rawIndex, animate = true) => {
      const cfg = cfgRef.current;
      const n = cfg.count;
      if (!n) return;
      const idx = cfg.loop ? ((rawIndex % n) + n) % n : clamp(rawIndex, 0, n - 1);
      let delta = idx - posRef.current;
      if (cfg.loop && n > 1) {
        delta = ((delta % n) + n) % n;
        if (delta > n / 2) delta -= n;
      }
      tweenTo(posRef.current + delta, animate);
      if (idx !== focusRef.current) {
        focusRef.current = idx;
        notify(idx);
      }
    },
    [tweenTo, notify]
  );

  const navigateBy = useCallback(step => setFocus(focusRef.current + step, true), [setFocus]);

  // Synchronize with external controlled index
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex !== focusRef.current) {
      setFocus(controlledIndex, true);
    }
  }, [controlledIndex, setFocus]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const cfg = cfgRef.current;
      scaleRef.current = clamp(w / (cfg.cardWidth + 40), 0.45, 1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  const onPointerDown = useCallback(e => {
    if (e.target.closest('input, select, textarea, button, [role="button"], a, label')) {
      return;
    }
    const cfg = cfgRef.current;
    if (cfg.count < 2) return;
    tweenRef.current?.kill();
    dragRef.current = {
      x: e.clientX,
      startPos: posRef.current,
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      moved: false,
      id: e.pointerId
    };
  }, []);

  const onPointerMove = useCallback(
    e => {
      const drag = dragRef.current;
      if (!drag) return;
      const cfg = cfgRef.current;
      const stepPx = Math.max(cfg.cardWidth * 0.45 * scaleRef.current, 50);
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 8) {
        drag.moved = true;
        rootRef.current?.setPointerCapture(drag.id);
      }
      if (!drag.moved) return;
      const now = performance.now();
      const dt = Math.max(now - drag.lastT, 1);
      drag.v = (e.clientX - drag.lastX) / dt;
      drag.lastX = e.clientX;
      drag.lastT = now;
      posRef.current = drag.startPos - dx / stepPx;
      layout(posRef.current);
    },
    [layout]
  );

  const onPointerEnd = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (!drag.moved) return;
    const cfg = cfgRef.current;
    const stepPx = Math.max(cfg.cardWidth * 0.45 * scaleRef.current, 50);
    const projected = posRef.current - (drag.v * 160) / stepPx;
    setFocus(Math.round(projected), true);
  }, [setFocus]);

  useEffect(() => {
    layout(posRef.current);
  }, [layout, depth, spread, tilt, tiltDirection, visibleCards, falloff, blur, cardWidth, cardHeight, radius, count]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    },
    []
  );

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ '--dc-perspective': `${perspective}px` }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Depth carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div className="depth-carousel__stage" ref={stageRef}>
        {data.map((item, i) => {
          const isFocused = active === i;
          return (
            <div
              key={item.id || i}
              className={`depth-carousel__card ${isFocused ? 'depth-carousel__card--active' : ''}`}
              ref={el => (cardRefs.current[i] = el)}
              style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!isFocused}
            >
              {/* Render custom card content */}
              {renderCard ? (
                renderCard(item, i, isFocused)
              ) : item.content ? (
                item.content
              ) : (
                <>
                  <img className="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable={false} />
                  <span
                    className="depth-carousel__tint"
                    ref={el => (overlayRefs.current[i] = el)}
                    style={{ background: tint }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {showControls && count > 1 && (
        <>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--prev"
            aria-label="Previous slide"
            onClick={() => navigateBy(-1)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="depth-carousel__arrow depth-carousel__arrow--next"
            aria-label="Next slide"
            onClick={() => navigateBy(1)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {showIndicators && count > 1 && (
        <div className="depth-carousel__dots" role="tablist" aria-label="Slides">
          {data.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Go to slide ${i + 1}`}
              className={`depth-carousel__dot${active === i ? ' is-active' : ''}`}
              onClick={() => setFocus(i, true)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DepthCarousel;
