import React from 'react';
import { Desktop } from './components/os/Desktop';
import { Taskbar } from './components/os/Taskbar';
import { WindowFrame } from './components/os/WindowFrame';
import { useOSStore } from './store/useOSStore';
// Certifique-se de ter uma imagem em src/assets/wallpaper.jpg
import desktopBg from './assets/wallpaper.webp'; 

function App() {
  const { windows } = useOSStore();

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: `url(${desktopBg})`, backgroundColor: '#2d4e66' }}
    >
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
    </div>
  );
}

export default App;