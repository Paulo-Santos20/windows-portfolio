import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Crown, Brain, Shield, Swords, Skull } from 'lucide-react';

// --- CONFIGURAÇÃO ---
const BOARD_SIZE = 8;

// Cria o tabuleiro inicial
const createBoard = () => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if ((r + c) % 2 === 1) {
                if (r < 3) board[r][c] = { color: 'b', isKing: false }; // Black (CPU)
                if (r > 4) board[r][c] = { color: 'w', isKing: false }; // White (Player)
            }
        }
    }
    return board;
};

// --- MOTOR DE INTELIGÊNCIA (ENGINE) ---
const CheckersEngine = {
    // Clona tabuleiro para simulação
    cloneBoard: (board) => board.map(row => row.map(p => p ? { ...p } : null)),

    isValidPos: (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE,

    // Gera movimentos para um tabuleiro/cor
    getAllMoves: (board, color) => {
        let moves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] && board[r][c].color === color) {
                    const pieceMoves = CheckersEngine.getPieceMoves(board, r, c);
                    pieceMoves.forEach(m => moves.push({ from: {r,c}, ...m }));
                }
            }
        }
        // Regra de Ouro: Se existe captura, DEVE capturar (filtragem para melhorar nível da IA)
        const captures = moves.filter(m => m.isCapture);
        return captures.length > 0 ? captures : moves;
    },

    getPieceMoves: (board, r, c) => {
        const piece = board[r][c];
        if (!piece) return [];
        const moves = [];
        
        // Direções: Brancas sobem (-1), Pretas descem (+1), Reis vão para ambos
        const dirs = [];
        if (piece.color === 'w' || piece.isKing) dirs.push([-1, -1], [-1, 1]);
        if (piece.color === 'b' || piece.isKing) dirs.push([1, -1], [1, 1]);

        dirs.forEach(([dr, dc]) => {
            // 1. Movimento Simples
            const nr = r + dr, nc = c + dc;
            if (CheckersEngine.isValidPos(nr, nc) && board[nr][nc] === null) {
                moves.push({ r: nr, c: nc, isCapture: false });
            }
            // 2. Captura
            const jr = r + dr * 2, jc = c + dc * 2;
            if (CheckersEngine.isValidPos(jr, jc)) {
                const mid = board[nr][nc];
                const dest = board[jr][jc];
                if (mid && mid.color !== piece.color && dest === null) {
                    moves.push({ r: jr, c: jc, isCapture: true, captured: { r: nr, c: nc } });
                }
            }
        });
        return moves;
    },

    // Avaliação do Tabuleiro (Cérebro da IA)
    evaluateBoard: (board) => {
        let score = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const p = board[r][c];
                if (!p) continue;
                
                // Valores Base
                let val = p.isKing ? 50 : 10;
                
                // Bônus Posicional (Dominar o centro e as laterais defensivas)
                if (c === 0 || c === 7) val += 2; // Laterais seguras
                if (r > 2 && r < 5 && c > 2 && c < 5) val += 3; // Centro forte

                // Bônus de Defesa (Linha de fundo)
                if (p.color === 'b' && r === 0) val += 5;
                if (p.color === 'w' && r === 7) val += 5;

                score += p.color === 'b' ? val : -val;
            }
        }
        return score;
    },

    // Algoritmo Minimax com Poda Alpha-Beta
    minimax: (board, depth, alpha, beta, isMaximizing) => {
        if (depth === 0) return { score: CheckersEngine.evaluateBoard(board) };

        const color = isMaximizing ? 'b' : 'w';
        const possibleMoves = CheckersEngine.getAllMoves(board, color);

        if (possibleMoves.length === 0) {
            // Sem movimentos = Derrota
            return { score: isMaximizing ? -1000 : 1000 };
        }

        let bestMove = possibleMoves[0];

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let move of possibleMoves) {
                const newBoard = CheckersEngine.simulateMove(board, move);
                const evalObj = CheckersEngine.minimax(newBoard, depth - 1, alpha, beta, false);
                if (evalObj.score > maxEval) {
                    maxEval = evalObj.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, evalObj.score);
                if (beta <= alpha) break; // Poda
            }
            return { score: maxEval, move: bestMove };
        } else {
            let minEval = Infinity;
            for (let move of possibleMoves) {
                const newBoard = CheckersEngine.simulateMove(board, move);
                const evalObj = CheckersEngine.minimax(newBoard, depth - 1, alpha, beta, true);
                if (evalObj.score < minEval) {
                    minEval = evalObj.score;
                    bestMove = move;
                }
                beta = Math.min(beta, evalObj.score);
                if (beta <= alpha) break; // Poda
            }
            return { score: minEval, move: bestMove };
        }
    },

    simulateMove: (board, move) => {
        const newBoard = CheckersEngine.cloneBoard(board);
        const piece = newBoard[move.from.r][move.from.c];
        newBoard[move.r][move.c] = piece;
        newBoard[move.from.r][move.from.c] = null;
        
        if (move.isCapture) {
            newBoard[move.captured.r][move.captured.c] = null;
        }
        
        // Promoção
        if ((piece.color === 'w' && move.r === 0) || (piece.color === 'b' && move.r === 7)) {
            newBoard[move.r][move.c].isKing = true;
        }
        return newBoard;
    }
};

