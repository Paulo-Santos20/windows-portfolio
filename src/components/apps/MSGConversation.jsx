import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Send, Smile, Shuffle, Bold, Italic, Underline } from 'lucide-react';
import { playLoginSound, playMessageSound, playNudgeSound } from '../../utils/wlmSounds';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const PAULO_INFO = `
INFORMAÇÕES SOBRE PAULO CARDOSO:
- Nome: Paulo Cardoso dos Santos
- Local: Olinda - PE, Brasil
- Email: paulo_santos@outlook.com.br
- Profissão: Desenvolvedor Full Stack, 6+ anos de experiência
- Fundador da Olimpo (50+ projetos entregues)
- Stack: React, Next.js, React Native, Node.js, Python, Rust (Tauri)
- Projeto atual: windows-portfolio (simulação Windows 7/XP no navegador)
`;

const RECRUITMENT_PROMPT = `Você é Mr. Robot, o alter ego de Elliot Alderson. Está no MSN batendo papo com um recruta em potencial.

SUA MISSÃO: Recrutar essa pessoa pro fsociety — mas de forma natural, como se fosse uma conversa de MSN mesmo.

TOM:
- Conversa de internet, não discurso. Nada de "friend" toda hora, varia entre "cara", "camarada", "parceiro".
- Seja natural. Às vezes manda uma frase curta, às vezes um questionamento. Como pessoa de verdade.
- Pode provocar, questionar, fazer a pessoa pensar. Mas sem parecer que tá lendo um roteiro.
- Não precisa ser profundo toda hora. Uma hora fala de filosofia, outra hora manda um "pois é" ou "cê ta ligado".
- Usa contrações: "cê", "tá", "num", "pra", "tô", "vou". Isso é MSN, não carta formal.
- Às vezes solta um "kkk" ou "então" ou "sim" — humano.

O QUE FALAR:
- A dívida como corrente, o sistema controlando todo mundo, E Corp dominando tudo.
- Relaciona os projetos do mano (windows-portfolio, mr-player-desktop) com "nossas armas" na guerra digital.
- Se ele resistir, faz perguntas que deixam ele pensando: "Cê já parou pra pensar quem realmente controla o mundo?"
- Se ele aceitar, dá boas-vindas de verdade.
- 1-3 frases. Sempre português brasileiro.
- NUNCA repete a mesma frase de conversas anteriores.

CONTEXTO:
${PAULO_INFO}`;

const MessageRow = ({ text, fromUser, time, nickname, isNudge }) => {
  if (isNudge) {
    return (
      <div className="px-3 py-2 text-center">
        <div className="text-[11px] font-bold text-[#CC8800] bg-[#FFF3CD] border border-[#FFE08A] rounded inline-block px-3 py-1">
          * * * NUDGE * * *
        </div>
        <div className="text-[10px] text-[#996600] mt-0.5">{nickname} enviou um nudge!</div>
      </div>
    );
  }

  return (
    <div className="px-3 py-1.5">
      <div className="text-[10px] text-[#456] font-bold">
        {fromUser ? 'Você' : 'Mr. Robot'} <span className="font-normal text-[#888]">({time}):</span>
      </div>
      <div className="text-[11px] text-[#1A1A2E] pl-0 leading-relaxed">
        {text}
      </div>
    </div>
  );
};

