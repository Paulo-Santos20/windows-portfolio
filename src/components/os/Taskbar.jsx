import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { AppWindow, Power, Search, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

// --- MENU INICIAR (Estilo Windows 7 Clássico) ---
const StartMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="absolute bottom-12 left-0 w-[400px] h-[550px] rounded-t-lg flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] z-50 overflow-hidden font-sans border border-[#536577]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Corpo do Menu (Duas Colunas) */}
      <div className="flex-1 flex bg-white/95 backdrop-blur-sm">
        
        {/* Coluna Esquerda (Programas - Branco) */}
        <div className="w-[60%] bg-white p-2 flex flex-col gap-1 overflow-y-auto">
           {/* Item de Lista Fake */}
           <div className="flex items-center gap-3 p-2 hover:bg-[#dceafc] hover:shadow-[inset_0_0_0_1px_#7da2ce] rounded-[2px] cursor-pointer group transition-all">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white shadow-md">
                 <AppWindow size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-bold text-slate-800 group-hover:text-black">Internet Explorer</span>
                 <span className="text-[10px] text-slate-500">Navegador</span>
              </div>
           </div>

           {/* Repita para encher a lista */}
           <div className="flex items-center gap-3 p-2 hover:bg-[#dceafc] hover:shadow-[inset_0_0_0_1px_#7da2ce] rounded-[2px] cursor-pointer group">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white shadow-md">CV</div>
              <span className="text-sm font-bold text-slate-800">Currículo PDF</span>
           </div>
           
           <div className="flex-1"></div> {/* Espaçador para empurrar "Todos os Programas" para baixo */}
           
           <button className="flex items-center gap-2 p-2 hover:bg-[#dceafc] text-slate-700 font-bold text-sm mt-2 group">
             <span>Todos os programas</span>
             <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/>
           </button>
        </div>

        {/* Coluna Direita (Sistema - Escuro) */}
        <div className="w-[40%] bg-[#1b2531] text-white p-3 flex flex-col gap-2 shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.5)] border-l border-[#536577]">
            {['Meus Documentos', 'Imagens', 'Música', 'Computador', 'Painel de Controle', 'Dispositivos e Impressoras', 'Ajuda e Suporte'].map((item, i) => (
                <button key={i} className="text-left px-2 py-1.5 text-sm hover:bg-white/10 rounded hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] text-[#cfd8e6] hover:text-white transition-colors">
                    {item}
                </button>
            ))}
        </div>
      </div>

      {/* Rodapé do Menu (Busca e Desligar) */}
      <div className="h-14 bg-gradient-to-b from-[#2f4256] to-[#16212d] flex items-center justify-between px-4 gap-4 border-t border-[#536577]">
          {/* Barra de Busca */}
          <div className="relative flex-1">
             <div className="bg-white rounded-[3px] flex items-center px-2 py-1 border border-[#536577] shadow-inner">
                <Search size={14} className="text-slate-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Pesquisar programas e arquivos" 
                  className="w-full text-xs outline-none bg-transparent text-slate-700 italic placeholder:text-slate-400"
                />
             </div>
          </div>

          {/* Botão Desligar */}
          <button 
             onClick={() => window.close()} // Fecha a aba (simulado)
             className="flex items-center gap-1 bg-gradient-to-b from-[#7e5c5c] to-[#4a2e2e] hover:from-[#9e7c7c] hover:to-[#6a4e4e] text-white px-3 py-1 rounded-[3px] border border-[#2e1a1a] shadow-sm text-xs font-bold whitespace-nowrap"
          >
             Desligar
             <Power size={12} />
          </button>
      </div>
    </div>
  );
};

