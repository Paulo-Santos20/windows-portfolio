// Ícones SVG do Windows XP (Calculadora, Paint, Prompt)
export const XPCalcIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <defs>
      <linearGradient id="calcBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4D0C8"/>
        <stop offset="100%" stopColor="#C0C0C0"/>
      </linearGradient>
      <linearGradient id="calcScreen" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#C8D8C8"/>
        <stop offset="100%" stopColor="#98B898"/>
      </linearGradient>
    </defs>
    <rect x="6" y="4" width="36" height="40" rx="2" fill="url(#calcBody)" stroke="#808080"/>
    <rect x="8" y="6" width="32" height="8" fill="url(#calcScreen)" stroke="#808080" strokeWidth="0.5"/>
    <rect x="10" y="18" width="5" height="3" fill="#CC0000" stroke="#880000"/>
    <rect x="17" y="18" width="5" height="3" fill="#CC0000" stroke="#880000"/>
    <rect x="24" y="18" width="5" height="3" fill="#CC0000" stroke="#880000"/>
    <rect x="31" y="18" width="5" height="3" fill="#CC0000" stroke="#880000"/>
    <rect x="10" y="24" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="17" y="24" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="24" y="24" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="31" y="24" width="5" height="3" fill="#CC0000" stroke="#880000"/>
    <rect x="10" y="30" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="17" y="30" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="24" y="30" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="31" y="30" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="10" y="36" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="17" y="36" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="24" y="36" width="5" height="3" fill="#3050A0" stroke="#102050"/>
    <rect x="31" y="36" width="5" height="3" fill="#00AA00" stroke="#006600"/>
  </svg>
);

export const XPPaintIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <defs>
      <linearGradient id="paintBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E0E0E0"/>
        <stop offset="100%" stopColor="#B0B0B0"/>
      </linearGradient>
    </defs>
    <rect x="8" y="32" width="32" height="12" rx="1" fill="url(#paintBody)" stroke="#808080"/>
    <path d="M16 10L12 26H20L16 10Z" fill="#E5C100" stroke="#B09000"/>
    <path d="M32 8L36 24H28L32 8Z" fill="#8B4513" stroke="#5D3A1A"/>
    <path d="M24 6L20 26H28L24 6Z" fill="#CD853F" stroke="#8B5A2B"/>
    <circle cx="34" cy="30" r="8" fill="#CC0000" opacity="0.8"/>
    <path d="M10 32V28H38V32" fill="#A0A0A0"/>
  </svg>
);

export const XPCmdIcon = () => (
  <svg viewBox="0 0 48 48" className="w-full h-full">
    <defs>
      <linearGradient id="cmdBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#303030"/>
        <stop offset="100%" stopColor="#1A1A1A"/>
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="36" height="36" rx="2" fill="url(#cmdBody)" stroke="#000000"/>
    <rect x="8" y="10" width="4" height="3" fill="#00FF00"/>
    <rect x="14" y="10" width="4" height="3" fill="#00FF00"/>
    <rect x="20" y="10" width="4" height="3" fill="#00FF00"/>
    <rect x="26" y="10" width="4" height="3" fill="#00FF00"/>
    <rect x="32" y="10" width="4" height="3" fill="#00FF00"/>
    <rect x="8" y="16" width="22" height="2" fill="#00FF00"/>
    <rect x="8" y="20" width="16" height="2" fill="#00FF00"/>
    <rect x="8" y="24" width="20" height="2" fill="#00FF00"/>
    <rect x="8" y="28" width="14" height="2" fill="#00FF00"/>
    <rect x="8" y="32" width="18" height="2" fill="#00FF00"/>
    <path d="M6 6C6 4.9 6.9 4 8 4H40C41.1 4 42 4.9 42 6V8H6V6Z" fill="#404040"/>
  </svg>
);