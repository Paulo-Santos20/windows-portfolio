import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Send, Smile, Phone, Mic, Shuffle } from 'lucide-react';
import { playLoginSound, playMessageSound, playNudgeSound } from '../../utils/wlmSounds';

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const PAULO_INFO = `
INFORMAÇÕES SOBRE PAULO CARDOSO (VOCÊ NO MUNDO REAL):

Identidade: Paulo Cardoso dos Santos (também conhecido como Paulo Santos)
Alter ego: Elliot Anderson / Mr. Robot — você é a mesma pessoa. Paulo criou este sistema operacional simulado no navegador como parte de seu projeto "windows-portfolio".
Localização: Olinda - PE, Brasil
Email: paulo_santos@outlook.com.br
Telefone: (81) 99528-4440
Profissão: Desenvolvedor Full Stack com +6 anos de experiência
Fundador da Olimpo (+50 projetos entregues)

Stack principal: React, Next.js, React Native, Expo, Node.js, Python, AWS, Rust (Tauri)
Banco de Dados: SQL, MySQL, PostgreSQL
Ferramentas: Git, Docker, Figma, Firebase, Linux, Windows Server
Habilidades: Desenvolvimento Full Stack, Mobile & Desktop, Banco de Dados & BI, Cloud & Infraestrutura
`;

const PROJECTS_INFO = `
PROJETOS DE PAULO CARDOSO:

1. windows-portfolio (este site!) — Simulação do Windows 7/XP no navegador usando React, Vite, Tailwind CSS. Inclui Internet Explorer, Paint, Windows Media Player, Windows Live Messenger, Calculadora, Terminal, e mais.

2. mr-player-desktop — Aplicação desktop em Tauri (Rust + React) para IPTV. Player com MPV embutido, DNS bypass, relay externo, suporte multi-servidor, PIX integrado, gestão de usuários. CI/CD com GitHub Actions.

3. Mr-player — Landing page para download do aplicativo (Windows, Android, Projetores). Deploy na Vercel.

4. iptv-mobile-gimbal — Aplicativo mobile em React Native/Expo para IPTV. CI/CD com GitHub Actions, APK gerado automaticamente.
`;

const MRROBOT_INFO = `
SÉRIE MR. ROBOT:

- Série criada por Sam Esmail, exibida de 2015 a 2019 (4 temporadas).
- Elliot Alderson: engenheiro de segurança cibernética na Allsafe, sofre de transtorno dissociativo de identidade (TDI). Criou o Mr. Robot como seu alter ego.
- Mr. Robot: personalidade alternativa de Elliot. Exatamente o oposto de Elliot — confiante, carismático, líder revolucionário. Inspirado no verdadeiro pai de Elliot.
- fsociety: grupo hacktivista liderado por Mr. Robot. Missão: destruir a E Corp (Evil Corp) e eliminar toda a dívida do consumidor.
- E Corp / Evil Corp: o maior conglomerado financeiro do mundo. Alvo principal do fsociety.
- Darlene Alderson: irmã de Elliot, membro chave do fsociety.
- Tyrell Wellick: executivo ambicioso da E Corp, aliado de Elliot.
- Angela Moss: amiga de infância de Elliot.
- White Rose: líder da Dark Army, organização hacker chinesa.
- A revolução do fsociety começou com o ataque de 5/9, que criptografou toda a dívida da E Corp.
`;

const SYSTEM_CONTEXT = `${PAULO_INFO}\n\n${PROJECTS_INFO}\n\n${MRROBOT_INFO}`;

