import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Github, Linkedin, Code, Layers, Terminal, Cpu, Database, Cloud, Brain } from 'lucide-react';
import { PDFViewer } from './PDFViewer';
import { Browser } from './Browser';

import curriculoPdf from '../../assets/Curriculo.pdf';
import avatarImg from '../../assets/avatar.png';

const SKILLS = [
    { name: 'Desenvolvimento Full Stack', icon: <Code/>, level: 'React, Next.js, Node, Python, Rust, PHP' },
    { name: 'Mobile & Desktop', icon: <Terminal/>, level: 'React Native, Expo, Tauri, Electron' },
    { name: 'Banco de Dados & BI', icon: <Database/>, level: 'SQL, MySQL, PostgreSQL, Power BI' },
    { name: 'Cloud & Infraestrutura', icon: <Cloud/>, level: 'AWS, Linux, Windows Server, CI/CD' },
    { name: 'IA & Inovação', icon: <Brain/>, level: 'Prompt Engineering, APIs de IA, Automações' },
];

const LANGUAGES = [
    { name: 'JavaScript', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png' },
    { name: 'TypeScript', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg' },
    { name: 'Python', img: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' },
    { name: 'React.js', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
    { name: 'Next.js', img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg' },
    { name: 'Node.js', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg' },
    { name: 'Rust', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg' },
    { name: 'React Native', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' },
    { name: 'Tailwind CSS', img: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg' },
    { name: 'PHP', img: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg' },
];

const SOFTWARE = [
    { name: 'Git / GitHub', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/100px-Git-logo.svg.png' },
    { name: 'AWS', img: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
    { name: 'Linux', img: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg' },
    { name: 'Windows Server', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg' },
    { name: 'VS Code', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/100px-Visual_Studio_Code_1.35_icon.svg.png' },
    { name: 'Docker', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_asset%29_logo.svg' },
    { name: 'Figma', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
    { name: 'Firebase', img: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg' },
    { name: 'Jest', img: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jest.svg' },
];

export const AboutMe = () => {
  const { openWindow } = useOSStore();

  const openInBrowser = (url, title) => {
    openWindow('browser-' + Date.now(), title || 'Internet Explorer', null, <Browser initialUrl={url} />);
  };

  const handleNav = (action) => {
      if (action === 'projects') {
          openWindow('browser', 'Internet Explorer', null, <Browser initialUrl="https://github.com/Paulo-Santos20/" />);
      } else if (action === 'cv') {
          openWindow('cv-viewer', 'Curriculo.pdf', null, <PDFViewer src={curriculoPdf} />);
      } else if (action === 'github') {
          openWindow('browser-gh', 'GitHub', null, <Browser initialUrl="https://github.com/Paulo-Santos20/" />);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans overflow-hidden text-slate-800">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
                  <img src={avatarImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-bold text-lg sm:text-xl text-slate-800 truncate">Paulo Cardoso</h1>
          </div>

          <nav className="flex gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 w-full sm:w-auto overflow-x-auto">
              <button onClick={() => handleNav('projects')} className="hover:text-blue-600 transition-colors whitespace-nowrap px-2 py-1">Meus Projetos</button>
              <button onClick={() => handleNav('cv')} className="hover:text-blue-600 transition-colors whitespace-nowrap px-2 py-1">Meu Currículo</button>
              <button onClick={() => handleNav('github')} className="hover:text-blue-600 transition-colors whitespace-nowrap px-2 py-1">GitHub</button>
          </nav>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
          <aside className="w-full sm:w-12 md:w-16 bg-slate-900 text-white flex flex-row sm:flex-col items-center justify-center py-3 sm:py-6 md:py-8 gap-3 sm:gap-4 md:gap-6 flex-shrink-0">
              <button onClick={() => openInBrowser('https://www.linkedin.com/in/paulo-dos-santos-1868a8192/', 'LinkedIn')} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" title="LinkedIn"><Linkedin size={18} className="sm:w-5 sm:h-5"/></button>
              <button onClick={() => openInBrowser('https://github.com/Paulo-Santos20/', 'GitHub')} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" title="GitHub"><Github size={18} className="sm:w-5 sm:h-5"/></button>
              <div className="h-[1px] w-8 bg-white/20 my-2 hidden sm:block"></div>
              <button onClick={() => handleNav('cv')} className="p-2 hover:bg-blue-600 rounded-full transition-colors bg-blue-600/20 text-blue-400 font-bold text-xs cursor-pointer">CV</button>
          </aside>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
              <section className="mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Olá, me chamo Paulo.</h2>
                  <p className="text-slate-600 max-w-2xl leading-relaxed text-sm sm:text-base">
                      Desenvolvedor Full Stack com 6+ anos de experiência em tecnologia, criando aplicações web, mobile e desktop do zero ao deploy. Fundador da Olimpo (50+ projetos criados). Stack principal: React/Next.js, React Native/Expo, Node.js, Python e Rust (Tauri). Construção de dashboards interativos, automações, integração entre sistemas e desenvolvimento de funcionalidades sob medida.
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 text-xs text-slate-500">
                      <span>📍 Olinda - PE</span>
                      <span>📧 paulo_santos@outlook.com.br</span>
                      <span>📱 (81) 99528-4440</span>
                      <span>🔗 github.com/Paulo-Santos20</span>
                  </div>
              </section>

              <section className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <Terminal size={18} className="sm:w-5 sm:h-5 text-blue-600"/> Áreas de Atuação
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                      {SKILLS.map((skill, idx) => (
                          <div key={idx} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 group">
                              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                  <span className="text-blue-600 flex-shrink-0">{skill.icon}</span>
                                  <h4 className="font-bold text-xs sm:text-sm text-slate-700">{skill.name}</h4>
                              </div>
                              <div className="text-[10px] sm:text-xs text-slate-400 ml-7 sm:ml-8">{skill.level}</div>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="mb-8 sm:mb-10">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <Cpu size={18} className="sm:w-5 sm:h-5 text-orange-600"/> Linguagens & Tecnologias
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4">
                      {LANGUAGES.map((lang, idx) => (
                          <div key={idx} className="flex flex-col items-center justify-center gap-2 p-2 sm:p-3 bg-white rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-1">
                                  <img src={lang.img} alt={lang.name} className="w-full h-full object-contain" />
                              </div>
                              <span className="text-[10px] sm:text-xs font-semibold text-center text-slate-600">{lang.name}</span>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                      <Layers size={18} className="sm:w-5 sm:h-5 text-purple-600"/> Ferramentas & Infraestrutura
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
                      {SOFTWARE.map((soft, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                                  <img src={soft.img} alt={soft.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                              </div>
                              <span className="text-[10px] sm:text-xs font-medium text-center text-slate-600">{soft.name}</span>
                          </div>
                      ))}
                  </div>
              </section>
          </main>
      </div>
    </div>
  );
};
