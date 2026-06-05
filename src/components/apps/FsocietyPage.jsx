import React, { useState, useEffect } from 'react';

const F = ['███████','██     ','██     ','█████  ','██     ','██     ','██     '];
const S = ['███████','██     ','██     ','███████','     ██','     ██','███████'];
const O = ['███████','██   ██','██   ██','██   ██','██   ██','██   ██','███████'];
const C = ['███████','██     ','██     ','██     ','██     ','██     ','███████'];
const I = ['  ███  ','  ███  ','  ███  ','  ███  ','  ███  ','  ███  ','  ███  '];
const E = ['███████','██     ','█████  ','██     ','██     ','██     ','███████'];
const T = ['███████','  ███  ','  ███  ','  ███  ','  ███  ','  ███  ','  ███  '];
const Y = ['██   ██','██   ██','██   ██','  ███  ','  ███  ','  ███  ','  ███  '];

const FSO_LOGO = Array.from({length: 7}, (_, i) =>
  [F, S, O, C, I, E, T, Y].map(letter => letter[i]).join(' ')
);

const calcTimeLeft = () => {
  const target = new Date('2026-07-19T16:00:00-03:00');
  const now = new Date();
  const diff = target - now;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
  const total = Math.floor(diff / 1000);
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
    expired: false,
  };
};

export const FsocietyPage = ({ accessToken }) => {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (accessToken !== 'fsociety-leavemehere') {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <span className="text-red-600 font-mono text-lg">Acesso negado.</span>
      </div>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="h-full w-full bg-black flex flex-col items-center justify-center font-mono select-none p-4">
      <pre className="text-[#00ff00] text-xs sm:text-sm md:text-base leading-tight mb-8 drop-shadow-[0_0_10px_rgba(0,255,0,0.3)]">
        {FSO_LOGO.join('\n')}
      </pre>
      <div className="text-[#00ff00] text-sm sm:text-base mb-6 animate-pulse drop-shadow-[0_0_6px_rgba(0,255,0,0.5)]">
        &gt; Hello, friend.
      </div>
      <div className="text-[#00ff00] text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest drop-shadow-[0_0_15px_rgba(0,255,0,0.4)]">
        {timeLeft.expired ? (
          <span className="text-red-500 text-2xl">ACESSO LIBERADO</span>
        ) : (
          <span className="tabular-nums">{pad(timeLeft.d)}:{pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}</span>
        )}
      </div>
      {!timeLeft.expired && (
        <div className="text-[#00ff00]/60 text-xs mt-4 tracking-widest uppercase">
          19/07/2026 16:00
        </div>
      )}
    </div>
  );
};
