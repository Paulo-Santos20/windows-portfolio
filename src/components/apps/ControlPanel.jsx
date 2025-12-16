import React, { useState, useEffect } from 'react';
import { useOSStore, BLISS_URL } from '../../store/useOSStore';
import { Monitor, MousePointer2, Check, Type, MousePointerClick, Crosshair } from 'lucide-react';
import bugWallpaper from '../../assets/wallpaper.webp';

// Dados...
const cursorOptions = [
    { id: 'default', name: 'Padrão', icon: <MousePointer2 size={24} className="transform -rotate-12"/> },
    { id: 'pointer', name: 'Link', icon: <MousePointerClick size={24}/> },
    { id: 'crosshair', name: 'Precisão', icon: <Crosshair size={24}/> },
    { id: 'text', name: 'Texto', icon: <Type size={24} /> },
];

const wallpapers = [
  { name: 'Bug Edition', url: bugWallpaper },
  { name: 'Windows XP (Bliss)', url: BLISS_URL },
  { name: 'Azul Real', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
  { name: 'Outono', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
];

// Recebe windowId automaticamente do WindowFrame
export const ControlPanel = ({ windowId }) => {
  const { 
      displaySettings, setDisplaySettings, 
      wallpaper, setWallpaper, 
      themeMode, setThemeMode, 
      cursorType, setCursorType,
      closeWindow // IMPORTANTE
  } = useOSStore();

  const [activeTab, setActiveTab] = useState('settings');
  const [tempScale, setTempScale] = useState(displaySettings.scale);
  const [tempFont, setTempFont] = useState(displaySettings.fontSize);

  useEffect(() => { setTempScale(displaySettings.scale); setTempFont(displaySettings.fontSize); }, [displaySettings]);

  const getResolutionText = (scale) => {
      if (scale > 1) return "800 por 600 pixels (Baixa)";
      if (scale === 1) return "1024 por 768 pixels (Normal)";
      return "1920 por 1080 pixels (Alta)";
  };

  const handleApply = () => {
      setDisplaySettings({ scale: tempScale, fontSize: tempFont });
  };

  const handleOK = () => {
      handleApply(); // Salva
      // Usa o ID injetado ou fallback para 'settings' se algo der errado
      closeWindow(windowId || 'settings'); 
  };

  const handleCancel = () => {
      closeWindow(windowId || 'settings');
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-tahoma select-none p-3 text-[11px] text-black">
        <div className="flex gap-[2px] ml-1 relative z-10 -mb-[1px]">
            {[{ id: 'themes', label: 'Temas' }, { id: 'desktop', label: 'Área de Trabalho' }, { id: 'settings', label: 'Configurações' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-1 rounded-t-[3px] border border-[#91a7b4] border-b-0 transition-none ${activeTab === tab.id ? 'bg-white font-bold pb-2 -mb-1 z-20 border-t-[#e68b2c]' : 'bg-[#ece9d8] text-gray-600 mt-1 hover:bg-[#fcfcfc]'}`}>{tab.label}</button>
            ))}
        </div>
        
        <div className="flex-1 bg-white border border-[#91a7b4] p-4 shadow-[1px_1px_0_white] relative z-0 overflow-auto custom-scrollbar">
            {activeTab === 'settings' && (
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex justify-center mb-2">
                        <div className="relative w-[160px] h-[130px] bg-[url('https://i.imgur.com/3q5q5.png')] bg-no-repeat bg-contain bg-center flex justify-center pt-[10px]">
                            <div className="w-[114px] h-[84px] bg-[#3a6ea5] border border-gray-600 flex items-center justify-center relative overflow-hidden">
                                <div className="text-white text-center leading-tight drop-shadow-md">
                                    <div className="font-bold mb-1">1</div>{getResolutionText(tempScale)}
                                </div>
                                <div className="absolute bottom-0 w-full h-2 bg-blue-800 border-t border-blue-400"></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#ece9d8] rounded border border-[#d4d0c8]">
                        <div className="flex flex-col gap-1">
                            <span className="mb-1">Resolução da tela</span>
                            <div className="flex flex-col items-center bg-white border border-[#7f9db9] p-2 relative h-24 justify-end">
                                <div className="absolute top-1 left-2 text-[9px] text-gray-500">Menos</div><div className="absolute top-1 right-2 text-[9px] text-gray-500">Mais</div>
                                <input type="range" min="0.75" max="1.25" step="0.25" value={tempScale} onChange={(e) => setTempScale(parseFloat(e.target.value))} className="w-3/4 cursor-pointer accent-blue-600 rotate-180 mb-2" />
                                <span className="font-bold text-blue-800">{getResolutionText(tempScale)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                                <span>Tamanho da fonte</span>
                                <select value={tempFont} onChange={(e) => setTempFont(e.target.value)} className="w-full border border-[#7f9db9] text-[11px] p-0.5">
                                    <option value="small">Pequena (Small Fonts)</option>
                                    <option value="normal">Normal (96 DPI)</option>
                                    <option value="large">Grande (120 DPI)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'themes' && (
                <div className="flex flex-col gap-4">
                    <fieldset className="border border-[#d4d0c8] p-3 rounded-sm">
                        <legend className="ml-1 px-1 text-blue-800">Tema</legend>
                        <div className="flex gap-4 items-center">
                            <button onClick={() => setThemeMode('xp')} className={`flex items-center gap-2 px-3 py-2 border rounded w-full text-left ${themeMode === 'xp' ? 'bg-blue-100 border-blue-500 ring-1 ring-blue-200' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <div className="w-4 h-4 bg-blue-600 rounded-full border border-white shadow-sm"></div><div className="flex flex-col"><span className="font-bold">Windows XP</span><span className="text-gray-500 text-[9px]">Padrão (Azul)</span></div>
                            </button>
                            <button onClick={() => setThemeMode('dark')} className={`flex items-center gap-2 px-3 py-2 border rounded w-full text-left ${themeMode === 'dark' ? 'bg-gray-200 border-gray-600' : 'border-gray-300 hover:bg-gray-50'}`}>
                                <div className="w-4 h-4 bg-black rounded-full border border-gray-500 shadow-sm"></div><div className="flex flex-col"><span className="font-bold">Dark Mode</span><span className="text-gray-500 text-[9px]">Estilo Escuro</span></div>
                            </button>
                        </div>
                    </fieldset>
                </div>
            )}

            {activeTab === 'desktop' && (
                <div className="flex flex-col gap-4 h-full overflow-y-auto">
                    <fieldset className="border border-[#d4d0c8] p-3 rounded-sm"><legend className="ml-1 px-1 text-blue-800">Plano de Fundo</legend><div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">{wallpapers.map((wp, idx) => (<div key={idx} onClick={() => setWallpaper(wp.url)} className={`cursor-pointer relative border-2 flex flex-col ${wallpaper === wp.url ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'}`}><div className="h-20 bg-gray-200 w-full"><img src={wp.url} alt={wp.name} className="w-full h-full object-cover" /></div><span className="p-1 text-center truncate">{wp.name}</span>{wallpaper === wp.url && <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-0.5"><Check size={8} className="text-white"/></div>}</div>))}</div></fieldset>
                    <fieldset className="border border-[#d4d0c8] p-3 rounded-sm"><legend className="ml-1 px-1 text-blue-800">Ponteiros do Mouse</legend><div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">{cursorOptions.map(opt => (<button key={opt.id} onClick={() => setCursorType(opt.id)} className={`flex flex-col items-center justify-center p-2 border rounded min-w-[70px] ${cursorType === opt.id ? 'bg-white border-blue-500 shadow-inner' : 'border-transparent hover:bg-white hover:border-gray-300'}`}><div className="mb-1 text-gray-700">{opt.icon}</div><span className="text-center">{opt.name}</span></button>))}</div></fieldset>
                </div>
            )}
        </div>

        {/* RODAPÉ */}
        <div className="flex justify-end gap-2 mt-3 pt-1 border-t border-white/50">
            <button onClick={handleOK} className="min-w-[75px] px-3 py-1 bg-[#f5f5f5] border border-gray-400 rounded-[2px] shadow-sm hover:border-black active:bg-gray-200">OK</button>
            <button onClick={handleCancel} className="min-w-[75px] px-3 py-1 bg-[#f5f5f5] border border-gray-400 rounded-[2px] shadow-sm hover:border-black active:bg-gray-200">Cancelar</button>
            <button onClick={handleApply} className="min-w-[75px] px-3 py-1 bg-[#f5f5f5] border border-gray-400 rounded-[2px] shadow-sm hover:border-black active:bg-gray-200">Aplicar</button>
        </div>
    </div>
  );
};