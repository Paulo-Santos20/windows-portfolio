import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Brain, Shield, Swords, AlertTriangle, Crown, Skull } from 'lucide-react';

// --- CONSTANTES ---
const PIECES = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
};

const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const INITIAL_BOARD = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

const INITIAL_CASTLING = { w: { k: true, q: true }, b: { k: true, q: true } };

// --- ENGINE LÓGICA ---
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

  // Verifica se a casa (r, c) está sendo atacada pelo inimigo
  isSquareAttacked: (board, r, c, defenderColor) => {
      const enemyColor = defenderColor === 'w' ? 'b' : 'w';
      
      // 1. Ataque de Peões Inimigos
      // Se sou Branco (defensor), inimigo Preto (vem de cima, r menor).
      // Um peão preto em [r-1][c±1] ataca [r][c].
      const pawnRow = defenderColor === 'w' ? r - 1 : r + 1;
      if (ChessEngine.isValidPos(pawnRow, c - 1) && board[pawnRow][c - 1] === enemyColor + 'p') return true;
      if (ChessEngine.isValidPos(pawnRow, c + 1) && board[pawnRow][c + 1] === enemyColor + 'p') return true;

      // 2. Cavalos
      const knightMoves = [[2,1], [2,-1], [-2,1], [-2,-1], [1,2], [1,-2], [-1,2], [-1,-2]];
      for(let [dr, dc] of knightMoves) {
          if(ChessEngine.isValidPos(r + dr, c + dc) && board[r + dr][c + dc] === enemyColor + 'n') return true;
      }

      // 3. Peças Deslizantes (Torre, Bispo, Rainha)
      const rays = [
          { dirs: [[0,1],[0,-1],[1,0],[-1,0]], pieces: ['r', 'q'] }, // Linhas
          { dirs: [[1,1],[1,-1],[-1,1],[-1,-1]], pieces: ['b', 'q'] } // Diagonais
      ];
      for(let { dirs, pieces } of rays) {
          for(let [dr, dc] of dirs) {
              let nr = r + dr, nc = c + dc;
              while(ChessEngine.isValidPos(nr, nc)) {
                  const p = board[nr][nc];
                  if(p) {
                      if(p[0] === enemyColor && pieces.includes(p[1])) return true;
                      break; // Bloqueado por qualquer peça
                  }
                  nr += dr; nc += dc;
              }
          }
      }
      
      // 4. Rei Inimigo (raio de 1)
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
                return true; // Continua deslizando
            } else if (target[0] !== color) {
                moves.push({ r: nr, c: nc, capture: true });
                return false; // Captura e para
            }
        }
        return false; // Bloqueado ou fora
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
        // Movimento frontal (só se vazio)
        if (ChessEngine.isValidPos(r + dir, c) && !board[r + dir][c]) {
            moves.push({ r: r + dir, c, capture: false });
            // Movimento duplo inicial
            if ((color === 'w' && r === 6) || (color === 'b' && r === 1)) {
                if (!board[r + (dir * 2)][c]) moves.push({ r: r + (dir * 2), c, capture: false });
            }
        }
        // Capturas Diagonais (só se tiver inimigo)
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

  getValidMoves: (board, r, c, castlingRights = null) => {
      const piece = board[r][c];
      if (!piece) return [];
      
      // 1. Pega movimentos brutos (padrão da peça)
      const rawMoves = ChessEngine.getRawMoves(board, r, c);
      
      // 2. Adiciona Roque se for Rei
      if (piece[1] === 'k' && castlingRights && castlingRights[piece[0]]) {
          const row = piece[0] === 'w' ? 7 : 0;
          if (r === row && c === 4 && !ChessEngine.isSquareAttacked(board, row, 4, piece[0])) { // Rei não pode estar em xeque
              if (castlingRights[piece[0]].k && !board[row][5] && !board[row][6] && !ChessEngine.isSquareAttacked(board, row, 5, piece[0]) && !ChessEngine.isSquareAttacked(board, row, 6, piece[0])) {
                  rawMoves.push({ r: row, c: 6, capture: false, isCastle: 'king' });
              }
              if (castlingRights[piece[0]].q && !board[row][1] && !board[row][2] && !board[row][3] && !ChessEngine.isSquareAttacked(board, row, 3, piece[0]) && !ChessEngine.isSquareAttacked(board, row, 2, piece[0])) {
                  rawMoves.push({ r: row, c: 2, capture: false, isCastle: 'queen' });
              }
          }
      }

      // 3. Filtra movimentos que deixam o rei em xeque
      return rawMoves.filter(move => {
          const tempBoard = ChessEngine.cloneBoard(board);
          tempBoard[move.r][move.c] = tempBoard[r][c]; // Executa movimento simulado
          tempBoard[r][c] = null;
          
          const kingPos = move.isCastle ? {r: move.r, c: move.c} : ChessEngine.findKing(tempBoard, piece[0]);
          if (!kingPos) return false; // Segurança
          
          return !ChessEngine.isSquareAttacked(tempBoard, kingPos.r, kingPos.c, piece[0]);
      });
  },

  evaluateBoard: (board) => {
      let score = 0;
      for(let r=0; r<8; r++) {
          for(let c=0; c<8; c++) {
              const p = board[r][c];
              if(!p) continue;
              const val = PIECE_VALUES[p[1]] + (p[1] === 'p' ? (p[0]==='w' ? (7-r)*10 : r*10) : 0); // Bonus por avançar peão
              score += p[0] === 'w' ? val : -val;
          }
      }
      return score;
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

  minimax: (board, depth, alpha, beta, isMaximizing) => {
      if (depth === 0) return ChessEngine.evaluateBoard(board);

      const turn = isMaximizing ? 'w' : 'b';
      const moves = ChessEngine.getAllValidMoves(board, turn, null);

      if (moves.length === 0) {
          const kingPos = ChessEngine.findKing(board, turn);
          if (kingPos && ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, turn)) {
              return isMaximizing ? -99999 : 99999; // Xeque-mate
          }
          return 0; // Afogamento
      }

      // Ordena capturas primeiro para otimizar poda
      moves.sort((a, b) => (b.to.capture ? 1 : 0) - (a.to.capture ? 1 : 0));

      if (isMaximizing) {
          let maxEval = -Infinity;
          for (let move of moves) {
              const newBoard = ChessEngine.cloneBoard(board);
              newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
              newBoard[move.from.r][move.from.c] = null;
              if (newBoard[move.to.r][move.to.c] === 'wp' && move.to.r === 0) newBoard[move.to.r][move.to.c] = 'wq'; // Promoção simples

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
              if (newBoard[move.to.r][move.to.c] === 'bp' && move.to.r === 7) newBoard[move.to.r][move.to.c] = 'bq';

              const evalScore = ChessEngine.minimax(newBoard, depth - 1, alpha, beta, true);
              minEval = Math.min(minEval, evalScore);
              beta = Math.min(beta, evalScore);
              if (beta <= alpha) break;
          }
          return minEval;
      }
  },

  getBestMove: (board, difficulty) => {
      const allMoves = ChessEngine.getAllValidMoves(board, 'b', null);
      if (allMoves.length === 0) return null;

      if (difficulty === 'easy') return allMoves[Math.floor(Math.random() * allMoves.length)];

      const depth = difficulty === 'extreme' ? 3 : 2;
      let bestMove = null;
      let minEval = Infinity;
      let alpha = -Infinity;
      let beta = Infinity;

      // Ordena para avaliar capturas primeiro
      allMoves.sort((a, b) => (b.to.capture ? 1 : 0) - (a.to.capture ? 1 : 0));

      for (let move of allMoves) {
          const newBoard = ChessEngine.cloneBoard(board);
          newBoard[move.to.r][move.to.c] = newBoard[move.from.r][move.from.c];
          newBoard[move.from.r][move.from.c] = null;
          // Promoção IA
          if (newBoard[move.to.r][move.to.c] === 'bp' && move.to.r === 7) newBoard[move.to.r][move.to.c] = 'bq';

          const evalScore = ChessEngine.minimax(newBoard, depth, alpha, beta, true);

          if (evalScore < minEval) {
              minEval = evalScore;
              bestMove = move;
          }
          beta = Math.min(beta, evalScore);
      }
      return bestMove || allMoves[0];
  }
};

