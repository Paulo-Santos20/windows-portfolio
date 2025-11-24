import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { ArrowRight, Power } from 'lucide-react';

export const BootSequence = () => {
  const { bootStatus, setBootStatus } = useOSStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const startupAudio = new Audio('https://www.myinstants.com/media/sounds/windows-7-startup.mp3');

  useEffect(() => {
    if (bootStatus === 'booting') {
      const timer = setTimeout(() => {
        setBootStatus('login');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [bootStatus, setBootStatus]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Paulo') {
      setLoggingIn(true);
      startupAudio.volume = 0.5;
      startupAudio.play().catch(e => console.log("Áudio bloqueado pelo browser"));
      setTimeout(() => {
        setBootStatus('desktop');
      }, 1500);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (bootStatus === 'desktop') return null;

  if (bootStatus === 'booting') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999]">
        <div className="mb-8 relative w-20 h-20 animate-pulse">
           <div className="absolute top-0 left-0 w-9 h-9 bg-[#f2552e] rounded-sm animate-bounce" style={{ animationDelay: '0s' }}></div>
           <div className="absolute top-0 right-0 w-9 h-9 bg-[#8bc43d] rounded-sm animate-bounce" style={{ animationDelay: '0.2s' }}></div>
           <div className="absolute bottom-0 left-0 w-9 h-9 bg-[#2d9fe6] rounded-sm animate-bounce" style={{ animationDelay: '0.4s' }}></div>
           <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#fdbd08] rounded-sm animate-bounce" style={{ animationDelay: '0.6s' }}></div>
        </div>
        <h1 className="text-white font-sans text-xl tracking-wider">Iniciando o Windows</h1>
        <p className="text-gray-500 text-xs mt-2">© 2025 Microsoft Corporation</p>
      </div>
    );
  }

  // TELA LOGIN
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center font-sans"
         style={{
            // Imagem Unsplash estável
            background: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80) no-repeat center center fixed',
            backgroundSize: 'cover'
         }}
    >
      <div className="flex flex-col items-center gap-4 backdrop-blur-sm p-8 rounded-xl bg-black/20">
         <div className="w-40 h-40 rounded-lg overflow-hidden border-4 border-white/30 shadow-2xl relative">
             <img 
               src="https://i.pinimg.com/736x/8f/c9/2c/8fc92c7304192408c6902dc9eb4c5147.jpg" 
               alt="Elliot" 
               className="w-full h-full object-cover"
             />
         </div>

         <h2 className="text-white text-2xl font-light tracking-wide text-shadow">Mr. Robot</h2>

         {loggingIn ? (
             <div className="flex items-center gap-2 text-white mt-2">
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 <span>Bem-vindo</span>
             </div>
         ) : (
             <form onSubmit={handleLogin} className="flex flex-col items-center gap-2">
                 <div className="flex items-center">
                    <input 
                        type="password" 
                        placeholder="Senha"
                        className={`px-3 py-1.5 outline-none text-sm w-48 shadow-inner rounded-sm ${error ? 'bg-red-100 border border-red-500' : 'border border-white/30'}`}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(false); }}
                        autoFocus
                    />
                    <button type="submit" className="bg-[#1c6499] hover:bg-[#207cca] p-1.5 border border-[#144a73] shadow-md transition-colors rounded-sm ml-1">
                        <ArrowRight size={18} className="text-white" />
                    </button>
                 </div>
                 {error && <span className="text-white text-xs bg-red-500/80 px-2 py-0.5 rounded">Senha incorreta (Dica: Paulo)</span>}
             </form>
         )}
      </div>

      <div className="absolute bottom-8 right-8">
          <button className="flex items-center gap-2 text-white/80 hover:text-white bg-red-600/20 hover:bg-red-600/40 px-3 py-2 rounded transition-all">
              <Power size={20} />
              <span className="text-sm">Desligar</span>
          </button>
      </div>
      
      <div className="absolute bottom-8 left-8 text-white/50 text-xs">
          Windows 7 Ultimate
      </div>
    </div>
  );
};