import React, { useState } from 'react';

export default function MotionSitesVideoBackground() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  // MotionSites Education & Academic Fluid Motion Assets
  const videoSrc = 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/uploaded/linesbrightArea.mp4';
  const fallbackVideoSrc = 'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/prompts%20(i\'ve%20added%20them%20to%20the%20motionsites)/agencygradientArea.mp4';

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030d17]">
      {/* ── MOTIONSITES ANIMATED VIDEO STREAM ────────────────────────────── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-85' : 'opacity-0'
        }`}
        style={{
          filter: 'brightness(0.65) contrast(1.15) hue-rotate(200deg)'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={fallbackVideoSrc} type="video/mp4" />
      </video>

      {/* ── CINEMATIC MULTI-LAYER DARK OVERLAYS FOR CONTRAST ─────────────── */}
      {/* Deep Blue/Midnight Base Tint */}
      <div className="absolute inset-0 bg-[#030d17]/50 mix-blend-multiply pointer-events-none" />

      {/* Top Header Veil */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#030d17]/95 via-[#030d17]/60 to-transparent pointer-events-none" />

      {/* Center Readability Mask for Headline */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(3, 13, 23, 0.78) 0%, rgba(3, 13, 23, 0.35) 60%, transparent 100%)'
        }}
      />

      {/* Bottom Fade for Smooth Page Continuation */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#030d17] via-[#030d17]/80 to-transparent pointer-events-none" />
    </div>
  );
}
