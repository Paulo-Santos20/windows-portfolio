import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { ArrowRight, Power, ArrowLeft } from 'lucide-react';

// --- CONFIGURAÇÃO DOS USUÁRIOS ---
const USERS = [
  { 
    id: 'paulo', 
    name: 'Paulo Cardoso', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', // Foto Profissional
    password: 'paulo',
    isAdmin: true
  },
  { 
    id: 'robot', 
    name: 'Mr. Robot', 
    avatar: 'https://i.pinimg.com/736x/8f/c9/2c/8fc92c7304192408c6902dc9eb4c5147.jpg', // Foto Elliot
    password: 'fsociety',
    isAdmin: true
  }
];

export const BootSequence = () => {
  const { bootStatus, setBootStatus, setCurrentUser } = useOSStore();
  
  // Estados Locais
  const [selectedUser, setSelectedUser] = useState(null); // null = mostra lista, obj = mostra senha
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Som
  const startupAudio = new Audio('https://www.myinstants.com/media/sounds/windows-7-startup.mp3');

  // 1. Efeito de Boot (Logo do Windows)
  useEffect(() => {
    if (bootStatus === 'booting') {
      const timer = setTimeout(() => {
        setBootStatus('login');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [bootStatus, setBootStatus]);

  // 2. Resetar estados ao voltar para login (Logoff)
  useEffect(() => {
      if (bootStatus === 'login') {
          setSelectedUser(null);
          setPasswordInput('');
          setError('');
          setIsLoggingIn(false);
      }
  }, [bootStatus]);

  // Ações
  const handleUserClick = (user) => {
      setSelectedUser(user);
      setPasswordInput('');
      setError('');
  };

  const handleBack = () => {
      setSelectedUser(null);
      setError('');
  };

  const handleLogin = (e) => {
      e.preventDefault();
      if (!selectedUser) return;

      if (passwordInput === selectedUser.password) {
          setIsLoggingIn(true);
          
          // Define na store quem logou
          setCurrentUser(selectedUser.name, selectedUser.avatar);

          startupAudio.volume = 0.5;
          startupAudio.play().catch(() => {});

          setTimeout(() => {
              setBootStatus('desktop');
          }, 1500);
      } else {
          setError('O nome de usuário ou a senha estão incorretos.');
          setPasswordInput('');
      }
  };

  // Se já estiver no desktop, não renderiza nada
  if (bootStatus === 'desktop') return null;

  // --- TELA 1: ANIMAÇÃO DE BOOT ---
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

  // --- TELA 2: LOGIN (SELEÇÃO E SENHA) ---
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center font-sans"
         style={{
            background: 'url(https://wallpaperaccess.com/full/253488.jpg) no-repeat center center fixed',
            backgroundSize: 'cover'
         }}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-md transition-all duration-500">
         
         {/* SE NENHUM USUÁRIO SELECIONADO -> LISTA DE USUÁRIOS */}
         {!selectedUser && (
             <div className="flex flex-col gap-4 w-full items-center animate-in fade-in zoom-in duration-300">
                 {USERS.map(user => (
                     <div 
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/20 cursor-pointer transition-all w-64 group border border-transparent hover:border-white/30 hover:shadow-lg"
                     >
                         <div className="w-16 h-16 rounded-md border-2 border-white/50 overflow-hidden relative shadow-md group-hover:border-white">
                             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                         </div>
                         <span className="text-white text-lg font-medium text-shadow group-hover:underline decoration-white/50">{user.name}</span>
                     </div>
                 ))}
             </div>
         )}

         {/* SE USUÁRIO SELECIONADO -> CAMPO DE SENHA */}
         {selectedUser && (
             <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 
                 {/* Avatar Selecionado */}
                 <div className="w-32 h-32 rounded-md border-4 border-white/40 overflow-hidden shadow-2xl relative mb-2">
                     <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                 </div>

                 <h2 className="text-white text-2xl font-light tracking-wide text-shadow">{selectedUser.name}</h2>

                 {isLoggingIn ? (
                     <div className="flex flex-col items-center gap-2">
                         <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         <span className="text-white text-sm">Bem-vindo</span>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center w-full">
                         <form onSubmit={handleLogin} className="flex items-center relative group">
                            <input 
                                type="password" 
                                placeholder="Senha"
                                className="px-3 py-1.5 outline-none text-sm w-56 shadow-inner rounded-sm border border-white/30 focus:border-white/60 transition-colors"
                                value={passwordInput}
                                onChange={(e) => { setPasswordInput(e.target.value); setError(''); }}
                                autoFocus
                            />
                            <button 
                                type="submit" 
                                className="absolute right-[-30px] bg-[#1c6499] hover:bg-[#207cca] p-1.5 border border-[#144a73] shadow-md transition-colors rounded-sm flex items-center justify-center"
                            >
                                <ArrowRight size={16} className="text-white" />
                            </button>
                         </form>
                         
                         {/* Botão Voltar / Trocar Usuário */}
                         <button 
                            onClick={handleBack}
                            className="mt-4 text-white/70 hover:text-white text-xs flex items-center gap-1 hover:underline"
                         >
                             <ArrowLeft size={12} /> Trocar de usuário
                         </button>

                         {/* Mensagem de Erro */}
                         {error && (
                             <div className="mt-4 text-white text-xs bg-black/40 px-3 py-2 rounded border border-red-500/50">
                                 {error}
                             </div>
                         )}
                     </div>
                 )}
             </div>
         )}

      </div>

      {/* Rodapé */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2">
          <div className="h-6 w-[1px] bg-white/30 mr-2"></div>
          <button className="flex items-center gap-2 text-white hover:bg-white/10 px-2 py-1 rounded transition-colors">
              <div className="bg-[#d64a4a] p-1 rounded-sm border border-[#a03535] shadow-sm">
                  <Power size={14} />
              </div>
          </button>
      </div>
      
      <div className="absolute bottom-8 left-0 w-full text-center text-white/50 text-sm font-medium drop-shadow-md">
          Windows 7 Ultimate
      </div>
    </div>
  );
};