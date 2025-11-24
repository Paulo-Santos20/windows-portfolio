import React, { useRef, useEffect } from 'react';

export const VideoPlayer = ({ src, title }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Tenta iniciar o vídeo automaticamente ao abrir a janela
    if (videoRef.current) {
      videoRef.current.volume = 0.5;
      videoRef.current.play().catch(e => console.log("Autoplay bloqueado pelo navegador:", e));
    }
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-white font-sans select-none">
      {/* Barra Superior Estilo WMP */}
      <div className="h-8 bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] flex items-center px-4 border-b border-white/10">
         <span className="text-xs text-slate-300">{title || "Reproduzindo Vídeo"}</span>
      </div>

      {/* Área do Vídeo */}
      <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
         <video 
            ref={videoRef}
            src={src}
            controls 
            autoPlay
            className="w-full h-full object-contain max-h-full"
         >
            Seu navegador não suporta a tag de vídeo.
         </video>
      </div>

      {/* Controles (O nativo do browser 'controls' acima já resolve, mas deixamos um rodapé estético) */}
      <div className="h-12 bg-[#1a1a1a] border-t border-white/10 flex items-center justify-center text-xs text-gray-500">
          Windows Media Player
      </div>
    </div>
  );
};