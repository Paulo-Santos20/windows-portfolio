import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { clsx } from 'clsx';

export const WindowFrame = ({ id, title, icon, children, zIndex, isMinimized, isMaximized }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, activeWindowId, themeMode } = useOSStore();
  const [isDragging, setIsDragging] = useState(false);
  
  const isActive = activeWindowId === id;

  // --- LÓGICA DE CORES DO TEMA ---
  // Gradiente Azul (Aero) vs Gradiente Preto (Dark)
  const headerBackground = themeMode === 'dark'
    ? (isActive 
        ? 'linear-gradient(to bottom, #505050 0%, #303030 50%, #151515 50%, #000000 100%)' // Dark Ativo
        : 'linear-gradient(to bottom, #3f3f3f 0%, #2b2b2b 50%, #1a1a1a 100%)')            // Dark Inativo
    : (isActive 
        ? 'linear-gradient(to bottom, #86c4e8 0%, #469ad3 4%, #207cca 50%, #207cca 96%, #54a5d8 100%)' // Aero Ativo
        : 'linear-gradient(to bottom, #e2e2e2 0%, #d1d1d1 50%, #bababa 100%)');            // Aero Inativo

  // Cor das bordas laterais
  const borderColor = themeMode === 'dark' ? '#151515' : '#207cca';

  // Cor do texto do título
  const titleColor = themeMode === 'dark' ? 'text-white/90' : (isActive ? "text-[#1e3e5c]" : "text-slate-600");

  if (isMinimized) return null;

  return (
    <Rnd
      default={{ x: 50, y: 50, width: 800, height: 600 }}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      size={isMaximized ? { width: '100%', height: 'calc(100% - 40px)' } : undefined}
      bounds="parent"
      minWidth={320}
      minHeight={200}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-header"
      
      onDragStart={() => { setIsDragging(true); focusWindow(id); }}
      onDragStop={() => setIsDragging(false)}
      onMouseDown={() => focusWindow(id)}
      
      className={clsx(
        "flex flex-col overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
        isActive ? "z-50" : "z-0",
        !isDragging && "transition-all duration-200 ease-out",
        isMaximized ? "rounded-none" : "rounded-lg"
      )}
      
      style={{ 
        zIndex: zIndex, 
        display: 'flex',
        willChange: isDragging ? 'transform' : 'auto', 
        userSelect: 'none'
      }}
    >
      {/* HEADER DINÂMICO */}
      <div 
        className={clsx(
          "window-header h-8 flex-shrink-0 flex items-center justify-between px-2 cursor-default relative",
          !isMaximized && "cursor-move"
        )}
        onDoubleClick={() => toggleMaximize(id)}
        style={{
            background: headerBackground,
            borderTop: '1px solid rgba(255,255,255,0.3)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <div className="flex items-center gap-2 font-sans text-[13px] tracking-wide pointer-events-none" style={{ textShadow: themeMode === 'dark' ? '0 1px 2px black' : '0 0 5px white' }}>
          <span className="drop-shadow-md">{icon}</span>
          <span className={clsx("font-bold drop-shadow-sm", titleColor)}>{title}</span>
        </div>
        
        <div className="flex items-center gap-1 h-full pt-1 no-drag" onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="w-7 h-5 flex items-center justify-center rounded-[2px] hover:bg-white/20 shadow-inner group transition-all">
            <div className="w-2 h-[2px] bg-white shadow-sm"></div>
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); toggleMaximize(id); }} className="w-7 h-5 flex items-center justify-center rounded-[2px] hover:bg-white/20 shadow-inner group transition-all">
            {isMaximized ? (
                <div className="relative w-3 h-3">
                    <div className="absolute top-0 right-0 w-2 h-2 border border-white"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border border-white bg-inherit"></div>
                </div>
            ) : (
                <div className="w-[10px] h-[8px] border border-white shadow-sm"></div>
            )}
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="w-10 h-5 flex items-center justify-center rounded-[2px] bg-[#dba8a8] border border-[#bd6a6a] hover:bg-[#e04343] hover:border-[#b02b2b] shadow-inner group transition-all ml-1">
            <X size={14} className="text-white drop-shadow-md" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA JANELA */}
      <div className="flex-1 flex flex-col relative p-[3px]" style={{ backgroundColor: borderColor }}>
         <div className="flex-1 bg-white overflow-hidden relative border border-slate-400 select-text">
             {children}
         </div>
      </div>
    </Rnd>
  );
};