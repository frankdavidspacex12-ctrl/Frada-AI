import React, { useMemo } from 'react';

interface QuestionBackgroundAnimationProps {
  questionId: number;
  isActive: boolean;
}

interface FloatingParticle {
  id: number;
  leftPercent: number;
  size: number;
  durationSec: number;
  delaySec: number;
  swayType: 'a' | 'b' | 'c';
  color: string;
  accentColor: string;
  opacity: number;
  variant: number;
}

const HEART_COLORS = [
  { main: '#FF6B8B', accent: '#FFE4EA' }, // Warm Strawberry Rose
  { main: '#F472B6', accent: '#FCE7F3' }, // Friendly Candy Pink
  { main: '#FB7185', accent: '#FFF1F2' }, // Coral Blush
  { main: '#FBBF24', accent: '#FEF3C7' }, // Sunny Vanilla Gold
  { main: '#FB923C', accent: '#FFEDD5' }, // Sweet Peach
  { main: '#E879F9', accent: '#FAE8FF' }, // Lavender Pastel
];

const MEMORY_COLORS = [
  { main: '#F59E0B', accent: '#FEF3C7' }, // Warm Lantern Gold
  { main: '#F472B6', accent: '#FCE7F3' }, // Blossom Pink
  { main: '#FB7185', accent: '#FFE4E6' }, // Heart Coral
  { main: '#FDBA74', accent: '#FFF7ED' }, // Soft Apricot
];

const FLAVOR_COLORS = [
  { main: '#FF5C77', accent: '#FFE4E8' }, // Juicy Strawberry
  { main: '#FACC15', accent: '#FEF9C3' }, // Sunny Citrus
  { main: '#F472B6', accent: '#FCE7F3' }, // Creamy Gelatin
  { main: '#78350F', accent: '#FDE68A' }, // Warm Mocha Coffee
];

const PROMISE_COLORS = [
  { main: '#FBBF24', accent: '#FEF9C3' }, // Radiant Star Gold
  { main: '#F472B6', accent: '#FCE7F3' }, // Butterfly Pink
  { main: '#60A5FA', accent: '#DBEAFE' }, // Sky Hope Blue
  { main: '#A78BFA', accent: '#EDE9FE' }, // Dreamy Lilac
];

function generateParticles(questionId: number, count: number): FloatingParticle[] {
  const palette =
    questionId === 1
      ? HEART_COLORS
      : questionId === 2
      ? MEMORY_COLORS
      : questionId === 3
      ? FLAVOR_COLORS
      : PROMISE_COLORS;

  const swayOptions: ('a' | 'b' | 'c')[] = ['a', 'b', 'c'];

  return Array.from({ length: count }, (_, idx) => {
    const seed = (idx * 37 + questionId * 17) % 100;
    // Spread cleanly across left and right zones as well as center
    const leftPercent = ((idx + 0.4) / count) * 90 + ((seed % 6) - 2);
    const paletteItem = palette[(idx + questionId) % palette.length];
    const durationSec = 9.0 + ((idx * 1.9 + questionId) % 5.5); // Smooth comfortable pace (9s - 14.5s)
    const delaySec = -((idx / count) * durationSec);

    return {
      id: idx,
      leftPercent: Math.max(2, Math.min(91, leftPercent)),
      // Larger, unmistakable friendly sizes
      size: questionId === 1 ? 66 + (idx % 3) * 18 : 60 + (idx % 3) * 16,
      durationSec,
      delaySec,
      swayType: swayOptions[idx % 3],
      color: paletteItem.main,
      accentColor: paletteItem.accent,
      opacity: 0.86 + (idx % 2) * 0.08,
      variant: idx % 4,
    };
  });
}

