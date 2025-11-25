import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Brain, Shield, Swords, Crown } from 'lucide-react';

// --- 1. CONFIGURAÇÕES E UTILITÁRIOS ---

const PIECES = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
};

const VALUES = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };

const INITIAL_BOARD = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

// --- 2. ENGINE DE XADREZ (PURA LÓGICA) ---
const ChessEngine = {
  cloneBoard: (board) => board.map(row => [...row]),
  
  isValidPos: (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8,

  // Encontra o Rei
  findKing: (board, color) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] && board[r][c][0] === color && board[r][c][1] === 'k') {
          return { r, c };
        }
      }
    }
    return null;
  },

  // Verifica se uma posição está sob ataque
  isSquareAttacked: (board, r, c, defenderColor) => {
    const enemyColor = defenderColor === 'w' ? 'b' : 'w';
    const pawnDir = defenderColor === 'w' ? -1 : 1;

    // Peão
    if (ChessEngine.isValidPos(r - pawnDir, c - 1) && board[r - pawnDir][c - 1] === enemyColor + 'p') return true;
    if (ChessEngine.isValidPos(r - pawnDir, c + 1) && board[r - pawnDir][c + 1] === enemyColor + 'p') return true;

    // Cavalo
    const knightMoves = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];
    for (let [dr, dc] of knightMoves) {
      if (ChessEngine.isValidPos(r + dr, c + dc) && board[r + dr][c + dc] === enemyColor + 'n') return true;
    }

    // Rei (Inimigo perto)
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i===0 && j===0) continue;
        if (ChessEngine.isValidPos(r + i, c + j) && board[r + i][c + j] === enemyColor + 'k') return true;
      }
    }

    // Linhas (Torre/Rainha) e Diagonais (Bispo/Rainha)
    const rays = [
      { dirs: [[0,1],[0,-1],[1,0],[-1,0]], pieces: ['r', 'q'] },
      { dirs: [[1,1],[1,-1],[-1,1],[-1,-1]], pieces: ['b', 'q'] }
    ];

    for (let { dirs, pieces } of rays) {
      for (let [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        while (ChessEngine.isValidPos(nr, nc)) {
          const p = board[nr][nc];
          if (p) {
            if (p[0] === enemyColor && pieces.includes(p[1])) return true;
            break; // Bloqueio
          }
          nr += dr; nc += dc;
        }
      }
    }
    return false;
  },

  // Gera movimentos "Físicos" (sem validar Check)
  getRawMoves: (board, r, c) => {
    const piece = board[r][c];
    if (!piece) return [];
    const type = piece[1];
    const color = piece[0];
    const moves = [];

    const add = (nr, nc) => {
      if (!ChessEngine.isValidPos(nr, nc)) return false;
      const target = board[nr][nc];
      if (!target) {
        moves.push({ r: nr, c: nc, capture: false });
        return true;
      } else if (target[0] !== color) {
        moves.push({ r: nr, c: nc, capture: true });
        return false;
      }
      return false;
    };

    if (['r', 'b', 'q'].includes(type)) {
      const dirs = type === 'r' ? [[0,1],[0,-1],[1,0],[-1,0]] : 
                   type === 'b' ? [[1,1],[1,-1],[-1,1],[-1,-1]] :
                   [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
      dirs.forEach(([dr, dc]) => {
        let nr = r + dr, nc = c + dc;
        while (add(nr, nc)) { nr += dr; nc += dc; }
      });
    } else if (type === 'n' || type === 'k') {
      const dirs = type === 'n' ? [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]] :
                   [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
      dirs.forEach(([dr, dc]) => add(r + dr, c + dc));
    } else if (type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      // Andar 1
      if (ChessEngine.isValidPos(r + dir, c) && !board[r + dir][c]) {
        moves.push({ r: r + dir, c, capture: false });
        // Andar 2
        if ((color === 'w' && r === 6) || (color === 'b' && r === 1)) {
          if (!board[r + dir * 2][c]) moves.push({ r: r + dir * 2, c, capture: false });
        }
      }
      // Capturar
      [[dir, 1], [dir, -1]].forEach(([dr, dc]) => {
        if (ChessEngine.isValidPos(r + dr, c + dc)) {
          const t = board[r + dr][c + dc];
          if (t && t[0] !== color) moves.push({ r: r + dr, c: c + dc, capture: true });
        }
      });
    }
    return moves;
  },

  // Gera movimentos LEGAIS (Valida Check)
  getValidMoves: (board, r, c) => {
    const piece = board[r][c];
    if (!piece) return [];
    const rawMoves = ChessEngine.getRawMoves(board, r, c);
    
    // Filtra movimentos que deixam o rei em xeque
    return rawMoves.filter(move => {
      const tempBoard = ChessEngine.cloneBoard(board);
      tempBoard[move.r][move.c] = tempBoard[r][c];
      tempBoard[r][c] = null;
      
      const kingPos = ChessEngine.findKing(tempBoard, piece[0]);
      return !kingPos || !ChessEngine.isSquareAttacked(tempBoard, kingPos.r, kingPos.c, piece[0]);
    });
  },

  // IA: Avaliação do Tabuleiro
  evaluate: (board) => {
    let score = 0;
    for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        const p = board[r][c];
        if (!p) continue;
        const val = VALUES[p[1]] + ((r > 2 && r < 5 && c > 2 && c < 5) ? 2 : 0); // Bônus centro
        score += p[0] === 'b' ? val : -val;
      }
    }
    return score;
  },

  // IA: Minimax
  minimax: (board, depth, alpha, beta, isMax) => {
    if (depth === 0) return ChessEngine.evaluate(board);

    const color = isMax ? 'b' : 'w';
    let bestVal = isMax ? -Infinity : Infinity;
    
    // Pega todas as peças da cor
    let hasMoves = false;
    for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        if (board[r][c] && board[r][c][0] === color) {
          const moves = ChessEngine.getValidMoves(board, r, c);
          for (let move of moves) {
            hasMoves = true;
            const newBoard = ChessEngine.cloneBoard(board);
            newBoard[move.r][move.c] = newBoard[r][c];
            newBoard[r][c] = null;
            
            // Promoção simples para avaliação
            if (newBoard[move.r][move.c][1] === 'p' && (move.r === 0 || move.r === 7)) newBoard[move.r][move.c] = color + 'q';

            const val = ChessEngine.minimax(newBoard, depth - 1, alpha, beta, !isMax);
            
            if (isMax) {
              bestVal = Math.max(bestVal, val);
              alpha = Math.max(alpha, bestVal);
            } else {
              bestVal = Math.min(bestVal, val);
              beta = Math.min(beta, bestVal);
            }
            if (beta <= alpha) break;
          }
        }
      }
    }
    
    if (!hasMoves) return isMax ? -10000 : 10000; // Mate
    return bestVal;
  }
};

