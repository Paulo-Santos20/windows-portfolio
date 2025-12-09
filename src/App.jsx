import React from 'react';
import { useOSStore } from './store/useOSStore';
import { BootSequence } from './components/os/BootSequence';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { WindowFrame } from './components/os/WindowFrame';

const App = () => {
  const { wallpaper, bootStatus, windows, cursorType, displaySettings } = useOSStore();

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

  return (
    <div 
      className={`h-screen w-screen overflow-hidden relative select-none font-tahoma bg-black`}
      style={{ cursor: getCursorStyle() }}
    >
      <BootSequence />

      {bootStatus === 'desktop' && (
        <div 
            className="w-full h-full relative origin-top-left transition-all duration-300 ease-in-out"
            style={{ 
                transform: `scale(${displaySettings.scale})`,
                width: `${100 / displaySettings.scale}%`,
                height: `${100 / displaySettings.scale}%`,
                fontSize: getFontSize() 
            }}
        >
          <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${wallpaper})` }} />

          <Desktop />

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
              // --- NOVAS PROPS FALTANTES ---
              initialWidth={win.initialWidth}
              initialHeight={win.initialHeight}
              hasMenuBar={win.hasMenuBar}
              resizable={win.resizable}
            >
              {win.component}
            </WindowFrame>
          ))}

          <Taskbar />
        </div>
      )}
    </div>
  );
};

export default App;