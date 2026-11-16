import React from 'react';

export const BackgroundDancingPastels: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#FFFBF2]">
      {/* Animated warm cream & rose base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF7] via-[#FFF3E0] to-[#FFE4EC]" />

      {/* 1. Vivid Pastel Pink Orb (Sweeps across top-left to center) */}
      <div
        className="animate-pastel-1 absolute -top-20 -left-16 w-[55vw] h-[55vw] max-w-[660px] max-h-[660px] rounded-full opacity-90 blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(249,168,212,0.88) 0%, rgba(251,207,232,0.65) 45%, transparent 75%)',
        }}
      />

      {/* 2. Rich Golden Vanilla Orb (Sweeps dynamically across right to middle) */}
      <div
        className="animate-pastel-2 absolute top-8 -right-20 w-[56vw] h-[56vw] max-w-[680px] max-h-[680px] rounded-full opacity-90 blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(253,224,71,0.78) 0%, rgba(254,240,138,0.65) 48%, transparent 76%)',
        }}
      />

      {/* 3. Sweet Peach Cream Orb (Dances from bottom-left across center) */}
      <div
        className="animate-pastel-3 absolute -bottom-24 left-8 w-[58vw] h-[58vw] max-w-[700px] max-h-[700px] rounded-full opacity-85 blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(253,186,116,0.8) 0%, rgba(254,215,170,0.6) 48%, transparent 78%)',
        }}
      />

      {/* 4. Rose Berry Blush Orb (Dances around bottom-right to top-center) */}
      <div
        className="animate-pastel-4 absolute bottom-10 -right-12 w-[50vw] h-[50vw] max-w-[580px] max-h-[580px] rounded-full opacity-85 blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(253,164,175,0.82) 0%, rgba(254,205,211,0.58) 46%, transparent 76%)',
        }}
      />

      {/* 5. Center Butter-Vanilla Glow Orb (Orbits through the middle) */}
      <div
        className="animate-pastel-5 absolute top-1/3 left-1/3 w-[44vw] h-[44vw] max-w-[520px] max-h-[520px] rounded-full opacity-80 blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(253,230,138,0.82) 0%, rgba(252,231,243,0.55) 50%, transparent 76%)',
        }}
      />
    </div>
  );
};
