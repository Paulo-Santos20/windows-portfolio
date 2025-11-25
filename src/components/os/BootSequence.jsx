import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { ArrowRight, Power, Accessibility } from 'lucide-react';

// --- CONFIGURAÇÃO DOS USUÁRIOS ---
const USERS = [
  { 
    id: 'paulo', 
    name: 'Paulo Cardoso', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 
    password: '', 
    isAdmin: true
  },
  { 
    id: 'robot', 
    name: 'Mr. Robot', 
    avatar: 'https://i.pinimg.com/736x/8f/c9/2c/8fc92c7304192408c6902dc9eb4c5147.jpg', 
    password: 'fsociety', // COM SENHA
    isAdmin: true
  }
];

export const BootSequence = () => {
  const { bootStatus, setBootStatus, setCurrentUser } = useOSStore();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [loginStatus, setLoginStatus] = useState('idle'); 

  const startupAudio = new Audio('https://www.myinstants.com/media/sounds/windows-7-startup.mp3');

  useEffect(() => {
    if (bootStatus === 'booting') {
      const timer = setTimeout(() => setBootStatus('login'), 4000);
      return () => clearTimeout(timer);
    }
  }, [bootStatus, setBootStatus]);

  useEffect(() => {
      if (bootStatus === 'login') {
          setSelectedUser(null);
          setPasswordInput('');
          setError('');
          setLoginStatus('idle');
      }
  }, [bootStatus]);

  const executeLogin = (user) => {
      setLoginStatus('logging_in');
      setCurrentUser(user.name, user.avatar);
      startupAudio.volume = 0.5;
      startupAudio.play().catch(() => {});
      setTimeout(() => setBootStatus('desktop'), 2000);
  };

  const handleUserClick = (user) => {
      setSelectedUser(user);
      setError('');
      setPasswordInput('');
      // Se não tem senha, loga direto ao clicar
      if (!user.password) executeLogin(user);
  };

  const handleSubmitPassword = (e) => {
      e.preventDefault();
      if (!selectedUser) return;
      if (passwordInput === selectedUser.password) executeLogin(selectedUser);
      else { setError('Senha incorreta'); setPasswordInput(''); }
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

  // --- TELA DE LOGIN ---
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center font-sans select-none"
         style={{
            backgroundImage: 'url(https://wallpapers.com/images/hd/minimalistic-blue-windows-7-screen-y1f3lbswydb71soy.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
         }}
    >
      <div className="flex flex-col items-center w-full max-w-md relative z-10">
         
         {/* LISTA DE USUÁRIOS */}
         {!selectedUser && (
             <div className="flex flex-col gap-6 w-full items-center animate-in fade-in zoom-in duration-300">
                 {USERS.map(user => (
                     <div 
                        key={user.id}
                        onClick={() => handleUserClick(user)}
                        className="flex flex-col items-center gap-3 cursor-pointer group hover:scale-105 transition-transform"
                     >
                         <div className="w-32 h-32 p-1 rounded-[14px] shadow-[0_0_15px_rgba(0,0,0,0.3)] border border-white/30 relative overflow-hidden bg-gradient-to-b from-white/50 to-white/10 backdrop-blur-sm group-hover:bg-white/40 transition-colors">
                             <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[10px] border border-black/10" />
                         </div>
                         <span className="text-white text-2xl font-light text-shadow-lg tracking-wide">{user.name}</span>
                     </div>
                 ))}
             </div>
         )}

         {/* USUÁRIO SELECIONADO (SENHA) */}
         {selectedUser && (
             <div className="flex flex-col items-center gap-5 animate-in fade-in duration-300">
                 
                 {/* Avatar Grande */}
                 <div 
                    className="w-40 h-40 p-1.5 rounded-[16px] shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-white/30 relative overflow-hidden bg-gradient-to-b from-white/50 to-white/10 cursor-pointer"
                    onClick={() => loginStatus !== 'logging_in' && handleUserClick(selectedUser)}
                 >
                     <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover rounded-[12px] border border-black/10" />
                 </div>

                 <h2 className="text-white text-3xl font-normal tracking-wide text-shadow-lg mb-1">{selectedUser.name}</h2>

                 {loginStatus === 'logging_in' ? (
                     <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 border-4 border-t-white border-r-white/50 border-b-white/20 border-l-white/20 rounded-full animate-spin"></div>
                         <span className="text-white text-sm font-medium text-shadow">Bem-vindo</span>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center w-full gap-3">
                         
                         {/* FORMULÁRIO IDÊNTICO AO WIN7 */}
                         <form onSubmit={handleSubmitPassword} className="flex items-center relative">
                            <input 
                                type="password" 
                                placeholder="Senha"
                                // Estilo Exato do Input Win7: Borda cinza-azulada, sombra interna suave, foco brilhante
                                className="pl-3 pr-2 py-1.5 w-60 text-sm outline-none rounded-[3px] font-sans placeholder:text-slate-400 text-black transition-all
                                           border border-[#8e9bb3] 
                                           shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]
                                           focus:border-[#5899d0] focus:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(88,153,208,0.5)]"
                                value={passwordInput}
                                onChange={(e) => { setPasswordInput(e.target.value); setError(''); }}
                                autoFocus
                            />
                            
                            {/* Botão "Ir" (Seta) IDÊNTICO AO WIN7 */}
                            <button 
                                type="submit" 
                                // Gradiente dividido (Split Gradient) + Borda Azul Escura + Sombra Branca Interna
                                className="ml-2 w-7 h-7 rounded-[3px] border border-[#003c74] flex items-center justify-center shadow-md hover:brightness-110 active:brightness-90
                                           bg-[linear-gradient(to_bottom,#89b8dd_0%,#5992c4_50%,#2e679f_51%,#286096_100%)]
                                           group overflow-hidden relative"
                            >
                                {/* Brilho interno no topo do botão */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40"></div>
                                <ArrowRight size={16} className="text-white drop-shadow-sm" strokeWidth={3} />
                            </button>
                         </form>

                         {error && <span className="text-white text-xs bg-black/30 px-2 py-1 rounded border border-white/20">{error}</span>}

                         <button 
                            onClick={() => { setSelectedUser(null); setError(''); }}
                            className="mt-1 px-4 py-1 text-white/80 hover:text-white text-xs rounded hover:bg-white/10 transition-colors"
                         >
                             Trocar usuário
                         </button>
                     </div>
                 )}
             </div>
         )}
      </div>

      {/* RODAPÉ COM BOTÃO VERMELHO CORRETO */}
      <div className="absolute bottom-0 w-full h-20 flex items-end justify-between px-8 pb-6 pointer-events-none">
          
          <button className="pointer-events-auto flex items-center justify-center w-9 h-9 bg-gradient-to-b from-[#4679bd] to-[#1a4b86] border border-[#103057] rounded-[4px] shadow-lg hover:brightness-110 active:scale-95 transition-all">
              <Accessibility size={20} className="text-white drop-shadow-md" />
          </button>

          <div className="flex flex-col items-center mb-2 opacity-90">
              <div className="flex items-center gap-2 text-shadow-lg">
                  <span className="text-white text-2xl font-sans tracking-tight"><span className="font-bold">Windows</span> 7</span>
                  <span className="text-white text-sm self-end mb-1 ml-1">Dev Edition</span>
              </div>
          </div>

          {/* Botão Desligar Vermelho Dividido */}
          <div className="flex items-center pointer-events-auto shadow-lg rounded-[4px] overflow-hidden border border-[#630608]">
              <button className="flex items-center justify-center w-8 h-8 bg-[linear-gradient(to_bottom,#d45555_0%,#b52d2d_50%,#960d0d_51%,#a31616_100%)] hover:brightness-110 active:brightness-90 border-r border-[#630608]/50">
                  <Power size={16} className="text-white drop-shadow-md" />
              </button>
              <button className="flex items-center justify-center w-5 h-8 bg-[linear-gradient(to_bottom,#d45555_0%,#b52d2d_50%,#960d0d_51%,#a31616_100%)] hover:brightness-110 active:brightness-90">
                  <div className="w-0 h-0 border-l-[4px] border-l-white border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5"></div>
              </button>
          </div>

      </div>
    </div>
  );
};