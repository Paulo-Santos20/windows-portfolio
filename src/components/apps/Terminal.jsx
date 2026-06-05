import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { FsocietyPage } from './FsocietyPage';

export const Terminal = ({ windowId }) => {
  const { closeWindow, openWindow } = useOSStore();

  const [history, setHistory] = useState([
      'Microsoft Windows XP [Versão 5.1.2600]',
      '(C) Copyright 1985-2001 Microsoft Corp.',
      '',
      'Digite "help" para ver os comandos disponíveis.',
      ''
  ]);

  const [input, setInput] = useState('');
  const [color, setColor] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [awaitingPassword, setAwaitingPassword] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleFocus = () => {
      inputRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
      if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
  }, [history]);

  useEffect(() => {
      handleFocus();
  }, []);

  const handleCommand = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(commandHistory[newIdx]);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIdx = historyIndex + 1;
        if (newIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIdx);
          setInput(commandHistory[newIdx]);
        }
        return;
      }
      if (e.key === 'Enter') {
          const raw = input.trim();
          const cmd = raw.toLowerCase();
          const args = raw.split(/\s+/);
          const firstArg = args[0]?.toLowerCase() || '';
          let response = [];

          // Modo senha fsociety
          if (awaitingPassword) {
            setAwaitingPassword(false);
            if (cmd === 'leavemehere') {
              response = [
                'Acesso concedido. Redirecionando...',
                ''
              ];
              setHistory(prev => [...prev, `Digite a senha: ${raw}`, ...response]);
              setInput('');
              setTimeout(() => {
                openWindow('fsociety', 'fsociety.exe', null, <FsocietyPage accessToken="fsociety-leavemehere" />, '/', {});
              }, 800);
            } else {
              response = [
                'Senha incorreta. Acesso negado.',
                'Tentativa de acesso inválida registrada.',
                ''
              ];
              setHistory(prev => [...prev, `Digite a senha: ${raw}`, ...response]);
              setInput('');
            }
            return;
          }

          switch (firstArg) {
              case 'help':
                  response = [
                      'Comandos disponíveis:',
                      '  ABOUT     - Sobre o desenvolvedor',
                      '  PROJECTS  - Listar projetos',
                      '  CONTACT   - Informações de contato',
                      '  CLS       - Limpar a tela',
                      '  EXIT      - Fechar o Prompt de Comando',
                      '  HELP      - Mostra esta lista',
                      '  DATE      - Data atual',
                  '  TIME      - Hora atual',
                  '  fsociety00.dat - Arquivo classificado',
                  '  WHOAMI    - Usuário atual',
                  '  VER       - Versão do sistema',
                      '  DIR       - Lista de diretórios',
                      '  ECHO      - Repete uma mensagem',
                      '  NEOFETCH  - Informações estilizadas do sistema',
                      '  REPO      - Link do repositório',
                      '  SKILLS    - Habilidades do desenvolvedor',
                      '  COLOR     - Altera a cor do terminal (ex: color 0a)'
                  ];
                  break;
              case 'cls':
              case 'clear':
                  setHistory([]);
                  setInput('');
                  return;
              case 'about':
                  response = [
                      'Paulo Cardoso',
                      'Desenvolvedor Full Stack',
                      '50+ projetos criados',
                      'Especialista em React, Node.js e UI/UX.',
                      'Este portfólio é um clone do Windows XP com tema Win7.'
                  ];
                  break;
              case 'contact':
                  response = [
                      'LinkedIn: https://www.linkedin.com/in/paulo-dos-santos-1868a8192/',
                      'GitHub: https://github.com/Paulo-Santos20',
                      'Email: paulo_santos20@outlook.com.br'
                  ];
                  break;
              case 'projects':
                  response = [
                      'Projetos em destaque:',
                      '  - Controle de Ativos (Sistema financeiro)',
                      '  - Qualy Mix (Plataforma de receitas)',
                      '  - Baratinho (E-commerce)',
                      '  - Prospector (Ferramenta de dados)',
                      '  - Windows Portfolio (Este projeto)',
                      'Use o ícone "Meus Projetos" na área de trabalho para detalhes.'
                  ];
                  break;
              case 'date':
                  response = [new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })];
                  break;
              case 'time':
                  response = [new Date().toLocaleTimeString('pt-BR')];
                  break;
              case 'whoami':
                  response = ['Paulo-Santos20\\Convidado'];
                  break;
              case 'ver':
                  response = [
                      'Windows XP Paulo Edition [Versão 5.1.2600]',
                      '(C) Copyright 1985-2001 Microsoft Corp.'
                  ];
                  break;
              case 'dir':
                  response = [
                      ' Volume in drive C has no label.',
                      ' Volume Serial Number is 7A4B-2C1F',
                      '',
                      ' Directory of C:\\Users\\Paulo',
                      '',
                      '12/10/2024  14:30    <DIR>          .',
                      '12/10/2024  14:30    <DIR>          ..',
                      '12/10/2024  10:15    <DIR>          Documentos',
                      '12/10/2024  09:45    <DIR>          Downloads',
                      '12/10/2024  11:20    <DIR>          Imagens',
                      '12/10/2024  08:00    <DIR>          Músicas',
                      '12/10/2024  15:00    <DIR>          Vídeos',
                      '               0 File(s)              0 bytes',
                      '               7 Dir(s)  10.234.567.890 bytes free'
                  ];
                  break;
              case 'echo':
                  response = [args.slice(1).join(' ') || 'ECHO está ligado.'];
                  break;
              case 'neofetch':
                  response = [
                      '        .---.         Paulo@Portfolio',
                      '       /     \\        -----------------',
                      '      |  O  O |       SO: Windows XP Paulo Edition v5.1',
                      '      |   ^   |       Host: Windows Portfolio React App',
                      '      |  \\_/  |       Kernel: React 19 + Vite 7',
                      '       \\_____/        Shell: CMD.exe v5.1.2600',
                      '    ___/   \\___       Resolution: 1920x1080',
                      '   /  \\_____/  \\      DE: Windows XP Luna / Win7 Aero',
                      '  /  /       \\  \\     Terminal: xterm',
                      ' /  /         \\  \\    CPU: Intel(R) Core(TM) i7 @ 2.60GHz',
                      '|  /           \\  |   GPU: Software Renderer',
                      '| |  ()  ()  () | |   Memory: 2048MB / 4096MB'
                  ];
                  break;
              case 'repo':
                  response = [
                      'Repositório: https://github.com/Paulo-Santos20/windows-portfolio',
                      'Sugestões e issues são bem-vindos!'
                  ];
                  break;
              case 'skills':
                  response = [
                      'Habilidades:',
                      '  Frontend: React, Next.js, Tailwind CSS, TypeScript',
                      '  Backend:  Node.js, Express, PHP, PostgreSQL',
                      '  Mobile:   React Native',
                      '  Devops:   Docker, CI/CD, Vercel',
                      '  Design:   UI/UX, Figma, Photoshop'
                  ];
                  break;
              case 'color':
                  const colorMap = {
                      '0a': 'text-green-400', '0b': 'text-cyan-400', '0c': 'text-red-400',
                      '0e': 'text-yellow-300', '0f': 'text-white', '02': 'text-green-600',
                      '03': 'text-cyan-600', '04': 'text-red-600', '06': 'text-yellow-600',
                      '07': 'text-gray-300', '01': 'text-blue-600', '09': 'text-blue-400',
                  };
                  const colorClass = colorMap[args[1]] || (args[1] ? null : '');
                  if (args[1] && !colorClass) {
                      response = ['Cores disponíveis: 0a(verde), 0b(ciano), 0c(vermelho), 0e(amarelo), 0f(branco), 07(cinza), 01(azul)'];
                  } else if (colorClass) {
                      setColor(colorClass);
                      response = [];
                  } else {
                      response = ['Terminal colorido padrão.'];
                      setColor('');
                  }
                  break;
              case 'fsociety00.dat':
                  response = [
                      'Arquivo protegido.',
                      'Digite a senha:'
                  ];
                  setAwaitingPassword(true);
                  setHistory(prev => [...prev, `Paulo>${input}`, ...response]);
                  setCommandHistory(prev => [...prev.slice(-49), raw]);
                  setHistoryIndex(-1);
                  setInput('');
                  return;
              case 'exit':
                  closeWindow(windowId);
                  return;
              case '':
                  break;
              default:
                  response = [`'${cmd}' não é reconhecido como um comando interno ou externo.`];
          }

          setHistory(prev => [...prev, `Paulo>${input}`, ...response, '']);
          if (raw) setCommandHistory(prev => [...prev.slice(-49), raw]);
          setHistoryIndex(-1);
          setInput('');
      }
  };

  return (
    <div
        className={`h-full bg-black ${color || 'text-gray-300'} font-mono text-sm p-2 overflow-y-auto cursor-text select-none`}
        onClick={handleFocus}
        style={{ fontFamily: 'Consolas, "Lucida Console", monospace' }}
        ref={containerRef}
    >
        {history.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap leading-tight mb-0.5 break-all">{line}</div>
        ))}

        <div className="flex flex-wrap break-all">
            <span className="mr-2 whitespace-nowrap">{awaitingPassword ? 'Senha:' : 'Paulo>'}</span>
            <span>{awaitingPassword ? '•'.repeat(input.length) : input}</span>
            <span className="animate-pulse font-bold ml-[1px]">_</span>
        </div>

        <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoComplete="off"
            spellCheck="false"
            className="fixed top-[-1000px] left-[-1000px] opacity-0 h-0 w-0"
        />

        <div ref={bottomRef} />
    </div>
  );
};
