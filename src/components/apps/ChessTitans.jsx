import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Brain, Shield, Swords, AlertTriangle, Crown, Skull } from 'lucide-react';

// --- CONSTANTES ---
const PIECES = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
};

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// Tabelas de Posição (PST) - Refinadas para encorajar centro e avanço
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
  // Genérico para peças maiores (prefira o centro)
  DEFAULT: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ]
};

const INITIAL_BOARD = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

const INITIAL_CASTLING = { w: { k: true, q: true }, b: { k: true, q: true } };

// --- ENGINE OTIMIZADA ---
const ChessEngine = {
  isValidPos: (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8,
  cloneBoard: (board) => board.map(row => [...row]),

  findKing: (board, color) => {
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              if(board[r][c] === color + 'k') return {r, c};
          }
      }
      return null;
  },

  isSquareAttacked: (board, r, c, defenderColor) => {
      const enemyColor = defenderColor === 'w' ? 'b' : 'w';
      const pawnDir = defenderColor === 'w' ? -1 : 1;

      // Otimização: Verifica ataques comuns primeiro (Peões e Cavalos)
      if (ChessEngine.isValidPos(r - pawnDir, c - 1) && board[r - pawnDir][c - 1] === enemyColor + 'p') return true;
      if (ChessEngine.isValidPos(r - pawnDir, c + 1) && board[r - pawnDir][c + 1] === enemyColor + 'p') return true;

      const knightMoves = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];
      for(let [dr, dc] of knightMoves) {
          if(ChessEngine.isValidPos(r + dr, c + dc) && board[r + dr][c + dc] === enemyColor + 'n') return true;
      }

      const rays = [
          { dirs: [[0,1],[0,-1],[1,0],[-1,0]], pieces: ['r', 'q'] },
          { dirs: [[1,1],[1,-1],[-1,1],[-1,-1]], pieces: ['b', 'q'] }
      ];
      for(let { dirs, pieces } of rays) {
          for(let [dr, dc] of dirs) {
              let nr = r + dr, nc = c + dc;
              while(ChessEngine.isValidPos(nr, nc)) {
                  const p = board[nr][nc];
                  if(p) {
                      if(p[0] === enemyColor && pieces.includes(p[1])) return true;
                      break;
                  }
                  nr += dr; nc += dc;
              }
          }
      }
      
      // Rei Inimigo (para evitar rei colar em rei)
      for(let x=-1; x<=1; x++){
          for(let y=-1; y<=1; y++){
              if(x===0 && y===0) continue;
              if(ChessEngine.isValidPos(r+x, c+y) && board[r+x][c+y] === enemyColor + 'k') return true;
          }
      }

      return false;
  },

  getRawMoves: (board, r, c) => {
    const piece = board[r][c];
    if (!piece) return [];
    const type = piece[1];
    const color = piece[0];
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

    if (['r', 'b', 'q'].includes(type)) {
        const dirs = type === 'r' ? [[0,1],[0,-1],[1,0],[-1,0]] : type === 'b' ? [[1,1],[1,-1],[-1,1],[-1,-1]] : [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
        dirs.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (addMove(nr, nc)) { nr += dr; nc += dc; }
        });
    } else if (type === 'n' || type === 'k') {
        const dirs = type === 'n' ? [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]] : [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
        dirs.forEach(([dr, dc]) => addMove(r + dr, c + dc));
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
                if (target && target[0] !== color) moves.push({ r: r + dr, c: c + dc, capture: true });
            }
        });
    }
    return moves;
  },

  getCastlingMoves: (board, color, castlingRights) => {
      const moves = [];
      if (!castlingRights) return moves;
      const row = color === 'w' ? 7 : 0;
      
      if (board[row][4] !== color + 'k' || ChessEngine.isSquareAttacked(board, row, 4, color)) return moves;

      if (castlingRights[color].k) {
          if (!board[row][5] && !board[row][6]) {
              if (!ChessEngine.isSquareAttacked(board, row, 5, color) && !ChessEngine.isSquareAttacked(board, row, 6, color)) {
                  moves.push({ r: row, c: 6, capture: false, isCastle: 'king' });
              }
          }
      }
      if (castlingRights[color].q) {
          if (!board[row][1] && !board[row][2] && !board[row][3]) {
              if (!ChessEngine.isSquareAttacked(board, row, 3, color) && !ChessEngine.isSquareAttacked(board, row, 2, color)) {
                  moves.push({ r: row, c: 2, capture: false, isCastle: 'queen' });
              }
          }
      }
      return moves;
  },

  getValidMoves: (board, r, c, castlingRights = null) => {
      const piece = board[r][c];
      if (!piece) return [];
      const rawMoves = ChessEngine.getRawMoves(board, r, c);
      
      if (piece[1] === 'k' && castlingRights) {
          rawMoves.push(...ChessEngine.getCastlingMoves(board, piece[0], castlingRights));
      }

      return rawMoves.filter(move => {
          const tempBoard = ChessEngine.cloneBoard(board);
          tempBoard[move.r][move.c] = tempBoard[r][c];
          tempBoard[r][c] = null;
          
          // Se for roque, a posição do rei é o destino. Se não, busca o rei.
          const kingPos = move.isCastle ? {r: move.r, c: move.c} : ChessEngine.findKing(tempBoard, piece[0]);
          
          return !kingPos || !ChessEngine.isSquareAttacked(tempBoard, kingPos.r, kingPos.c, piece[0]);
      });
  },

  getAllValidMoves: (board, color, castlingRights) => {
      const moves = [];
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              if(board[r][c] && board[r][c][0] === color) {
                  const pieceMoves = ChessEngine.getValidMoves(board, r, c, castlingRights);
                  pieceMoves.forEach(m => moves.push({ from: {r,c}, to: m }));
              }
          }
      }
      return moves;
  },

  evaluateBoard: (board) => {
      let score = 0;
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              const p = board[r][c];
              if(!p) continue;
              
              const type = p[1];
              const color = p[0];
              let value = PIECE_VALUES[type];

              // PST (Tabelas de Posição)
              const table = PST[type] || PST['DEFAULT'];
              const pstValue = (color === 'b') ? table[r][c] : table[7-r][c];
              
              value += pstValue;
              score += (color === 'b') ? value : -value;
          }
      }
      return score;
  },

  minimax: (board, depth, alpha, beta, isMaximizing) => {
      if (depth === 0) return ChessEngine.evaluateBoard(board);

      const turn = isMaximizing ? 'b' : 'w';
      // Ignora castling rights na recursão profunda para performance
      const moves = ChessEngine.getAllValidMoves(board, turn, null); 

      if (moves.length === 0) {
          const kingPos = ChessEngine.findKing(board, turn);
          if(!kingPos) return 0; // Bug safety
          const inCheck = ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, turn);
          return inCheck ? (isMaximizing ? -99999 : 99999) : 0;
      }

      // Ordenação: Capturas primeiro (Otimização Alpha-Beta)
      moves.sort((a, b) => (b.to.capture ? 1 : 0) - (a.to.capture ? 1 : 0));

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

  getBestMove: (board, difficulty, castlingRights) => {
      const allMoves = ChessEngine.getAllValidMoves(board, 'b', castlingRights);
      if (allMoves.length === 0) return null;

      // 1. FÁCIL: Aleatório
      if (difficulty === 'easy') {
          return allMoves[Math.floor(Math.random() * allMoves.length)];
      }

      // 2. MÉDIO: Minimax Depth 2 (Olha 1 jogada a frente e resposta)
      // Antes era "Ganancioso" (Depth 1), por isso movia só a torre. Agora pensa.
      if (difficulty === 'medium') {
           let bestScore = -Infinity;
           let bestMoves = []; // Array para guardar movimentos com mesmo score

           for (let move of allMoves) {
               const newBoard = ChessEngine.cloneBoard(board);
               newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
               newBoard[move.from.r][move.from.c] = null;
               
               // Profundidade 1 (rápida)
               const score = ChessEngine.minimax(newBoard, 1, -Infinity, Infinity, false);
               
               if (score > bestScore) {
                   bestScore = score;
                   bestMoves = [move];
               } else if (score === bestScore) {
                   bestMoves.push(move);
               }
           }
           // Escolhe aleatório entre os melhores para evitar repetição
           return bestMoves[Math.floor(Math.random() * bestMoves.length)];
      }

      // 3. DIFÍCIL / EXTREMO: Minimax Depth 3/4
      const depth = difficulty === 'extreme' ? 4 : 3;
      let bestMove = null;
      let bestVal = -Infinity;
      let alpha = -Infinity;
      let beta = Infinity;

      // Ordena para otimizar a raiz
      allMoves.sort((a, b) => (b.to.capture ? 1 : 0) - (a.to.capture ? 1 : 0));

      // Lista de melhores movimentos para randomizar se empatar
      let candidateMoves = [];

      for (let move of allMoves) {
          const newBoard = ChessEngine.cloneBoard(board);
          newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
          newBoard[move.from.r][move.from.c] = null;
          if (newBoard[move.to.r][move.to.c] === 'bp' && move.to.r === 7) newBoard[move.to.r][move.to.c] = 'bq';

          const boardVal = ChessEngine.minimax(newBoard, depth - 1, alpha, beta, false);

          if (boardVal > bestVal) {
              bestVal = boardVal;
              bestMove = move;
              candidateMoves = [move];
          } else if (boardVal === bestVal) {
              candidateMoves.push(move);
          }
          alpha = Math.max(alpha, boardVal);
      }

      // Retorna um dos melhores movimentos aleatoriamente para variar o jogo
      return candidateMoves.length > 0 ? candidateMoves[Math.floor(Math.random() * candidateMoves.length)] : allMoves[0];
  }
};

