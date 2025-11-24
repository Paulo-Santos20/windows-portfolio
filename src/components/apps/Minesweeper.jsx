import React, { useState, useEffect } from 'react';
import { Smile, Frown, Meh } from 'lucide-react';

export const Minesweeper = () => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [mineCount, setMineCount] = useState(MINES);
  const [face, setFace] = useState('smile'); // smile, oh, dead, cool

  // Inicializa o jogo
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setGameOver(false);
    setWin(false);
    setMineCount(MINES);
    setFace('smile');

    // Cria grid vazio
    let newGrid = Array(ROWS).fill().map(() => Array(COLS).fill({ 
      isMine: false, 
      isOpen: false, 
      isFlagged: false, 
      count: 0 
    }));

    // Coloca Minas
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      let r = Math.floor(Math.random() * ROWS);
      let c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c] = { ...newGrid[r][c], isMine: true };
        minesPlaced++;
      }
    }

    // Calcula Vizinhos
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          // Checa os 8 vizinhos
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c] = { ...newGrid[r][c], count };
        }
      }
    }
    setGrid(newGrid);
  };

  const revealCell = (r, c) => {
    if (gameOver || win || grid[r][c].isOpen || grid[r][c].isFlagged) return;

    let newGrid = [...grid];
    newGrid[r] = [...newGrid[r]]; // Copia a linha para imutabilidade

    if (newGrid[r][c].isMine) {
      // BOOM
      newGrid[r][c] = { ...newGrid[r][c], isOpen: true }; // Mostra a mina
      setGameOver(true);
      setFace('dead');
      // Revela todas as minas
      revealAllMines(newGrid);
    } else {
      // Abre a célula
      floodFill(newGrid, r, c);
      setGrid(newGrid);
      checkWin(newGrid);
    }
  };

  const floodFill = (currentGrid, r, c) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || currentGrid[r][c].isOpen || currentGrid[r][c].isMine) return;

    currentGrid[r][c] = { ...currentGrid[r][c], isOpen: true };

    if (currentGrid[r][c].count === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          floodFill(currentGrid, r + i, c + j);
        }
      }
    }
  };

  const revealAllMines = (currentGrid) => {
     const revealed = currentGrid.map(row => row.map(cell => 
        cell.isMine ? { ...cell, isOpen: true } : cell
     ));
     setGrid(revealed);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isOpen) return;

    const newGrid = [...grid];
    const cell = newGrid[r][c];
    newGrid[r][c] = { ...cell, isFlagged: !cell.isFlagged };
    
    setMineCount(prev => cell.isFlagged ? prev + 1 : prev - 1);
    setGrid(newGrid);
  };

  const checkWin = (currentGrid) => {
    let openedCount = 0;
    currentGrid.forEach(row => row.forEach(cell => {
      if (cell.isOpen) openedCount++;
    }));

    if (openedCount === (ROWS * COLS - MINES)) {
      setWin(true);
      setFace('cool');
    }
  };

  // Cores dos números clássicos
  const numColors = [
    '', 'text-blue-600', 'text-green-600', 'text-red-600', 'text-blue-900', 'text-red-900', 'text-teal-600', 'text-black', 'text-gray-600'
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#c0c0c0] p-4 font-sans select-none">
       {/* Moldura do Jogo */}
       <div className="bg-[#c0c0c0] p-1 border-l-4 border-t-4 border-white border-r-4 border-b-4 border-[#808080] shadow-xl">
          
          {/* Header (Placar e Rosto) */}
          <div className="flex justify-between items-center p-2 border-l-2 border-t-2 border-[#808080] border-r-2 border-b-2 border-white mb-2 bg-[#c0c0c0]">
              {/* Contador Minas */}
              <div className="bg-black text-red-600 font-mono text-2xl px-1 border-2 border-[#808080] w-16 text-center">
                  {Math.max(0, mineCount).toString().padStart(3, '0')}
              </div>

              {/* Botão Reset (Rosto) */}
              <button 
                onClick={resetGame}
                className="w-8 h-8 flex items-center justify-center bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white"
              >
                 {face === 'smile' && <Smile className="text-yellow-600 fill-yellow-400" size={20} />}
                 {face === 'dead' && <Frown className="text-yellow-600 fill-yellow-400" size={20} />}
                 {face === 'cool' && <span className="text-lg">😎</span>}
              </button>

              {/* Tempo (Fake por enquanto) */}
              <div className="bg-black text-red-600 font-mono text-2xl px-1 border-2 border-[#808080] w-16 text-center">
                  000
              </div>
          </div>

          {/* Grid do Jogo */}
          <div className="grid grid-cols-9 border-l-4 border-t-4 border-[#808080] border-r-4 border-b-4 border-white">
              {grid.map((row, r) => (
                  row.map((cell, c) => (
                      <div 
                        key={`${r}-${c}`}
                        onClick={() => revealCell(r, c)}
                        onContextMenu={(e) => toggleFlag(e, r, c)}
                        onMouseDown={() => !gameOver && setFace('oh')}
                        onMouseUp={() => !gameOver && setFace('smile')}
                        className={`w-6 h-6 flex items-center justify-center text-sm font-bold cursor-default
                            ${cell.isOpen 
                                ? 'border-[1px] border-[#808080] bg-[#c0c0c0]' 
                                : 'bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080]'
                            }
                        `}
                      >
                         {cell.isOpen && cell.isMine && <div className="w-3 h-3 bg-black rounded-full"></div>}
                         {cell.isOpen && !cell.isMine && cell.count > 0 && (
                             <span className={numColors[cell.count]}>{cell.count}</span>
                         )}
                         {!cell.isOpen && cell.isFlagged && <span className="text-red-600 text-xs">🚩</span>}
                      </div>
                  ))
              ))}
          </div>
       </div>
    </div>
  );
};