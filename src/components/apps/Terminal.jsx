import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';

export const Terminal = ({ windowId }) => {
  const { closeWindow } = useOSStore();
  
  // Histórico inicial
  const [history, setHistory] = useState([
      'Microsoft Windows XP [Versão 5.1.2600]',
      '(C) Copyright 1985-2001 Microsoft Corp.',
      '',
      'Digite "help" para ver os comandos disponíveis.',
      ''
  ]);
  
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Foca no input invisível ao clicar na janela preta
  const handleFocus = () => {
      // preventScroll: true é a chave, mas a posição fixed do input ajuda mais
      inputRef.current?.focus({ preventScroll: true });
  };

  // Mantém o scroll sempre embaixo quando o histórico cresce
  useEffect(() => {
      if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
  }, [history]);

  // Foca ao abrir a janela
  useEffect(() => {
      handleFocus();
  }, []);

  const handleCommand = (e) => {
      if (e.key === 'Enter') {
          const cmd = input.trim().toLowerCase();
          let response = [];

          switch (cmd) {
              case 'help':
                  response = [
                      'Comandos disponíveis:',
                      '  ABOUT    - Sobre o desenvolvedor',
                      '  PROJECTS - Listar projetos',
                      '  CONTACT  - Informações de contato',
                      '  CLS      - Limpar a tela',
                      '  EXIT     - Fechar o Prompt de Comando',
                      '  HELP     - Mostra esta lista'
                  ];
                  break;
              case 'cls':
              case 'clear':
                  setHistory([]);
                  setInput('');
                  return;
              case 'about':
                  response = ['Paulo Cardoso', 'Analista de Sistemas Full Stack.', 'Especialista em React, Node.js e UI/UX.'];
                  break;
              case 'contact':
                  response = ['LinkedIn: linkedin.com/in/paulo', 'GitHub: github.com/paulo', 'Email: paulo@exemplo.com'];
                  break;
              case 'projects':
                  response = ['1. E-commerce Full Stack', '2. Dashboard Financeiro', '3. Clone Windows XP', 'Use o ícone "Meus Projetos" para detalhes.'];
                  break;
              case 'exit':
                  closeWindow(windowId);
                  return;
              case '':
                  break;
              default:
                  response = [`'${cmd}' não é reconhecido como um comando interno ou externo.`];
          }

          setHistory(prev => [...prev, `C:\\Users\\Paulo>${input}`, ...response, '']);
          setInput('');
      }
  };

  return (
    <div 
        className="h-full bg-black text-gray-300 font-mono text-sm p-2 overflow-y-auto cursor-text select-none"
        onClick={handleFocus}
        style={{ fontFamily: 'Consolas, "Lucida Console", monospace' }}
        ref={containerRef}
    >
        {/* Histórico de Comandos */}
        {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-tight mb-0.5 break-all">{line}</div>
        ))}
        
        {/* Linha Atual (Simulada) */}
        <div className="flex flex-wrap break-all">
            <span className="mr-2 whitespace-nowrap">C:\Users\Paulo&gt;</span>
            
            {/* Texto que o usuário vê (Espelho do input) */}
            <span>{input}</span>
            
            {/* Cursor Piscante */}
            <span className="animate-pulse font-bold ml-[1px]">_</span>
        </div>

        {/* INPUT FANTASMA: 
            Fica fixo e invisível. Captura o teclado sem quebrar o layout.
        */}
        <input 
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoComplete="off"
            spellCheck="false"
            // Classes Tailwind para sumir com ele do fluxo visual, mas manter funcional
            className="fixed top-[-1000px] left-[-1000px] opacity-0 h-0 w-0"
        />
        
        <div ref={bottomRef} />
    </div>
  );
};