// --- COMPONENTE VISUAL ---
export const ChessTitans = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [castling, setCastling] = useState(INITIAL_CASTLING);
  const [turn, setTurn] = useState('w');
  const [selected, setSelected] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  const [status, setStatus] = useState('playing');
  const [aiThinking, setAiThinking] = useState(false);

  // IA Joga
  useEffect(() => {
    if (turn === 'b' && status === 'playing') {
      setAiThinking(true);
      setTimeout(() => {
        const aiMove = ChessEngine.getBestMove(board, difficulty);
        if (aiMove) {
          executeMove(aiMove.from, aiMove.to);
        } else {
          // Se IA não tem movimentos, verifica fim de jogo
          const kingPos = ChessEngine.findKing(board, 'b');
          if (kingPos && ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, 'b')) setStatus('checkmate');
          else setStatus('stalemate');
        }
        setAiThinking(false);
      }, 100);
    }
  }, [turn, status, board]); // board é dependência para recálculo

  // Verifica Xeque/Mate após cada turno
  useEffect(() => {
      const kingPos = ChessEngine.findKing(board, turn);
      if(!kingPos) return;
      
      const inCheck = ChessEngine.isSquareAttacked(board, kingPos.r, kingPos.c, turn);
      const hasMoves = ChessEngine.getAllValidMoves(board, turn, castling).length > 0;

      if (inCheck && !hasMoves) setStatus('checkmate');
      else if (!inCheck && !hasMoves) setStatus('stalemate');
      else if (inCheck) setStatus('check');
      else setStatus('playing');
  }, [turn, board]); // Depende do turno atual e do tabuleiro

  const executeMove = (from, to) => {
    const newBoard = ChessEngine.cloneBoard(board);
    const piece = newBoard[from.r][from.c];
    const newCastling = JSON.parse(JSON.stringify(castling));

    newBoard[to.r][to.c] = piece;
    newBoard[from.r][from.c] = null;

    // Roque
    if (to.isCastle) {
        if (to.isCastle === 'king') { newBoard[from.r][5] = newBoard[from.r][7]; newBoard[from.r][7] = null; }
        else { newBoard[from.r][3] = newBoard[from.r][0]; newBoard[from.r][0] = null; }
    }

    // Atualiza direitos de Roque
    if (piece[1] === 'k') { if(newCastling[piece[0]]) { newCastling[piece[0]].k = false; newCastling[piece[0]].q = false; } }
    if (piece[1] === 'r') {
        if (from.c === 0 && newCastling[piece[0]]) newCastling[piece[0]].q = false;
        if (from.c === 7 && newCastling[piece[0]]) newCastling[piece[0]].k = false;
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
    
    // 1. TENTA EXECUTAR MOVIMENTO (Captura ou Deslocamento)
    // Se a casa clicada é um destino válido para a peça selecionada, MOVA.
    const move = possibleMoves.find(m => m.r === r && m.c === c);
    if (move) {
      executeMove(selected, move);
      return; // Importante: Sai da função aqui para não selecionar a peça inimiga
    }

    // 2. SE NÃO FOR MOVIMENTO, TENTA SELECIONAR NOVA PEÇA
    if (clickedPiece && clickedPiece[0] === 'w') {
      if (selected && selected.r === r && selected.c === c) {
        setSelected(null);
        setPossibleMoves([]);
      } else {
        setSelected({ r, c });
        setPossibleMoves(ChessEngine.getValidMoves(board, r, c, castling));
      }
    } else {
      // Clicou no vazio ou inimigo (sem ser movimento válido)
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
    setAiThinking(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e293b] font-sans select-none">
      {/* Header */}
      <div className="h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-white font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-1 rounded shadow-lg text-sm flex items-center gap-2"><Crown size={14}/> Chess Titans</span>
          {status === 'check' && <span className="bg-orange-500 px-2 py-0.5 rounded text-xs animate-pulse flex items-center gap-1"><AlertTriangle size={12}/> XEQUE!</span>}
        </div>
        <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
           {['easy', 'medium', 'hard', 'extreme'].map(d => (
             <button key={d} onClick={() => setDifficulty(d)} className={`px-2 py-1 text-[10px] uppercase font-bold rounded transition-all ${difficulty === d ? 'bg-blue-600 text-white' : 'text-white/40 hover:text-white'}`}>
                {d === 'extreme' ? <Skull size={12}/> : (d === 'easy' ? 'Fácil' : d === 'medium' ? 'Médio' : 'Difícil')}
             </button>
           ))}
        </div>
        <button onClick={resetGame} className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><RotateCcw size={18}/></button>
      </div>

      {/* Tabuleiro */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#334155_0%,_#0f172a_100%)]"></div>
        
        {(status === 'checkmate' || status === 'stalemate') && (
          <div className="absolute z-50 inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white p-8 rounded-2xl text-center border-4 border-slate-200 shadow-2xl transform scale-110">
                <h2 className={`text-4xl font-black mb-2 ${status === 'checkmate' ? 'text-red-600' : 'text-gray-600'}`}>{status === 'checkmate' ? 'FIM DE JOGO' : 'EMPATE'}</h2>
                <p className="text-gray-500 mb-6 font-medium text-lg">{status === 'stalemate' ? 'Afogamento' : (turn === 'w' ? 'Vitória das Pretas!' : 'Vitória das Brancas!')}</p>
                <button onClick={resetGame} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2 mx-auto"><RotateCcw size={18}/> Jogar Novamente</button>
             </div>
          </div>
        )}

        <div className="relative shadow-2xl rounded-lg border-[8px] border-[#475569] bg-[#334155]" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div className="grid grid-cols-8 grid-rows-8 w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] bg-[#e2e8f0]">
            {board.map((row, r) => (
              row.map((piece, c) => {
                const isBlack = (r + c) % 2 === 1;
                const isSelected = selected && selected.r === r && selected.c === c;
                const move = possibleMoves.find(m => m.r === r && m.c === c);
                const isCheck = piece && piece[1] === 'k' && piece[0] === turn && (status === 'check' || status === 'checkmate');

                return (
                  <div 
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150
                      ${isBlack ? 'bg-[#779556]' : 'bg-[#ebecd0]'}
                      ${isSelected ? '!bg-[#baca44]' : ''}
                      ${isCheck ? '!bg-red-500/50 ring-inset ring-4 ring-red-600' : ''}
                    `}
                  >
                    {/* Indicador de Movimento/Captura (Pointer Events None para o clique vazar para a Div Pai) */}
                    {move && (
                      <div className={`absolute z-20 pointer-events-none rounded-full
                        ${move.capture 
                          ? 'inset-0 border-[6px] border-black/20' 
                          : 'w-4 h-4 bg-black/20'
                        }
                      `}></div>
                    )}

                    {/* Peça (Pointer Events None para não bloquear o clique da casa) */}
                    {piece && (
                      <span className={`text-4xl sm:text-5xl select-none z-10 drop-shadow-sm transition-transform duration-200 pointer-events-none
                        ${piece[0] === 'w' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]' : 'text-black drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}
                        ${isSelected ? '-translate-y-1 scale-110' : ''}
                      `}
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

      <div className="h-10 bg-slate-800 flex items-center justify-between px-4 text-white text-xs border-t border-white/5 shrink-0">
         <div className="flex items-center gap-2">{aiThinking ? <span className="flex items-center gap-2 text-blue-300 animate-pulse"><Brain size={14} className="animate-spin"/> Pensando...</span> : <span className="flex items-center gap-2 text-gray-400 font-medium">Aguardando...</span>}</div>
         <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${turn === 'w' ? 'bg-white text-slate-900' : 'bg-black text-white border border-white/20'}`}>{turn === 'w' ? <Shield size={12}/> : <Swords size={12}/>} {turn === 'w' ? 'Sua Vez' : 'Vez das Pretas'}</div>
      </div>
    </div>
  );
};