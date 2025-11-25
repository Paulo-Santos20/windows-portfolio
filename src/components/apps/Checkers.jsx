import React, { useState, useEffect } from 'react';
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

// --- MOTOR DE INTELIGÊNCIA E REGRAS ---
const CheckersEngine = {
    cloneBoard: (board) => board.map(row => row.map(p => p ? { ...p } : null)),
    isValidPos: (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE,

    // Gera movimentos para uma peça específica
    getPieceMoves: (board, r, c, mustCaptureFrom = null) => {
        const piece = board[r][c];
        if (!piece) return [];
        
        // Se estamos no meio de um combo, só essa peça pode mover
        if (mustCaptureFrom && (mustCaptureFrom.r !== r || mustCaptureFrom.c !== c)) return [];

        const moves = [];
        const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

        // --- LÓGICA DA DAMA (VOADORA) ---
        if (piece.isKing) {
            directions.forEach(([dr, dc]) => {
                let dist = 1;
                while (true) {
                    const nr = r + (dr * dist);
                    const nc = c + (dc * dist);

                    if (!CheckersEngine.isValidPos(nr, nc)) break; // Saiu do tabuleiro

                    const target = board[nr][nc];

                    if (target === null) {
                        // Casa vazia: pode mover (se não estivermos obrigados a capturar em combo)
                        if (!mustCaptureFrom) {
                            moves.push({ r: nr, c: nc, isCapture: false });
                        }
                    } else {
                        // Encontrou peça
                        if (target.color === piece.color) break; // Bloqueado por amigo

                        // Inimigo encontrado: Verificar se pode capturar (casa seguinte vazia)
                        const jumpR = nr + dr;
                        const jumpC = nc + dc;
                        
                        // Dama pode pousar em qualquer casa vazia APÓS a peça capturada (Regra simplificada: pousa na imediata para facilitar UX)
                        if (CheckersEngine.isValidPos(jumpR, jumpC) && board[jumpR][jumpC] === null) {
                            moves.push({ 
                                r: jumpR, c: jumpC, 
                                isCapture: true, 
                                captured: { r: nr, c: nc } 
                            });
                        }
                        break; // Não pode pular mais de uma peça na mesma linha de visão direta sem pousar
                    }
                    dist++;
                }
            });
        } 
        // --- LÓGICA PEÇA COMUM ---
        else {
            directions.forEach(([dr, dc]) => {
                const isForward = (piece.color === 'w' && dr === -1) || (piece.color === 'b' && dr === 1);
                
                // 1. Movimento Simples (Só pra frente)
                const nr = r + dr;
                const nc = c + dc;
                
                if (isForward && !mustCaptureFrom) { // Só move se não estiver em combo
                    if (CheckersEngine.isValidPos(nr, nc) && board[nr][nc] === null) {
                        moves.push({ r: nr, c: nc, isCapture: false });
                    }
                }

                // 2. Captura (Pra frente e Pra trás - Regra Internacional)
                const jr = r + (dr * 2);
                const jc = c + (dc * 2);

                if (CheckersEngine.isValidPos(jr, jc)) {
                    const mid = board[nr][nc];
                    const dest = board[jr][jc];

                    if (mid && mid.color !== piece.color && dest === null) {
                        moves.push({ 
                            r: jr, c: jc, 
                            isCapture: true, 
                            captured: { r: nr, c: nc } 
                        });
                    }
                }
            });
        }

        return moves;
    },

    // Gera todos os movimentos possíveis para uma cor
    getAllMoves: (board, color, mustCaptureFrom = null) => {
        let moves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] && board[r][c].color === color) {
                    const pieceMoves = CheckersEngine.getPieceMoves(board, r, c, mustCaptureFrom);
                    pieceMoves.forEach(m => moves.push({ from: {r,c}, ...m }));
                }
            }
        }
        // REGRA DE OURO: Se existe captura, OBRIGATÓRIO capturar
        const captures = moves.filter(m => m.isCapture);
        return captures.length > 0 ? captures : moves;
    },

    // Simula um movimento (Retorna novo board e se deve continuar jogando)
    simulateMove: (board, move) => {
        const newBoard = CheckersEngine.cloneBoard(board);
        const piece = newBoard[move.from.r][move.from.c];
        
        // Move
        newBoard[move.r][move.c] = piece;
        newBoard[move.from.r][move.from.c] = null;
        
        let extraTurn = false;
        let nextStart = null;

        // Processa Captura
        if (move.isCapture) {
            newBoard[move.captured.r][move.captured.c] = null;
            
            // Verifica se pode capturar de novo (Combo) a partir da nova posição
            const followUpMoves = CheckersEngine.getPieceMoves(newBoard, move.r, move.c);
            const canCaptureAgain = followUpMoves.some(m => m.isCapture);
            
            if (canCaptureAgain) {
                extraTurn = true;
                nextStart = { r: move.r, c: move.c };
            }
        }
        
        // Promoção (Só vira Dama se o turno acabou)
        if (!extraTurn) {
            if ((piece.color === 'w' && move.r === 0) || (piece.color === 'b' && move.r === 7)) {
                newBoard[move.r][move.c].isKing = true;
            }
        }

        return { newBoard, extraTurn, nextStart };
    },

    // IA: Minimax
    evaluateBoard: (board) => {
        let score = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const p = board[r][c];
                if (!p) continue;
                let val = p.isKing ? 50 : 10;
                if (r > 2 && r < 5 && c > 2 && c < 5) val += 2; // Centro
                score += p.color === 'b' ? val : -val;
            }
        }
        return score;
    },

    minimax: (board, depth, alpha, beta, isMaximizing, mustCaptureFrom) => {
        if (depth === 0) return { score: CheckersEngine.evaluateBoard(board) };

        const color = isMaximizing ? 'b' : 'w';
        const moves = CheckersEngine.getAllMoves(board, color, mustCaptureFrom);

        if (moves.length === 0) return { score: isMaximizing ? -1000 : 1000 };

        let bestMove = moves[0];

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let move of moves) {
                const { newBoard, extraTurn, nextStart } = CheckersEngine.simulateMove(board, move);
                // Se tem turno extra, não diminui profundidade e continua maximizando
                const nextDepth = extraTurn ? depth : depth - 1;
                const nextMax = extraTurn ? true : false;
                
                const evalObj = CheckersEngine.minimax(newBoard, nextDepth, alpha, beta, nextMax, nextStart);
                
                if (evalObj.score > maxEval) {
                    maxEval = evalObj.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, evalObj.score);
                if (beta <= alpha) break;
            }
            return { score: maxEval, move: bestMove };
        } else {
            let minEval = Infinity;
            for (let move of moves) {
                const { newBoard, extraTurn, nextStart } = CheckersEngine.simulateMove(board, move);
                const nextDepth = extraTurn ? depth : depth - 1;
                const nextMax = extraTurn ? false : true;

                const evalObj = CheckersEngine.minimax(newBoard, nextDepth, alpha, beta, nextMax, nextStart);
                
                if (evalObj.score < minEval) {
                    minEval = evalObj.score;
                    bestMove = move;
                }
                beta = Math.min(beta, evalObj.score);
                if (beta <= alpha) break;
            }
            return { score: minEval, move: bestMove };
        }
    }
};

