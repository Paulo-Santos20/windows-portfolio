import React from 'react';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { WindowFrame } from './components/os/WindowFrame';
import { BootSequence } from './components/os/BootSequence'; // NOVO
import { useOSStore } from './store/useOSStore';

function App() {
  const { windows, wallpaper, bootStatus } = useOSStore();

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat font-sans select-none"
      style={{ backgroundImage: bootStatus === 'desktop' ? `url(${wallpaper})` : 'none', backgroundColor: '#000' }}
    >
      {/* Sequência de Boot (Sobrepõe tudo até logar) */}
      <BootSequence />

      {/* Só renderiza o sistema se estiver no desktop */}
      {bootStatus === 'desktop' && (
        <>
          <Desktop />

          {windows.map((win) => (
            <WindowFrame 
              key={win.id}
              {...win}
            >
              {win.component}
            </WindowFrame>
          ))}

          <Taskbar />
        </>
      )}
    </div>
  );
}

export default App;