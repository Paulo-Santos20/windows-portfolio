import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, RotateCcw, HelpCircle, X } from 'lucide-react';

// --- CONSTANTES ---
const SUITS = ['♥', '♦', '♣', '♠'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// --- COMPONENTE DE AJUDA ---
const HelpModal = ({ onClose }) => (
  <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm font-sans">
    <div className="bg-white w-96 rounded-lg shadow-2xl border border-slate-400 overflow-hidden flex flex-col">
      {/* Header Estilo Windows */}
      <div className="bg-gradient-to-b from-[#86c4e8] to-[#207cca] px-2 py-1 flex justify-between items-center border-b border-white/30">
        <div className="flex items-center gap-2 text-white text-sm font-bold shadow-sm">
          <HelpCircle size={14} />
          <span>Ajuda do Paciência</span>
        </div>
        <button onClick={onClose} className="bg-[#d64a4a] hover:bg-[#e81123] text-white rounded-sm p-0.5 border border-white/20 shadow-inner">
          <X size={14} />
        </button>
      </div>
      
      {/* Conteúdo */}
      <div className="p-6 text-sm text-slate-700 bg-white overflow-y-auto max-h-[400px]">
        <h3 className="font-bold text-lg mb-2 text-blue-800">Como Jogar</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>**Objetivo:** Mover todas as cartas para as 4 bases no canto superior direito, começando pelo Ás até o Rei.</li>
          <li>**Nas Colunas:** Você pode empilhar cartas em ordem **decrescente** (Rei, Dama, Valete...) alternando as cores (Vermelho sobre Preto).</li>
          <li>**Mover:** Arraste as cartas com o mouse. Você pode mover pilhas inteiras se elas já estiverem ordenadas.</li>
          <li>**Espaços Vazios:** Apenas o **Rei (K)** pode ser colocado em uma coluna vazia.</li>
          <li>**Dica:** Dê um **duplo clique** em uma carta para enviá-la automaticamente para a base.</li>
        </ul>
      </div>
      
      {/* Footer */}
      <div className="bg-[#f0f0f0] p-3 border-t border-slate-300 flex justify-end">
        <button onClick={onClose} className="px-4 py-1 bg-white border border-slate-400 rounded shadow-sm hover:bg-slate-100 text-xs">OK</button>
      </div>
    </div>
  </div>
);

export const Solitaire = () => {
  const [columns, setColumns] = useState([]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [stock, setStock] = useState([]);
  const [waste, setWaste] = useState([]);
  const [showHelp, setShowHelp] = useState(false);

  // Estado do Drag & Drop
  const [dragging, setDragging] = useState(null); // { cards: [], source: {type, idx, cardIdx}, startPos: {x,y}, currentPos: {x,y} }
  
  // Refs para detecção de drop (Hit Testing)
  const colRefs = useRef([]);
  const foundationRefs = useRef([]);

  useEffect(() => {
    initGame();
  }, []);

  // --- LÓGICA DO JOGO ---
  const initGame = () => {
    let deck = [];
    SUITS.forEach(suit => {
      RANKS.forEach((rank, index) => {
        deck.push({
          id: `${rank}${suit}`,
          rank: rank,
          suit: suit,
          value: index + 1,
          color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
          faceUp: false
        });
      });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const newColumns = Array(7).fill().map(() => []);
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck.pop();
        if (j === i) card.faceUp = true;
        newColumns[i].push(card);
      }
    }

    setColumns(newColumns);
    setStock(deck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setDragging(null);
  };

  // --- DRAG AND DROP (MOUSE HANDLERS) ---

  // 1. Iniciar Arraste
  const handleMouseDown = (e, source, cards) => {
    if (e.button !== 0) return; // Apenas botão esquerdo
    if (!cards || cards.length === 0) return;
    
    // Só pode arrastar cartas viradas para cima
    if (!cards[0].faceUp) return;

    e.preventDefault();
    e.stopPropagation();

    setDragging({
      cards: cards,
      source: source,
      startPos: { x: e.clientX, y: e.clientY },
      currentPos: { x: e.clientX, y: e.clientY }
    });
  };

  // 2. Mover Mouse (Global)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setDragging(prev => ({
          ...prev,
          currentPos: { x: e.clientX, y: e.clientY }
        }));
      }
    };

    const handleMouseUp = (e) => {
      if (dragging) {
        handleDrop(e);
        setDragging(null);
      }
    };

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  // 3. Soltar (Lógica de Validação)
  const handleDrop = (e) => {
    const { cards, source } = dragging;
    const dropX = e.clientX;
    const dropY = e.clientY;

    // Helper para verificar colisão
    const isOver = (rect) => {
      return dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom;
    };

    // A. Tentar soltar em uma Coluna
    for (let i = 0; i < 7; i++) {
      if (colRefs.current[i]) {
        const rect = colRefs.current[i].getBoundingClientRect();
        // Expande a área de drop para baixo para facilitar
        const hitRect = { ...rect, bottom: rect.bottom + 200 }; 
        
        if (isOver(hitRect)) {
          // Validar regra da coluna
          const targetCol = columns[i];
          if (canMoveToColumn(cards[0], targetCol)) {
             moveCards(source, { type: 'col', idx: i }, cards);
             return;
          }
        }
      }
    }

    // B. Tentar soltar numa Base (Foundation)
    // Só pode mover 1 carta por vez para base
    if (cards.length === 1) {
      for (let i = 0; i < 4; i++) {
        if (foundationRefs.current[i]) {
          const rect = foundationRefs.current[i].getBoundingClientRect();
          if (isOver(rect)) {
            if (canMoveToFoundation(cards[0], i)) {
              moveCards(source, { type: 'foundation', idx: i }, cards);
              return;
            }
          }
        }
      }
    }
  };

  // --- REGRAS E MOVIMENTAÇÃO ---

  const canMoveToColumn = (card, targetCol) => {
    if (targetCol.length === 0) return card.value === 13; // Rei
    const targetCard = targetCol[targetCol.length - 1];
    return (card.color !== targetCard.color) && (card.value === targetCard.value - 1);
  };

  const canMoveToFoundation = (card, fIdx) => {
    const pile = foundations[fIdx];
    if (pile.length === 0) return card.value === 1; // Ás
    const targetCard = pile[pile.length - 1];
    return (card.suit === targetCard.suit) && (card.value === targetCard.value + 1);
  };

  const moveCards = (from, to, cardsToMove) => {
    const newCols = [...columns];
    const newFoundations = [...foundations];
    let newWaste = [...waste];

    // 1. Remover da origem
    if (from.type === 'waste') {
      newWaste.pop();
    } else if (from.type === 'col') {
      const col = newCols[from.idx];
      col.splice(from.cardIdx, cardsToMove.length);
      // Virar carta anterior
      if (col.length > 0) col[col.length - 1].faceUp = true;
    }

    // 2. Adicionar ao destino
    if (to.type === 'col') {
      newCols[to.idx].push(...cardsToMove);
    } else if (to.type === 'foundation') {
      newFoundations[to.idx].push(cardsToMove[0]);
    }

    setColumns(newCols);
    setFoundations(newFoundations);
    setWaste(newWaste);
  };

  // --- AÇÕES EXTRAS ---
  const handleStockClick = () => {
    if (stock.length > 0) {
      const card = stock[stock.length - 1];
      const newStock = stock.slice(0, -1);
      setStock(newStock);
      setWaste([...waste, { ...card, faceUp: true }]);
    } else {
      const newStock = waste.map(c => ({ ...c, faceUp: false })).reverse();
      setStock(newStock);
      setWaste([]);
    }
  };

  const handleDoubleClick = (card, source) => {
    if (!card.faceUp) return;
    // Auto move para foundation
    for (let i = 0; i < 4; i++) {
      if (canMoveToFoundation(card, i)) {
        moveCards(source, { type: 'foundation', idx: i }, [card]);
        return;
      }
    }
  };

  // --- RENDERIZADORES ---
  const CardView = ({ card, style, onMouseDown, onDoubleClick, isDraggingSource }) => (
      <div 
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        className={`
            absolute w-20 h-28 rounded-md border shadow-sm select-none
            flex flex-col justify-between p-1
            ${card.faceUp ? 'bg-white border-slate-400' : 'bg-blue-700 border-white'}
            ${isDraggingSource ? 'opacity-0' : 'opacity-100'} 
            hover:brightness-105
        `}
        style={{ 
            ...style,
            backgroundImage: !card.faceUp ? 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)' : 'none',
            cursor: card.faceUp ? 'grab' : 'default'
        }}
      >
          {card.faceUp && (
              <>
                  <div className={`text-sm font-bold ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {card.rank}{card.suit}
                  </div>
                  <div className={`text-3xl text-center ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {card.suit}
                  </div>
                  <div className={`text-sm font-bold text-right transform rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {card.rank}{card.suit}
                  </div>
              </>
          )}
      </div>
  );

  // Renderiza a "pilha fantasma" que segue o mouse
  const DragLayer = () => {
    if (!dragging) return null;
    const { cards, startPos, currentPos } = dragging;
    const deltaX = currentPos.x - startPos.x;
    const deltaY = currentPos.y - startPos.y;

    return (
      <div 
        className="fixed z-[9999] pointer-events-none"
        style={{ 
            left: startPos.x - 40, // Centraliza no mouse (aprox)
            top: startPos.y - 50,
            transform: `translate(${deltaX}px, ${deltaY}px)`
        }}
      >
         {cards.map((card, i) => (
             <div 
                key={'drag-' + card.id}
                className={`
                    absolute w-20 h-28 rounded-md border border-slate-400 bg-white shadow-2xl
                    flex flex-col justify-between p-1
                `}
                style={{ top: i * 25 }}
             >
                  <div className={`text-sm font-bold ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {card.rank}{card.suit}
                  </div>
                  <div className={`text-3xl text-center ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {card.suit}
                  </div>
                  <div className={`text-sm font-bold text-right transform rotate-180 ${card.color === 'red' ? 'text-red-600' : 'text-black'}`}>
                      {card.rank}{card.suit}
                  </div>
             </div>
         ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#005c00] font-sans overflow-hidden select-none">
       {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
       
       {/* Camada de Arraste */}
       <DragLayer />

       {/* Topo */}
       <div className="h-8 bg-white/10 flex items-center justify-between px-4 border-b border-white/10 text-white text-xs">
           <div className="flex gap-2">
               <span>Solitaire</span>
               <button onClick={() => setShowHelp(true)} className="hover:underline flex items-center gap-1 text-yellow-300">
                   <HelpCircle size={12}/> Ajuda
               </button>
           </div>
           <div className="flex gap-4">
               <span>Pontos: {foundations.flat().length * 10}</span>
               <button onClick={initGame} className="hover:text-yellow-300 flex gap-1"><RotateCcw size={14}/> Reiniciar</button>
           </div>
       </div>

       {/* Mesa */}
       <div className="flex-1 p-4 relative">
           
           {/* ÁREA SUPERIOR */}
           <div className="flex justify-between max-w-4xl mx-auto">
               {/* Baralho e Lixo */}
               <div className="flex gap-4">
                   {/* Stock */}
                   <div onClick={handleStockClick} className="w-20 h-28 rounded-md border-2 border-white/20 flex items-center justify-center cursor-pointer hover:brightness-110 bg-[#004d00]">
                       {stock.length > 0 ? (
                           <div className="w-full h-full bg-blue-700 rounded-md border-2 border-white relative">
                               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
                               <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">{stock.length}</div>
                           </div>
                       ) : <RefreshCw className="text-white/30" />}
                   </div>

                   {/* Waste */}
                   <div className="w-20 h-28 relative">
                       {waste.length > 0 && (
                           <CardView 
                                card={waste[waste.length - 1]} 
                                style={{ top: 0, left: 0 }}
                                isDraggingSource={dragging && dragging.source.type === 'waste'}
                                onMouseDown={(e) => handleMouseDown(e, { type: 'waste' }, [waste[waste.length - 1]])}
                                onDoubleClick={() => handleDoubleClick(waste[waste.length - 1], { type: 'waste' })}
                           />
                       )}
                   </div>
               </div>

               {/* Foundations */}
               <div className="flex gap-2">
                   {foundations.map((pile, i) => (
                       <div 
                         key={i} 
                         ref={el => foundationRefs.current[i] = el}
                         className="w-20 h-28 rounded-md border-2 border-white/20 bg-white/5 flex items-center justify-center relative"
                       >
                           {pile.length === 0 ? (
                               <span className="text-3xl text-white/20">{SUITS[i]}</span>
                           ) : (
                               <CardView 
                                    card={pile[pile.length - 1]} 
                                    style={{ top: 0, left: 0 }} 
                                    // Não permitimos arrastar DA base de volta para simplificar (regra opcional)
                               />
                           )}
                       </div>
                   ))}
               </div>
           </div>

           {/* COLUNAS */}
           <div className="flex justify-center gap-2 sm:gap-4 mt-8">
               {columns.map((col, colIdx) => (
                   <div 
                     key={colIdx} 
                     ref={el => colRefs.current[colIdx] = el}
                     className="w-20 h-[400px] relative"
                   >
                       {/* Area vazia clicável/droppable */}
                       {col.length === 0 && <div className="w-20 h-28 rounded-md border-2 border-white/10 bg-white/5"></div>}

                       {col.map((card, cardIdx) => (
                           <CardView 
                                key={card.id} 
                                card={card}
                                style={{ top: cardIdx * (card.faceUp ? 25 : 10) }}
                                isDraggingSource={dragging && dragging.source.type === 'col' && dragging.source.idx === colIdx && cardIdx >= dragging.source.cardIdx}
                                onMouseDown={(e) => handleMouseDown(e, { type: 'col', idx: colIdx, cardIdx }, col.slice(cardIdx))}
                                onDoubleClick={() => handleDoubleClick(card, { type: 'col', idx: colIdx })}
                           />
                       ))}
                   </div>
               ))}
           </div>

       </div>
    </div>
  );
};