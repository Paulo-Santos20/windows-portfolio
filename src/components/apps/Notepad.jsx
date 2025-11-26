import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';

export const Notepad = ({ id, content = "", fileName = "Sem título" }) => {
  const { updateFileContent } = useOSStore();
  const [text, setText] = useState(content);

  useEffect(() => {
    setText(content);
  }, [content]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    if (id) updateFileContent(id, newText);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Menu Bar XP (Bege) */}
      <div className="flex items-center gap-2 bg-[#ece9d8] border-b border-[#d4d0c8] px-1 py-0.5 select-none text-[11px]">
        {['Arquivo', 'Editar', 'Formatar', 'Exibir', 'Ajuda'].map(item => (
           <button key={item} className="px-2 py-0.5 hover:bg-[#316ac5] hover:text-white text-black cursor-default transition-none">
             {item}
           </button>
        ))}
      </div>

      {/* Área de Texto */}
      <textarea 
        className="flex-1 w-full h-full p-1 outline-none resize-none overflow-auto text-black leading-snug border-none"
        style={{ fontFamily: '"Lucida Console", monospace', fontSize: '13px' }}
        value={text}
        onChange={handleChange}
        spellCheck={false}
      />
      
      {/* Status Bar XP */}
      <div className="h-5 bg-[#ece9d8] border-t border-[#d4d0c8] flex items-center justify-end px-2 gap-4 text-[11px] text-black select-none">
          <div className="border-l border-r border-gray-400 px-2">Ln {text.split('\n').length}, Col {text.length}</div>
      </div>
    </div>
  );
};