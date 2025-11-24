import React from 'react';

export const PDFViewer = ({ src }) => {
  return (
    <div className="w-full h-full bg-[#525659] flex flex-col">
       <iframe
          src={src}
          className="w-full h-full border-none"
          title="Leitor de PDF"
       >
          {/* Fallback caso o navegador seja muito antigo */}
          <div className="flex flex-col items-center justify-center h-full text-white">
             <p>Seu navegador não consegue exibir este PDF.</p>
             <a href={src} download className="text-blue-300 underline mt-2 cursor-pointer">
                 Clique aqui para baixar
             </a>
          </div>
       </iframe>
    </div>
  );
};