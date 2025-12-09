import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useOSStore } from '../../store/useOSStore';

// --- BOTÃO ESTILO XP (MANTIDO IGUAL) ---
const XPButton = ({ type, onClick, isMaximized }) => {
  const isClose = type === 'close';
  const bgStyle = isClose
    ? { background: 'linear-gradient(to bottom, #e97d6d 0%, #e24c36 50%, #af1f0e 51%, #a20b00 100%)', borderColor: '#ffffff' }
    : { background: 'linear-gradient(to bottom, #87b3ff 0%, #4882e8 50%, #1647b3 51%, #193da5 100%)', borderColor: '#ffffff' };

  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group relative flex items-center justify-center cursor-default"
      style={{ width: '21px', height: '21px', marginLeft: '2px', borderRadius: '3px', border: '1px solid white', boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.7)', ...bgStyle }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: '2px', boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.4)' }}></div>
      <div style={{ filter: 'drop-shadow(0px 1px 0px rgba(0,0,0,0.3))', position: 'relative', zIndex: 10 }}>
          {type === 'minimize' && <div style={{ width: '8px', height: '3px', background: 'white', marginTop: '4px' }}></div>}
          {type === 'maximize' && (isMaximized ? 
              <div style={{ width: '12px', height: '12px', position: 'relative' }}>
                 <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', border: '2px solid white', borderTopWidth: '3px' }}></div>
                 <div style={{ position: 'absolute', bottom: 0, left: 0, width: '8px', height: '8px', border: '2px solid white', borderTopWidth: '3px', background: '#193da5', zIndex: 2 }}></div>
              </div> : 
              <div style={{ width: '10px', height: '10px', border: '2px solid white', borderTopWidth: '3px' }}></div>
          )}
          {isClose && <svg width="10" height="10" viewBox="0 0 10 10" style={{ stroke: 'white', strokeWidth: 2 }}><path d="M1 1 L9 9 M9 1 L1 9" /></svg>}
      </div>
    </button>
  );
};

export const WindowFrame = ({ id, title, icon, children, zIndex, isMinimized, isMaximized, isSkin }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, activeWindowId, themeMode } = useOSStore();
  const [isDragging, setIsDragging] = useState(false);
  const rndRef = useRef(null);
  const isActive = activeWindowId === id;

  // --- LÓGICA DE CENTRALIZAÇÃO ---
  // Define tamanho padrão
  const defaultW = isSkin ? 600 : 800;
  const defaultH = isSkin ? 400 : 600;

  // Calcula o centro da tela (com um leve deslocamento baseado no zIndex para não empilhar 100%)
  // window.innerWidth pode variar com o zoom do navegador, mas funciona bem para centralizar inicialmente.
  const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

  // Cálculo: (Tela - Janela) / 2 + Pequeno Offset para cascata
  const centerX = (screenW - defaultW) / 2 + (zIndex % 5) * 20;
  const centerY = (screenH - defaultH) / 2 + (zIndex % 5) * 20 - 30; // -30px para subir um pouco e fugir da taskbar

  useEffect(() => {
    if (isMaximized && rndRef.current) {
      rndRef.current.updatePosition({ x: 0, y: 0 });
      rndRef.current.updateSize({ width: '100%', height: '100%' });
    }
  }, [isMaximized]);

  if (isMinimized) return null;

  // TEMA
  const isDark = themeMode === 'dark';
  const headerBg = isDark 
      ? (isActive ? 'linear-gradient(to bottom, #4c4c4c 0%, #2b2b2b 100%)' : 'linear-gradient(to bottom, #3f3f3f 0%, #1a1a1a 100%)')
      : (isActive ? 'linear-gradient(to bottom, #0058ee 0%, #3593ff 4%, #288eff 18%, #127dff 44%, #036dff 100%)' : 'linear-gradient(to bottom, #7697c8 0%, #7697c8 100%)');
  const borderColor = isDark ? '#1a1a1a' : '#00138c';
  const bodyBg = isDark ? '#2b2b2b' : '#ece9d8';

  return (
    <Rnd
      ref={rndRef}
      default={{ 
          x: centerX > 0 ? centerX : 50, // Fallback se a tela for muito pequena
          y: centerY > 0 ? centerY : 50, 
          width: defaultW, 
          height: defaultH 
      }}
      minWidth={300} minHeight={200}
      bounds="parent"
      disableDragging={isMaximized} 
      enableResizing={!isMaximized && !isSkin}
      dragHandleClassName="window-header"
      onDragStart={() => { setIsDragging(true); focusWindow(id); }}
      onDragStop={() => setIsDragging(false)}
      onMouseDown={() => focusWindow(id)}
      className={`flex flex-col overflow-hidden ${isActive ? 'z-50' : 'z-0'} ${isSkin ? 'pointer-events-none' : ''}`}
      style={{ 
        zIndex: zIndex || 1, display: 'flex',
        background: isSkin ? 'transparent' : borderColor, 
        borderRadius: isMaximized || isSkin ? '0' : '8px 8px 0 0',
        padding: (isSkin || isMaximized) ? '0' : '3px', paddingTop: 0,
        boxShadow: isSkin ? 'none' : '2px 2px 10px rgba(0,0,0,0.5)',
      }}
    >
      {!isSkin && (
          <div 
            className="window-header h-[30px] flex-shrink-0 flex items-center justify-between px-2 cursor-default relative overflow-hidden select-none"
            onDoubleClick={() => toggleMaximize(id)}
            style={{
                background: headerBg,
                borderRadius: isMaximized ? 0 : '6px 6px 0 0',
                borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <div className="flex items-center gap-2 text-white font-bold text-[13px] pointer-events-none truncate" style={{ textShadow: '1px 1px 1px black', fontFamily: 'Tahoma' }}>
              <span className="drop-shadow-md">{icon}</span><span className="truncate">{title}</span>
            </div>
            <div className="flex items-start pt-[2px] no-drag" onMouseDown={(e) => e.stopPropagation()}>
              <XPButton type="minimize" onClick={() => minimizeWindow(id)} />
              <XPButton type="maximize" onClick={() => toggleMaximize(id)} isMaximized={isMaximized} />
              <XPButton type="close" onClick={() => closeWindow(id)} />
            </div>
          </div>
      )}

      <div className={`flex-1 flex flex-col relative overflow-hidden`} style={{ backgroundColor: isSkin ? 'transparent' : bodyBg, border: isSkin ? 'none' : `1px solid ${borderColor}` }}>
         {isSkin ? React.cloneElement(children, { 
             onClose: () => closeWindow(id), 
             onMinimize: () => minimizeWindow(id), 
             onMaximize: () => toggleMaximize(id), 
             isMaximized: isMaximized, 
             isWindowActive: isActive,
             windowId: id,
             style: { pointerEvents: 'auto' }
         }) : (
             <div className="flex-1 bg-white overflow-auto relative select-text pointer-events-auto">
                 <div style={{ backgroundColor: bodyBg }} className="border-b border-[#d1d1d1] px-2 py-0.5 text-[11px] flex gap-3 select-none shrink-0" >
                     {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => <span key={m} className={`px-1 cursor-default ${isDark ? 'text-white hover:bg-gray-600' : 'text-black hover:bg-[#316ac5] hover:text-white'}`}>{m}</span>)}
                 </div>
                 <div className="w-full h-full overflow-auto">
                    {React.isValidElement(children) ? React.cloneElement(children, { windowId: id }) : children}
                 </div>
             </div>
         )}
      </div>
    </Rnd>
  );
};