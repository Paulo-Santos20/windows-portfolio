import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, RefreshCw, Lock } from 'lucide-react';

export const Browser = () => {
  const [url, setUrl] = useState('https://google.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowResults(true);
    setUrl(`https://google.com/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Browser Toolbar */}
      <div className="bg-slate-200 p-2 flex items-center gap-2 border-b border-slate-300">
        <div className="flex gap-2 text-slate-500">
          <ArrowLeft size={18} className="cursor-pointer hover:text-slate-700" />
          <ArrowRight size={18} className="cursor-pointer hover:text-slate-700" />
          <RefreshCw size={18} className="cursor-pointer hover:text-slate-700" />
        </div>
        <div className="flex-1 bg-white rounded-full border border-slate-300 px-3 py-1 flex items-center gap-2 text-sm">
          <Lock size={12} className="text-green-600" />
          <input 
            value={url} 
            readOnly 
            className="flex-1 outline-none text-slate-600"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {!showResults ? (
          // Fake Google Home
          <div className="flex flex-col items-center justify-center h-full gap-6">
             <h1 className="text-6xl font-bold text-slate-700 tracking-tighter">
               <span className="text-blue-500">G</span>
               <span className="text-red-500">o</span>
               <span className="text-yellow-500">o</span>
               <span className="text-blue-500">g</span>
               <span className="text-green-500">l</span>
               <span className="text-red-500">e</span>
             </h1>
             <form onSubmit={handleSearch} className="w-full max-w-md">
               <div className="relative">
                 <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                 <input 
                    type="text"
                    className="w-full py-2 pl-10 pr-4 rounded-full border border-slate-300 shadow-sm focus:shadow-md outline-none transition-shadow"
                    placeholder="Pesquise sobre o desenvolvedor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
               <div className="flex gap-4 justify-center mt-6">
                 <button type="submit" className="bg-slate-100 px-4 py-2 rounded text-sm text-slate-600 hover:border-slate-300 border border-transparent">Pesquisa Google</button>
                 <button type="button" className="bg-slate-100 px-4 py-2 rounded text-sm text-slate-600 hover:border-slate-300 border border-transparent">Estou com sorte</button>
               </div>
             </form>
          </div>
        ) : (
          // Fake Results
          <div className="p-8 max-w-4xl mx-auto">
             <p className="text-sm text-slate-500 mb-4">Cerca de 1.000.000 resultados (0,42 segundos)</p>
             
             {/* Result 1 - LinkedIn */}
             <div className="mb-8">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span className="bg-slate-200 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">in</span>
                  <span className="text-slate-700">linkedin.com › in › seu-perfil</span>
                </div>
                <h3 className="text-xl text-blue-800 hover:underline cursor-pointer font-medium">
                  Analista de Sistemas Pleno | Especialista React & Python
                </h3>
                <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                  Desenvolvedor Full Stack focado em React, performance e escalabilidade. Experiência em automação Python, SQL e gestão hospitalar (MV).
                </p>
             </div>

             {/* Result 2 - GitHub */}
             <div className="mb-8">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <span className="bg-slate-200 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">gh</span>
                  <span className="text-slate-700">github.com › seu-usuario</span>
                </div>
                <h3 className="text-xl text-blue-800 hover:underline cursor-pointer font-medium">
                  Projetos Open Source - Estampa Fina & Ferramentas Hospitalares
                </h3>
                <p className="text-slate-600 mt-1 text-sm leading-relaxed">
                  Repositório de códigos de alta qualidade. Destaque para automações SQL e sistemas de gestão de estoque com React e Cloudflare.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};