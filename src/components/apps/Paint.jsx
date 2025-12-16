import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pencil } from 'lucide-react';

export const Paint = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Estados Visuais
  const [tool, setTool] = useState('pencil'); // 'pencil' | 'eraser'
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);

  // Refs de Lógica (Para performance sem delay)
  const toolRef = useRef('pencil');
  const colorRef = useRef('#000000');
  const lineWidthRef = useRef(3);

  // --- CURSORES PERSONALIZADOS (BASE64 SEGURO) ---
  
  // Borracha (Quadrado Branco com Borda Preta)
  const cursorEraser = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkZGIiBzdHJva2U9IiMwMDAiIGQ9Ik0xIDE0aDE0VjJHMVoiLz48L3N2Zz4=') 8 8, auto`;

  // Lápis (Clássico XP)
  const cursorPencil = `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAw 24 24Ij48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMCAyNHYtNGwxNC0xNCA0IDQgMTQgMTR6bTIxLTdsLTMtM2wyLjUtMi41YzEtMSAyLjUtMSAzLjUgMCAxIDEgMSAyLjUgMCAzLjV6IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=') 0 24, crosshair`;

  const colors = [
    '#000000', '#787878', '#790300', '#757a01', '#007902', '#007775', '#040273', '#7b0077', '#767a38', '#003432',
    '#ffffff', '#b9b9b9', '#ff0500', '#fefe03', '#03ff03', '#03ffff', '#0206ff', '#ff05ff', '#ffff7e', '#00ff80'
  ];

  // Ações de Troca (Sincroniza State e Ref)
  const handleToolChange = (newTool) => {
      setTool(newTool);
      toolRef.current = newTool;
  };

  const handleColorChange = (newColor) => {
      setColor(newColor);
      colorRef.current = newColor;
      // Voltar para lápis ao escolher cor é o padrão do XP
      setTool('pencil');
      toolRef.current = 'pencil';
  };

  const handleWidthChange = (newWidth) => {
      setLineWidth(newWidth);
      lineWidthRef.current = newWidth;
  };

  // Inicialização do Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1200; 
    canvas.height = 800;

    const context = canvas.getContext("2d", { alpha: false });
    
    // Fundo Branco Obrigatório
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.lineCap = "round";
    context.lineJoin = "round";
    
    contextRef.current = context;
  }, []);

  // --- LÓGICA DE DESENHO ---
  const getCoordinates = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
      };
  };

  const applySettings = () => {
      const ctx = contextRef.current;
      if (!ctx) return;

      const currentTool = toolRef.current;
      const currentWidth = lineWidthRef.current;

      if (currentTool === 'eraser') {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = currentWidth * 8; // Borracha maior
          ctx.lineCap = 'square';
      } else {
          ctx.strokeStyle = colorRef.current;
          ctx.lineWidth = currentWidth;
          ctx.lineCap = 'round';
      }
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    applySettings();
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    applySettings(); // Garante configuração a cada movimento
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsDrawing(false);
  };

  const ToolButton = ({ active, onClick, icon }) => (
      <button 
        onClick={onClick}
        className={`w-6 h-6 flex items-center justify-center border rounded-[2px] mb-1 ${active ? 'bg-white border-blue-500 shadow-inner' : 'bg-[#ece9d8] border-transparent hover:border-slate-400'}`}
      >
          {icon}
      </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-tahoma select-none overflow-hidden">
        
        {/* Menu Superior */}
        <div className="flex gap-2 px-1 py-0.5 bg-[#ece9d8] text-[11px] border-b border-white shadow-sm mb-1 shrink-0">
            {['File', 'Edit', 'View', 'Image', 'Colors', 'Help'].map(m => (
                <span key={m} className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">{m}</span>
            ))}
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Barra Lateral */}
            <div className="w-10 bg-[#ece9d8] border-r border-[#aca899] flex flex-col items-center pt-2 gap-1 shadow-[inset_-1px_0_0_white] shrink-0">
                <ToolButton active={tool === 'pencil'} onClick={() => handleToolChange('pencil')} icon={<Pencil size={14} className="text-black"/>} />
                <ToolButton active={tool === 'eraser'} onClick={() => handleToolChange('eraser')} icon={<Eraser size={14} className="text-pink-600"/>} />
                
                <div className="mt-4 w-8 bg-white border border-[#aca899] p-1 flex flex-col gap-1 items-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
                    {[2, 4, 6, 8].map(size => (
                        <div 
                            key={size}
                            onClick={() => handleWidthChange(size)}
                            className={`w-full h-3 flex items-center justify-center cursor-pointer hover:bg-blue-100 ${lineWidth === size ? 'bg-blue-600' : ''}`}
                        >
                            <div className="bg-black rounded-full" style={{ width: size, height: size }}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Área de Desenho */}
            <div 
                className="flex-1 bg-[#808080] p-3 overflow-auto flex shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] relative"
                // APLICA O CURSOR AQUI NO CONTAINER, MAIS SEGURO QUE NO CANVAS DIRETO
                style={{ cursor: tool === 'eraser' ? cursorEraser : 'crosshair' }} 
            >
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onMouseLeave={finishDrawing}
                    className="bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.5)] block"
                    style={{ width: '100%', height: '100%', touchAction: 'none' }}
                />
            </div>
        </div>

        {/* Rodapé de Cores */}
        <div className="h-12 bg-[#ece9d8] border-t border-[#aca899] p-1 flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 border border-[#aca899] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] bg-white p-1 relative">
                <div className="w-full h-full border border-black absolute top-1 left-1 z-0 bg-white"></div>
                <div className="w-4 h-4 border border-black absolute top-2 left-2 z-10" style={{ backgroundColor: color }}></div>
            </div>

            <div className="flex flex-wrap w-64 gap-[1px]">
                {colors.map(c => (
                    <div 
                        key={c} 
                        onClick={() => handleColorChange(c)}
                        className="w-4 h-4 border border-[#808080] cursor-pointer hover:border-white hover:scale-110 transition-transform"
                        style={{ backgroundColor: c }}
                    />
                ))}
            </div>
            
            <div className="flex-1 text-[10px] text-gray-500 text-right px-2 truncate">
                {tool === 'eraser' ? 'Borracha Ativa' : 'Lápis Ativo'}
            </div>
        </div>
    </div>
  );
};