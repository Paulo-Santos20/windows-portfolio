import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { clsx } from 'clsx';

export const WindowFrame = ({ id, title, icon, children, zIndex, isMinimized, isMaximized }) => {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, activeWindowId } = useOSStore();
  const [isDragging, setIsDragging] = useState(false);
  
  const isActive = activeWindowId === id;

  if (isMinimized) return null;

  return (
    <Rnd
      // Lógica de Posição
      default={{ x: 50, y: 50, width: 800, height: 600 }}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
      size={isMaximized ? { width: '100%', height: 'calc(100% - 40px)' } : undefined}
      
      // Configurações de Performance e Comportamento
      bounds="parent"
      minWidth={320}
      minHeight={200}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="window-header" // Só arrasta pelo cabeçalho
      
      // Eventos para gerenciar fluidez
      onDragStart={() => {
        setIsDragging(true);
        focusWindow(id);
      }}
      onDragStop={() => setIsDragging(false)}
      onMouseDown={() => focusWindow(id)}
      
      // Classes CSS
      className={clsx(
        "flex flex-col overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
        isActive ? "z-50" : "z-0",
        // SÓ aplica transição se NÃO estiver arrastando. Isso elimina o lag.
        !isDragging && "transition-all duration-200 ease-out",
        isMaximized ? "rounded-none" : "rounded-lg"
      )}
      
      // Styles Inline para garantir prioridade
      style={{ 
        zIndex: zIndex, 
        display: 'flex',
        // Aceleração de Hardware: Joga o render para a GPU
        willChange: isDragging ? 'transform' : 'auto', 
        // Garante que o cursor não mude para 'texto' enquanto arrasta rápido
        userSelect: 'none'
      }}
    >
      {/* HEADER (Barra de Título) */}
      <div 
        className={clsx(
          "window-header h-8 flex-shrink-0 flex items-center justify-between px-2 cursor-default relative",
          // Cursor muda para move apenas no header
          !isMaximized && "cursor-move"
        )}
        onDoubleClick={() => toggleMaximize(id)}
        style={{
            background: isActive 
                ? 'linear-gradient(to bottom, #86c4e8 0%, #469ad3 4%, #207cca 50%, #207cca 96%, #54a5d8 100%)' 
                : 'linear-gradient(to bottom, #e2e2e2 0%, #d1d1d1 50%, #bababa 100%)',
            borderTop: '1px solid rgba(255,255,255,0.6)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
        }}
      >
        <div className="flex items-center gap-2 font-sans text-[13px] tracking-wide pointer-events-none" style={{ textShadow: '0 0 5px rgba(255,255,255,0.8)' }}>
          <span className="drop-shadow-md text-slate-800">{icon}</span>
          <span className={clsx("font-bold drop-shadow-sm", isActive ? "text-[#1e3e5c]" : "text-slate-600")}>{title}</span>
        </div>
        
        {/* Botões de Controle (Com classe 'no-drag' para evitar bugs) */}
        <div className="flex items-center gap-1 h-full pt-1 no-drag" onMouseDown={(e) => e.stopPropagation()}>
          {/* Minimizar */}
          <button 
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} 
            className="w-7 h-5 flex items-center justify-center rounded-[2px] hover:bg-white/30 border border-transparent hover:border-white/40 shadow-inner group transition-all"
          >
            <div className="w-2 h-[2px] bg-white shadow-sm group-hover:bg-slate-800"></div>
          </button>
          
          {/* Maximizar / Restaurar */}
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(id); }}
            className="w-7 h-5 flex items-center justify-center rounded-[2px] hover:bg-white/30 border border-transparent hover:border-white/40 shadow-inner group transition-all"
          >
            {isMaximized ? (
                <div className="relative w-3 h-3">
                    <div className="absolute top-0 right-0 w-2 h-2 border border-white bg-transparent shadow-sm group-hover:border-slate-800"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border border-white bg-transparent shadow-sm group-hover:border-slate-800 bg-inherit"></div>
                </div>
            ) : (
                <div className="w-[10px] h-[8px] border border-white shadow-sm group-hover:border-slate-800"></div>
            )}
          </button>
          
          {/* Fechar */}
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }} 
            className="w-10 h-5 flex items-center justify-center rounded-[2px] bg-[#dba8a8] border border-[#bd6a6a] hover:bg-[#e04343] hover:border-[#b02b2b] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] group transition-all ml-1"
            style={{
                background: 'linear-gradient(to bottom, #ebaeb0 0%, #d87e81 50%, #c43f43 51%, #e06c6f 100%)'
            }}
          >
            <X size={14} className="text-white drop-shadow-md" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Conteúdo da Janela */}
      <div className="flex-1 flex flex-col relative bg-[#207cca] p-[3px]">
         <div className="flex-1 bg-white overflow-hidden relative border border-slate-400 select-text">
             {children}
         </div>
      </div>
    </Rnd>
  );
};