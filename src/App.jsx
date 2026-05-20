import React, { useState, useEffect, useCallback } from 'react';
import { useOSStore } from './store/useOSStore';
import { BootSequence } from './components/os/BootSequence';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { WindowFrame } from './components/os/WindowFrame';
import { AltTabSwitcher } from './components/os/AltTabSwitcher';

const BREAKPOINTS = {
  phone: window.matchMedia('(max-width: 639px)'),
  tablet: window.matchMedia('(min-width: 640px) and (max-width: 1023px)'),
  desktop: window.matchMedia('(min-width: 1024px)'),
};

const App = () => {
  const { wallpaper, bootStatus, windows, cursorType, displaySettings, theme, setBreakpoint, focusWindow } = useOSStore();
  
  const [isMobile, setIsMobile] = useState(BREAKPOINTS.phone.matches || BREAKPOINTS.tablet.matches || 'ontouchstart' in window);

  const updateBreakpoint = useCallback(() => {
    if (BREAKPOINTS.phone.matches) { setBreakpoint('phone'); setIsMobile(true); }
    else if (BREAKPOINTS.tablet.matches) { setBreakpoint('tablet'); setIsMobile(true); }
    else { setBreakpoint('desktop'); setIsMobile(false); }
  }, [setBreakpoint]);

  useEffect(() => {
    updateBreakpoint();
    const handleChange = () => updateBreakpoint();
    Object.values(BREAKPOINTS).forEach(mq => mq.addEventListener('change', handleChange));
    return () => Object.values(BREAKPOINTS).forEach(mq => mq.removeEventListener('change', handleChange));
  }, [updateBreakpoint]);

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
      className={`h-screen w-screen overflow-hidden relative select-none font-tahoma bg-black ${theme === 'win7' ? 'theme-win7' : 'theme-winxp'}`}
      style={{ cursor: getCursorStyle() }}
    >
      <BootSequence />

      {bootStatus === 'desktop' && (
        <div 
            className="w-full h-full relative"
            style={{ fontSize: getFontSize() }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${wallpaper})` }}
            onError={(e) => { e.target.style.backgroundImage = 'linear-gradient(135deg, #3a6ea5, #1a3a5a)'; }}
          />

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

          <AltTabSwitcher windows={windows} activeWindowId={useOSStore.getState().activeWindowId} onSelect={focusWindow} />
        </div>
      )}
    </div>
  );
};

export default App;