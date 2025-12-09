import React, { useState } from 'react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0.');
  const [history, setHistory] = useState(''); // Novo estado para mostrar a conta
  const [memory, setMemory] = useState(0);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [value, setValue] = useState(null);

  const getFloat = () => parseFloat(display.replace(/\.$/, ''));

  // --- ENTRADA ---
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit) + '.');
      setWaitingForOperand(false);
    } else {
      if (display === '0.') {
        setDisplay(String(digit) + '.');
      } else {
        const raw = display.replace('.', '');
        setDisplay(raw + digit + '.');
      }
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('..')) {
      if (display.endsWith('.')) { } // Já tem ponto visual
    }
  };

  // --- OPERAÇÕES ---
  const performOperation = (nextOperator) => {
    const inputValue = getFloat();

    if (value == null) {
      // Primeiro número digitado
      setValue(inputValue);
      if (nextOperator !== '=') {
          setHistory(`${inputValue} ${nextOperator}`);
      }
    } else if (pendingOperator) {
      // Já existe uma operação pendente, calcula o intermediário
      const currentValue = value || 0;
      const newValue = calculate(currentValue, inputValue, pendingOperator);
      
      setValue(newValue);
      setDisplay(String(newValue) + '.');

      // Se for =, limpa o histórico. Se for operador, atualiza o histórico com o acumulado
      if (nextOperator === '=') {
          setHistory(''); 
          setPendingOperator(null);
          setWaitingForOperand(true);
          return; // Para aqui para não setar o operador como '='
      } else {
          setHistory(`${newValue} ${nextOperator}`);
      }
    } else {
        // Caso onde trocamos de operador sem digitar número
        if (nextOperator !== '=') {
            setHistory(`${inputValue} ${nextOperator}`);
        }
    }

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

  // --- AÇÕES ---
  const handleClear = () => {
    setDisplay('0.');
    setHistory('');
    setValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
  };

  const handleCE = () => setDisplay('0.');
  
  const handleBackspace = () => {
    if (waitingForOperand) return;
    const current = display.replace('.', '');
    if (current.length === 1) {
      setDisplay('0.');
    } else {
      setDisplay(current.slice(0, -1) + '.');
    }
  };

  const handleInverse = () => {
    const num = getFloat();
    const res = 1 / num;
    setDisplay(String(res) + '.');
    setHistory(`recip(${num})`);
    setWaitingForOperand(true);
  };

  const handleSqrt = () => {
    const num = getFloat();
    const res = Math.sqrt(num);
    setDisplay(String(res) + '.');
    setHistory(`sqrt(${num})`);
    setWaitingForOperand(true);
  };

  const handleSign = () => {
    const num = getFloat();
    setDisplay(String(num * -1) + '.');
  };

  const handlePercent = () => {
    const current = getFloat();
    if (value === null) return;
    const result = (value * current) / 100;
    setDisplay(String(result) + '.');
    // Mostra visualmente o cálculo da porcentagem
    setHistory(`${value} ${pendingOperator} ${result}`); 
  };

  const handleMemory = (op) => {
      const current = getFloat();
      switch(op) {
          case 'MC': setMemory(0); break;
          case 'MR': setDisplay(String(memory) + '.'); setWaitingForOperand(true); break;
          case 'MS': setMemory(current); setWaitingForOperand(true); break;
          case 'M+': setMemory(memory + current); setWaitingForOperand(true); break;
      }
  };

  // --- BOTÃO ---
  const CalcButton = ({ label, onClick, className = "", textColor = "text-blue-800" }) => (
    <button
      type="button"
      onMouseDown={(e) => {
          e.stopPropagation();
          if (onClick) onClick(label);
      }}
      className={`
        relative flex items-center justify-center
        bg-gradient-to-b from-white to-[#dcdcdc]
        border border-[#878785] rounded-[3px]
        active:border-[#666] active:bg-[#ccc] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]
        shadow-[1px_1px_1px_rgba(0,0,0,0.1)]
        text-[11px] font-tahoma ${textColor} ${className}
        cursor-default select-none
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col w-[224px] h-auto bg-[#ece9d8] select-none font-tahoma p-[3px] pointer-events-auto"
         style={{ border: '1px solid #d4d0c8' }}>
        
        {/* Menu Bar */}
        <div className="flex gap-2 text-[11px] text-black mb-[2px] px-1">
            <span className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">Edit</span>
            <span className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">View</span>
            <span className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">Help</span>
        </div>

        {/* VISOR (ATUALIZADO PARA MOSTRAR HISTÓRICO) */}
        <div className="bg-white border border-[#7b9ebd] rounded-[3px] h-[34px] mb-[6px] flex flex-col items-end justify-center px-2 mx-[2px] shadow-[inset_2px_2px_2px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Linha Pequena do Histórico */}
            <span className="text-[10px] text-gray-500 h-[12px] leading-none w-full text-right truncate">
                {history}
            </span>
            {/* Linha Principal */}
            <span className="text-[16px] truncate w-full text-right font-medium text-black leading-none pb-1">
                {display}
            </span>
        </div>

        {/* Corpo Principal */}
        <div className="flex flex-col gap-[4px] px-[2px] pb-[2px]">
            
            {/* Linha Superior */}
            <div className="flex gap-[4px] h-[28px]">
                <div className="w-[34px] h-full border border-[#878785] bg-[#ece9d8] rounded-[3px] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)] flex items-center justify-center">
                    {memory !== 0 && <span className="text-[14px] font-bold text-black mt-[-2px]">M</span>}
                </div>
                <div className="flex gap-[4px] flex-1">
                    <CalcButton label="Backspace" textColor="text-red-600" className="flex-1" onClick={handleBackspace} />
                    <CalcButton label="CE" textColor="text-red-600" className="flex-1" onClick={handleCE} />
                    <CalcButton label="C" textColor="text-red-600" className="flex-1" onClick={handleClear} />
                </div>
            </div>

            {/* Grid Numérico */}
            <div className="grid grid-cols-6 gap-[4px]">
                <CalcButton label="MC" textColor="text-red-600" className="w-[32px] h-[28px]" onClick={() => handleMemory('MC')} />
                <CalcButton label="7" onClick={() => inputDigit(7)} className="w-[32px] h-[28px]" />
                <CalcButton label="8" onClick={() => inputDigit(8)} className="w-[32px] h-[28px]" />
                <CalcButton label="9" onClick={() => inputDigit(9)} className="w-[32px] h-[28px]" />
                <CalcButton label="/" textColor="text-red-600" onClick={() => performOperation('/')} className="w-[32px] h-[28px]" />
                <CalcButton label="sqrt" textColor="text-blue-800" onClick={handleSqrt} className="w-[32px] h-[28px]" />

                <CalcButton label="MR" textColor="text-red-600" className="w-[32px] h-[28px]" onClick={() => handleMemory('MR')} />
                <CalcButton label="4" onClick={() => inputDigit(4)} className="w-[32px] h-[28px]" />
                <CalcButton label="5" onClick={() => inputDigit(5)} className="w-[32px] h-[28px]" />
                <CalcButton label="6" onClick={() => inputDigit(6)} className="w-[32px] h-[28px]" />
                <CalcButton label="*" textColor="text-red-600" onClick={() => performOperation('*')} className="w-[32px] h-[28px]" />
                <CalcButton label="%" textColor="text-blue-800" onClick={handlePercent} className="w-[32px] h-[28px]" />

                <CalcButton label="MS" textColor="text-red-600" className="w-[32px] h-[28px]" onClick={() => handleMemory('MS')} />
                <CalcButton label="1" onClick={() => inputDigit(1)} className="w-[32px] h-[28px]" />
                <CalcButton label="2" onClick={() => inputDigit(2)} className="w-[32px] h-[28px]" />
                <CalcButton label="3" onClick={() => inputDigit(3)} className="w-[32px] h-[28px]" />
                <CalcButton label="-" textColor="text-red-600" onClick={() => performOperation('-')} className="w-[32px] h-[28px]" />
                <CalcButton label="1/x" textColor="text-blue-800" onClick={handleInverse} className="w-[32px] h-[28px]" />

                <CalcButton label="M+" textColor="text-red-600" className="w-[32px] h-[28px]" onClick={() => handleMemory('M+')} />
                <CalcButton label="0" onClick={() => inputDigit(0)} className="w-[32px] h-[28px]" />
                <CalcButton label="+/-" textColor="text-blue-800" onClick={handleSign} className="w-[32px] h-[28px]" />
                <CalcButton label="." textColor="text-blue-800" onClick={inputDot} className="w-[32px] h-[28px]" />
                <CalcButton label="+" textColor="text-red-600" onClick={() => performOperation('+')} className="w-[32px] h-[28px]" />
                <CalcButton label="=" textColor="text-red-600" onClick={() => performOperation('=')} className="w-[32px] h-[28px]" />
            </div>
        </div>
    </div>
  );
};