// --- COMPONENTE PRINCIPAL ---
export const Checkers = () => {
  const [board, setBoard] = useState(createBoard());
  const [turn, setTurn] = useState('w'); 
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard, extreme
  const [isThinking, setIsThinking] = useState(false);
  const [winner, setWinner] = useState(null);

  // Turno da IA
  useEffect(() => {
      if (turn === 'b' && !winner) {
          setIsThinking(true);
          // Delay para realismo
          const delay = difficulty === 'extreme' ? 100 : 800; 
          
          setTimeout(() => {
              let aiMove = null;
              
              // NÍVEIS DE DIFICULDADE
              if (difficulty === 'easy') {
                  // Aleatório total
                  const moves = CheckersEngine.getAllMoves(board, 'b');
                  if (moves.length) aiMove = moves[Math.floor(Math.random() * moves.length)];
              } 
              else if (difficulty === 'medium') {
                  // Profundidade 2 (Vê captura imediata)
                  const result = CheckersEngine.minimax(board, 2, -Infinity, Infinity, true);
                  aiMove = result.move;
              }
              else if (difficulty === 'hard') {
                  // Profundidade 4 (Planeja jogadas)
                  const result = CheckersEngine.minimax(board, 4, -Infinity, Infinity, true);
                  aiMove = result.move;
              }
              else { // EXTREME
                  // Profundidade 6 (Mestre)
                  const result = CheckersEngine.minimax(board, 6, -Infinity, Infinity, true);
                  aiMove = result.move;
              }

              if (aiMove) {
                  executeMove(aiMove.from, aiMove);
              } else {
                  setWinner('w'); // Sem movimentos para IA = Jogador venceu
              }
              setIsThinking(false);
          }, delay);
      } else if (turn === 'w') {
          // Verifica se jogador tem movimentos
          const playerMoves = CheckersEngine.getAllMoves(board, 'w');
          if (playerMoves.length === 0) setWinner('b');
      }
  }, [turn, difficulty]);

  const executeMove = (from, to) => {
      const newBoard = CheckersEngine.simulateMove(board, { from, ...to });
      setBoard(newBoard);
      setTurn(prev => prev === 'w' ? 'b' : 'w');
      setSelected(null);
      setPossibleMoves([]);
  };

  const handleSquareClick = (r, c) => {
      if (turn !== 'w' || isThinking || winner) return;

      const piece = board[r][c];
      const isMove = possibleMoves.find(m => m.r === r && m.c === c);

      // 1. Executa movimento
      if (isMove) {
          executeMove(selected, isMove);
          return;
      }

      // 2. Seleciona Peça
      if (piece && piece.color === 'w') {
          setSelected({ r, c });
          setPossibleMoves(CheckersEngine.getPieceMoves(board, r, c));
      } else {
          setSelected(null);
          setPossibleMoves([]);
      }
  };

  const resetGame = () => {
      setBoard(createBoard());
      setTurn('w');
      setPossibleMoves([]);
      setSelected(null);
      setWinner(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#2b2118] font-sans select-none">
       {/* Topo */}
       <div className="h-12 bg-white/10 flex items-center justify-between px-4 border-b border-white/10">
           <div className="flex items-center gap-2 text-white font-bold">
               <span className="bg-red-700/80 px-2 py-0.5 rounded text-sm">Damas</span>
           </div>
           
           {/* Seletor de Dificuldade */}
           <div className="flex bg-black/40 p-1 rounded gap-1">
               {['easy', 'medium', 'hard', 'extreme'].map(d => (
                   <button 
                     key={d} 
                     onClick={() => setDifficulty(d)} 
                     className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-colors
                        ${difficulty === d 
                            ? (d === 'extreme' ? 'bg-purple-600 text-white shadow-[0_0_10px_#9333ea]' : 'bg-amber-600 text-white') 
                            : 'text-white/40 hover:text-white/80'}
                     `}
                   >
                       {d === 'extreme' ? <Skull size={12}/> : d}
                   </button>
               ))}
           </div>
           
           <button onClick={resetGame} className="text-white/70 hover:text-white"><RotateCcw size={16}/></button>
       </div>

       {/* Área do Tabuleiro */}
       <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden" 
            style={{ background: 'radial-gradient(circle at center, #3d2b1f 0%, #1a120b 100%)' }}>
           
           {/* Modal Vencedor */}
           {winner && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                   <div className="bg-white p-8 rounded-lg shadow-2xl text-center border-4 border-amber-600">
                       <h2 className="text-3xl font-bold text-slate-800 mb-2">{winner === 'w' ? 'VITÓRIA!' : 'DERROTA'}</h2>
                       <p className="text-slate-600 mb-6">{winner === 'w' ? 'Você venceu o computador.' : 'A IA venceu desta vez.'}</p>
                       <button onClick={resetGame} className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700 font-bold shadow-lg">Jogar Novamente</button>
                   </div>
               </div>
           )}

           <div className="relative shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-[16px] border-[#4a3525] rounded-sm bg-[#1e1e1e]"
                style={{ transform: 'perspective(1000px) rotateX(20deg)' }}>
               
               <div className="grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px]">
                   {board.map((row, r) => (
                       row.map((piece, c) => {
                           const isDark = (r + c) % 2 === 1;
                           const isSelected = selected && selected.r === r && selected.c === c;
                           const move = possibleMoves.find(m => m.r === r && m.c === c);

                           return (
                               <div 
                                 key={`${r}-${c}`}
                                 onClick={() => handleSquareClick(r, c)}
                                 className={`relative flex items-center justify-center
                                    ${isDark ? 'bg-[#1f1f1f]' : 'bg-[#e3cba8]'}
                                    ${move ? 'cursor-pointer' : ''}
                                 `}
                               >
                                   {/* Indicadores de Movimento (Bola Verde / Borda Vermelha) */}
                                   {move && (
                                       <div className={`absolute z-0 rounded-full
                                            ${move.isCapture 
                                                ? 'inset-1 border-4 border-red-500 animate-pulse shadow-[0_0_15px_red]' 
                                                : 'w-4 h-4 bg-green-500/70 shadow-[0_0_10px_lime]'}
                                       `}></div>
                                   )}

                                   {/* Peça */}
                                   {piece && (
                                       <div className={`
                                          w-[75%] h-[75%] rounded-full shadow-[0_5px_5px_rgba(0,0,0,0.5),inset_0_-4px_4px_rgba(0,0,0,0.4),inset_0_2px_6px_rgba(255,255,255,0.3)]
                                          flex items-center justify-center z-10 transition-all duration-200
                                          ${piece.color === 'w' 
                                              ? 'bg-[#d4d4d8] border-4 border-[#a1a1aa]' // Brancas (Cinza Claro)
                                              : 'bg-[#ef4444] border-4 border-[#b91c1c]'} // Pretas (Vermelho)
                                          ${isSelected ? 'scale-110 ring-4 ring-yellow-400 -translate-y-2' : ''}
                                       `}>
                                           {/* Detalhe da Coroa */}
                                           {piece.isKing && <Crown size={20} className="text-yellow-400 drop-shadow-md animate-pulse" />}
                                           {/* Detalhe Anel */}
                                           {!piece.isKing && <div className="w-[60%] h-[60%] rounded-full border-2 border-black/10"></div>}
                                       </div>
                                   )}
                               </div>
                           );
                       })
                   ))}
               </div>
           </div>
       </div>

       {/* Footer */}
       <div className="h-8 bg-black/40 flex items-center justify-center gap-3 text-white text-xs border-t border-white/10">
           {isThinking ? 
                <span className="flex items-center gap-2 text-purple-300"><Brain size={14} className="animate-spin"/> Analisando {difficulty === 'extreme' ? '6000' : '100'} jogadas...</span> : 
                <span className="flex items-center gap-2 text-gray-300">{turn === 'w' ? <Shield size={14} className="text-white"/> : <Swords size={14} className="text-red-500"/>} {turn === 'w' ? 'Sua vez' : 'Aguarde'}</span>
           }
       </div>
    </div>
  );
};