export const Taskbar = () => {
  const { windows, activeWindowId, focusWindow, restoreWindow, minimizeWindow } = useOSStore();
  const [startOpen, setStartOpen] = useState(false);
  const [timeData, setTimeData] = useState({ time: '', date: '' });

  // Relógio Sincronizado com Recife
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Força o Fuso de Recife
      const timeString = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Recife',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now);

      const dateString = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Recife',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(now);

      setTimeData({ time: timeString, date: dateString });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {startOpen && <div className="fixed inset-0 z-40" onClick={() => setStartOpen(false)} />}
      
      {/* O Menu Iniciar agora fica "fora" da barra para não bugar o layout */}
      <div className="fixed bottom-10 left-0 z-50">
         <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
      </div>
      
      {/* BARRA DE TAREFAS (Aero Glass) */}
      <div className="fixed bottom-0 w-full h-10 flex items-center justify-between z-[9999] px-1 select-none"
           style={{
             background: 'linear-gradient(to bottom, rgba(28, 55, 76, 0.9) 0%, rgba(20, 30, 48, 0.95) 50%, rgba(0, 0, 0, 0.95) 100%)',
             backdropFilter: 'blur(10px)',
             borderTop: '1px solid rgba(255,255,255,0.3)',
             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
           }}
      >
        
        {/* Botão Iniciar (The Orb) */}
        <div className="relative -top-[2px] z-50 ml-1">
           <button 
            onClick={() => setStartOpen(!startOpen)}
            className="w-10 h-10 rounded-full transition-all hover:brightness-110 active:scale-95 flex items-center justify-center group relative shadow-[0_0_10px_rgba(0,100,255,0.5)]"
            style={{
                background: 'radial-gradient(circle at center, #1f508a 0%, #153864 45%, #0d2138 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.5), 0 2px 5px rgba(0,0,0,0.8)'
            }}
           >
                {/* Logo Windows Simples com CSS */}
                <div className="grid grid-cols-2 gap-[2px] opacity-90 group-hover:opacity-100">
                    <div className="w-2 h-2 bg-[#f2552e] rounded-tl-[1px]"></div>
                    <div className="w-2 h-2 bg-[#8bc43d] rounded-tr-[1px]"></div>
                    <div className="w-2 h-2 bg-[#2d9fe6] rounded-bl-[1px]"></div>
                    <div className="w-2 h-2 bg-[#fdbd08] rounded-br-[1px]"></div>
                </div>
                {/* Brilho Glossy do Botão */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none"></div>
           </button>
        </div>

        {/* Área de Apps (Janelas) */}
        <div className="flex-1 flex items-center gap-1 px-3 pl-4 overflow-x-auto h-full">
          {windows.map((win) => (
             <button
               key={win.id}
               onClick={() => {
                 if (win.isMinimized) restoreWindow(win.id);
                 else if (activeWindowId === win.id) minimizeWindow(win.id);
                 else focusWindow(win.id);
               }}
               className={clsx(
                 "relative h-[34px] px-3 min-w-[140px] max-w-[180px] rounded-[3px] flex items-center gap-2 border border-transparent hover:shadow-[inset_0_0_5px_rgba(255,255,255,0.4)] hover:bg-white/10 transition-all text-shadow",
                 activeWindowId === win.id && !win.isMinimized
                   ? "bg-gradient-to-b from-white/20 to-white/5 border-white/30 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)]" 
                   : ""
               )}
             >
               <span className="drop-shadow-md">{win.icon}</span>
               <span className="text-xs text-white truncate drop-shadow-md font-sans">{win.title}</span>
             </button>
          ))}
        </div>

        {/* Tray (Relógio e Ícones) */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0d161f]/50 rounded-lg border border-white/5 mx-2 shadow-inner">
           {/* Ícones de Sistema Pequenos */}
           <div className="flex gap-2 text-white/80 mr-2">
               <div className="hover:bg-white/10 p-1 rounded cursor-pointer"><div className="w-3 h-3 border-2 border-white/80 rounded-sm mt-1"></div></div> {/* Battery fake */}
               <div className="hover:bg-white/10 p-1 rounded cursor-pointer"><div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/80"></div></div> {/* Wifi fake */}
           </div>
           
           {/* Relógio Recife */}
           <div className="flex flex-col items-center justify-center text-white text-[11px] leading-tight w-[60px] cursor-default" title="Horário de Recife - PE">
               <span>{timeData.time}</span>
               <span>{timeData.date}</span>
           </div>
        </div>
        
        {/* Mostrar Área de Trabalho (Barra vertical no canto) */}
        <div className="w-3 h-full border-l border-white/30 hover:bg-white/30 hover:shadow-[0_0_10px_white] transition-all cursor-pointer ml-1" title="Mostrar Área de Trabalho"></div>

      </div>
    </>
  );
};