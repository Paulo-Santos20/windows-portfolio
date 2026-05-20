import React, { useState, useEffect, useCallback } from 'react';

export const AltTabSwitcher = ({ windows, activeWindowId, onSelect }) => {
  const [active, setActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [altHeld, setAltHeld] = useState(false);

  const visibleWindows = windows.filter(w => !w.isMinimized && w.title !== 'Prompt de Comando');

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Alt' && !e.repeat) {
      setAltHeld(true);
    }
    if (e.key === 'Tab' && e.altKey && visibleWindows.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      if (!active) {
        setActive(true);
        setSelectedIndex(0);
      } else {
        setSelectedIndex(prev => (prev + 1) % visibleWindows.length);
      }
    }
  }, [active, visibleWindows.length]);

  const handleKeyUp = useCallback((e) => {
    if (e.key === 'Alt') {
      setAltHeld(false);
      if (active && visibleWindows[selectedIndex]) {
        onSelect(visibleWindows[selectedIndex].id);
      }
      setActive(false);
      setSelectedIndex(0);
    }
  }, [active, selectedIndex, visibleWindows, onSelect]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  if (!active || visibleWindows.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '6px',
          padding: '16px 20px',
          borderRadius: '10px',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}
      >
        {visibleWindows.map((win, i) => {
          const isSelected = i === selectedIndex;
          return (
            <div
              key={win.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: isSelected ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: isSelected ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
                transition: 'all 0.1s',
                minWidth: '72px',
              }}
            >
              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'brightness(1.4)' }}>
                {win.icon || <div style={{ width: 32, height: 32, borderRadius: 4, background: '#555' }} />}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                  textAlign: 'center',
                  maxWidth: 72,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: '"Segoe UI", Tahoma, sans-serif',
                }}
              >
                {win.title}
              </div>
            </div>
          );
        })}
      </div>
      {altHeld && (
        <div
          style={{
            position: 'fixed',
            bottom: '40px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '11px',
            fontFamily: '"Segoe UI", Tahoma, sans-serif',
          }}
        >
          {`${selectedIndex + 1} of ${visibleWindows.length}`}
        </div>
      )}
    </div>
  );
};

export default AltTabSwitcher;
