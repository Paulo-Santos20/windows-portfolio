const CDN = 'https://cdn.jsdelivr.net/gh/Visnalize/resources@main/icons/win7';

const iconSrc = {
  folder: `${CDN}/Standard%20Folders/imageres_5.ico`,
  folder_open: `${CDN}/Standard%20Folders/imageres_3.ico`,
  computer: `${CDN}/Shell32.dll/explorer_ICO_MYCOMPUTER.ico`,
  recycle_empty: `${CDN}/Shell32.dll/shell32_16.ico`,
  recycle_full: `${CDN}/Shell32.dll/shell32_17.ico`,
  ie: `${CDN}/Internet%20Explorer/iexplore_7.ico`,
  globe: `${CDN}/Internet%20Explorer/iexplore_7.ico`,
  wmp: `${CDN}/Windows%20Media%20Player/wmplayer_120.ico`,
  play: `${CDN}/Windows%20Media%20Player/wmplayer_120.ico`,
  user: `${CDN}/Shell32.dll/shell32_47.ico`,
  txt: `${CDN}/Default%20Programs/notepad_2.ico`,
  pdf: `${CDN}/Default%20Programs/notepad_2.ico`,
  games: `${CDN}/Games/Chess_128.ico`,
  gamepad: `${CDN}/Games/Chess_128.ico`,
  settings: `${CDN}/Control%20Panel/imageres_27.ico`,
  projects: `${CDN}/Shell32.dll/shell32_151.ico`,
  briefcase: `${CDN}/Shell32.dll/shell32_151.ico`,
  paint: `${CDN}/Default%20Programs/mspaint_2.ico`,
  cmd: `${CDN}/Default%20Programs/cmd_IDI_APPICON.ico`,
};

const fallbackSrc = `${CDN}/Default%20Programs/notepad_2.ico`;

const CalcIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="calcBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f5f5f5"/>
        <stop offset="100%" stopColor="#e0e0e0"/>
      </linearGradient>
      <linearGradient id="calcBtn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4fc3f7"/>
        <stop offset="100%" stopColor="#0288d1"/>
      </linearGradient>
    </defs>
    <rect x="5" y="3" width="38" height="42" rx="3" fill="url(#calcBg)" stroke="#999" strokeWidth="1"/>
    <rect x="7" y="5" width="34" height="8" rx="1" fill="#222"/>
    <text x="10" y="11" fill="lime" fontSize="6" fontFamily="monospace">12345678</text>
    {[0,1,2,3].map(row => [0,1,2,3].map(col => (
      <rect key={`${row}-${col}`} x={8+col*9} y={15+row*7} width="8" height="6" rx="1" fill={row===0&&col===3?"url(#calcBtn)":"#f0f0f0"} stroke="#bbb" strokeWidth="0.5"/>
    )))}
  </svg>
);

const Person = ({ dx }) => (
  <g transform={`translate(${dx}, 0)`}>
    <circle cx="0" cy="-10" r="4.5" fill="white" />
    <path d="
      M -1,-5
      C -5,-4 -6,-2 -6,1
      L -5,8
      C -6,10 -4,11 -3,10
      L -3,7
      C -3,5 -2,4 -1,4
      C -3,7 -4,9 -4,11
      C -4,13 4,13 4,11
      C 4,9 3,7 1,4
      C 1,4 2,5 3,7
      L 3,10
      C 4,11 6,10 5,8
      L 6,1
      C 6,-2 5,-4 1,-5
      Z" fill="white" />
  </g>
);

const MsnIcon = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="msnGrad" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#b8ef5c"/>
        <stop offset="45%" stopColor="#7cc428"/>
        <stop offset="100%" stopColor="#3f7a0a"/>
      </radialGradient>
    </defs>
    <circle cx="24" cy="24" r="22.5" fill="url(#msnGrad)"/>
    <circle cx="24" cy="24" r="22.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
    <Person dx={16} />
    <Person dx={30} />
  </svg>
);

export const Win7Icon = ({ type, className = "" }) => {
  if (type === 'calc') return <CalcIcon />;
  if (type === 'msn') return <MsnIcon />;

  const src = iconSrc[type] || fallbackSrc;

  return (
    <img
      src={src}
      alt={type}
      className={`w-full h-full ${className}`}
      draggable={false}
    />
  );
};
