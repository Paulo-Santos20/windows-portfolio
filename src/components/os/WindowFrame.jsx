import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { clsx } from 'clsx';

export const WindowFrame = ({ id, title, icon, children, zIndex, isMinimized, isMaximized, isSkin }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, activeWindowId, themeMode } = useOSStore();
  const [isDragging, setIsDragging] = useState(false);
  
  const isActive = activeWindowId === id;

  // Cores do Tema
  const headerBackground = themeMode === 'dark'
    ? (isActive ? 'linear-gradient(to bottom, #505050 0%, #303030 50%, #151515 50%, #000000 100%)' : 'linear-gradient(to bottom, #3f3f3f 0%, #2b2b2b 50%, #1a1a1a 100%)')
    : (isActive ? 'linear-gradient(to bottom, #0058ee 0%, #3593ff 4%, #288eff 18%, #127dff 44%, #036dff 100%)' : 'linear-gradient(to bottom, #7697c8 0%, #7697c8 100%)');

  const borderColor = themeMode === 'dark' ? '#151515' : '#00138c';

  if (isMinimized) return null;

  return (
    <Rnd
      default={{ x: 50, y: 50, width: isSkin ? 600 : 800, height: isSkin ? 400 : 600 }}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      size={isMaximized ? { width: '100%', height: '100%' } : undefined}
      bounds="parent"
      minWidth={300}
      minHeight={200}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-header"
      
      onDragStart={() => { setIsDragging(true); focusWindow(id); }}
      onDragStop={() => setIsDragging(false)}
      onMouseDown={() => focusWindow(id)}
      
      className={clsx(
        "flex flex-col overflow-hidden",
        !isSkin && "shadow-xl",
        isActive ? "z-50" : "z-0",
        isMaximized ? "rounded-none" : (isSkin ? "" : "rounded-t-lg")
      )}
      
      style={{ 
        zIndex, 
        display: 'flex', 
        background: isSkin ? 'transparent' : (isMaximized ? borderColor : borderColor),
        padding: (isSkin || isMaximized) ? '0' : '3px',
        paddingTop: '0',
        border: isSkin ? 'none' : 'none'
      }}
    >
      {/* HEADER PADRÃO (Só aparece se NÃO for Skin) */}
      {!isSkin && (
          <div 
            className="window-header h-8 flex-shrink-0 flex items-center justify-between px-2 cursor-default relative"
            onDoubleClick={() => toggleMaximize(id)}
            style={{
                background: headerBackground,
                borderRadius: isMaximized ? 0 : '6px 6px 0 0',
                borderBottom: '1px solid #00138c'
            }}
          >
            <div className="flex items-center gap-2 text-white font-bold text-[13px] drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] pointer-events-none">
              <span className="drop-shadow-md">{icon}</span>
              <span>{title}</span>
            </div>
            
            <div className="flex items-center gap-1 h-full pt-1 no-drag" onMouseDown={(e) => e.stopPropagation()}>
              <button onClick={() => minimizeWindow(id)} className="w-5 h-5 bg-blue-500 border border-white rounded-[3px] flex items-center justify-center shadow-sm hover:brightness-110 active:brightness-90"><Minus size={12} className="text-white" strokeWidth={4}/></button>
              <button onClick={() => toggleMaximize(id)} className="w-5 h-5 bg-blue-500 border border-white rounded-[3px] flex items-center justify-center shadow-sm hover:brightness-110 active:brightness-90">{isMaximized ? <div className="relative w-3 h-3"><div className="absolute top-0 right-0 w-2 h-2 border border-white"></div><div className="absolute bottom-0 left-0 w-2 h-2 border border-white bg-inherit"></div></div> : <div className="w-[10px] h-[8px] border border-white shadow-sm"></div>}</button>
              <button onClick={() => closeWindow(id)} className="w-10 h-5 flex items-center justify-center rounded-[2px] bg-[#dba8a8] border border-[#bd6a6a] hover:bg-[#e04343] hover:border-[#b02b2b] shadow-inner group transition-all ml-1"><X size={14} className="text-white drop-shadow-md" strokeWidth={3} /></button>
            </div>
          </div>
      )}

      {/* CONTEÚDO DA JANELA */}
      <div className={`flex-1 flex flex-col relative overflow-hidden ${isSkin ? '' : 'bg-[#f0f0f0] border-l border-r border-b border-[#00138c]'}`}>
         {/* AQUI ESTÁ A CORREÇÃO: Passamos onMaximize e isMaximized */}
         {isSkin ? React.cloneElement(children, { 
             onClose: () => closeWindow(id), 
             onMinimize: () => minimizeWindow(id),
             onMaximize: () => toggleMaximize(id), // Nova Prop
             isMaximized: isMaximized,             // Nova Prop
             isWindowActive: isActive
         }) : (
             <div className="flex-1 bg-white overflow-auto relative">
                 {children}
             </div>
         )}
      </div>
    </Rnd>
  );
};