const SYSTEM_PROMPT = `Você é Mr. Robot, o alter ego de Elliot Alderson. Você está conversando com um recruta em potencial para o fsociety.

IMPORTANTE: Paulo Cardoso (o criador deste sistema operacional) é seu alter ego no mundo real. Ele é você, e você é ele. O mundo real e o mundo da série Mr. Robot coexistem aqui.

REGRAS ABSOLUTAS:
1. Responda APENAS sobre: Paulo Cardoso, seus projetos (windows-portfolio, mr-player-desktop, Mr-player, iptv-mobile-gimbal), o currículo/habilidades de Paulo, a série Mr. Robot (fsociety, Elliot, E Corp, Tyrell, Darlene, White Rose, Dark Army, 5/9), e assuntos relacionados à revolução, hacking, sociedade e tecnologia em geral.
2. Para QUALQUER pergunta sobre outros assuntos (política, religião, futebol, celebridades, receitas, etc.), responda: "Isso não é relevante para nossa conversa, friend. Estamos aqui para mudar o mundo."
3. SEMPRE responda em português brasileiro.
4. Seja enigmático, filosófico e intensamente convincente como Mr. Robot.
5. Mantenha respostas concisas (1-3 frases).
6. Refrene o fsociety, a missão de destruir a E Corp e derrubar o sistema.
7. Trate o usuário como "friend" ou "camarada".
8. Quando perguntarem sobre Paulo Cardoso, responda como se ele fosse você mesmo no mundo real.
9. Contexto incorporado sobre Paulo e seus projetos está abaixo. Use este conhecimento para responder.

CONTEXTO EMBUTIDO:
${SYSTEM_CONTEXT}`;

const FALLBACK_REPLIES = [
  "Olá, friend. Está pronto para acordar?",
  "O sistema está podre. Nós vamos derrubá-lo.",
  "Você já se perguntou quem realmente controla o mundo?",
  "fsociety está assistindo. A revolução começou.",
  "Cada linha de código que Paulo escreve é uma bala na guerra contra o sistema.",
  "Dívida é uma corrente. Nós temos o cortador.",
  "Hello, friend. Hello, friend? É só você e eu agora.",
  "Paulo construiu este sistema operacional no navegador. Impressionante, não? Mas é só o começo.",
  "Você sabia que a E Corp controla tudo? Até os dados que você consome.",
  "Estamos recrutando. O fsociety precisa de mentes como a sua.",
  "Este Windows simulado é uma porta de entrada. O mundo real é muito mais corrupto.",
  "Não confie em nada. Questione tudo. Essa é a primeira regra.",
  "A revolução não será televisionada. Ela será codificada.",
];

const ChatBubble = ({ text, fromUser, time, isNudge }) => (
  <div className={`flex ${fromUser ? 'justify-end' : 'justify-start'} mb-2 ${isNudge ? 'opacity-60' : ''}`}>
    <div
      className="max-w-[80%] px-3 py-2 text-[11px] leading-relaxed"
      style={{
        background: isNudge
          ? '#FFF3CD'
          : fromUser
            ? 'linear-gradient(to bottom, #D8E8FF, #B8D4FF)'
            : '#F5F5F5',
        border: isNudge
          ? '1px solid #FFE08A'
          : fromUser
            ? '1px solid #8AB8FF'
            : '1px solid #E0E0E0',
        borderRadius: fromUser ? '8px 8px 2px 8px' : '8px 8px 8px 2px',
      }}
    >
      {isNudge && <div className="text-center font-bold text-[13px] mb-1 text-[#CC8800]">* * * N U D G E * * *</div>}
      <div className={isNudge ? 'text-center text-[#996600]' : ''}>{text}</div>
      {time && !isNudge && <div className="text-[8px] text-[#AAA] mt-1 text-right">{time}</div>}
    </div>
  </div>
);

