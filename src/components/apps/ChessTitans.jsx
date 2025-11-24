import React, { useState, useEffect } from 'react';
import { RotateCcw, Brain, Shield, Swords, AlertTriangle, Crown } from 'lucide-react';

// --- CONSTANTES ---
const PIECES = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
};

// Valores Materiais (Peça vale quanto?)
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// --- TABELAS DE POSIÇÃO (PST - Piece Square Tables) ---
// Isso ensina a IA onde as peças devem ficar. (Ex: Cavalos no centro, Peões avançando)
// Valores são espelhados para as Pretas.
const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  // (Simplificado para B, R, Q, K para economizar linhas, mas a lógica é similar: Centro = Bom)
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  // Rei prefere ficar escondido no início
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

const INITIAL_BOARD = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

// --- CHESS ENGINE AVANÇADA ---
const ChessEngine = {
  isValidPos: (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8,
  cloneBoard: (board) => board.map(row => [...row]),

  findKing: (board, color) => {
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              if(board[r][c] && board[r][c][0] === color && board[r][c][1] === 'k') return {r, c};
          }
      }
      return null;
  },

  isSquareAttacked: (board, r, c, defenderColor) => {
      const enemyColor = defenderColor === 'w' ? 'b' : 'w';
      const pawnDir = defenderColor === 'w' ? -1 : 1;

      // Cavalo
      const knightMoves = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];
      for(let [dr, dc] of knightMoves) {
          const nr = r+dr, nc = c+dc;
          if(ChessEngine.isValidPos(nr, nc)) {
              const p = board[nr][nc];
              if(p && p[0] === enemyColor && p[1] === 'n') return true;
          }
      }
      // Peão
      const pawnAttacks = [[-pawnDir, 1], [-pawnDir, -1]];
      for(let [dr, dc] of pawnAttacks) {
          const nr = r+dr, nc = c+dc;
          if(ChessEngine.isValidPos(nr, nc)) {
              const p = board[nr][nc];
              if(p && p[0] === enemyColor && p[1] === 'p') return true;
          }
      }
      // Raios (Torre/Bispo/Rainha)
      const rays = [
          { dir: [[0,1], [0,-1], [1,0], [-1,0]], types: ['r', 'q'] },
          { dir: [[1,1], [1,-1], [-1,1], [-1,-1]], types: ['b', 'q'] }
      ];
      for(let ray of rays) {
          for(let [dr, dc] of ray.dir) {
              let nr = r+dr, nc = c+dc;
              while(ChessEngine.isValidPos(nr, nc)) {
                  const p = board[nr][nc];
                  if(p) {
                      if(p[0] === enemyColor && ray.types.includes(p[1])) return true;
                      if(p[1] !== 'k') break; 
                  }
                  nr += dr; nc += dc;
              }
          }
      }
      // Rei
      for(let x=-1; x<=1; x++) {
          for(let y=-1; y<=1; y++) {
              if(x===0 && y===0) continue;
              const nr = r+x, nc = c+y;
              if(ChessEngine.isValidPos(nr, nc)) {
                  const p = board[nr][nc];
                  if(p && p[0] === enemyColor && p[1] === 'k') return true;
              }
          }
      }
      return false;
  },

  getRawMoves: (board, r, c) => {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const moves = [];

    const addMove = (nr, nc) => {
        if (ChessEngine.isValidPos(nr, nc)) {
            const target = board[nr][nc];
            if (!target) {
                moves.push({ r: nr, c: nc, capture: false });
                return true; 
            } else if (target[0] !== color) {
                moves.push({ r: nr, c: nc, capture: true });
                return false; 
            }
        }
        return false;
    };

    const directions = {
        'r': [[0,1], [0,-1], [1,0], [-1,0]],
        'b': [[1,1], [1,-1], [-1,1], [-1,-1]],
        'q': [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]],
        'n': [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]],
        'k': [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]]
    };

    if (['r', 'b', 'q'].includes(type)) {
        directions[type].forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (addMove(nr, nc)) { nr += dr; nc += dc; }
        });
    } else if (type === 'n' || type === 'k') {
        directions[type].forEach(([dr, dc]) => addMove(r + dr, c + dc));
    } else if (type === 'p') {
        const dir = color === 'w' ? -1 : 1;
        if (ChessEngine.isValidPos(r + dir, c) && !board[r + dir][c]) {
            moves.push({ r: r + dir, c, capture: false });
            if ((color === 'w' && r === 6) || (color === 'b' && r === 1)) {
                if (!board[r + (dir * 2)][c]) moves.push({ r: r + (dir * 2), c, capture: false });
            }
        }
        [[dir, 1], [dir, -1]].forEach(([dr, dc]) => {
            if (ChessEngine.isValidPos(r + dr, c + dc)) {
                const target = board[r + dr][c + dc];
                if (target && target[0] !== color) {
                    moves.push({ r: r + dr, c: c + dc, capture: true });
                }
            }
        });
    }
    return moves;
  },

  getValidMoves: (board, r, c) => {
      const piece = board[r][c];
      if (!piece) return [];
      const rawMoves = ChessEngine.getRawMoves(board, r, c);
      const validMoves = [];

      for (let move of rawMoves) {
          const tempBoard = ChessEngine.cloneBoard(board);
          tempBoard[move.r][move.c] = tempBoard[r][c];
          tempBoard[r][c] = null;
          const kingPos = ChessEngine.findKing(tempBoard, piece[0]);
          if (kingPos && !ChessEngine.isSquareAttacked(tempBoard, kingPos.r, kingPos.c, piece[0])) {
              validMoves.push(move);
          }
      }
      return validMoves;
  },

  getAllValidMoves: (board, color) => {
      const moves = [];
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              if(board[r][c] && board[r][c][0] === color) {
                  const pieceMoves = ChessEngine.getValidMoves(board, r, c);
                  pieceMoves.forEach(m => moves.push({ from: {r,c}, to: m }));
              }
          }
      }
      return moves;
  },

  getGameState: (board, turnColor) => {
      const kingPos = ChessEngine.findKing(board, turnColor);
      const inCheck = kingPos ? ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, turnColor) : false;
      
      // Se tem movimentos legais, jogo continua. Se não, Checkmate ou Stalemate.
      const hasMoves = ChessEngine.getAllValidMoves(board, turnColor).length > 0;

      if (inCheck && !hasMoves) return 'checkmate';
      if (!inCheck && !hasMoves) return 'stalemate';
      if (inCheck) return 'check';
      return 'playing';
  },

  // --- AVALIAÇÃO POSICIONAL (O Segredo do Extreme) ---
  evaluateBoard: (board) => {
      let score = 0;
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              const p = board[r][c];
              if(!p) continue;
              
              const type = p[1];
              const color = p[0];
              
              // 1. Valor Material
              let value = PIECE_VALUES[type];

              // 2. Valor Posicional (PST)
              // Se for preto, usamos a tabela normal. Se for branco, espelhamos a tabela.
              let pstValue = 0;
              const table = PST[type] || PST['b']; // Fallback para tabela genérica (Bispo)
              
              if (color === 'b') {
                  pstValue = table[r][c];
              } else {
                  pstValue = table[7-r][c]; // Espelha para brancas
              }

              value += pstValue;

              score += color === 'b' ? value : -value;
          }
      }
      return score;
  },

  // --- MINIMAX (ALGORITMO EXTREME) ---
  minimax: (board, depth, alpha, beta, isMaximizing) => {
      if (depth === 0) {
          return -ChessEngine.evaluateBoard(board); // Invertemos o score para perspectiva das Pretas
      }

      const moves = ChessEngine.getAllValidMoves(board, isMaximizing ? 'b' : 'w');
      
      if (moves.length === 0) {
          // Checkmate ou Stalemate
          const kingPos = ChessEngine.findKing(board, isMaximizing ? 'b' : 'w');
          const inCheck = ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, isMaximizing ? 'b' : 'w');
          return inCheck ? -99999 : 0; // Mate é muito ruim, Empate é neutro
      }

      // Ordenação de Movimentos (Heurística para otimizar Alpha-Beta)
      // Analisa capturas primeiro
      moves.sort((a, b) => (b.to.capture ? 10 : 0) - (a.to.capture ? 10 : 0));

      if (isMaximizing) {
          let maxEval = -Infinity;
          for (let move of moves) {
              const newBoard = ChessEngine.cloneBoard(board);
              newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
              newBoard[move.from.r][move.from.c] = null;
              
              const evalScore = ChessEngine.minimax(newBoard, depth - 1, alpha, beta, false);
              maxEval = Math.max(maxEval, evalScore);
              alpha = Math.max(alpha, evalScore);
              if (beta <= alpha) break;
          }
          return maxEval;
      } else {
          let minEval = Infinity;
          for (let move of moves) {
              const newBoard = ChessEngine.cloneBoard(board);
              newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
              newBoard[move.from.r][move.from.c] = null;

              const evalScore = ChessEngine.minimax(newBoard, depth - 1, alpha, beta, true);
              minEval = Math.min(minEval, evalScore);
              beta = Math.min(beta, evalScore);
              if (beta <= alpha) break;
          }
          return minEval;
      }
  },

  getBestMove: (board, difficulty) => {
      const allMoves = ChessEngine.getAllValidMoves(board, 'b');
      if (allMoves.length === 0) return null;

      // EASY: Aleatório
      if (difficulty === 'easy') return allMoves[Math.floor(Math.random() * allMoves.length)];

      // MEDIUM: Profundidade 2 (Vê capturas óbvias)
      if (difficulty === 'medium') {
          // Simples ganância
          const captures = allMoves.filter(m => m.to.capture);
          if (captures.length > 0) return captures[Math.floor(Math.random() * captures.length)];
          return allMoves[Math.floor(Math.random() * allMoves.length)];
      }

      // HARD / EXTREME: Minimax
      // Extreme usa profundidade maior e tabelas de posição (já embutidas na avaliação)
      const depth = difficulty === 'extreme' ? 4 : 3; // Depth 4 no browser é pesado, mas 'Extreme'
      
      let bestMove = null;
      let bestValue = -Infinity;
      let alpha = -Infinity;
      let beta = Infinity;

      // Ordena movimentos na raiz também
      allMoves.sort((a, b) => (b.to.capture ? 1 : 0) - (a.to.capture ? 1 : 0));

      for (let move of allMoves) {
          const newBoard = ChessEngine.cloneBoard(board);
          newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
          newBoard[move.from.r][move.from.c] = null;

          // Chama Minimax para o próximo nível (Minimizando para o jogador)
          const boardValue = ChessEngine.minimax(newBoard, depth - 1, alpha, beta, false);

          if (boardValue > bestValue) {
              bestValue = boardValue;
              bestMove = move;
          }
          alpha = Math.max(alpha, boardValue);
      }

      return bestMove || allMoves[0];
  }
};

