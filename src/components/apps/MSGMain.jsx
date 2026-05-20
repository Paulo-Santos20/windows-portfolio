import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { MessageCircle, Search, Settings, Volume2, VolumeX, ChevronDown, LogOut } from 'lucide-react';
import { MSGConversation } from './MSGConversation';

const STATUS_ORDER = ['online', 'away', 'busy', 'offline'];
const STATUS_LABELS = { online: 'Online', away: 'Ausente', busy: 'Ocupado', offline: 'Invisível' };
const STATUS_COLORS = { online: '#7fdb7f', away: '#fdbd08', busy: '#e04040', offline: '#999' };

const ContactItem = ({ name, lastMsg, status, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#E8F0FA] active:bg-[#D0E0F0] border-b border-[#E0E0E0]"
  >
    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#2a2a4e] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border border-[#CCC]">
      F
      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: STATUS_COLORS[status] || '#7fdb7f' }} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[12px] font-semibold text-[#1A1A2E]">{name}</div>
      {lastMsg && <div className="text-[10px] text-[#888] truncate">{lastMsg}</div>}
    </div>
  </div>
);

const SettingsPopup = ({ onClose }) => {
  const { msgStatus, setMsgStatus, msgPersonalMessage, setMsgPersonalMessage, msgSoundEnabled, setMsgSoundEnabled } = useOSStore();
  const [editMsg, setEditMsg] = useState(msgPersonalMessage);

  return (
    <div className="absolute right-2 top-12 z-50 w-[220px] bg-white rounded-md shadow-xl border border-[#CCC] text-[11px]" onClick={(e) => e.stopPropagation()}>
      <div className="px-3 py-2 border-b border-[#E0E0E0] font-semibold text-[12px] text-[#1A1A2E]">Configurações</div>
      <div className="p-3 space-y-3">
        <div>
          <div className="text-[10px] text-[#888] mb-1">Status</div>
          <div className="flex gap-1">
            {STATUS_ORDER.map(s => (
              <button
                key={s}
                onClick={() => setMsgStatus(s)}
                className={`px-2 py-1 rounded text-[10px] border ${msgStatus === s ? 'border-[#0078D7] bg-[#E8F0FA] font-semibold' : 'border-[#CCC] hover:bg-[#F0F0F0]'}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#888] mb-1">Mensagem pessoal</div>
          <input
            value={editMsg}
            onChange={(e) => setEditMsg(e.target.value)}
            onBlur={() => setMsgPersonalMessage(editMsg)}
            onKeyDown={(e) => e.key === 'Enter' && (e.target.blur(), setMsgPersonalMessage(editMsg))}
            className="w-full border border-[#CCC] rounded px-2 py-1 text-[11px] outline-none focus:border-[#0078D7]"
            placeholder="Digite uma mensagem..."
            maxLength={100}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#888]">Som</span>
          <button
            onClick={() => setMsgSoundEnabled(!msgSoundEnabled)}
            className={`p-1 rounded ${msgSoundEnabled ? 'text-[#0078D7]' : 'text-[#999]'}`}
          >
            {msgSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>
      </div>
      <div className="border-t border-[#E0E0E0] p-2 flex justify-center">
        <button onClick={onClose} className="text-[10px] text-[#0078D7] hover:underline">Fechar</button>
      </div>
    </div>
  );
};

export const MSGMain = ({ windowId }) => {
  const { msgNickname, setMsgNickname, msgStatus, setMsgStatus, msgPersonalMessage, openWindow } = useOSStore();
  const [nickname, setNickname] = useState(msgNickname || '');
  const [loggedIn, setLoggedIn] = useState(!!msgNickname);
  const [showSettings, setShowSettings] = useState(false);
  const [searchText, setSearchText] = useState('');

  const statusColor = STATUS_COLORS[msgStatus];
  const statusLabel = STATUS_LABELS[msgStatus];

  const handleLogin = () => {
    if (!nickname.trim()) return;
    setMsgNickname(nickname.trim());
    setLoggedIn(true);
  };

  const openConversation = () => {
    const state = useOSStore.getState();
    if (state.windows.some(w => w.id === 'msg-conversation' && !w.isMinimized)) {
      state.focusWindow('msg-conversation');
      return;
    }
    state.openWindow('msg-conversation', 'Fsociety — Conversa', null, <MSGConversation />);
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gradient-to-b from-[#E8F0FA] to-[#D0E4F5] p-6 select-none">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0078D7] to-[#0050A0] flex items-center justify-center mb-3 shadow-md">
          <MessageCircle size={28} className="text-white" />
        </div>
        <h2 className="text-base font-bold text-[#1A3A5A] mb-0.5">Windows Live Messenger</h2>
        <p className="text-[10px] text-[#888] mb-5">Conecte-se ao fsociety</p>
        <div className="bg-white rounded-lg shadow-md p-4 w-[220px] border border-[#B0C4D8]">
          <label className="text-[10px] text-[#666] block mb-1 font-semibold">Seu nome</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Digite seu nickname..."
            className="w-full border border-[#B0C4D8] rounded-sm px-2 py-1.5 text-[12px] outline-none focus:border-[#0078D7] mb-3"
            autoFocus
          />
          <button
            onClick={handleLogin}
            disabled={!nickname.trim()}
            className="w-full py-1.5 rounded-sm text-white font-bold text-[12px] disabled:opacity-50"
            style={{
              background: 'linear-gradient(to bottom, #4d9de0, #1c5eb8)',
              border: '1px solid #1a4a8a',
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full select-none" style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif' }}>
      {/* User header */}
      <div className="p-3 border-b border-[#E0E0E0]" style={{ background: 'linear-gradient(to bottom, #E8F0FA, #D0E4F5)' }}>
        <div className="flex items-start gap-3">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#4d9de0] to-[#1c5eb8] flex items-center justify-center text-white text-lg font-bold flex-shrink-0 border-2 border-white shadow-sm">
            {nickname[0]?.toUpperCase()}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: statusColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-[#1A1A2E]">{nickname}</span>
              <div className="relative">
                <button
                  onClick={() => setMsgStatus(STATUS_ORDER[(STATUS_ORDER.indexOf(msgStatus) + 1) % 4])}
                  className="flex items-center gap-0.5 text-[10px] text-[#666] hover:text-[#0078D7]"
                >
                  <span style={{ color: statusColor }}>●</span> {statusLabel} <ChevronDown size={10} />
                </button>
              </div>
            </div>
            <div className="text-[10px] text-[#888] italic truncate">{msgPersonalMessage || 'Clique para definir sua mensagem...'}</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[#E0E0E0]">
        <div className="flex items-center bg-white border border-[#CCC] rounded-sm px-2 py-1 gap-1.5">
          <Search size={12} className="text-[#AAA]" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Procurar contatos..."
            className="text-[11px] outline-none bg-transparent w-full text-[#444]"
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="px-3 py-1.5 text-[10px] font-semibold text-[#0078D7] uppercase">Online</div>
        <ContactItem name="Fsociety" lastMsg="Online" status="online" onClick={openConversation} />
        <div className="px-3 py-1.5 text-[10px] font-semibold text-[#888] uppercase mt-2">Offline</div>
        <div className="px-3 py-3 text-[10px] text-[#AAA] text-center italic">Nenhum contato offline</div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-[#E0E0E0] text-[10px] text-[#888]" style={{ background: '#F5F5F5' }}>
        <div className="flex items-center gap-3">
          <span className="hover:text-[#0078D7] cursor-pointer">Adicionar</span>
          <span className="hover:text-[#0078D7] cursor-pointer">Perfil</span>
        </div>
        <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:text-[#0078D7] cursor-pointer">
            <Settings size={14} />
          </button>
          {showSettings && <SettingsPopup onClose={() => setShowSettings(false)} />}
        </div>
      </div>
    </div>
  );
};

export default MSGMain;