// Q1: Big Friendly Heart-Shaped Balloon with Cute Bow & Glossy Highlight
const HeartBalloonSVG: React.FC<{ color: string; accent: string; size: number }> = ({
  color,
  accent,
  size,
}) => (
  <svg
    width={size}
    height={size * 1.5}
    viewBox="0 0 80 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_10px_18px_rgba(200,106,130,0.28)]"
  >
    {/* Friendly wavy balloon string */}
    <path
      d="M40 72 C33 84, 47 94, 38 104 C33 111, 42 115, 40 119"
      stroke="#9E7356"
      strokeOpacity="0.65"
      strokeWidth="2.4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Little cute bow tie at the balloon knot */}
    <path d="M35 67 L45 67 L40 74 Z" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M40 72 C34 69, 31 74, 36 76 Z" fill={accent} stroke={color} strokeWidth="1.2" />
    <path d="M40 72 C46 69, 49 74, 44 76 Z" fill={accent} stroke={color} strokeWidth="1.2" />

    {/* Plump Heart Balloon Body with crisp soft white border */}
    <path
      d="M40 70 C40 70 8 49 8 25 C8 13.5 17 5 28 5 C34.5 5 38.5 8.5 40 12.5 C41.5 8.5 45.5 5 52 5 C63 5 72 13.5 72 25 C72 49 40 70 40 70 Z"
      fill={color}
      stroke="#FFFFFF"
      strokeWidth="2.5"
    />
    {/* Glossy balloon shine */}
    <path
      d="M19 21 C19 15.5 23 12 27.5 12 C29.5 12 31 12.6 32.2 13.5"
      stroke="#FFFFFF"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.88"
    />
    <circle cx="19.5" cy="29" r="2.5" fill="#FFFFFF" opacity="0.85" />
    {/* Cute friendly soft blush & smile */}
    <circle cx="29" cy="36" r="2.2" fill="#52301A" opacity="0.65" />
    <circle cx="51" cy="36" r="2.2" fill="#52301A" opacity="0.65" />
    <circle cx="25" cy="40" r="3" fill={accent} opacity="0.7" />
    <circle cx="55" cy="40" r="3" fill={accent} opacity="0.7" />
    <path
      d="M35.5 40 C37.5 43, 42.5 43, 44.5 40"
      stroke="#52301A"
      strokeWidth="2.2"
      strokeLinecap="round"
      opacity="0.65"
    />
  </svg>
);

