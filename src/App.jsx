import React from 'react';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { WindowFrame } from './components/os/WindowFrame';
import { BootSequence } from './components/os/BootSequence';
import { ContextMenu } from './components/os/ContextMenu';
import { useOSStore } from './store/useOSStore';

function App() {
  const { windows, wallpaper, bootStatus, closeContextMenu, cursorType } = useOSStore(); // Importe cursorType

  // Mapa de classes Tailwind para os cursores
  const cursorClass = {
      'default': 'cursor-default',
      'pointer': 'cursor-pointer',
      'crosshair': 'cursor-crosshair',
      'text': 'cursor-text',
      'wait': 'cursor-wait'
  }[cursorType] || 'cursor-default';

  return (
    <div 
      // APLICA O CURSOR AQUI
      className={`h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat font-sans select-none ${cursorClass}`}
      style={{ backgroundImage: bootStatus === 'desktop' ? `url(${wallpaper})` : 'none', backgroundColor: '#000' }}
      onClick={() => closeContextMenu()}
      onContextMenu={(e) => e.preventDefault()}
    >
      <BootSequence />

      {bootStatus === 'desktop' && (
        <>
          <Desktop />

          {windows.map((win) => (
            <WindowFrame key={win.id} {...win}>
              {win.component}
            </WindowFrame>
          ))}

          <Taskbar />
          <ContextMenu />
        </>
      )}
    </div>
  );
}

export default App;