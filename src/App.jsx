import React, { useState, useEffect } from 'react';
import { useOSStore } from './store/useOSStore';
import { BootSequence } from './components/os/BootSequence';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { WindowFrame } from './components/os/WindowFrame';

// --- TELA DE ORIENTAÇÃO (Para Mobile) ---
const OrientationLock = ({ isPortrait }) => {
  if (!isPortrait) return null;
  
  return (
    <div className="fixed inset-0 bg-[#003399] z-[999999] flex flex-col items-center justify-center p-8">
      <div className="bg-[#ece9d8] p-6 rounded-lg shadow-2xl text-center max-w-sm">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-xl font-bold text-[#003399] mb-2">Gire seu dispositivo</h2>
        <p className="text-sm text-gray-600">
          Para uma melhor experiência, gire seu celular para o modo paisagem (horizontal).
        </p>
        <div className="mt-4 flex justify-center">
          <div className="animate-bounce text-4xl">↔️</div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { wallpaper, bootStatus, windows, cursorType, displaySettings } = useOSStore();
  
  // Detectar modo mobile e orientação
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobile(mobile);
      setIsPortrait(portrait);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    // Forçar orientação landscape via API se disponível
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  const getFontSize = () => {
      switch(displaySettings.fontSize) {
          case 'small': return '10px';
          case 'large': return '14px';
          default: return '12px';
      }
  };

  const getCursorStyle = () => {
      switch (cursorType) {
          case 'pointer': return 'pointer';
          case 'crosshair': return 'crosshair';
          case 'text': return 'text';
          case 'wait': return 'wait';
          default: return 'default';
      }
  };

  // Calcular scale dinâmico baseado no tamanho da tela
  const getScale = () => {
    if (isMobile) {
      // Em mobile, usar escala baseada na largura
      const baseScale = Math.min(window.innerWidth / 1024, window.innerHeight / 768);
      return Math.min(baseScale * 0.85, 1);
    }
    return displaySettings.scale;
  };

  return (
    <div 
      className={`h-screen w-screen overflow-hidden relative select-none font-tahoma bg-black`}
      style={{ cursor: getCursorStyle() }}
    >
      {/* Tela de orientação para mobile portrait */}
      <OrientationLock isPortrait={isMobile && isPortrait} />

      <BootSequence />

      {bootStatus === 'desktop' && (
        <div 
            className="w-full h-full relative origin-top-left transition-all duration-300 ease-in-out"
            style={{ 
                transform: `scale(${getScale()})`,
                width: isMobile ? '100vw' : `${100 / getScale()}%`,
                height: isMobile ? '100vh' : `${100 / getScale()}%`,
                fontSize: getFontSize(),
                // Ajustar transform origin para mobile
                transformOrigin: isMobile ? 'center center' : 'top left'
            }}
        >
          <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${wallpaper})` }} />

          <Desktop isMobile={isMobile} />

          {windows.map((win) => (
            <WindowFrame
              key={win.id}
              id={win.id}
              title={win.title}
              icon={win.icon}
              zIndex={win.zIndex}
              isMinimized={win.isMinimized}
              isMaximized={win.isMaximized}
              isSkin={win.isSkin}
              initialWidth={win.initialWidth}
              initialHeight={win.initialHeight}
              hasMenuBar={win.hasMenuBar}
              resizable={win.resizable}
              isMobile={isMobile}
            >
              {win.component}
            </WindowFrame>
          ))}

          <Taskbar isMobile={isMobile} />
        </div>
      )}
    </div>
  );
};

export default App;