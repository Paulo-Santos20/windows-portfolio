import React from 'react';
import { ZoomIn, ZoomOut, RotateCw, Trash2, Save, Printer, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export const ImageViewer = ({ src, fileName }) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#eef3fa]">
      {/* Toolbar Superior */}
      <div className="h-8 border-b border-[#a0a0a0] flex items-center px-2 gap-2 bg-gradient-to-b from-white to-[#f0f0f0] text-slate-600">
         <div className="flex items-center gap-1 border-r border-[#d0d0d0] pr-2">
             <button className="p-1 hover:bg-[#cce8ff] border border-transparent hover:border-[#99d1ff] rounded-[2px]">Arquivo</button>
             <button className="p-1 hover:bg-[#cce8ff] border border-transparent hover:border-[#99d1ff] rounded-[2px]">Imprimir</button>
             <button className="p-1 hover:bg-[#cce8ff] border border-transparent hover:border-[#99d1ff] rounded-[2px]">E-mail</button>
         </div>
         <span className="text-xs text-slate-500 pl-2">{fileName}</span>
      </div>

      {/* Área da Imagem */}
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
         <img 
            src={src} 
            alt={fileName} 
            className="max-w-full max-h-full object-contain shadow-lg"
         />
      </div>

      {/* Toolbar de Controle Inferior (Estilo Win7) */}
      <div className="h-12 border-t border-[#a0a0a0] bg-[#f0f0f0] flex items-center justify-center gap-4">
          <div className="flex items-center gap-1 bg-white border border-[#d0d0d0] rounded-full px-4 py-1 shadow-sm">
             <ZoomIn size={20} className="text-slate-600 cursor-pointer hover:text-blue-600"/>
             <ZoomOut size={20} className="text-slate-600 cursor-pointer hover:text-blue-600"/>
             <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
             <ChevronLeft size={24} className="text-slate-600 cursor-pointer hover:text-blue-600"/>
             
             {/* Botão Play Grande */}
             <div className="w-8 h-8 bg-blue-100 rounded-full border border-blue-300 flex items-center justify-center cursor-pointer hover:bg-blue-200 shadow-inner mx-2">
                <Play size={16} fill="#2563eb" className="text-blue-600 ml-1"/>
             </div>

             <ChevronRight size={24} className="text-slate-600 cursor-pointer hover:text-blue-600"/>
             <div className="w-[1px] h-4 bg-slate-300 mx-1"></div>
             <RotateCw size={18} className="text-slate-600 cursor-pointer hover:text-blue-600"/>
             <Trash2 size={18} className="text-slate-600 cursor-pointer hover:text-red-600"/>
          </div>
      </div>
    </div>
  );
};