import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from './Browser';
import { Github, Globe, FolderGit2, Lock } from 'lucide-react';
import mrPlayerImg from '../../assets/projects/mr-player.png';
import controleAtivosImg from '../../assets/projects/controle-ativos.png';
import qualyMixImg from '../../assets/projects/qualy-mix.png';
import baratinhoImg from '../../assets/projects/baratinho.png';
import prospectorImg from '../../assets/projects/prospector.png';
import windowsPortfolioImg from '../../assets/projects/windows-portfolio.png';

// --- DADOS DOS PROJETOS REAIS ---
const PROJECT_LIST = [
  {
    id: 1,
    title: "Mr. Player",
    description: "Player IPTV para Windows e Android com Tauri, relay proxy, bypass DNS e split tunnel VPN. Suporte a HLS, MPV, Next Episode e PIX.",
    image: mrPlayerImg,
    tags: ["React", "TypeScript", "Tauri", "Rust", "Firebase", "HLS"],
    githubUrl: "https://github.com/Paulo-Santos20/Mr-player",
    liveUrl: "https://mr-player-five.vercel.app",
    private: false
  },
  {
    id: 2,
    title: "Controle de Ativos Hospitalares",
    description: "Sistema completo de gestão de ativos de TI para ambientes hospitalares com dashboard, inventário, movimentação e relatórios.",
    image: controleAtivosImg,
    tags: ["React", "Firebase", "Firestore", "CSS Modules"],
    githubUrl: "https://github.com/Paulo-Santos20/controle-ativos",
    liveUrl: "https://controle-ativos.vercel.app",
    private: false
  },
  {
    id: 3,
    title: "QualyMix",
    description: "Marketplace de supermercado com carrinho, CMS completo e gerador de posts Instagram com IA (Gemini + Groq).",
    image: qualyMixImg,
    tags: ["React", "Vite", "Tailwind CSS", "Gemini AI", "Groq"],
    githubUrl: "https://github.com/Paulo-Santos20/qualy-mix",
    liveUrl: "https://qualy-mix.vercel.app",
    private: false
  },
  {
    id: 4,
    title: "Baratinho",
    description: "Plataforma de comparação de preços em tempo real com web scraping, gráficos interativos e ofertas automatizadas.",
    image: baratinhoImg,
    tags: ["Next.js", "TypeScript", "Firebase", "Web Scraping", "Recharts"],
    githubUrl: "https://github.com/Paulo-Santos20/Baratinho",
    liveUrl: "https://baratinho.vercel.app",
    private: false
  },
  {
    id: 5,
    title: "Prospector",
    description: "Sistema de captação de leads com inteligência artificial usando OpenAI e Groq para qualificação automatizada.",
    image: prospectorImg,
    tags: ["React", "Node.js", "Express", "OpenAI", "Groq", "Firebase"],
    githubUrl: "https://github.com/Paulo-Santos20/Prospector",
    liveUrl: "https://prospector-dun.vercel.app",
    private: false
  },
  {
    id: 6,
    title: "Windows Portfolio",
    description: "Portfólio interativo no estilo Windows XP com área de trabalho, janelas, jogos, calculadora, paint e terminal.",
    image: windowsPortfolioImg,
    tags: ["React", "Vite", "Tailwind CSS", "Zustand", "react-rnd"],
    githubUrl: "https://github.com/Paulo-Santos20/windows-portfolio",
    liveUrl: "https://windows-portfolio-paulo.vercel.app",
    private: false
  }
];

export const Projects = () => {
  const { openWindow } = useOSStore();

  // Função para abrir o Site ao Vivo (Internet Explorer Interno)
  const handleOpenLive = (project) => {
    openWindow(
        `browser_live_${project.id}`, 
        `${project.title} - Internet Explorer`, 
        <Globe size={16} className="text-blue-500"/>, 
        <Browser initialUrl={project.liveUrl} />
    );
  };

  // ATUALIZADO: Função para abrir o GitHub (Internet Explorer Interno)
  const handleOpenGithub = (project) => {
    openWindow(
        `browser_github_${project.id}`, 
        `GitHub - ${project.title}`, 
        <Github size={16} className="text-black"/>, // Ícone do GitHub na janela
        <Browser initialUrl={project.githubUrl} />
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                  <FolderGit2 size={20} />
              </div>
              <div>
                  <h1 className="font-bold text-lg text-slate-800 leading-none">Meus Projetos</h1>
                  <span className="text-xs text-slate-500">Portfólio de Desenvolvimento</span>
              </div>
          </div>
          <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {PROJECT_LIST.length} Projetos Publicados
          </div>
      </header>

      {/* LISTA DE PROJETOS (GRID) */}
      <main className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {PROJECT_LIST.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden group">
                      
                      {/* Imagem do Projeto */}
                      <div className="h-40 w-full overflow-hidden relative bg-slate-200">
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                              <h3 className="text-white font-bold text-lg drop-shadow-md truncate">{project.title}</h3>
                          </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-4 flex-1 flex flex-col">
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                              {project.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                              {project.tags.map(tag => (
                                  <span key={tag} className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                                      {tag}
                                  </span>
                              ))}
                          </div>

                          <div className="h-[1px] bg-slate-100 w-full mb-3"></div>

                          {/* Botões de Ação */}
                          <div className="flex gap-2">
                              <button 
                                onClick={() => handleOpenLive(project)}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                              >
                                  <Globe size={14} /> Ver Online
                              </button>
                              
                              {project.private ? (
                                <div className="flex-1 flex items-center justify-center gap-2 bg-slate-400 text-white py-2 rounded-lg text-xs font-bold cursor-not-allowed shadow-sm">
                                  <Lock size={14} /> Privado
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleOpenGithub(project)}
                                  className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                                >
                                  <Github size={14} /> Código
                                </button>
                              )}
                          </div>
                      </div>
                  </div>
              ))}

          </div>
      </main>
    </div>
  );
};