// --- COMPONENTE VISUAL ---
export const ChessTitans = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [turn, setTurn] = useState('w'); 
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard, extreme
  const [gameStatus, setGameStatus] = useState('playing');
  const [isThinking, setIsThinking] = useState(false);

  // IA Joga
  useEffect(() => {
      if (turn === 'b' && gameStatus !== 'checkmate' && gameStatus !== 'stalemate') {
          setIsThinking(true);
          // Delay pequeno para renderizar o status "Pensando"
          setTimeout(() => {
              const aiMove = ChessEngine.getBestMove(board, difficulty);
              if (aiMove) {
                  executeMove(aiMove.from, aiMove.to);
              }
              setIsThinking(false);
          }, 100);
      }
  }, [turn]);

  // Verifica Status (Xeque/Mate) após cada jogada
  useEffect(() => {
      const status = ChessEngine.getGameState(board, turn);
      setGameStatus(status);
  }, [board, turn]);

  const executeMove = (from, to) => {
      const newBoard = ChessEngine.cloneBoard(board);
      newBoard[to.r][to.c] = newBoard[from.r][from.c];
      newBoard[from.r][from.c] = null;
      
      // Promoção Automática (Rainha)
      if (newBoard[to.r][to.c][1] === 'p') {
          if ((to.r === 0 && newBoard[to.r][to.c][0] === 'w') || (to.r === 7 && newBoard[to.r][to.c][0] === 'b')) {
              newBoard[to.r][to.c] = newBoard[to.r][to.c][0] + 'q';
          }
      }

      setBoard(newBoard);
      setTurn(prev => prev === 'w' ? 'b' : 'w');
      setSelected(null);
      setPossibleMoves([]);
  };

  const handleSquareClick = (r, c) => {
    if (turn !== 'w' || isThinking || gameStatus === 'checkmate') return;

    const clickedPiece = board[r][c];
    
    // 1. Executa movimento
    const validMove = possibleMoves.find(m => m.r === r && m.c === c);
    if (validMove) {
        executeMove(selected, validMove);
        return;
    }

    // 2. Seleciona
    if (clickedPiece && clickedPiece[0] === 'w') {
        if (selected && selected.r === r && selected.c === c) {
            setSelected(null);
            setPossibleMoves([]);
        } else {
            setSelected({ r, c });
            setPossibleMoves(ChessEngine.getValidMoves(board, r, c));
        }
    } else {
        setSelected(null);
        setPossibleMoves([]);
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setTurn('w');
    setGameStatus('playing');
    setSelected(null);
    setPossibleMoves([]);
  };

  const getKingStatus = (r, c, piece) => {
      if (piece && piece[1] === 'k' && piece[0] === turn) {
          if (gameStatus === 'check' || gameStatus === 'checkmate') return 'bg-red-500/50 ring-4 ring-red-600';
      }
      return '';
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] font-sans select-none">
       {/* Topo */}
       <div className="h-12 bg-white/10 flex items-center justify-between px-4 border-b border-white/10">
           <div className="flex items-center gap-2 text-white font-bold">
               <span className="bg-blue-600 px-2 py-0.5 rounded text-sm">Chess Titans</span>
               {gameStatus === 'check' && <span className="bg-orange-500 px-2 py-0.5 rounded text-xs animate-pulse font-bold">XEQUE!</span>}
           </div>
           
           <div className="flex gap-1 bg-black/40 p-1 rounded">
               {['easy', 'medium', 'hard', 'extreme'].map(d => (
                   <button key={d} onClick={() => setDifficulty(d)} className={`px-2 text-[10px] uppercase font-bold rounded ${difficulty === d ? (d==='extreme'?'bg-purple-600 text-white':'bg-blue-600 text-white') : 'text-white/50 hover:text-white'}`}>
                       {d === 'extreme' ? <Crown size={12}/> : d}
                   </button>
               ))}
           </div>
           <button onClick={resetGame} className="text-white/70 hover:text-white"><RotateCcw size={16}/></button>
       </div>

       {/* Tabuleiro */}
       <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden" 
            style={{ background: 'radial-gradient(circle at center, #2d4a66 0%, #0f172a 100%)' }}>
           
           {gameStatus === 'checkmate' && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in zoom-in">
                   <div className="bg-white p-8 rounded-lg shadow-2xl text-center border-4 border-red-600">
                       <h2 className="text-3xl font-bold text-red-600 mb-2">XEQUE-MATE!</h2>
                       <p className="text-slate-600 mb-6 font-bold text-lg">{turn === 'w' ? 'As Pretas venceram.' : 'VOCÊ VENCEU!'}</p>
                       <button onClick={resetGame} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold shadow-lg">Jogar Novamente</button>
                   </div>
               </div>
           )}

           <div className="relative shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-[12px] border-[#334155] bg-[#1e293b] rounded-md" 
                style={{ transform: 'perspective(1000px) rotateX(20deg)' }}>
               
               <div className="grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px]">
                   {board.map((row, r) => (
                       row.map((piece, c) => {
                           const isBlack = (r + c) % 2 === 1;
                           const isSelected = selected && selected.r === r && selected.c === c;
                           const moveInfo = possibleMoves.find(m => m.r === r && m.c === c);
                           const kingAlert = getKingStatus(r, c, piece);
                           
                           return (
                               <div 
                                 key={`${r}-${c}`}
                                 onClick={() => handleSquareClick(r, c)}
                                 className={`
                                    relative flex items-center justify-center cursor-pointer
                                    ${isBlack ? 'bg-[#475569]' : 'bg-[#94a3b8]'}
                                    ${isSelected ? 'ring-inset ring-4 ring-yellow-400 bg-yellow-200/20' : ''}
                                    ${kingAlert}
                                 `}
                               >
                                   {/* Indicadores */}
                                   {moveInfo && (
                                       <div className={`absolute z-0 rounded-full
                                            ${moveInfo.capture 
                                                ? 'inset-0 border-4 border-red-500/80 animate-pulse' 
                                                : 'w-4 h-4 bg-green-400/70 shadow-[0_0_10px_#4ade80]'
                                            }
                                       `}></div>
                                   )}

                                   {/* Peça */}
                                   {piece && (
                                       <span 
                                         className={`text-4xl sm:text-5xl select-none drop-shadow-2xl transition-all duration-200 z-10
                                            ${piece[0] === 'w' ? 'text-[#f1f5f9]' : 'text-[#0f172a]'}
                                            ${isSelected ? '-translate-y-2 scale-110' : ''}
                                         `}
                                         style={{ 
                                             textShadow: piece[0] === 'b' ? '0 2px 0 rgba(255,255,255,0.1)' : '0 2px 0 rgba(0,0,0,0.5)',
                                             filter: piece[0] === 'b' ? 'drop-shadow(0 4px 2px rgba(0,0,0,0.5))' : 'drop-shadow(0 4px 2px rgba(0,0,0,0.8))'
                                         }}
                                       >
                                           {PIECES[piece[0]][piece[1]]}
                                       </span>
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
                <span className="flex items-center gap-2 text-purple-300"><Brain size={14} className="animate-spin"/> {difficulty === 'extreme' ? 'Analisando 4 profundidades...' : 'Calculando...'}</span> : 
                <span className="flex items-center gap-2 text-gray-300">{turn === 'w' ? <Shield size={14} className="text-blue-400"/> : <Swords size={14} className="text-red-400"/>} {turn === 'w' ? 'Sua vez' : 'Aguarde'}</span>
           }
       </div>
    </div>
  );
};