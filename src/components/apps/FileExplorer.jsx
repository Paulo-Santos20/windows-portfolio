import React, { useState } from 'react';
import { FileText, Image as ImageIcon, Folder, ArrowLeft, ArrowUp, Monitor } from 'lucide-react';

// --- MOCK FILE SYSTEM (Dados) ---
const fileSystem = {
  'root': { id: 'root', name: 'Meu Computador', type: 'root', children: ['docs', 'imgs', 'projects'] },
  
  // Pastas Principais
  'docs': { id: 'docs', name: 'Meus Documentos', type: 'folder', parent: 'root', children: ['cv', 'notes'] },
  'imgs': { id: 'imgs', name: 'Minhas Imagens', type: 'folder', parent: 'root', children: ['perfil', 'print1'] },
  'projects': { id: 'projects', name: 'Meus Projetos', type: 'folder', parent: 'root', children: ['estampa', 'hcp'] },
  
  // Subpastas e Arquivos
  'estampa': { id: 'estampa', name: 'Estampa Fina', type: 'folder', parent: 'projects', children: ['logo_ef', 'planilha_ef'] },
  'hcp': { id: 'hcp', name: 'HCP Gestão', type: 'folder', parent: 'projects', children: ['relatorio_sql'] },

  // Arquivos Reais (Nodes finais)
  'cv': { id: 'cv', name: 'Curriculo_FullStack.pdf', type: 'pdf', size: '2.4 MB', parent: 'docs' },
  'notes': { id: 'notes', name: 'Anotacoes_React.txt', type: 'txt', size: '12 KB', parent: 'docs' },
  'perfil': { id: 'perfil', name: 'Foto_Perfil.jpg', type: 'img', size: '4.1 MB', parent: 'imgs' },
  'print1': { id: 'print1', name: 'Screenshot_App.png', type: 'img', size: '2.2 MB', parent: 'imgs' },
  'logo_ef': { id: 'logo_ef', name: 'Logo_V1.png', type: 'img', size: '1.5 MB', parent: 'estampa' },
  'planilha_ef': { id: 'planilha_ef', name: 'Estoque.xlsx', type: 'xls', size: '120 KB', parent: 'estampa' },
  'relatorio_sql': { id: 'relatorio_sql', name: 'Query_Otimizada.sql', type: 'sql', size: '4 KB', parent: 'hcp' },
};

export const FileExplorer = ({ initialPath = 'root' }) => {
  const [currentId, setCurrentId] = useState(initialPath);
  const [history, setHistory] = useState([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentFolder = fileSystem[currentId] || fileSystem['root'];

  // Navegar para uma pasta
  const handleNavigate = (id) => {
    const item = fileSystem[id];
    if (item.type === 'folder' || item.type === 'root') {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(id);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentId(id);
    } else {
      // Lógica para abrir arquivo (simulado)
      alert(`Abrindo arquivo: ${item.name}`);
    }
  };

  // Voltar
  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentId(history[newIndex]);
    }
  };

  // Subir nível
  const handleUp = () => {
    if (currentFolder.parent) {
      handleNavigate(currentFolder.parent);
    }
  };

  // Ícone Helper
  const getIcon = (item) => {
    if (item.type === 'folder' || item.type === 'root') return <Folder className="text-yellow-500 fill-yellow-500" size={48} />;
    if (item.type === 'img') return <div className="bg-blue-100 p-2 rounded"><ImageIcon className="text-blue-500" size={32} /></div>;
    return <FileText className="text-slate-500" size={40} />;
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Barra de Endereço e Ferramentas */}
      <div className="bg-[#f0f5f9] border-b border-slate-300 p-2 flex flex-col gap-2">
         
         {/* Controles de Navegação */}
         <div className="flex items-center gap-2">
            <button onClick={handleBack} disabled={historyIndex === 0} className="disabled:opacity-30 hover:bg-blue-100 p-1 rounded-full">
                <ArrowLeft size={16} color="#444" />
            </button>
            <button onClick={handleUp} disabled={!currentFolder.parent} className="disabled:opacity-30 hover:bg-blue-100 p-1 rounded-full">
                <ArrowUp size={16} color="#444" />
            </button>
            
            {/* Barra de Caminho (Breadcrumb fake) */}
            <div className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm flex items-center gap-2">
                <Monitor size={14} className="text-slate-500" />
                <span className="text-slate-400 font-bold">{'>'}</span>
                <span className="text-slate-700">{currentFolder.name}</span>
            </div>
            
            <div className="w-[200px] bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-400 italic">
                Pesquisar...
            </div>
         </div>

         {/* Barra de Comandos */}
         <div className="flex items-center gap-4 text-sm text-slate-600 pl-2 border-t border-white pt-1">
             <button className="hover:text-blue-600">Organizar</button>
             <button className="hover:text-blue-600">Nova pasta</button>
         </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {currentFolder.children && currentFolder.children.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
                {currentFolder.children.map(childId => {
                    const child = fileSystem[childId];
                    return (
                        <div 
                            key={childId}
                            onDoubleClick={() => handleNavigate(childId)}
                            className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded cursor-pointer group transition-colors"
                        >
                            <div className="w-16 h-16 flex items-center justify-center transition-transform group-hover:scale-105">
                                {getIcon(child)}
                            </div>
                            <span className="text-xs text-center text-slate-700 group-hover:text-blue-700 w-full truncate px-1">
                                {child.name}
                            </span>
                        </div>
                    )
                })}
            </div>
        ) : (
            <div className="text-slate-400 text-center mt-10">Esta pasta está vazia.</div>
        )}
      </div>

      {/* Rodapé Status */}
      <div className="bg-[#f0f5f9] border-t border-slate-300 p-1 px-4 text-xs text-slate-500 flex gap-4">
          <span>{currentFolder.children ? currentFolder.children.length : 0} itens</span>
      </div>
    </div>
  );
};