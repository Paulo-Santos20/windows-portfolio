import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { useOSStore } from '../../store/useOSStore';

const SNAP_THRESHOLD = 20;
const SHAKE_WINDOW = 500;
const SHAKE_THRESHOLD = 4;

const Win7Button = ({ type, onClick, isMaximized, phone }) => {
  const [hover, setHover] = useState(false);
  const isClose = type === 'close';
  
  const baseStyle = {
    width: phone ? '44px' : '34px',
    height: phone ? '44px' : '22px',
    marginLeft: '1px',
    border: 'none',
    background: hover
      ? (isClose ? 'linear-gradient(to bottom, #e08375, #d4553f)' : 'linear-gradient(to bottom, #e5e5e5, #cecece)')
      : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 0,
  };

  const iconColor = hover && isClose ? 'white' : '#333';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={baseStyle}
    >
      {type === 'minimize' && <div style={{ width: '10px', height: '1px', background: iconColor, marginTop: '8px' }} />}
      {type === 'maximize' && (
        isMaximized
          ? <div style={{ width: '10px', height: '10px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 2, width: '7px', height: '7px', border: `1.5px solid ${iconColor}`, background: 'white' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '7px', height: '7px', border: `1.5px solid ${iconColor}`, background: '#f0f0f0' }} />
            </div>
          : <div style={{ width: '10px', height: '10px', border: `1.5px solid ${iconColor}` }} />
      )}
      {isClose && (
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1 1 L9 9 M9 1 L1 9" stroke={iconColor} strokeWidth="1.5" />
        </svg>
      )}
    </button>
  );
};

const AERO_STYLE = {
  background: 'rgba(245, 245, 245, 0.25)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '8px 8px 0 0',
};

const WIN7_TITLE_GRADIENT = 'linear-gradient(to bottom, #e8e8e8 0%, #d4d4d4 8%, #c8c8c8 92%, #b8b8b8 100%)';
const WIN7_TITLE_ACTIVE = 'linear-gradient(to bottom, #eef0f2 0%, #d9dce0 8%, #caced3 92%, #bcc1c8 100%)';

export const WindowFrame = ({ id, title, icon, children, zIndex, isMinimized, isMaximized, isSkin, initialWidth, initialHeight, hasMenuBar = true, resizable = true, isMobile = false }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, handleShake, activeWindowId, theme, breakpoint } = useOSStore();
  const rndRef = useRef(null);
  const isActive = activeWindowId === id;
  const isWin7 = theme === 'win7';

  const phone = breakpoint === 'phone';
  const tablet = breakpoint === 'tablet';
  const isFullscreen = phone || (tablet && !isMaximized);

  const defaultW = isFullscreen ? window.innerWidth : initialWidth || (isSkin ? 600 : 800);
  const defaultH = isFullscreen ? window.innerHeight - (phone ? 48 : 40) : initialHeight || (isSkin ? 400 : 600);
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;

  const centerX = isFullscreen ? 0 : (screenW - defaultW) / 2 + (zIndex % 5) * 20;
  const centerY = isFullscreen ? 0 : (screenH - defaultH) / 2 + (zIndex % 5) * 20 - 30;

  const lastBounds = useRef({ x: centerX, y: centerY, width: defaultW, height: defaultH });
  const [snapZone, setSnapZone] = useState(null);
  const shakeHistory = useRef([]);
  const snapApplied = useRef(false);

  useEffect(() => {
    if (!rndRef.current) return;
    if (isMaximized) {
      rndRef.current.updatePosition({ x: 0, y: 0 });
      rndRef.current.updateSize({ width: '100%', height: '100%' });
    } else if (!snapApplied.current) {
      rndRef.current.updatePosition({ x: lastBounds.current.x, y: lastBounds.current.y });
      rndRef.current.updateSize({ width: lastBounds.current.width, height: lastBounds.current.height });
    }
    snapApplied.current = false;
  }, [isMaximized]);

  const handleDrag = useCallback((e, d) => {
    if (!isWin7 || isMaximized || isFullscreen || isSkin) return;

    const mx = e.clientX;
    const my = e.clientY;
    const ww = window.innerWidth;
    const wh = window.innerHeight;

    if (mx < SNAP_THRESHOLD) setSnapZone('left');
    else if (mx > ww - SNAP_THRESHOLD) setSnapZone('right');
    else if (my < SNAP_THRESHOLD) setSnapZone('top');
    else setSnapZone(null);

    const now = Date.now();
    const hist = shakeHistory.current;
    hist.push({ x: d.x, time: now });
    while (hist.length > 0 && now - hist[0].time > SHAKE_WINDOW) hist.shift();

    if (hist.length >= 6) {
      let changes = 0;
      for (let i = 2; i < hist.length; i++) {
        const prev = hist[i - 1].x - hist[i - 2].x;
        const curr = hist[i].x - hist[i - 1].x;
        if (prev * curr < 0) changes++;
      }
      if (changes >= SHAKE_THRESHOLD) {
        handleShake(id);
        shakeHistory.current = [];
        setSnapZone(null);
      }
    }
  }, [isWin7, isMaximized, isFullscreen, isSkin, id, handleShake]);

  const handleDragStop = useCallback((e, d) => {
    if (!isMaximized) {
      lastBounds.current.x = d.x;
      lastBounds.current.y = d.y;
    }

    if (snapZone && isWin7 && !isFullscreen && !isSkin) {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const snapW = Math.floor(ww / 2);

      if (snapZone === 'left') {
        lastBounds.current = { ...lastBounds.current, x: 0, y: 0, width: snapW, height: wh };
        snapApplied.current = true;
        rndRef.current.updatePosition({ x: 0, y: 0 });
        rndRef.current.updateSize({ width: snapW, height: wh });
      } else if (snapZone === 'right') {
        lastBounds.current = { ...lastBounds.current, x: ww - snapW, y: 0, width: snapW, height: wh };
        snapApplied.current = true;
        rndRef.current.updatePosition({ x: ww - snapW, y: 0 });
        rndRef.current.updateSize({ width: snapW, height: wh });
      } else if (snapZone === 'top') {
        toggleMaximize(id);
      }
      setSnapZone(null);
    }
  }, [isMaximized, snapZone, isWin7, isFullscreen, isSkin, id, toggleMaximize]);

  const handleResizeStop = (e, direction, ref, delta, position) => {
    if (!isMaximized) {
      lastBounds.current.width = ref.style.width;
      lastBounds.current.height = ref.style.height;
      lastBounds.current.x = position.x;
      lastBounds.current.y = position.y;
    }
  };

  if (isMinimized) return null;

  // --- XP Theme (legado) ---
  const isDark = false;
  const xpHeaderBg = isActive
    ? 'linear-gradient(to bottom, #0058ee 0%, #3593ff 4%, #288eff 18%, #127dff 44%, #036dff 100%)'
    : 'linear-gradient(to bottom, #a8bcd0 0%, #8aa8c8 50%, #7b9fc0 100%)';
  const xpBorderColor = '#00138c';
  const bodyBg = '#ece9d8';

  return (
    <>
      {snapZone && isWin7 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: snapZone === 'left' ? 0 : (snapZone === 'right' ? '50vw' : 0),
            width: snapZone === 'top' ? '100vw' : '50vw',
            height: snapZone === 'top' ? '100vh' : '100vh',
            background: 'rgba(0, 120, 215, 0.12)',
            border: '3px solid rgba(0, 120, 215, 0.5)',
            zIndex: 99998,
            pointerEvents: 'none',
            transition: 'all 0.08s ease-out',
          }}
        />
      )}
      <Rnd
        ref={rndRef}
        default={{ x: centerX > 0 ? centerX : 0, y: centerY > 0 ? centerY : 0, width: defaultW, height: defaultH }}
        minWidth={phone ? window.innerWidth : (resizable ? 300 : defaultW)}
        minHeight={phone ? window.innerHeight : (resizable ? 200 : defaultH)}
        bounds="parent"
        disableDragging={isSkin || isMaximized || isFullscreen}
        enableResizing={!isMaximized && resizable && !isFullscreen}
        dragHandleClassName="window-header"
        onDragStart={() => focusWindow(id)}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={() => focusWindow(id)}
        className={`flex flex-col overflow-hidden ${isActive ? 'z-50' : 'z-0'} ${isFullscreen ? '!absolute !inset-0 !w-full !h-full' : ''}`}
        style={{
          zIndex: zIndex || 1,
          display: 'flex',
          background: isSkin ? 'transparent' : (isWin7 ? 'transparent' : xpBorderColor),
          borderRadius: (isMaximized || isSkin || isFullscreen) ? '0' : (isWin7 ? '8px 8px 0 0' : '8px 8px 0 0'),
          padding: (isSkin || isMaximized || isFullscreen) ? '0' : (isWin7 ? '0' : '3px 3px 0 3px'),
          boxShadow: isSkin ? 'none' : (isWin7 ? '0 2px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)' : '2px 2px 10px rgba(0,0,0,0.5)'),
          ...(isWin7 && !isSkin && !isMaximized && !isFullscreen ? { ...AERO_STYLE } : {}),
        }}
      >
        {!isSkin && (
          <div
            className="window-header flex-shrink-0 flex items-center justify-between cursor-default select-none"
            onDoubleClick={() => resizable && !isFullscreen && toggleMaximize(id)}
            style={{
              height: phone ? '44px' : (isWin7 ? '22px' : '30px'),
              padding: isWin7 ? '0 0 0 8px' : '0 8px',
              background: isWin7 ? (isActive ? WIN7_TITLE_ACTIVE : WIN7_TITLE_GRADIENT) : xpHeaderBg,
              borderRadius: (isMaximized || isFullscreen) ? 0 : (isWin7 ? '7px 7px 0 0' : '6px 6px 0 0'),
              borderBottom: isWin7 ? '1px solid #b0b0b0' : `1px solid ${xpBorderColor}`,
            }}
          >
            <div
              className="flex items-center gap-1.5 truncate pointer-events-none"
              style={{
                color: isWin7 ? '#333' : 'white',
                fontWeight: isWin7 ? 600 : 700,
                fontSize: isWin7 ? '12px' : '13px',
                fontFamily: isWin7 ? '"Segoe UI", Tahoma, sans-serif' : 'Tahoma',
                textShadow: isWin7 ? 'none' : '1px 1px 1px black',
              }}
            >
              <span className="flex-shrink-0">{icon}</span>
              <span className="truncate">{title}</span>
            </div>
            <div className="flex items-stretch h-full no-drag" onMouseDown={(e) => e.stopPropagation()}>
              {isWin7 ? (
                <>
                  <Win7Button type="minimize" onClick={() => minimizeWindow(id)} phone={phone} />
                  {resizable && <Win7Button type="maximize" onClick={() => toggleMaximize(id)} isMaximized={isMaximized} phone={phone} />}
                  <Win7Button type="close" onClick={() => closeWindow(id)} phone={phone} />
                </>
              ) : (
                <XPButtonGroup minimize={() => minimizeWindow(id)} maximize={() => toggleMaximize(id)} close={() => closeWindow(id)} resizable={resizable} isMaximized={isMaximized} phone={phone} />
              )}
            </div>
          </div>
        )}
        <div
          className="flex-1 flex flex-col relative overflow-hidden"
          style={{
            backgroundColor: isSkin ? 'transparent' : (isWin7 ? '#f0f0f0' : bodyBg),
            border: isSkin ? 'none' : (isWin7 ? 'none' : `1px solid ${xpBorderColor}`),
          }}
        >
          {isSkin ? React.cloneElement(children, { onClose: () => closeWindow(id), onMinimize: () => minimizeWindow(id), onMaximize: () => toggleMaximize(id), isMaximized, isWindowActive: isActive, windowId: id, style: { pointerEvents: 'auto' } }) : (
            <div className="flex-1 overflow-auto relative select-text pointer-events-auto flex flex-col">
              {hasMenuBar && (
                <div
                  className="border-b border-[#d1d1d1] px-2 py-0.5 text-[11px] flex gap-3 select-none shrink-0"
                  style={{ backgroundColor: isWin7 ? '#f0f0f0' : bodyBg }}
                >
                  {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
                    <span key={m} className="px-1 cursor-pointer text-black hover:bg-[#316ac5] hover:text-white">{m}</span>
                  ))}
                </div>
              )}
              <div className="w-full h-full overflow-auto" style={{ backgroundColor: isWin7 ? '#f0f0f0' : '#ece9d8' }}>
                {React.isValidElement(children) ? React.cloneElement(children, { windowId: id }) : children}
              </div>
            </div>
          )}
        </div>
      </Rnd>
    </>
  );
};