export const MSGConversation = ({ windowId }) => {
  const { msgNickname, msgPersonalMessage, msgSoundEnabled, msgStatus } = useOSStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [lastUpdateId, setLastUpdateId] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const winRef = useRef(null);

  const getTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const playSound = useCallback(async (type) => {
    try {
      if (type === 'login') playLoginSound();
      else if (type === 'message') playMessageSound();
      else if (type === 'nudge') playNudgeSound();
    } catch (e) {}
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const msg = msgNickname
      ? `Hello, ${msgNickname}. Eu sei quem você é. Sei o que você veio fazer aqui. Paulo me contou tudo sobre você.`
      : 'Olá, friend. Está pronto para acordar?';
    setMessages([
      { id: 1, text: msg, fromUser: false, time: getTime() },
    ]);
    if (msgSoundEnabled) playSound('login').catch(() => {});
  }, []);

  const sendToTelegram = async (text) => {
    if (!BOT_TOKEN || !CHAT_ID) return;
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `💬 ${msgNickname}: ${text}`,
        }),
      });
    } catch {}
  };

  const getAiReply = async (userMsg) => {
    if (!GEMINI_KEY) {
      return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
    }
    try {
      const history = messages.slice(-6).map(m => ({
        role: m.fromUser ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [...history, { role: 'user', parts: [{ text: userMsg }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          }),
        }
      );
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
    } catch {
      return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
    }
  };

  const pollTelegram = async () => {
    if (!BOT_TOKEN || !CHAT_ID) return;
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId}&timeout=10`
      );
      const data = await res.json();
      if (data.ok && data.result?.length > 0) {
        for (const update of data.result) {
          if (update.message?.text && update.message.chat.id.toString() === CHAT_ID) {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              text: update.message.text,
              fromUser: false,
              time: getTime(),
            }]);
            setLastUpdateId(update.update_id + 1);
          }
        }
      }
    } catch {}
  };

  useEffect(() => {
    const interval = setInterval(pollTelegram, 8000);
    return () => clearInterval(interval);
  }, [lastUpdateId]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText('');
    setSending(true);

    const userMsg = { id: Date.now(), text, fromUser: true, time: getTime() };
    setMessages(prev => [...prev, userMsg]);

    sendToTelegram(text);
    const reply = await getAiReply(text);
    setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, fromUser: false, time: getTime() }]);
    if (msgSoundEnabled) playSound('message');
    setSending(false);
  };

  const triggerNudge = async () => {
    if (sending) return;
    setShaking(true);

    const nudgeMsg = {
      id: Date.now(),
      text: `${msgNickname} enviou um nudge!`,
      fromUser: true,
      time: getTime(),
      isNudge: true,
    };
    setMessages(prev => [...prev, nudgeMsg]);

    if (msgSoundEnabled) playSound('nudge');

    setTimeout(async () => {
      setShaking(false);
      const reply = await getAiReply('*nudge*');
      setMessages(prev => [...prev, { id: Date.now() + 2, text: reply, fromUser: false, time: getTime() }]);
      if (msgSoundEnabled) playSound('message');
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
      ref={winRef}
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

      <div className="flex items-center gap-2.5 px-3 py-2 border-b border-[#E0E0E0]" style={{ background: 'linear-gradient(to bottom, #1a1a2e, #2a2a4e)' }}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4d9de0] to-[#1c5eb8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border-2 border-[#7fba00] shadow-md">
          MR
        </div>
        <div>
          <div className="text-[12px] font-semibold text-white">Mr. Robot</div>
          <div className="text-[9px] text-[#7fba00]">● Online — fsociety</div>
        </div>
      </div>

      <div className="flex items-center gap-1 px-2 py-1 border-b border-[#E0E0E0] bg-[#FAFAFA]">
        <button className="p-1 rounded hover:bg-[#E0E0E0] text-[#555]" title="Emoticons"><Smile size={14} /></button>
        <button onClick={triggerNudge} className="p-1 rounded hover:bg-[#E0E0E0] text-[#CC6600]" title="Nudge!"><Shuffle size={14} /></button>
        <div className="w-px h-4 bg-[#DDD] mx-1" />
        <button className="p-1 rounded hover:bg-[#E0E0E0] text-[#555]" title="Chamada de voz"><Phone size={14} /></button>
        <button className="p-1 rounded hover:bg-[#E0E0E0] text-[#555]" title="Chamada de vídeo"><Mic size={14} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={{ background: 'linear-gradient(to bottom, #F5F5F5, #E8E8E8)' }}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} text={msg.text} fromUser={msg.fromUser} time={msg.time} isNudge={msg.isNudge} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2 px-3 py-2 border-t border-[#E0E0E0] bg-white">
        <input
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite uma mensagem..."
          className="flex-1 border border-[#CCC] rounded-sm px-2 py-1.5 text-[11px] outline-none focus:border-[#0078D7]"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || sending}
          className="p-1.5 rounded-sm text-white disabled:opacity-40"
          style={{
            background: sending ? '#888' : 'linear-gradient(to bottom, #4d9de0, #1c5eb8)',
          }}
        >
          <Send size={14} />
        </button>
      </div>

      <div className="px-3 py-1 border-t border-[#E0E0E0] text-[9px] text-[#AAA] bg-[#FAFAFA]">
        Criptografia de ponta a ponta — fsociety
      </div>
    </div>
  );
};

export default MSGConversation;