// Q2: Unmistakable Memory Wishes — Glowing Sky Lantern with Heart, Friendly Cherry Blossom Flower, & Ribbon Heart
const MemoryWishSVG: React.FC<{ color: string; accent: string; size: number; variant: number }> = ({
  color,
  accent,
  size,
  variant,
}) => {
  if (variant === 0 || variant === 2) {
    // Cute Glowing Sky Lantern (Farolillo de deseos con corazón)
    return (
      <svg
        width={size}
        height={size * 1.15}
        viewBox="0 0 80 92"
        fill="none"
        className="drop-shadow-[0_10px_18px_rgba(245,158,11,0.28)]"
      >
        {/* Warm aura */}
        <circle cx="40" cy="42" r="34" fill={accent} opacity="0.45" />
        {/* Lantern Paper Body */}
        <path
          d="M22 22 C22 12, 58 12, 58 22 L64 50 C64 62, 54 68, 40 68 C26 68, 16 62, 16 50 Z"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Inner glowing warmth */}
        <ellipse cx="40" cy="44" rx="16" ry="18" fill={accent} opacity="0.85" />
        {/* Cute Heart Emblem on Lantern */}
        <path
          d="M40 53 C40 53 31 46 31 40 C31 36.8 33.5 34.5 36.5 34.5 C38.2 34.5 39.4 35.5 40 36.7 C40.6 35.5 41.8 34.5 43.5 34.5 C46.5 34.5 49 36.8 49 40 C49 46 40 53 40 53 Z"
          fill="#FB7185"
        />
        {/* Lantern rim & warm flame */}
        <ellipse cx="40" cy="68" rx="11" ry="3.5" fill="#78350F" opacity="0.7" />
        <path d="M40 69 C38 74, 42 74, 40 79" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  // Cute Friendly 5-Petal Blossom Flower
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className="drop-shadow-[0_8px_14px_rgba(244,114,182,0.25)]"
    >
      <circle cx="40" cy="18" r="14" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="61" cy="33" r="14" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="53" cy="58" r="14" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="27" cy="58" r="14" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      <circle cx="19" cy="33" r="14" fill={color} stroke="#FFFFFF" strokeWidth="2" />
      {/* Friendly center */}
      <circle cx="40" cy="40" r="13" fill="#FEF08A" stroke="#FFFFFF" strokeWidth="2.2" />
      <circle cx="35.5" cy="38.5" r="1.8" fill="#52301A" />
      <circle cx="44.5" cy="38.5" r="1.8" fill="#52301A" />
      <path d="M36.5 42.5 C38 45, 42 45, 43.5 42.5" stroke="#52301A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

// Q3: Unmistakable Sweet Flavors — Friendly Gelatin Dessert, Juicy Strawberry, Citrus Slice, Warm Coffee Cup
const FlavorCharmSVG: React.FC<{ color: string; accent: string; size: number; variant: number }> = ({
  size,
  variant,
}) => {
  if (variant === 0) {
    // Friendly Artisanal Gelatin Dessert with Cream & Cherry
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className="drop-shadow-[0_8px_15px_rgba(244,114,182,0.28)]"
      >
        {/* Plate */}
        <ellipse cx="40" cy="64" rx="30" ry="7" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
        {/* Pink Gelatin Mold */}
        <path
          d="M16 61 C16 61 21 30 30 28 C33.5 27 36.5 29 40 29 C43.5 29 46.5 27 50 28 C59 30 64 61 64 61 Z"
          fill="#F472B6"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Whipped cream topping */}
        <path
          d="M27 29 C28 21, 35 19, 40 20 C45 19, 52 21, 53 29 C47 32, 33 32, 27 29 Z"
          fill="#FFFBEB"
          stroke="#FDE68A"
          strokeWidth="1.5"
        />
        {/* Cherry on top */}
        <circle cx="40" cy="15" r="5.5" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Cute face on gelatin */}
        <circle cx="33" cy="46" r="2.1" fill="#52301A" />
        <circle cx="47" cy="46" r="2.1" fill="#52301A" />
        <path d="M36.5 50 C38.5 52.5, 41.5 52.5, 43.5 50" stroke="#52301A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 1) {
    // Sunny Citrus / Maracuyá Slice
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className="drop-shadow-[0_8px_15px_rgba(250,204,21,0.3)]"
      >
        <circle cx="40" cy="40" r="30" fill="#FACC15" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="40" cy="40" r="24" fill="#FEF9C3" />
        <circle cx="40" cy="40" r="21" fill="#FDE047" />
        {/* Citrus wedges */}
        <path d="M40 18 L40 62 M18 40 L62 40 M24 24 L56 56 M56 24 L24 56" stroke="#FEF9C3" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="4" fill="#FFFFFF" />
      </svg>
    );
  }
  if (variant === 2) {
    // Friendly Plump Strawberry
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className="drop-shadow-[0_8px_15px_rgba(255,92,119,0.28)]"
      >
        <path
          d="M40 22 C58 22, 65 36, 57 53 C51 64, 43 70, 40 70 C37 70, 29 64, 23 53 C15 36, 22 22, 40 22 Z"
          fill="#FF5C77"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        {/* Leaf Crown */}
        <path
          d="M25 23 C30 14, 38 17, 40 20 C42 17, 50 14, 55 23 C49 26, 44 24, 40 26 C36 24, 31 26, 25 23 Z"
          fill="#34D399"
          stroke="#FFFFFF"
          strokeWidth="1.8"
        />
        <path d="M40 12 L40 20" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        {/* Seeds */}
        <circle cx="30" cy="36" r="1.8" fill="#FEF08A" />
        <circle cx="50" cy="36" r="1.8" fill="#FEF08A" />
        <circle cx="33" cy="52" r="1.8" fill="#FEF08A" />
        <circle cx="47" cy="52" r="1.8" fill="#FEF08A" />
        <circle cx="40" cy="60" r="1.8" fill="#FEF08A" />
        {/* Cute smile */}
        <circle cx="35" cy="41" r="2" fill="#52301A" />
        <circle cx="45" cy="41" r="2" fill="#52301A" />
        <path d="M37 45 C38.5 47, 41.5 47, 43 45" stroke="#52301A" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  // Cute Warm Coffee Cup with Heart Steam
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className="drop-shadow-[0_8px_15px_rgba(120,53,15,0.22)]"
    >
      {/* Gentle steam curls */}
      <path d="M31 20 C29 14, 35 12, 33 7" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
      <path d="M45 20 C43 14, 49 12, 47 7" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" opacity="0.65" />
      {/* Cup Handle */}
      <path d="M58 34 C68 34, 68 50, 56 50" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      <path d="M58 34 C68 34, 68 50, 56 50" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" />
      {/* Cup Body */}
      <path
        d="M18 28 L58 28 L54 56 C53 62, 47 66, 38 66 C29 66, 23 62, 22 56 Z"
        fill="#FFFBEB"
        stroke="#B45309"
        strokeWidth="2.5"
      />
      {/* Coffee Top */}
      <ellipse cx="38" cy="28" rx="20" ry="5" fill="#78350F" stroke="#FFFFFF" strokeWidth="1.8" />
      {/* Cute heart on cup */}
      <path
        d="M38 52 C38 52 31 46.5 31 42 C31 39.5 33 37.8 35.2 37.8 C36.6 37.8 37.5 38.6 38 39.5 C38.5 38.6 39.4 37.8 40.8 37.8 C43 37.8 45 39.5 45 42 C45 46.5 38 52 38 52 Z"
        fill="#FB7185"
      />
    </svg>
  );
};