// XP buttons (mantido para tema winxp)
const XPButton = ({ type, onClick, isMaximized, phone }) => {
  const [hover, setHover] = useState(false);
  const isClose = type === 'close';

  const getBackground = () => {
    if (isClose) {
      return hover
        ? 'linear-gradient(to bottom, #f08a7a 0%, #e85a45 40%, #c03020 51%, #a81508 100%)'
        : 'linear-gradient(to bottom, #e97d6d 0%, #e24c36 50%, #af1f0e 51%, #a20b00 100%)';
    }
    return hover
      ? 'linear-gradient(to bottom, #a8c6ff 0%, #6098f0 50%, #2a60c8 51%, #2848b0 100%)'
      : 'linear-gradient(to bottom, #87b3ff 0%, #4882e8 50%, #1647b3 51%, #193da5 100%)';
  };

  const style = {
    width: phone ? '38px' : '21px', height: phone ? '38px' : '21px',
    marginLeft: '1px', borderRadius: phone ? '6px' : '3px',
    border: '1px solid white',
    boxShadow: hover
      ? 'inset 0 1px 2px rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.4)'
      : 'inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 1px rgba(0,0,0,0.3)',
    background: getBackground(),
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={style}
    >
      {type === 'minimize' && <div style={{ width: '8px', height: '2px', background: 'white', marginTop: '5px', boxShadow: '0 1px 0 rgba(0,0,0,0.4)' }} />}
      {type === 'maximize' && (isMaximized
        ? <div style={{ width: '11px', height: '10px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '7px', height: '7px', border: '2px solid white', borderTopWidth: '3px' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '7px', height: '7px', border: '2px solid white', borderTopWidth: '3px', background: '#193da5', zIndex: 2 }} />
          </div>
        : <div style={{ width: '9px', height: '9px', border: '2px solid white', borderTopWidth: '3px', boxShadow: '0 1px 0 rgba(0,0,0,0.4)' }} />
      )}
      {isClose && <svg width="9" height="9" viewBox="0 0 10 10" style={{ stroke: 'white', strokeWidth: 2.5, filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.4))' }}><path d="M1 1 L9 9 M9 1 L1 9" /></svg>}
    </button>
  );
};

const XPButtonGroup = ({ minimize, maximize, close, resizable, isMaximized, phone }) => (
  <div className="flex items-start" style={{ paddingTop: phone ? '4px' : '2px' }}>
    <XPButton type="minimize" onClick={minimize} phone={phone} />
    {resizable && <XPButton type="maximize" onClick={maximize} isMaximized={isMaximized} phone={phone} />}
    <XPButton type="close" onClick={close} phone={phone} />
  </div>
);