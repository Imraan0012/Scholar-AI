import React from 'react';
import MoltenMetal from './MoltenMetal';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      <div className="w-full h-full absolute inset-0">
        <MoltenMetal
          color1="#7C3AED"
          color2="#4145a4"
          color3="#dfdfdf"
          colorMode="frost"
          speed={0.5}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.1}
          swirl={0.8}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.3}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseStrength={0.3}
        />
      </div>
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030d17]/50 via-[#030d17]/30 to-[#030d17]/85 pointer-events-none" />
    </div>
  );
}
