import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';

const ClockGadget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();

  return (
    <div
      className="gadget"
      style={{
        width: 160, height: 170,
        background: 'rgba(245, 245, 245, 0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Segoe UI", Tahoma, sans-serif',
        userSelect: 'none',
        cursor: 'default',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
      }}
    >
      <svg width="80" height="80" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
          const angle = (i * 30 - 90) * Math.PI / 180;
          const x1 = 50 + 38 * Math.cos(angle);
          const y1 = 50 + 38 * Math.sin(angle);
          const x2 = 50 + 42 * Math.cos(angle);
          const y2 = 50 + 42 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />;
        })}
        <line
          x1="50" y1="50"
          x2={50 + 25 * Math.sin((h % 12) * 30 * Math.PI / 180 + m * 0.5 * Math.PI / 180)}
          y2={50 - 25 * Math.cos((h % 12) * 30 * Math.PI / 180 + m * 0.5 * Math.PI / 180)}
          stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round"
        />
        <line
          x1="50" y1="50"
          x2={50 + 32 * Math.sin(m * 6 * Math.PI / 180)}
          y2={50 - 32 * Math.cos(m * 6 * Math.PI / 180)}
          stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"
        />
        <line
          x1="50" y1="50"
          x2={50 + 35 * Math.sin(s * 6 * Math.PI / 180)}
          y2={50 - 35 * Math.cos(s * 6 * Math.PI / 180)}
          stroke="#ff6666" strokeWidth="1" strokeLinecap="round"
        />
        <circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.8)" />
      </svg>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 6 }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

const CPUGadget = () => {
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setUsage(Math.floor(15 + Math.random() * 70));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const bars = [];
  for (let i = 0; i < 20; i++) {
    const h = Math.floor(20 + Math.random() * 80);
    bars.push(h);
  }

  return (
    <div
      className="gadget"
      style={{
        width: 160,
        height: 100,
        background: 'rgba(245, 245, 245, 0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        padding: '8px 12px',
        fontFamily: '"Segoe UI", Tahoma, sans-serif',
        userSelect: 'none',
        cursor: 'default',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 11 }}>CPU {usage}%</div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 50 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: `${h}%`,
              background: usage > 80 ? '#ff6666' : (usage > 50 ? '#ffbb33' : '#66bb6a'),
              borderRadius: '1px 1px 0 0',
              transition: 'height 0.5s',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <span>4 cores lógicos</span>
        <span>64% máx</span>
      </div>
    </div>
  );
};

export const DesktopGadgets = () => {
  const { breakpoint } = useOSStore();
  const { gadgetsEnabled } = { gadgetsEnabled: localStorage.getItem('gadgetsEnabled') !== 'false' };
  if (!gadgetsEnabled || breakpoint === 'phone') return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <ClockGadget />
      </div>
      <div style={{ pointerEvents: 'auto' }}>
        <CPUGadget />
      </div>
    </div>
  );
};

export default DesktopGadgets;