// Q4: Soul Promises — Big Friendly Golden Star, Pastel Butterfly, Cute Rainbow with Clouds
const PromiseStarSVG: React.FC<{ color: string; accent: string; size: number; variant: number }> = ({
  color,
  accent,
  size,
  variant,
}) => {
  if (variant === 0 || variant === 3) {
    // Plump Rounded Golden Star with Cute Friendly Face
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className="drop-shadow-[0_8px_16px_rgba(251,191,36,0.32)]"
      >
        <path
          d="M40 7 L49 27 L71 30 L55 45 L59 67 L40 56 L21 67 L25 45 L9 30 L31 27 Z"
          fill="#FBBF24"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="34" cy="39" r="2.2" fill="#52301A" />
        <circle cx="46" cy="39" r="2.2" fill="#52301A" />
        <circle cx="30" cy="43" r="2.8" fill="#FB7185" opacity="0.55" />
        <circle cx="50" cy="43" r="2.8" fill="#FB7185" opacity="0.55" />
        <path d="M36 44 C38 47, 42 47, 44 44" stroke="#52301A" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 1) {
    // Cute Pastel Rainbow with Fluffy Clouds
    return (
      <svg
        width={size * 1.15}
        height={size}
        viewBox="0 0 92 80"
        fill="none"
        className="drop-shadow-[0_8px_15px_rgba(244,114,182,0.26)]"
      >
        <path d="M16 54 A30 30 0 0 1 76 54" stroke="#FB7185" strokeWidth="7" strokeLinecap="round" />
        <path d="M23 54 A23 23 0 0 1 69 54" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" />
        <path d="M30 54 A16 16 0 0 1 62 54" stroke="#60A5FA" strokeWidth="7" strokeLinecap="round" />
        {/* Fluffy Left Cloud */}
        <circle cx="16" cy="56" r="9" fill="#FFFFFF" />
        <circle cx="25" cy="54" r="10" fill="#FFFFFF" />
        <circle cx="32" cy="58" r="7.5" fill="#FFFFFF" />
        {/* Fluffy Right Cloud */}
        <circle cx="60" cy="58" r="7.5" fill="#FFFFFF" />
        <circle cx="67" cy="54" r="10" fill="#FFFFFF" />
        <circle cx="76" cy="56" r="9" fill="#FFFFFF" />
      </svg>
    );
  }
  // Friendly Colorful Butterfly
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      className="drop-shadow-[0_8px_15px_rgba(167,139,250,0.28)]"
    >
      {/* Upper Wings */}
      <path
        d="M40 38 C28 14, 6 16, 12 36 C15 47, 29 45, 40 41 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      <path
        d="M40 38 C52 14, 74 16, 68 36 C65 47, 51 45, 40 41 Z"
        fill={color}
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />
      {/* Lower Wings */}
      <path
        d="M40 41 C28 44, 16 58, 25 64 C32 68, 38 54, 40 44 Z"
        fill={accent}
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
      <path
        d="M40 41 C52 44, 64 58, 55 64 C48 68, 42 54, 40 44 Z"
        fill={accent}
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
      {/* Polka dots on wings */}
      <circle cx="24" cy="31" r="4" fill="#FFFFFF" opacity="0.8" />
      <circle cx="56" cy="31" r="4" fill="#FFFFFF" opacity="0.8" />
      {/* Body & Antennae */}
      <rect x="37.5" y="29" width="5" height="25" rx="2.5" fill="#52301A" />
      <path d="M39 29 C35 21, 31 20, 29 22" stroke="#52301A" strokeWidth="2" strokeLinecap="round" />
      <path d="M41 29 C45 21, 49 20, 51 22" stroke="#52301A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const QuestionBackgroundAnimation: React.FC<QuestionBackgroundAnimationProps> = ({
  questionId,
  isActive,
}) => {
  const particleCount = questionId === 1 ? 16 : 15;
  const particles = useMemo(() => generateParticles(questionId, particleCount), [questionId, particleCount]);

  if (!isActive) return null;

  return (
    <div
      key={`bg-anim-q-${questionId}`}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {particles.map((p) => {
        const animName =
          p.swayType === 'a'
            ? 'floatSkyA'
            : p.swayType === 'b'
            ? 'floatSkyB'
            : 'floatSkyC';

        return (
          <div
            key={`${questionId}-${p.id}`}
            className="absolute bottom-0 will-change-transform"
            style={{
              left: `${p.leftPercent}%`,
              opacity: p.opacity,
              animation: `${animName} ${p.durationSec}s linear ${p.delaySec}s infinite`,
            }}
          >
            {questionId === 1 && (
              <HeartBalloonSVG color={p.color} accent={p.accentColor} size={p.size} />
            )}
            {questionId === 2 && (
              <MemoryWishSVG
                color={p.color}
                accent={p.accentColor}
                size={p.size}
                variant={p.variant}
              />
            )}
            {questionId === 3 && (
              <FlavorCharmSVG
                color={p.color}
                accent={p.accentColor}
                size={p.size}
                variant={p.variant}
              />
            )}
            {questionId >= 4 && (
              <PromiseStarSVG
                color={p.color}
                accent={p.accentColor}
                size={p.size}
                variant={p.variant}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
