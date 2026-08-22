import React from "react";

const base = (size = 24) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" });

export const ShieldIcon = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></svg>
);
export const ShieldCheck = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>
);
export const Compass = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M15 9l-2 6-6 2 2-6 6-2z" /></svg>
);
export const ArrowRight = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ChevronDown = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M6 9l6 6 6-6" /></svg>
);
export const WomanShield = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="6" r="3" /><path d="M6 21v-2a6 6 0 0112 0v2" /><path d="M16 11l3 1v3c0 2-1.4 3.5-3 4-1.6-.5-3-2-3-4v-3l3-1z" /></svg>
);
export const MedCross = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></svg>
);
export const WifiOff = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M2 8.8a16 16 0 0120 0" /><path d="M5 12.6a11 11 0 0114 0" /><path d="M8.5 16a6 6 0 017 0" /><circle cx="12" cy="19" r=".8" fill="currentColor" /><path d="M3 3l18 18" /></svg>
);
export const PinSearch = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" /><circle cx="12" cy="9" r="2.2" /><path d="M14 11l2.5 2.5" /></svg>
);
export const Wifi = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M2 8.8a16 16 0 0120 0" /><path d="M5 12.6a11 11 0 0114 0" /><path d="M8.5 16a6 6 0 017 0" /><circle cx="12" cy="19" r=".8" fill="currentColor" /></svg>
);
export const Bolt = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" /></svg>
);
export const Star = ({ size, ...p }) => (
  <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l3 6.5 7 .9-5.2 4.7L18 21l-6-3.5L6 21l1.2-6.9L2 9.4l7-.9L12 2z" /></svg>
);
export const PersonAura = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="6" r="2.5" /><path d="M9 21l1-7-2-2 2-3h4l2 3-2 2 1 7" /><circle cx="12" cy="12" r="10" strokeDasharray="2 3" opacity="0.5" /></svg>
);
export const IndiaMap = ({ size, ...p }) => (
  <svg width={size||24} height={size||24} viewBox="0 0 100 110" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" {...p}>
    <path d="M30 8 C 22 12 18 22 22 32 L 18 42 L 12 50 L 18 58 L 28 60 L 36 72 L 42 92 L 50 102 L 58 92 L 60 78 L 70 70 L 78 58 L 82 46 L 76 36 L 80 24 L 72 16 L 60 14 L 48 18 L 38 12 Z" />
  </svg>
);
export const Instagram = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
export const XLogo = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M4 4l16 16M20 4L4 20" /></svg>
);
export const LinkedIn = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7" /></svg>
);
export const YouTube = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><rect x="2.5" y="6" width="19" height="12" rx="3" /><path d="M11 10l4 2-4 2v-4z" fill="currentColor" /></svg>
);
export const Check = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M5 12l4 4L19 7" /></svg>
);
export const Tricolor = ({ size = 16 }) => (
  <svg width={size/4} height={size} viewBox="0 0 4 16" aria-hidden>
    <rect x="0" y="0" width="4" height="5.33" fill="#FF9933" />
    <rect x="0" y="5.33" width="4" height="5.33" fill="#FFFFFF" stroke="#E8D5B7" strokeWidth="0.3" />
    <rect x="0" y="10.66" width="4" height="5.34" fill="#138808" />
  </svg>
);