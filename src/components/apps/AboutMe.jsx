import React from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Github, Linkedin, Instagram, Globe, Code, PenTool, Image as ImageIcon, Cpu, Layers, Terminal } from 'lucide-react';
import { PDFViewer } from './PDFViewer';
import { Browser } from './Browser';

// Dados Mockados para Habilidades e Softwares
const SKILLS = [
    { name: 'Desenvolvimento Web', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&q=80', icon: <Code/> },
    { name: 'UI/UX Design', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&q=80', icon: <Layers/> },
    { name: 'Edição de Imagens', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&q=80', icon: <ImageIcon/> },
];

const SOFTWARE = [
    { name: 'VS Code', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/100px-Visual_Studio_Code_1.35_icon.svg.png' },
    { name: 'Git / GitHub', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/100px-Git-logo.svg.png' },
    { name: 'WordPress', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/WordPress_blue_logo.svg/100px-WordPress_blue_logo.svg.png' },
    { name: 'Photoshop', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/100px-Adobe_Photoshop_CC_icon.svg.png' },
    { name: 'Inteligência Artificial', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&q=80' },
];

export const AboutMe = () => {
  const { openWindow } = useOSStore();

  // Ações dos Links do Menu Superior
  const handleNav = (action) => {
      if (action === 'projects') {
          openWindow('browser', 'Internet Explorer', <Globe size={16} className="text-blue-500"/>, <Browser initialUrl="https://github.com/seu-usuario?tab=repositories" />);
      } else if (action === 'cv') {
          // Base64 do PDF (mesmo usado anteriormente)
          const pdfData = 'data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmoKICA8PCAvVHlwZSAvQ2F0YWxvZwogICAgIC9QYWdlcyAyIDAgUgogID4+CmVuZG9iagoKMiAwIG9iagogIDw8IC9UeXBlIC9QYWdlcwogICAgIC9LaWRzIFszIDAgUl0KICAgICAvQ291bnQgMQogICAgIC9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCiAgPj4KZW5kb2JqCgozIDAgb2JqCiAgPDwgIC9UeXBlIC9QYWdlCiAgICAgIC9QYXJlbnQgMiAwIFIKICAgICAgL1Jlc291cmNlcwogICAgICAgPDwgL0ZvbnQKICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgPDwgL1R5cGUgL0ZvbnQKICAgICAgICAgICAgICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgICAgICAgICAgICAgL0Jhc2VGb250IC9IZWx2ZXRpY2EKICAgICAgICAgICAgID4+CiAgICAgICAgICA+PgogICAgICAgPj4KICAgICAgL0NvbnRlbnRzIDQgMCBSCiAgPj4KZW5kb2JqCgo0IDAgb2JqCiAgPDwgL0xlbmd0aCA1NQogID4+CnN0cmVhbQogIEJUKC9GMSAxMiBUZikgMTAwIDcwMCBUZCAoSGVsbG8hIEVzdGUgZSB1bSBQREYgZGUgVGVzdGUgbm8gc2V1IFBvcnRmb2xpbyBXaW5kb3dzIDcpIFRqIEVVCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxNTcgMDAwMDAgbiAKMDAwMDAwMDMwNiAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1Jvb3QgMSAwIFIKICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjQxMQolJUVPRgo=';
          openWindow('cv-viewer', 'Meu Currículo.pdf', <div className="text-red-500 font-bold">PDF</div>, <PDFViewer src={pdfData} />);
      } else if (action === 'github') {
          openWindow('browser-gh', 'GitHub', <Globe size={16} className="text-black"/>, <Browser initialUrl="https://github.com" />);
      }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* HEADER (NAVBAR) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-bold text-lg text-slate-800">Paulo Cardoso</h1>
          </div>
          
          <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <button onClick={() => handleNav('projects')} className="hover:text-blue-600 transition-colors">Meus Projetos</button>
              <button onClick={() => handleNav('cv')} className="hover:text-blue-600 transition-colors">Meu Currículo</button>
              <button onClick={() => handleNav('github')} className="hover:text-blue-600 transition-colors">GitHub</button>
          </nav>
      </header>

      {/* CORPO PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
          
          {/* SIDEBAR ESQUERDA (REDES SOCIAIS) */}
          <aside className="w-16 bg-slate-900 text-white flex flex-col items-center py-8 gap-6 flex-shrink-0">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="LinkedIn"><Linkedin size={20}/></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="GitHub"><Github size={20}/></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Instagram"><Instagram size={20}/></a>
              <div className="h-[1px] w-8 bg-white/20 my-2"></div>
              <button className="p-2 hover:bg-blue-600 rounded-full transition-colors bg-blue-600/20 text-blue-400 font-bold text-xs">CV</button>
          </aside>

          {/* CONTEÚDO ROLÁVEL */}
          <main className="flex-1 overflow-y-auto p-8">
              
              {/* Introdução */}
              <section className="mb-10">
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Olá, eu sou o Paulo.</h2>
                  <p className="text-slate-600 max-w-2xl leading-relaxed">
                      Analista de sistemas apaixonado por criar experiências digitais. 
                      Especialista em transformar ideias complexas em interfaces simples e funcionais.
                  </p>
              </section>

              {/* HABILIDADES */}
              <section className="mb-10">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <PenTool size={20} className="text-blue-600"/> Habilidades
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {SKILLS.map((skill, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center gap-4">
                              <img src={skill.img} alt={skill.name} className="w-12 h-12 rounded object-cover" />
                              <div>
                                  <h4 className="font-bold text-sm">{skill.name}</h4>
                                  <div className="text-xs text-slate-400">Expertise</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* SOFTWARES */}
              <section>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Terminal size={20} className="text-purple-600"/> Softwares & Ferramentas
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {SOFTWARE.map((soft, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                              <div className="w-12 h-12 flex items-center justify-center">
                                  <img src={soft.img} alt={soft.name} className="max-w-full max-h-full object-contain" />
                              </div>
                              <span className="text-xs font-medium text-center">{soft.name}</span>
                          </div>
                      ))}
                  </div>
              </section>

          </main>
      </div>
    </div>
  );
};