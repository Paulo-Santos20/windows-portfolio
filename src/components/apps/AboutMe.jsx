import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Github, Linkedin, Code, Layers, Terminal, Cpu, Database, Cloud } from 'lucide-react';
import { PDFViewer } from './PDFViewer';
import { Browser } from './Browser';

import curriculoPdf from '../../assets/Curriculo.pdf';

const SKILLS = [
    { name: 'Desenvolvimento Full Stack', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&q=80', icon: <Code/>, level: 'React, Next.js, Node, Python, Rust' },
    { name: 'Mobile & Desktop', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&q=80', icon: <Terminal/>, level: 'React Native, Expo, Tauri' },
    { name: 'Banco de Dados & BI', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&q=80', icon: <Database/>, level: 'SQL, MySQL, PostgreSQL, Power BI' },
    { name: 'Cloud & Infraestrutura', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&q=80', icon: <Cloud/>, level: 'AWS, Linux, Windows Server, Redes' },
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
    { name: 'SQL', img: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png' },
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
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                  <img src="https://media.licdn.com/dms/image/v2/D4D03AQFEu8bIGJ4L2w/profile-displayphoto-shrink_200_200/B4DZXQBX8cGkAc-/0/1742951776685?e=1776297600&v=beta&t=wWWPZjh9EgeWmWL99fFgi8wK65eaFt1_2S8tRNkUDF0" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-bold text-lg text-slate-800">Paulo Cardoso</h1>
          </div>

          <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <button onClick={() => handleNav('projects')} className="hover:text-blue-600 transition-colors">Meus Projetos</button>
              <button onClick={() => handleNav('cv')} className="hover:text-blue-600 transition-colors">Meu Currículo</button>
              <button onClick={() => handleNav('github')} className="hover:text-blue-600 transition-colors">GitHub</button>
          </nav>
      </header>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          <aside className="w-full md:w-16 bg-slate-900 text-white flex flex-row md:flex-col items-center justify-center py-4 md:py-8 gap-4 md:gap-6 flex-shrink-0">
              <button onClick={() => openInBrowser('https://www.linkedin.com/in/paulo-dos-santos-1868a8192/', 'LinkedIn')} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" title="LinkedIn"><Linkedin size={20}/></button>
              <button onClick={() => openInBrowser('https://github.com/Paulo-Santos20/', 'GitHub')} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer" title="GitHub"><Github size={20}/></button>
              <div className="h-[1px] w-8 bg-white/20 my-2 hidden md:block"></div>
              <button onClick={() => handleNav('cv')} className="p-2 hover:bg-blue-600 rounded-full transition-colors bg-blue-600/20 text-blue-400 font-bold text-xs cursor-pointer">CV</button>
          </aside>

          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <section className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Olá, me chamo Paulo.</h2>
                  <p className="text-slate-600 max-w-2xl leading-relaxed text-sm sm:text-base">
                      Desenvolvedor Full Stack com +6 anos de experiência em tecnologia, criando aplicações web, mobile e desktop do zero ao deploy. Fundador da Olimpo (+50 projetos entregues). Stack principal: React/Next.js, React Native/Expo, Node.js, Python, AWS e Rust (Tauri).
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                      <span>📍 Olinda - PE</span>
                      <span>📧 paulo_santos@outlook.com.br</span>
                      <span>📱 (81) 99528-4440</span>
                  </div>
              </section>

              <section className="mb-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Terminal size={20} className="text-blue-600"/> Áreas de Atuação
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {SKILLS.map((skill, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-4 group">
                              <img src={skill.img} alt={skill.name} className="w-12 h-12 rounded-md object-cover opacity-90 group-hover:opacity-100" />
                              <div>
                                  <h4 className="font-bold text-sm text-slate-700">{skill.name}</h4>
                                  <div className="text-xs text-slate-400">{skill.level}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="mb-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Cpu size={20} className="text-orange-600"/> Linguagens & Tecnologias
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
                      {LANGUAGES.map((lang, idx) => (
                          <div key={idx} className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                              <div className="w-10 h-10 flex items-center justify-center p-1">
                                  <img src={lang.img} alt={lang.name} className="w-full h-full object-contain" />
                              </div>
                              <span className="text-xs font-semibold text-center text-slate-600">{lang.name}</span>
                          </div>
                      ))}
                  </div>
              </section>

              <section className="mb-4">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Layers size={20} className="text-purple-600"/> Ferramentas & Infraestrutura
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {SOFTWARE.map((soft, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                              <div className="w-12 h-12 flex items-center justify-center">
                                  <img src={soft.img} alt={soft.name} className="max-w-full max-h-full object-contain drop-shadow-sm" />
                              </div>
                              <span className="text-xs font-medium text-center text-slate-600">{soft.name}</span>
                          </div>
                      ))}
                  </div>
              </section>
          </main>
      </div>
    </div>
  );
};
