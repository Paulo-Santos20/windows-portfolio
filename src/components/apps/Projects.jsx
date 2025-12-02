import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Browser } from './Browser';
import { Github, Globe, FolderGit2 } from 'lucide-react';

// --- DADOS DOS PROJETOS ---
const PROJECT_LIST = [
  {
    id: 1,
    title: "E-commerce Full Stack",
    description: "Plataforma completa de vendas com carrinho, checkout e painel administrativo.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=600&q=80",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/microsoft/vscode", // URL Exemplo
    liveUrl: "https://amazon.com"
  },
  {
    id: 2,
    title: "Dashboard Financeiro",
    description: "Sistema de gestão financeira com gráficos interativos e relatórios em tempo real.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    tags: ["Vue.js", "Firebase", "ApexCharts"],
    githubUrl: "https://github.com/facebook/react", // URL Exemplo
    liveUrl: "https://google.com/finance"
  },
  {
    id: 3,
    title: "App de Tarefas (To-Do)",
    description: "Aplicação de produtividade com Drag & Drop e modo escuro.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
    tags: ["React", "Tailwind", "LocalStorage"],
    githubUrl: "https://github.com/vuejs/vue", // URL Exemplo
    liveUrl: "https://trello.com"
  },
  {
    id: 4,
    title: "Clone da Netflix",
    description: "Interface de streaming com consumo de API de filmes (TMDB).",
    image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80",
    tags: ["React", "API REST", "Sass"],
    githubUrl: "https://github.com/tailwindlabs/tailwindcss", // URL Exemplo
    liveUrl: "https://netflix.com"
  },
  {
    id: 5,
    title: "Chat em Tempo Real",
    description: "Chat estilo WhatsApp utilizando WebSockets para comunicação instantânea.",
    image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=600&q=80",
    tags: ["Socket.io", "Express", "React"],
    githubUrl: "https://github.com/socketio/socket.io", // URL Exemplo
    liveUrl: "https://whatsapp.com"
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
                              
                              {/* Botão GitHub agora abre janela interna */}
                              <button 
                                onClick={() => handleOpenGithub(project)}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
                              >
                                  <Github size={14} /> Código
                              </button>
                          </div>
                      </div>
                  </div>
              ))}

          </div>
      </main>
    </div>
  );
};