// --- COMPONENTE ---
export const ChessTitans = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [castling, setCastling] = useState(INITIAL_CASTLING);
  const [turn, setTurn] = useState('w');
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [status, setStatus] = useState('playing');
  const [aiThinking, setAiThinking] = useState(false);

  // IA Move
  useEffect(() => {
    let timer;
    if (turn === 'b' && status === 'playing') {
      setAiThinking(true);
      timer = setTimeout(() => {
        const aiMove = ChessEngine.getBestMove(board, difficulty, castling);
        if (aiMove) {
          executeMove(aiMove.from, aiMove.to);
        } else {
          const kingPos = ChessEngine.findKing(board, 'b');
          if (kingPos && ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, 'b')) {
             setStatus('checkmate');
          } else {
             setStatus('stalemate');
          }
        }
        setAiThinking(false);
      }, 200);
    }
    return () => clearTimeout(timer);
  }, [turn, status, board]); // Dependências corrigidas

  // Validação de Estado
  useEffect(() => {
      if (turn === 'w') {
          const kingPos = ChessEngine.findKing(board, 'w');
          if (kingPos) {
             const inCheck = ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, 'w');
             const hasMoves = ChessEngine.getAllValidMoves(board, 'w', castling).length > 0;
             if (inCheck && !hasMoves) setStatus('checkmate');
             else if (!inCheck && !hasMoves) setStatus('stalemate');
             else if (inCheck) setStatus('check');
             else setStatus('playing');
          }
      }
  }, [board, turn]);

  const executeMove = (from, to) => {
    const newBoard = ChessEngine.cloneBoard(board);
    const piece = newBoard[from.r][from.c];
    const newCastling = JSON.parse(JSON.stringify(castling));

    newBoard[to.r][to.c] = piece;
    newBoard[from.r][from.c] = null;

    // Roque
    if (to.isCastle) {
        if (to.isCastle === 'king') {
            newBoard[from.r][5] = newBoard[from.r][7];
            newBoard[from.r][7] = null;
        } else {
            newBoard[from.r][3] = newBoard[from.r][0];
            newBoard[from.r][0] = null;
        }
    }

    // Direitos de Roque
    if (piece[1] === 'k') { newCastling[piece[0]].k = false; newCastling[piece[0]].q = false; }
    if (piece[1] === 'r') {
        if (from.c === 0) newCastling[piece[0]].q = false;
        if (from.c === 7) newCastling[piece[0]].k = false;
    }

    // Promoção
    if (piece[1] === 'p') {
        if ((piece[0] === 'w' && to.r === 0) || (piece[0] === 'b' && to.r === 7)) {
            newBoard[to.r][to.c] = piece[0] + 'q';
        }
    }

    setBoard(newBoard);
    setCastling(newCastling);
    setTurn(prev => prev === 'w' ? 'b' : 'w');
    setSelected(null);
    setPossibleMoves([]);
  };

  const handleSquareClick = (r, c) => {
    if (turn !== 'w' || aiThinking || status === 'checkmate') return;

    const clickedPiece = board[r][c];
    const move = possibleMoves.find(m => m.r === r && m.c === c);

    if (move) {
      executeMove(selected, move);
      return;
    }

    if (clickedPiece && clickedPiece[0] === 'w') {
      if (selected && selected.r === r && selected.c === c) {
        setSelected(null);
        setPossibleMoves([]);
      } else {
        setSelected({ r, c });
        setPossibleMoves(ChessEngine.getValidMoves(board, r, c, castling));
      }
    } else {
      setSelected(null);
      setPossibleMoves([]);
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setCastling(INITIAL_CASTLING);
    setTurn('w');
    setStatus('playing');
    setSelected(null);
    setPossibleMoves([]);
  };

  const getKingStatus = (r, c, piece) => {
      if (piece && piece[1] === 'k' && piece[0] === turn) {
          if (status === 'check' || status === 'checkmate') return 'bg-red-500/50 ring-4 ring-red-600';
      }
      return '';
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] font-sans select-none">
      {/* Header */}
      <div className="h-12 bg-white/10 flex items-center justify-between px-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold">
          <span className="bg-blue-600 px-2 py-0.5 rounded text-sm">Chess Titans</span>
          {status === 'check' && <span className="bg-orange-500 px-2 py-0.5 rounded text-xs animate-pulse">XEQUE!</span>}
        </div>
        <div className="flex gap-1 bg-black/40 p-1 rounded">
           {['easy', 'medium', 'hard', 'extreme'].map(d => (
             <button key={d} onClick={() => setDifficulty(d)} className={`px-2 text-[10px] uppercase font-bold rounded ${difficulty === d ? (d==='extreme'?'bg-purple-600 text-white':'bg-blue-600 text-white') : 'text-white/50 hover:text-white'}`}>
                {d === 'extreme' ? <Skull size={12}/> : (d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Difícil')}
             </button>
           ))}
        </div>
        <button onClick={resetGame} className="text-white/70 hover:text-white"><RotateCcw size={16}/></button>
      </div>

      {/* Tabuleiro */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-900" style={{ background: 'radial-gradient(circle at center, #334155 0%, #0f172a 100%)' }}>
        {status === 'checkmate' && (
          <div className="absolute z-50 bg-black/80 inset-0 flex items-center justify-center backdrop-blur-sm animate-in zoom-in">
             <div className="bg-white p-6 rounded-lg text-center border-4 border-red-500">
                <h2 className="text-3xl font-bold text-red-600">XEQUE-MATE</h2>
                <p className="text-gray-600 my-2">{turn === 'w' ? 'Você perdeu.' : 'Você venceu!'}</p>
                <button onClick={resetGame} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Jogar Novamente</button>
             </div>
          </div>
        )}

        <div className="relative shadow-2xl border-[12px] border-[#475569] rounded-sm bg-[#1e293b]" 
             style={{ transform: 'perspective(1000px) rotateX(15deg)' }}>
          <div className="grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px]">
            {board.map((row, r) => (
              row.map((piece, c) => {
                const isBlack = (r + c) % 2 === 1;
                const isSelected = selected && selected.r === r && selected.c === c;
                const move = possibleMoves.find(m => m.r === r && m.c === c);
                const kingAlert = getKingStatus(r, c, piece);

                return (
                  <div 
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`relative flex items-center justify-center cursor-pointer
                      ${isBlack ? 'bg-[#64748b]' : 'bg-[#e2e8f0]'}
                      ${isSelected ? 'ring-inset ring-4 ring-yellow-400 bg-yellow-200/50' : ''}
                      ${kingAlert}
                    `}
                  >
                    {move && (
                      <div className={`absolute z-0 rounded-full
                        ${move.capture 
                          ? 'inset-0 border-4 border-red-500/60 animate-pulse' 
                          : 'w-4 h-4 bg-green-500/50 shadow-[0_0_10px_lime]'
                        }
                      `}></div>
                    )}
                    {piece && (
                      <span className={`text-4xl sm:text-5xl select-none z-10 drop-shadow-xl
                        ${piece[0] === 'w' ? 'text-white' : 'text-black'}
                        ${isSelected ? '-translate-y-2 scale-110' : ''}
                      `}
                      style={{ textShadow: piece[0] === 'b' ? '0 1px 2px rgba(255,255,255,0.2)' : '0 2px 4px rgba(0,0,0,0.5)' }}
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

      <div className="h-8 bg-black/40 flex items-center justify-center gap-3 text-white text-xs border-t border-white/10">
         {aiThinking ? 
            <span className="flex items-center gap-2 text-purple-300"><Brain size={14} className="animate-spin"/> {difficulty === 'extreme' ? 'Pensando 4 lances a frente...' : 'Pensando...'}</span> 
            : <span className="flex items-center gap-2 text-gray-300">{turn === 'w' ? <Shield size={14}/> : <Swords size={14}/>} Vez das {turn === 'w' ? 'Brancas' : 'Pretas'}</span>
         }
      </div>
    </div>
  );
};