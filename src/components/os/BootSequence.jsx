import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { ArrowRight, Power, HelpCircle } from 'lucide-react';

// Usuários
const USERS = [
  { 
    id: 'paulo', name: 'Paulo Cardoso', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 
    password: '', // Sem senha
    isAdmin: true
  },
  { 
    id: 'robot', name: 'Mr. Robot', 
    avatar: 'https://i.pinimg.com/736x/8f/c9/2c/8fc92c7304192408c6902dc9eb4c5147.jpg', 
    password: 'fsociety', 
    isAdmin: true
  }
];

export const BootSequence = () => {
  const { bootStatus, setBootStatus, setCurrentUser } = useOSStore();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const [loginStatus, setLoginStatus] = useState('idle');

  const startupAudio = new Audio('https://www.myinstants.com/media/sounds/windows-xp-startup.mp3');

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
          setError(false);
          setLoginStatus('idle');
      }
  }, [bootStatus]);

  const executeLogin = (user) => {
      setLoginStatus('logging_in');
      setCurrentUser(user.name, user.avatar);
      startupAudio.volume = 0.5;
      startupAudio.play().catch(() => {});
      setTimeout(() => setBootStatus('desktop'), 1500);
  };

  const handleUserClick = (user) => {
      if (loginStatus === 'logging_in') return;
      if (selectedUser?.id === user.id && user.password) return; // Já selecionado

      setSelectedUser(user);
      setPasswordInput('');
      setError(false);

      if (!user.password) executeLogin(user);
  };

  const handleSubmitPassword = (e) => {
      e.preventDefault();
      if (passwordInput === selectedUser.password) executeLogin(selectedUser);
      else { setError(true); setPasswordInput(''); }
  };

  if (bootStatus === 'desktop') return null;

  // --- BOOT LOADING ---
  if (bootStatus === 'booting') {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999]">
        <div className="flex flex-col items-center gap-8">
            {/* Logo Simplificado */}
            <div className="flex gap-1">
                <div className="flex flex-col gap-1">
                    <div className="w-8 h-8 bg-[#f2552e] rounded-tl-sm"></div>
                    <div className="w-8 h-8 bg-[#2d9fe6] rounded-bl-sm"></div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-8 h-8 bg-[#8bc43d] rounded-tr-sm"></div>
                    <div className="w-8 h-8 bg-[#fdbd08] rounded-br-sm"></div>
                </div>
            </div>
            <h1 className="text-white font-sans text-2xl font-bold tracking-tighter">
                Microsoft <span className="text-4xl font-extrabold italic">Windows</span><span className="text-orange-500 text-xl align-top">XP Dev Edition</span>
            </h1>
            <div className="w-48 h-4 border border-gray-500 rounded-[3px] p-0.5 mt-10 relative overflow-hidden">
                <div className="h-full w-16 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 rounded-[2px] animate-[slide-right_1.5s_linear_infinite]"></div>
            </div>
            <style>{`@keyframes slide-right { 0% { margin-left: -40px; } 100% { margin-left: 100%; } }`}</style>
        </div>
      </div>
    );
  }

  // --- LOGIN SCREEN XP (PIXEL PERFECT) ---
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col select-none overflow-hidden"
         style={{ fontFamily: 'Tahoma, sans-serif', backgroundColor: '#5A7EDC' }}
    >
        {/* Top Bar (Gradient) */}
        <div className="h-[80px] w-full border-b-2 border-[#F26D08] relative overflow-hidden bg-[#003399]">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#003399] via-[#003399] to-[#5A7EDC] opacity-50"></div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex items-center justify-center relative bg-gradient-to-r from-[#5A7EDC] via-[#638ADD] to-[#5A7EDC]">
            
            {/* Container Central Dividido */}
            <div className="w-[800px] flex h-[350px]">
                
                {/* ESQUERDA: LOGO E INSTRUÇÕES */}
                <div className="w-1/2 flex flex-col items-end justify-center pr-8 border-r border-white/30">
                    <div className="flex flex-col items-end mb-8">
                        <div className="flex gap-[2px] mb-2 transform -rotate-3 scale-90">
                            <div className="flex flex-col gap-[2px]">
                                <div className="w-6 h-6 bg-[#f2552e] rounded-tl-sm"></div>
                                <div className="w-6 h-6 bg-[#2d9fe6] rounded-bl-sm"></div>
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <div className="w-6 h-6 bg-[#8bc43d] rounded-tr-sm"></div>
                                <div className="w-6 h-6 bg-[#fdbd08] rounded-br-sm"></div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end leading-none">
                            <span className="text-white text-sm font-bold drop-shadow-md">Microsoft</span>
                            <span className="text-white text-[42px] font-extrabold italic drop-shadow-md leading-[0.8] tracking-tighter">
                                Windows<span className="text-[#F26D08] text-[28px] align-top ml-1">xp Dev Edition</span>
                            </span>
                        </div>
                    </div>
                    <span className="text-white text-[19px] font-medium drop-shadow-md text-right leading-tight opacity-90 w-64">
                        To begin, click your user name
                    </span>
                </div>

                {/* DIREITA: LISTA DE USUÁRIOS */}
                <div className="w-1/2 flex flex-col justify-center pl-8 gap-3">
                    {USERS.map(user => {
                        const isSelected = selectedUser?.id === user.id;
                        
                        // Se logando, mostra apenas o usuário atual
                        if (loginStatus === 'logging_in' && !isSelected) return null;

                        return (
                            <div key={user.id} className="flex flex-col items-start relative">
                                <div 
                                    onClick={() => handleUserClick(user)}
                                    className={`
                                        flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150
                                        ${isSelected ? 'bg-none' : 'hover:bg-white/10'}
                                    `}
                                >
                                    {/* AVATAR COM BORDA DE OURO */}
                                    <div className={`
                                        w-[50px] h-[50px] rounded-[3px] bg-white overflow-hidden shadow-md relative flex-shrink-0 border-[2px]
                                        ${isSelected ? 'border-[#FEEfae]' : 'border-[#FFFFFF]/60'}
                                    `}>
                                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex flex-col justify-center min-h-[50px]">
                                        <span className="text-white text-[20px] font-normal drop-shadow-md leading-none mb-1">
                                            {user.name}
                                        </span>
                                        
                                        {/* INPUT DE SENHA (APARECE AO CLICAR) */}
                                        {isSelected && user.password ? (
                                            <div className="animate-in fade-in duration-200">
                                                <div className="text-white/80 text-[11px] mb-1 ml-0.5">Type your password</div>
                                                <form onSubmit={handleSubmitPassword} className="flex items-center gap-2 relative">
                                                    <input 
                                                        type="password" 
                                                        autoFocus
                                                        className={`
                                                            w-40 h-7 px-1.5 text-sm border-none outline-none rounded-[2px] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)]
                                                            ${error ? 'bg-[#fff5f5]' : 'bg-white'}
                                                        `}
                                                        value={passwordInput}
                                                        onChange={(e) => {setPasswordInput(e.target.value); setError(false)}}
                                                    />
                                                    
                                                    {/* BOTÃO VERDE (SETINHA) */}
                                                    <button 
                                                        type="submit" 
                                                        className="w-7 h-7 rounded-[3px] bg-gradient-to-b from-[#60b259] to-[#2a7924] border border-[#185214] flex items-center justify-center shadow-md hover:brightness-110 active:brightness-95"
                                                    >
                                                        <ArrowRight size={16} className="text-white drop-shadow-md" strokeWidth={3} />
                                                    </button>
                                                    
                                                    {/* BOTÃO DE AJUDA (INTERROGAÇÃO) */}
                                                    <button 
                                                        type="button"
                                                        className="w-7 h-7 rounded-[3px] bg-gradient-to-b from-[#4679bd] to-[#1a4b86] border border-[#103057] flex items-center justify-center shadow-md hover:brightness-110"
                                                    >
                                                        <span className="text-white font-bold text-sm italic">?</span>
                                                    </button>
                                                </form>
                                                
                                                {/* MENSAGEM DE ERRO (BALÃO) */}
                                                {error && (
                                                    <div className="absolute left-0 top-16 bg-[#ffffe1] text-black text-xs p-2 border border-black rounded shadow-lg z-50 w-48">
                                                        Did you forget your password? Please type it again.
                                                        <div className="absolute -top-2 left-4 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-black"></div>
                                                        <div className="absolute -top-[7px] left-4 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-[#ffffe1]"></div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            // Status do login (loading)
                                            loginStatus === 'logging_in' && isSelected && (
                                                <span className="text-white/80 text-xs">Loading your personal settings...</span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="h-16 w-full bg-[#003399] border-t-2 border-[#F89B00] flex items-center justify-between px-12 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-[#003399] to-[#5A7EDC] opacity-30 pointer-events-none"></div>
            
            {/* Botão Desligar */}
            <button className="flex items-center gap-3 group relative z-10 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-b from-[#E98B64] to-[#D22E04] border border-white/40 rounded-[3px] flex items-center justify-center shadow-lg group-hover:brightness-110 transition-all">
                    <Power size={18} className="text-white drop-shadow-md" />
                </div>
                <span className="text-white text-[15px] font-bold shadow-black drop-shadow-md group-hover:underline">Turn off computer</span>
            </button>

            {/* Ajuda */}
            <div className="relative z-10 text-white/90 text-[11px] max-w-md text-right leading-snug drop-shadow-md">
                After you log on, you can add or change accounts.<br/>
                Just go to Control Panel and click User Accounts.
            </div>
        </div>
    </div>
  );
};