// --- COMPONENTE VISUAL ---
export const Checkers = () => {
  const [board, setBoard] = useState(createBoard());
  const [turn, setTurn] = useState('w'); 
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [mustCaptureFrom, setMustCaptureFrom] = useState(null); // Trava peça para combo
  const [difficulty, setDifficulty] = useState('medium');
  const [isThinking, setIsThinking] = useState(false);
  const [winner, setWinner] = useState(null);

  // IA Turno
  useEffect(() => {
      if (turn === 'b' && !winner) {
          setIsThinking(true);
          const delay = difficulty === 'extreme' ? 50 : 600;
          
          setTimeout(() => {
              // Configuração da IA baseada na dificuldade
              let depth = 1;
              if (difficulty === 'medium') depth = 2;
              if (difficulty === 'hard') depth = 4;
              if (difficulty === 'extreme') depth = 6;

              const result = CheckersEngine.minimax(board, depth, -Infinity, Infinity, true, mustCaptureFrom);
              const aiMove = result.move;

              if (aiMove) {
                  executeMove(aiMove.from, aiMove);
              } else {
                  if (!mustCaptureFrom) setWinner('w'); // Sem movimentos
              }
              setIsThinking(false);
          }, delay);
      } else if (turn === 'w' && !winner) {
          // Verifica derrota do jogador
          const moves = CheckersEngine.getAllMoves(board, 'w', mustCaptureFrom);
          if (moves.length === 0) setWinner('b');
      }
  }, [turn, mustCaptureFrom, board]);

  const executeMove = (from, to) => {
      const { newBoard, extraTurn, nextStart } = CheckersEngine.simulateMove(board, { from, ...to });
      
      setBoard(newBoard);
      setSelected(null);
      setPossibleMoves([]);

      if (extraTurn) {
          setMustCaptureFrom(nextStart);
          // Se for vez da IA (Pretas), o useEffect vai rodar de novo pois o turno não mudou
          // Se for vez do Jogador (Brancas), selecionamos automaticamente a peça
          if (turn === 'w') {
              setSelected(nextStart);
              const moves = CheckersEngine.getPieceMoves(newBoard, nextStart.r, nextStart.c, nextStart);
              setPossibleMoves(moves);
          }
      } else {
          setMustCaptureFrom(null);
          setTurn(prev => prev === 'w' ? 'b' : 'w');
      }
  };

  const handleSquareClick = (r, c) => {
      if (turn !== 'w' || isThinking || winner) return;

      const piece = board[r][c];
      
      // 1. Tentar Mover
      const isMove = possibleMoves.find(m => m.r === r && m.c === c);
      if (isMove) {
          executeMove(selected, isMove);
          return;
      }

      // 2. Selecionar Peça
      // (Se estiver em combo, só pode selecionar a peça do combo)
      if (piece && piece.color === 'w') {
          if (mustCaptureFrom && (r !== mustCaptureFrom.r || c !== mustCaptureFrom.c)) return;

          // Verifica se é uma seleção válida (Regra de captura obrigatória)
          const allMoves = CheckersEngine.getAllMoves(board, 'w', mustCaptureFrom);
          const capturesOnly = allMoves.some(m => m.isCapture);
          
          const myMoves = CheckersEngine.getPieceMoves(board, r, c, mustCaptureFrom);
          
          // Se houver capturas no tabuleiro, só posso selecionar peças que capturam
          if (capturesOnly) {
              const iCanCapture = myMoves.some(m => m.isCapture);
              if (!iCanCapture) return; // Bloqueia seleção de peça que não come
          }

          if (myMoves.length > 0) {
              setSelected({ r, c });
              setPossibleMoves(myMoves);
          }
      } else {
          // Deselecionar (se não estiver em combo)
          if (!mustCaptureFrom) {
              setSelected(null);
              setPossibleMoves([]);
          }
      }
  };

  const resetGame = () => {
      setBoard(createBoard());
      setTurn('w');
      setPossibleMoves([]);
      setSelected(null);
      setMustCaptureFrom(null);
      setWinner(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#2b2118] font-sans select-none">
       {/* Header */}
       <div className="h-12 bg-white/10 flex items-center justify-between px-4 border-b border-white/10">
           <span className="text-white font-bold flex items-center gap-2">
               <span className="bg-red-600 px-2 py-0.5 rounded">Damas</span>
               {mustCaptureFrom && <span className="text-yellow-400 text-xs animate-pulse">COMBO! Jogue novamente</span>}
           </span>
           <div className="flex bg-black/40 p-1 rounded gap-1">
               {['easy', 'medium', 'hard', 'extreme'].map(d => (
                   <button key={d} onClick={() => setDifficulty(d)} className={`px-2 text-[10px] uppercase font-bold rounded ${difficulty === d ? 'bg-amber-600 text-white' : 'text-white/40'}`}>
                       {d === 'extreme' ? <Skull size={12}/> : d}
                   </button>
               ))}
           </div>
           <button onClick={resetGame} className="text-white/70 hover:text-white"><RotateCcw size={16}/></button>
       </div>

       {/* Tabuleiro */}
       <div className="flex-1 flex items-center justify-center p-4" style={{ background: 'radial-gradient(circle at center, #3d2b1f 0%, #1a120b 100%)' }}>
           {winner && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                   <div className="bg-white p-8 rounded-lg text-center border-4 border-amber-600">
                       <h2 className="text-3xl font-bold text-slate-800 mb-2">{winner === 'w' ? 'VITÓRIA!' : 'DERROTA'}</h2>
                       <button onClick={resetGame} className="bg-amber-600 text-white px-6 py-2 rounded font-bold mt-4">Jogar Novamente</button>
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
                           const isHighlighted = move || isSelected;

                           return (
                               <div 
                                 key={`${r}-${c}`}
                                 onClick={() => handleSquareClick(r, c)}
                                 className={`relative flex items-center justify-center
                                    ${isDark ? 'bg-[#1f1f1f]' : 'bg-[#e3cba8]'}
                                    ${move ? 'cursor-pointer' : ''}
                                 `}
                               >
                                   {/* Highlights */}
                                   {move && (
                                       <div className={`absolute z-0 rounded-full
                                            ${move.isCapture ? 'inset-1 border-4 border-red-500 animate-pulse' : 'w-4 h-4 bg-green-500/70 shadow-[0_0_10px_lime]'}
                                       `}></div>
                                   )}

                                   {/* Peça */}
                                   {piece && (
                                       <div className={`
                                          w-[75%] h-[75%] rounded-full shadow-[0_5px_5px_rgba(0,0,0,0.5),inset_0_-4px_4px_rgba(0,0,0,0.4),inset_0_2px_6px_rgba(255,255,255,0.3)]
                                          flex items-center justify-center z-10 transition-all duration-200
                                          ${piece.color === 'w' ? 'bg-[#d4d4d8] border-4 border-[#a1a1aa]' : 'bg-[#ef4444] border-4 border-[#b91c1c]'}
                                          ${isSelected ? 'scale-110 ring-4 ring-yellow-400 -translate-y-2' : ''}
                                       `}>
                                           {piece.isKing && <Crown size={20} className="text-yellow-400 drop-shadow-md animate-pulse" />}
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
       
       <div className="h-8 bg-black/40 flex items-center justify-center gap-3 text-white text-xs border-t border-white/10">
           {isThinking ? <span className="flex items-center gap-2 text-purple-300"><Brain size={14} className="animate-spin"/> Pensando...</span> : <span className="text-gray-300">{turn === 'w' ? 'Sua vez' : 'Aguarde'}</span>}
       </div>
    </div>
  );
};