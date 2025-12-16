import React, { useState } from 'react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0.');
  const [history, setHistory] = useState('');
  const [memory, setMemory] = useState(0);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [value, setValue] = useState(null);

  const getFloat = () => parseFloat(display.replace(/\.$/, ''));

  // --- LÓGICA (Mantida igual, apenas visual alterado abaixo) ---
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit) + '.');
      setWaitingForOperand(false);
    } else {
      if (display === '0.') setDisplay(String(digit) + '.');
      else setDisplay(display.replace('.', '') + digit + '.');
    }
  };

  const inputDot = () => {
    if (waitingForOperand) { setDisplay('0.'); setWaitingForOperand(false); }
    else if (!display.includes('..')) { if (display.endsWith('.')) { } }
  };

  const performOperation = (nextOperator) => {
    const inputValue = getFloat();
    if (value == null) {
      setValue(inputValue);
      if (nextOperator !== '=') setHistory(`${inputValue} ${nextOperator}`);
    } else if (pendingOperator) {
      const currentValue = value || 0;
      const newValue = calculate(currentValue, inputValue, pendingOperator);
      setValue(newValue);
      setDisplay(String(newValue) + '.');
      if (nextOperator === '=') { setHistory(''); setPendingOperator(null); setWaitingForOperand(true); return; } 
      else { setHistory(`${newValue} ${nextOperator}`); }
    } else { if (nextOperator !== '=') setHistory(`${inputValue} ${nextOperator}`); }
    setWaitingForOperand(true);
    setPendingOperator(nextOperator);
  };

  const calculate = (left, right, operator) => {
    switch (operator) {
      case '+': return left + right;
      case '-': return left - right;
      case '*': return left * right;
      case '/': return left / right;
      default: return right;
    }
  };

  const handleClear = () => { setDisplay('0.'); setHistory(''); setValue(null); setPendingOperator(null); setWaitingForOperand(false); };
  const handleCE = () => setDisplay('0.');
  const handleBackspace = () => { if (!waitingForOperand) { const cur = display.replace('.', ''); setDisplay(cur.length === 1 ? '0.' : cur.slice(0, -1) + '.'); }};
  const handleInverse = () => { const num = getFloat(); setDisplay(String(1/num)+'.'); setWaitingForOperand(true); };
  const handleSqrt = () => { const num = getFloat(); setDisplay(String(Math.sqrt(num))+'.'); setWaitingForOperand(true); };
  const handleSign = () => { setDisplay(String(getFloat() * -1)+'.'); };
  const handlePercent = () => { if (value !== null) setDisplay(String((value * getFloat()) / 100)+'.'); };
  const handleMemory = (op) => {
      const current = getFloat();
      switch(op) {
          case 'MC': setMemory(0); break;
          case 'MR': setDisplay(String(memory)+'.'); setWaitingForOperand(true); break;
          case 'MS': setMemory(current); setWaitingForOperand(true); break;
          case 'M+': setMemory(memory + current); setWaitingForOperand(true); break;
      }
  };

  // Botão genérico
  const CalcButton = ({ label, onClick, className = "", textColor = "text-blue-800" }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.stopPropagation(); if (onClick) onClick(label); }}
      className={`relative flex items-center justify-center bg-gradient-to-b from-white to-[#dcdcdc] border border-[#878785] rounded-[3px] active:border-[#666] active:bg-[#ccc] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] shadow-[1px_1px_1px_rgba(0,0,0,0.1)] text-[11px] font-tahoma ${textColor} ${className} cursor-default select-none`}
    >
      {label}
    </button>
  );

  return (
    // CONTAINER PRINCIPAL: Ocupa 100% da janela (que será definida na Store)
    <div className="flex flex-col w-full h-full bg-[#ece9d8] select-none font-tahoma p-[3px] pointer-events-auto overflow-hidden">
        
        {/* Menu Bar */}
        <div className="flex gap-2 text-[11px] text-black mb-[2px] px-1 shrink-0">
            <span className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">Edit</span>
            <span className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">View</span>
            <span className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">Help</span>
        </div>

        {/* VISOR: Flex-grow 0 para não esticar, w-full para preencher lateralmente */}
        <div className="w-full px-[2px] mb-[6px] shrink-0">
            <div className="bg-white border border-[#7b9ebd] rounded-[3px] h-[34px] flex flex-col items-end justify-center px-2 shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1)] overflow-hidden">
                <span className="text-[10px] text-gray-500 h-[12px] leading-none w-full text-right truncate">{history}</span>
                <span className="text-[16px] truncate w-full text-right font-medium text-black leading-none pb-1">{display}</span>
            </div>
        </div>

        {/* ÁREA DOS BOTÕES: Ocupa o resto do espaço */}
        <div className="flex flex-col gap-[4px] px-[2px] pb-[2px] flex-1">
            
            {/* Linha Superior (Memória + Clear) */}
            <div className="flex gap-[4px] h-[28px] shrink-0">
                <div className="w-[34px] h-full border border-[#878785] bg-[#ece9d8] rounded-[3px] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] flex items-center justify-center shrink-0">
                    {memory !== 0 && <span className="text-[14px] font-bold text-black mt-[-2px]">M</span>}
                </div>
                {/* Botões ocupam o resto da largura igualmente */}
                <CalcButton label="Backspace" textColor="text-red-600" className="flex-1" onClick={handleBackspace} />
                <CalcButton label="CE" textColor="text-red-600" className="flex-1" onClick={handleCE} />
                <CalcButton label="C" textColor="text-red-600" className="flex-1" onClick={handleClear} />
            </div>

            {/* Grid Principal (6 Colunas) - Preenche altura e largura restantes */}
            <div className="grid grid-cols-6 gap-[4px] flex-1">
                <CalcButton label="MC" textColor="text-red-600" onClick={() => handleMemory('MC')} />
                <CalcButton label="7" onClick={() => inputDigit(7)} />
                <CalcButton label="8" onClick={() => inputDigit(8)} />
                <CalcButton label="9" onClick={() => inputDigit(9)} />
                <CalcButton label="/" textColor="text-red-600" onClick={() => performOperation('/')} />
                <CalcButton label="sqrt" textColor="text-blue-800" onClick={handleSqrt} />

                <CalcButton label="MR" textColor="text-red-600" onClick={() => handleMemory('MR')} />
                <CalcButton label="4" onClick={() => inputDigit(4)} />
                <CalcButton label="5" onClick={() => inputDigit(5)} />
                <CalcButton label="6" onClick={() => inputDigit(6)} />
                <CalcButton label="*" textColor="text-red-600" onClick={() => performOperation('*')} />
                <CalcButton label="%" textColor="text-blue-800" onClick={handlePercent} />

                <CalcButton label="MS" textColor="text-red-600" onClick={() => handleMemory('MS')} />
                <CalcButton label="1" onClick={() => inputDigit(1)} />
                <CalcButton label="2" onClick={() => inputDigit(2)} />
                <CalcButton label="3" onClick={() => inputDigit(3)} />
                <CalcButton label="-" textColor="text-red-600" onClick={() => performOperation('-')} />
                <CalcButton label="1/x" textColor="text-blue-800" onClick={handleInverse} />

                <CalcButton label="M+" textColor="text-red-600" onClick={() => handleMemory('M+')} />
                <CalcButton label="0" onClick={() => inputDigit(0)} />
                <CalcButton label="+/-" textColor="text-blue-800" onClick={handleSign} />
                <CalcButton label="." textColor="text-blue-800" onClick={inputDot} />
                <CalcButton label="+" textColor="text-red-600" onClick={() => performOperation('+')} />
                <CalcButton label="=" textColor="text-red-600" onClick={() => performOperation('=')} />
            </div>
        </div>
    </div>
  );
};