// --- 3. COMPONENTE REACT ---
export const ChessTitans = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [turn, setTurn] = useState('w');
  const [selected, setSelected] = useState(null); // {r, c}
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [status, setStatus] = useState('playing'); // playing, check, checkmate
  const [aiThinking, setAiThinking] = useState(false);

  // Verifica estado do jogo (Check/Mate) a cada turno
  useEffect(() => {
    const kingPos = ChessEngine.findKing(board, turn);
    const inCheck = kingPos ? ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, turn) : false;
    
    // Verifica se existem movimentos legais
    let canMove = false;
    loop: for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        if (board[r][c] && board[r][c][0] === turn) {
          if (ChessEngine.getValidMoves(board, r, c).length > 0) {
            canMove = true;
            break loop;
          }
        }
      }
    }

    if (!canMove) {
      setStatus(inCheck ? 'checkmate' : 'stalemate');
    } else {
      setStatus(inCheck ? 'check' : 'playing');
    }
  }, [board, turn]);

  // Turno da IA
  useEffect(() => {
    if (turn === 'b' && status !== 'checkmate' && status !== 'stalemate') {
      setAiThinking(true);
      // Timeout para não travar a UI
      setTimeout(() => {
        makeAIMove();
        setAiThinking(false);
      }, 500);
    }
  }, [turn, status]); // Dependências corrigidas

  const makeAIMove = () => {
    const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    let bestMove = null;
    let bestVal = -Infinity;

    // Itera todas as peças pretas
    for(let r=0; r<8; r++) {
      for(let c=0; c<8; c++) {
        if (board[r][c] && board[r][c][0] === 'b') {
          const moves = ChessEngine.getValidMoves(board, r, c);
          for(let move of moves) {
            const newBoard = ChessEngine.cloneBoard(board);
            newBoard[move.r][move.c] = newBoard[r][c];
            newBoard[r][c] = null;
            // Minimax
            const moveVal = ChessEngine.minimax(newBoard, depth, -Infinity, Infinity, false);
            if (moveVal > bestVal) {
              bestVal = moveVal;
              bestMove = { from: {r,c}, to: move };
            }
          }
        }
      }
    }

    if (bestMove) {
      executeMove(bestMove.from, bestMove.to);
    }
  };

  const executeMove = (from, to) => {
    const newBoard = ChessEngine.cloneBoard(board);
    newBoard[to.r][to.c] = newBoard[from.r][from.c];
    newBoard[from.r][from.c] = null;

    // Promoção
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
    if (turn !== 'w' || aiThinking || status === 'checkmate') return;

    const clickedPiece = board[r][c];
    
    // 1. Tentar mover
    const move = possibleMoves.find(m => m.r === r && m.c === c);
    if (move) {
      executeMove(selected, move);
      return;
    }

    // 2. Selecionar
    if (clickedPiece && clickedPiece[0] === 'w') {
      if (selected && selected.r === r && selected.c === c) {
        setSelected(null); // Deseleciona
        setPossibleMoves([]);
      } else {
        setSelected({ r, c });
        // AQUI: Calcula movimentos válidos ao clicar
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
    setStatus('playing');
    setSelected(null);
    setPossibleMoves([]);
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
           {['easy', 'medium', 'hard'].map(d => (
             <button key={d} onClick={() => setDifficulty(d)} className={`px-2 text-[10px] uppercase font-bold rounded ${difficulty === d ? 'bg-blue-600 text-white' : 'text-white/50'}`}>
                {d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Difícil'}
             </button>
           ))}
        </div>
        <button onClick={resetGame} className="text-white/70 hover:text-white"><RotateCcw size={16}/></button>
      </div>

      {/* Tabuleiro */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-900" style={{ background: 'radial-gradient(circle at center, #334155 0%, #0f172a 100%)' }}>
        
        {/* Modal Game Over */}
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
                
                // Destaque de Xeque
                const isKingInCheck = piece === 'wk' && status === 'check' && turn === 'w';

                return (
                  <div 
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`relative flex items-center justify-center cursor-pointer
                      ${isBlack ? 'bg-[#64748b]' : 'bg-[#e2e8f0]'}
                      ${isSelected ? 'ring-inset ring-4 ring-yellow-400 bg-yellow-200/50' : ''}
                      ${isKingInCheck ? 'bg-red-500/80 ring-inset ring-4 ring-red-600 animate-pulse' : ''}
                    `}
                  >
                    {/* Marcadores de Movimento */}
                    {move && (
                      <div className={`absolute z-0 rounded-full
                        ${move.capture 
                          ? 'inset-0 border-4 border-red-500/60 animate-pulse' 
                          : 'w-4 h-4 bg-green-500/50 shadow-[0_0_10px_lime]'
                        }
                      `}></div>
                    )}

                    {/* Peça */}
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
            <span className="flex items-center gap-2 text-purple-300"><Brain size={14} className="animate-spin"/> IA Pensando...</span> 
            : <span className="flex items-center gap-2 text-gray-300">{turn === 'w' ? <Shield size={14}/> : <Swords size={14}/>} Vez das {turn === 'w' ? 'Brancas' : 'Pretas'}</span>
         }
      </div>
    </div>
  );
};