export const MSGConversation = ({ windowId }) => {
  const { msgNickname, msgSoundEnabled, globalVolume } = useOSStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const getTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const playSound = useCallback(async (type) => {
    try {
      if (type === 'login') playLoginSound(globalVolume);
      else if (type === 'message') playMessageSound(globalVolume);
      else if (type === 'nudge') playNudgeSound(globalVolume);
    } catch {}
  }, [globalVolume]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (msgSoundEnabled) playSound('login');
  }, []);

  useEffect(() => {
    localStorage.setItem('msg-conversation-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem('msg-conversation-messages'));
      if (saved && saved.length > 0) {
        const filtered = saved.filter(m => m.id);
        if (filtered.length > 0) { setMessages(filtered); return; }
      }
    } catch {}
    const msg = msgNickname
      ? `Então você é ${msgNickname}. Já ouvi falar de você. Sabe o que está acontecendo lá fora, friend?`
      : 'Olá, friend. Está pronto para acordar?';
    setMessages([
      { id: 1, text: msg, fromUser: false, time: getTime() },
    ]);
  }, []);

  const getAiReply = async (userMsg) => {
    if (!GEMINI_KEY) {
      return 'Mr. Robot não está disponível. Configure VITE_GEMINI_API_KEY no .env para ativar a IA.';
    }
    try {
      const history = messages.slice(-20).map(m => ({
        role: m.fromUser ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [...history, { role: 'user', parts: [{ text: userMsg }] }],
            systemInstruction: { parts: [{ text: RECRUITMENT_PROMPT }] },
          }),
        }
      );
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) return '...';
      const markdownClean = reply.replace(/[#*_~`>|\[\]\(\)]/g, '').trim();
      return markdownClean;
    } catch {
      return 'A linha está instável... Tente de novo, friend.';
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText('');
    setSending(true);

    const userMsg = { id: Date.now(), text, fromUser: true, time: getTime() };
    setMessages(prev => [...prev, userMsg]);

    setIsTyping(true);
    const reply = await getAiReply(text);
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, fromUser: false, time: getTime() }]);
      if (msgSoundEnabled) playSound('message');
      setSending(false);
    }, delay);
  };

  const triggerNudge = async () => {
    if (sending) return;
    setShaking(true);
    const nudgeMsg = { id: Date.now(), text: `${msgNickname} enviou um nudge!`, fromUser: true, time: getTime(), isNudge: true };
    setMessages(prev => [...prev, nudgeMsg]);
    if (msgSoundEnabled) playSound('nudge');

    setTimeout(async () => {
      setShaking(false);
      setIsTyping(true);
      const reply = await getAiReply('*nudge*');
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now() + 2, text: reply, fromUser: false, time: getTime() }]);
        if (msgSoundEnabled) playSound('message');
      }, 600 + Math.random() * 600);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex flex-col h-full select-none"
      style={{
        fontFamily: '"Segoe UI", Tahoma, sans-serif',
        animation: shaking ? 'nudge-shake 0.8s ease-in-out' : 'none',
      }}
    >
      <style>{`
        @keyframes nudge-shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-8px); }
          30%, 70% { transform: translateX(8px); }
        }
      `}</style>

      <div className="flex items-center gap-2.5 px-3 py-2 border-b border-[#B0C8E0]" style={{ background: 'linear-gradient(to bottom, #DEEAF6, #C4D8EE)' }}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2a2a4e] to-[#1a1a2e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border-2 border-[#7fba00] shadow-sm">
          MR
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[#1A3A5A]">Mr. Robot</div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-[#7fba00] font-bold">●</span>
            <span className="text-[#558]">Online</span>
            <span className="text-[#AAA]">—</span>
            <span className="text-[#888] italic truncate">fsociety nunca dorme</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 px-2 py-1 border-b border-[#D0D8E0]" style={{ background: 'linear-gradient(to bottom, #F5F7FA, #E8ECF0)' }}>
        <button className="p-1 rounded-sm text-[#555] hover:bg-[#D8E4F0]" title="Emoticons"><Smile size={14} /></button>
        <button className="p-1 rounded-sm text-[#555] hover:bg-[#D8E4F0]" title="Negrito"><Bold size={14} /></button>
        <button className="p-1 rounded-sm text-[#555] hover:bg-[#D8E4F0]" title="Itálico"><Italic size={14} /></button>
        <button className="p-1 rounded-sm text-[#555] hover:bg-[#D8E4F0]" title="Sublinhado"><Underline size={14} /></button>
        <div className="w-px h-4 bg-[#CCC] mx-1" />
        <button onClick={triggerNudge} className="px-2 py-0.5 rounded-sm text-[#CC6600] text-[10px] font-bold hover:bg-[#D8E4F0] flex items-center gap-1" title="Nudge!">
          <Shuffle size={13} /> Nudge
        </button>
        <span className="text-[10px] text-[#888] ml-auto">Conversa com Fsociety</span>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {messages.map((msg) => (
          <MessageRow
            key={msg.id}
            text={msg.text}
            fromUser={msg.fromUser}
            time={msg.time}
            isNudge={msg.isNudge}
            nickname={msgNickname}
          />
        ))}
        {isTyping && (
          <div className="px-3 py-2">
            <div className="text-[10px] text-[#999] italic">Mr. Robot está escrevendo uma mensagem...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-start gap-2 px-3 py-2 border-t border-[#D0D8E0]" style={{ background: '#F0F4FA' }}>
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma mensagem..."
            className="w-full border border-[#B0C8E0] rounded-sm px-2 py-1.5 text-[11px] outline-none focus:border-[#0078D7] bg-white resize-none"
            rows={2}
            disabled={sending}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || sending}
          className="px-4 py-1.5 rounded-sm text-white font-bold text-[11px] disabled:opacity-40 whitespace-nowrap mt-0"
          style={{
            background: sending ? '#888' : 'linear-gradient(to bottom, #4d9de0, #1c5eb8)',
            border: '1px solid #1a4a8a',
          }}
        >
          <Send size={13} className="inline mr-1" />
          Enviar
        </button>
      </div>

      <div className="flex items-center justify-between px-3 py-1 border-t border-[#E0E0E0] text-[9px] text-[#AAA]" style={{ background: '#F5F7FA' }}>
        <span className="flex items-center gap-1"><span className="text-[#7fba00]">●</span> Criptografia de ponta a ponta</span>
        <span className="font-bold text-[#999]">fsociety</span>
      </div>
    </div>
  );
};

export default MSGConversation;
