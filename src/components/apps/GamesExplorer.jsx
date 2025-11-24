import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Gamepad2, Puzzle, Club, CircleDot } from 'lucide-react'; // CircleDot para Damas
import { Minesweeper } from './Minesweeper';
import { Solitaire } from './Solitaire';
import { ChessTitans } from './ChessTitans';
import { Checkers } from './Checkers'; // NOVO

export const GamesExplorer = () => {
  const { openWindow } = useOSStore();

  const games = [
    { id: 'minesweeper', name: 'Campo Minado', desc: 'Lógica e sorte', icon: <div className="w-10 h-10 bg-slate-200 border-2 border-slate-400 flex items-center justify-center text-xl">💣</div> },
    { id: 'solitaire', name: 'Paciência', desc: 'O clássico jogo de cartas', icon: <div className="w-10 h-10 bg-white border-2 border-slate-300 flex items-center justify-center text-red-600 text-xl font-bold">♥</div> },
    { id: 'chess', name: 'Chess Titans', desc: 'Estratégia e tática', icon: <div className="w-10 h-10 bg-slate-800 border-2 border-slate-500 flex items-center justify-center text-white text-2xl">♞</div> },
    { id: 'checkers', name: 'Damas', desc: 'Captura clássica', icon: <div className="w-10 h-10 bg-[#4a3b2a] border-2 border-[#2e2315] flex items-center justify-center rounded-full"><div className="w-6 h-6 bg-red-600 rounded-full border border-red-800"></div></div> },
  ];

  const handleOpenGame = (game) => {
      if (game.id === 'minesweeper') {
          openWindow('game-minesweeper', 'Campo Minado', <span>💣</span>, <Minesweeper />);
      } else if (game.id === 'solitaire') {
          openWindow('game-solitaire', 'Paciência', <Club size={16} className="text-green-700"/>, <Solitaire />);
      } else if (game.id === 'chess') {
          openWindow('game-chess', 'Chess Titans', <Puzzle size={16} className="text-blue-700"/>, <ChessTitans />);
      } else if (game.id === 'checkers') {
          // NOVO: Abre Damas
          openWindow('game-checkers', 'Damas', <CircleDot size={16} className="text-red-700"/>, <Checkers />);
      } else {
          alert(`O jogo ${game.name} ainda não foi instalado.`);
      }
  };

  // ... Resto do componente permanece igual (renderização do grid) ...
  return (
    <div className="flex flex-col h-full bg-white font-sans">
       <div className="bg-[#f0f5f9] border-b border-slate-300 p-2 flex items-center gap-2">
           <span className="text-slate-600 font-bold">Explorador de Jogos</span>
       </div>
       <div className="flex-1 p-4 bg-white overflow-y-auto">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {games.map(game => (
                   <div 
                     key={game.id}
                     onDoubleClick={() => handleOpenGame(game)}
                     className="flex items-center gap-4 p-3 hover:bg-[#dceafc] border border-transparent hover:border-[#7da2ce] rounded cursor-pointer transition-colors group"
                   >
                       <div className="w-14 h-14 flex items-center justify-center bg-white shadow-md rounded border border-slate-200 group-hover:scale-105 transition-transform">
                           {game.icon}
                       </div>
                       <div>
                           <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-900">{game.name}</h4>
                           <span className="text-xs text-slate-500">{game.desc}</span>
                       </div>
                   </div>
               ))}
           </div>
       </div>
       <div className="bg-[#f0f5f9] border-t border-slate-300 p-2 text-xs text-slate-500">
           <span>{games.length} jogos instalados</span>
       </div>
    </div>
  );
};