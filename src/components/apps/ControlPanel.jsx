import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Monitor, Moon, Sun, Check, MousePointer2, Crosshair, Type, MousePointerClick } from 'lucide-react'; // IBeam removido, Type adicionado
import bugWallpaper from '../../assets/Wallpaper.webp';

// Opções de Mouse
const cursorOptions = [
    { id: 'default', name: 'Aero Padrão', icon: <MousePointer2 size={24} className="transform -rotate-12"/> },
    { id: 'pointer', name: 'Link Select', icon: <MousePointerClick size={24}/> },
    { id: 'crosshair', name: 'Precisão', icon: <Crosshair size={24}/> },
    // Usamos o ícone 'Type' ou um visual manual para o cursor de texto
    { id: 'text', name: 'Texto (I-Beam)', icon: <Type size={24} /> },
    { id: 'wait', name: 'Ocupado', icon: <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> },
];

const wallpapers = [
  { name: 'Windows 7 Original', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { name: 'Architecture', url: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { name: 'Nature', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { name: 'Dark Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80' },
  { name: 'Bug Edition', url: bugWallpaper },
];

export const ControlPanel = () => {
  const { wallpaper, setWallpaper, themeMode, setThemeMode, cursorType, setCursorType } = useOSStore();

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] font-sans">
      <div className="flex h-full">
         {/* Sidebar */}
         <div className="w-48 bg-gradient-to-b from-[#f5faff] to-[#d6e7f5] border-r border-[#aebdd1] p-4 hidden sm:block">
            <h3 className="text-[#1e395b] font-bold mb-4">Painel de Controle</h3>
            <ul className="text-sm text-[#1e395b] space-y-2 cursor-pointer">
                <li className="font-bold underline">Aparência e Personalização</li>
                <li className="hover:underline">Hardware e Sons</li>
                <li className="hover:underline">Dispositivos e Impressoras</li>
            </ul>
         </div>

         {/* Conteúdo */}
         <div className="flex-1 p-6 overflow-y-auto bg-white">
            <h2 className="text-[#1e395b] text-lg font-bold mb-6 border-b border-slate-300 pb-2">Personalização</h2>
            
            {/* 1. TEMAS */}
            <div className="mb-8">
                <h4 className="text-slate-700 font-bold mb-3 flex items-center gap-2"><Monitor size={18} /> Tema da Janela</h4>
                <div className="flex gap-4">
                    <button onClick={() => setThemeMode('aero')} className={`flex flex-col items-center gap-2 p-3 rounded border w-32 transition-all ${themeMode === 'aero' ? 'bg-blue-50 border-blue-400 shadow-sm' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <div className="w-full h-8 bg-gradient-to-b from-[#86c4e8] to-[#207cca] rounded"></div>
                        <span className="text-xs font-medium">Windows Aero</span>
                    </button>
                    <button onClick={() => setThemeMode('dark')} className={`flex flex-col items-center gap-2 p-3 rounded border w-32 transition-all ${themeMode === 'dark' ? 'bg-slate-800 border-slate-600 shadow-sm text-white' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <div className="w-full h-8 bg-gradient-to-b from-[#4a4a4a] to-[#000] rounded"></div>
                        <span className="text-xs font-medium">Dark Glass</span>
                    </button>
                </div>
            </div>

            {/* 2. PONTEIROS DO MOUSE */}
            <div className="mb-8">
                <h4 className="text-slate-700 font-bold mb-3 flex items-center gap-2"><MousePointer2 size={18} /> Ponteiros do Mouse</h4>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {cursorOptions.map(opt => (
                        <button 
                            key={opt.id}
                            onClick={() => setCursorType(opt.id)}
                            className={`flex flex-col items-center justify-center gap-2 p-2 rounded border w-24 h-24 transition-all ${cursorType === opt.id ? 'bg-blue-100 border-blue-400 shadow-inner' : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            <div className="text-slate-700">{opt.icon}</div>
                            <span className="text-[10px] text-center leading-tight">{opt.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. PAPEL DE PAREDE */}
            <div>
                <h4 className="text-slate-700 font-bold mb-3">Plano de Fundo da Área de Trabalho</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {wallpapers.map((wp, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setWallpaper(wp.url)}
                            className={`cursor-pointer group relative rounded overflow-hidden border-2 shadow-sm ${wallpaper === wp.url ? 'border-blue-500' : 'border-transparent hover:border-slate-300'}`}
                        >
                            <div className="aspect-video bg-slate-200">
                                <img src={wp.url} alt={wp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm text-white text-[10px] p-1 text-center truncate">
                                {wp.name}
                            </div>
                            {wallpaper === wp.url && <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5 shadow"><Check size={12} className="text-white" /></div>}
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};