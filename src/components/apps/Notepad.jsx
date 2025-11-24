import React from 'react';

export const Notepad = ({ content = "", fileName = "Sem título" }) => {
  return (
    <div className="flex flex-col h-full w-full bg-white font-mono text-sm">
      {/* Menu Bar */}
      <div className="flex items-center gap-1 bg-white border-b border-[#f0f0f0] px-1 py-0.5 select-none">
        {['Arquivo', 'Editar', 'Formatar', 'Exibir', 'Ajuda'].map(item => (
           <button key={item} className="px-2 py-0.5 hover:bg-[#cce8ff] hover:border-[#99d1ff] border border-transparent text-xs text-slate-800 rounded-[2px] transition-colors">
             {item}
           </button>
        ))}
      </div>

      {/* Área de Texto */}
      <textarea 
        className="flex-1 w-full h-full p-1 outline-none resize-none overflow-auto font-['Consolas','Lucida_Console',monospace] text-slate-900 leading-snug"
        defaultValue={content}
        spellCheck={false}
      />
      
      {/* Status Bar (Rodapé) */}
      <div className="h-6 bg-[#f0f0f0] border-t border-[#d9d9d9] flex items-center justify-end px-2 gap-4 text-xs text-slate-500 select-none">
          <div className="border-l border-[#d9d9d9] pl-2 h-full flex items-center">Ln 1, Col 1</div>
          <div className="border-l border-[#d9d9d9] pl-2 h-full flex items-center">100%</div>
          <div className="border-l border-[#d9d9d9] pl-2 h-full flex items-center">Windows (CRLF)</div>
          <div className="border-l border-[#d9d9d9] pl-2 h-full flex items-center">UTF-8</div>
      </div>
    </div>
  );
};