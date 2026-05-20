import React, { useRef, useState, useEffect } from 'react';

const ToolButton = ({ active, onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`w-7 h-7 flex items-center justify-center border rounded mb-0.5 ${active ? 'bg-white border-blue-500 shadow-inner' : 'bg-[#ece9d8] border-transparent hover:border-slate-400'}`}
  >
    {children}
  </button>
);

const ColorSwatch = ({ color, active, onClick }) => (
  <div
    onClick={onClick}
    className="w-4 h-4 border border-[#808080] cursor-pointer hover:border-white hover:scale-110 transition-transform"
    style={{ backgroundColor: color, outline: active ? '2px solid #000' : 'none', outlineOffset: '1px' }}
  />
);

const ResizeDialog = ({ isOpen, onClose, onResize, currentW, currentH }) => {
  const [w, setW] = useState(currentW);
  const [h, setH] = useState(currentH);

  useEffect(() => { setW(currentW); setH(currentH); }, [currentW, currentH]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-[#ece9d8] border-2 border-[#004080] shadow-xl p-4 w-[280px] rounded" onClick={e => e.stopPropagation()}>
        <div className="text-sm font-bold text-[#004080] mb-3">Redimensionar</div>
        <div className="flex gap-4 mb-3">
          <div>
            <label className="text-[10px] text-gray-600 block">Largura (px)</label>
            <input type="number" min={1} max={4000} value={w} onChange={e => setW(Number(e.target.value))} className="w-20 border border-[#aca899] px-1 py-0.5 text-xs" />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 block">Altura (px)</label>
            <input type="number" min={1} max={4000} value={h} onChange={e => setH(Number(e.target.value))} className="w-20 border border-[#aca899] px-1 py-0.5 text-xs" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 text-xs border border-[#aca899] bg-[#f0f0f0] hover:bg-[#e0e0e0]">Cancelar</button>
          <button onClick={() => { onResize(w, h); onClose(); }} className="px-3 py-1 text-xs border border-[#004080] bg-[#004080] text-white hover:bg-[#003060]">OK</button>
        </div>
      </div>
    </div>
  );
};

export const Paint = () => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [showResize, setShowResize] = useState(false);
  const [dimensions, setDimensions] = useState({ w: 800, h: 500 });
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  const toolRef = useRef('pencil');
  const colorRef = useRef('#000000');
  const lineWidthRef = useRef(3);
  const mousePosRef = useRef({ x: -100, y: -100 });

  const widthOptions = tool === 'pencil' ? [1, 2, 3, 5] : tool === 'brush' ? [4, 8, 12, 18] : [4, 8, 16, 32];

  useEffect(() => {
    if (tool === 'pencil' && ![1, 2, 3, 5].includes(lineWidth)) setLineWidth(2);
    else if (tool === 'brush' && ![4, 8, 12, 18].includes(lineWidth)) setLineWidth(8);
    else if (tool === 'eraser' && ![4, 8, 16, 32].includes(lineWidth)) setLineWidth(8);
  }, [tool]);

  const colors = [
    '#000000', '#787878', '#790300', '#757a01', '#007902', '#007775', '#040273', '#7b0077', '#767a38', '#003432',
    '#ffffff', '#b9b9b9', '#ff0500', '#fefe03', '#03ff03', '#03ffff', '#0206ff', '#ff05ff', '#ffff7e', '#00ff80'
  ];

  const handleToolChange = (newTool) => {
    setTool(newTool);
    toolRef.current = newTool;
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    colorRef.current = newColor;
    setTool('pencil');
    toolRef.current = 'pencil';
  };

  const handleWidthChange = (newWidth) => {
    setLineWidth(newWidth);
    lineWidthRef.current = newWidth;
  };

  const initCanvas = (w, h) => {
    setDimensions({ w, h });
    const canvas = canvasRef.current;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    contextRef.current = ctx;

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.width = w;
      overlay.height = h;
    }
  };

  useEffect(() => {
    initCanvas(800, 500);
  }, []);

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

  const drawEraserPreview = (x, y) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    const size = lineWidthRef.current;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);
    ctx.setLineDash([]);
  };

  const clearEraserPreview = () => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  };

  const applySettings = () => {
    const ctx = contextRef.current;
    if (!ctx) return;
    const currentTool = toolRef.current;
    const currentWidth = lineWidthRef.current;

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = currentWidth;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
    } else if (currentTool === 'brush') {
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = currentWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.85;
    } else {
      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = currentWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1;
    }
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    applySettings();
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
    clearEraserPreview();
  };

  const draw = (e) => {
    const { x, y } = getCoordinates(e);
    mousePosRef.current = { x, y };
    setMousePos({ x, y });

    if (tool === 'eraser' && !isDrawing) {
      drawEraserPreview(x, y);
      return;
    }

    if (!isDrawing) return;
    applySettings();
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const finishDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      contextRef.current.globalAlpha = 1;
    }
    setIsDrawing(false);
    if (toolRef.current === 'eraser') {
      drawEraserPreview(mousePosRef.current.x, mousePosRef.current.y);
    }
  };

  const handleResize = (newW, newH) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = newW;
    canvas.height = newH;
    const ctx = canvas.getContext('2d', { alpha: false });
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, newW, newH);
    ctx.drawImage(tempCanvas, 0, 0, newW, newH);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    contextRef.current = ctx;
    setDimensions({ w: newW, h: newH });

    const overlay = overlayRef.current;
    if (overlay) {
      overlay.width = newW;
      overlay.height = newH;
      const octx = overlay.getContext('2d');
      octx.clearRect(0, 0, newW, newH);
    }
  };

  const getCursor = () => {
    if (tool === 'eraser') return 'none';
    if (tool === 'brush') return 'crosshair';
    return 'crosshair';
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] font-tahoma select-none overflow-hidden">
      <div className="flex gap-2 px-1 py-0.5 bg-[#ece9d8] text-[11px] border-b border-white shadow-sm mb-1 shrink-0">
        {['File', 'Edit', 'View', 'Image', 'Colors', 'Help'].map(m => (
          <span key={m} className="hover:bg-[#1660e8] hover:text-white px-1 cursor-default">{m}</span>
        ))}
        <button onClick={() => setShowResize(true)} className="ml-4 px-2 border-l border-[#aca899] hover:bg-[#1660e8] hover:text-white cursor-default">Redimensionar</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-10 bg-[#ece9d8] border-r border-[#aca899] flex flex-col items-center pt-2 gap-1 shadow-[inset_-1px_0_0_white] shrink-0">
          <ToolButton active={tool === 'pencil'} onClick={() => handleToolChange('pencil')} title="Lápis">
            <svg viewBox="0 0 16 16" width="14" height="14"><path d="M2 14l2-1 8-8-1-1-8 8-1 2zm9.5-9.5l-1-1L12 2l1 1-1.5 1.5z" fill="#222"/></svg>
          </ToolButton>
          <ToolButton active={tool === 'brush'} onClick={() => handleToolChange('brush')} title="Pincel">
            <svg viewBox="0 0 16 16" width="14" height="14"><path d="M4 14c-1 0-2-.5-2-2 0-1.5 2-3 4-3s3 1 2 2c-.5.5-2 1-3 1 0 1 .5 2-1 2zM13 2c-1 1-3 3-5 5l1 1 5-5-1-1z" fill="#222"/></svg>
          </ToolButton>
          <ToolButton active={tool === 'eraser'} onClick={() => handleToolChange('eraser')} title="Borracha">
            <svg viewBox="0 0 16 16" width="14" height="14"><rect x="2" y="3" width="12" height="12" rx="1" fill="#e04040" stroke="#a02020" strokeWidth="0.5"/><rect x="4" y="5" width="8" height="8" fill="#ffcccc" stroke="#c06060" strokeWidth="0.3"/></svg>
          </ToolButton>

          <div className="mt-3 w-8 bg-white border border-[#aca899] p-1 flex flex-col gap-1 items-center shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]">
            {widthOptions.map(size => (
              <div
                key={size}
                onClick={() => handleWidthChange(size)}
                className={`w-full h-4 flex items-center justify-center cursor-pointer ${lineWidth === size ? 'bg-blue-600' : 'hover:bg-blue-100'}`}
              >
                <div className={`rounded-full ${tool === 'eraser' ? 'border border-gray-400 bg-white' : 'bg-black'}`} style={{ width: Math.min(size * 1.2, 10), height: Math.min(size * 1.2, 10) }}></div>
              </div>
            ))}
          </div>

          <div className="mt-2 text-[8px] text-gray-400 text-center leading-tight">
            {tool === 'pencil' ? 'Lápis' : tool === 'brush' ? 'Pincel' : 'Borracha'}
          </div>
        </div>

        <div
          className="flex-1 bg-[#808080] p-3 overflow-auto flex shadow-[inset_1px_1px_2px_rgba(0,0,0,0.3)] relative"
          style={{ cursor: getCursor() }}
        >
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={() => { finishDrawing(); clearEraserPreview(); }}
              className="bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.5)] block absolute inset-0"
              style={{ width: '100%', height: '100%', touchAction: 'none' }}
            />
            <canvas
              ref={overlayRef}
              className="pointer-events-none absolute inset-0"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <ResizeDialog
            isOpen={showResize}
            onClose={() => setShowResize(false)}
            onResize={handleResize}
            currentW={dimensions.w}
            currentH={dimensions.h}
          />
        </div>
      </div>

      <div className="h-12 bg-[#ece9d8] border-t border-[#aca899] p-1 flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 border border-[#aca899] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)] bg-white p-1 relative">
          <div className="w-4 h-4 border border-black absolute top-2 left-2 z-10" style={{ backgroundColor: color }}></div>
        </div>

        <div className="flex flex-wrap w-64 gap-[1px]">
          {colors.map(c => (
            <ColorSwatch key={c} color={c} active={color === c} onClick={() => handleColorChange(c)} />
          ))}
        </div>

        <div className="flex-1 text-[10px] text-gray-500 text-right px-2 truncate">
          {dimensions.w} × {dimensions.h}px
          {tool === 'eraser' && <span className="ml-2 text-red-500 font-bold">({lineWidth}px)</span>}
        </div>
      </div>
    </div>
  );
};
