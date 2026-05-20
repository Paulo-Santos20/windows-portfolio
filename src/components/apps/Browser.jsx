import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Globe } from 'lucide-react';
import { clsx } from 'clsx';

export const Browser = ({ initialUrl }) => {
  const HOME_PAGE = initialUrl || 'https://www.google.com/webhp?igu=1';

  const [currentUrl, setCurrentUrl] = useState(HOME_PAGE);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([HOME_PAGE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const navigateTo = (url) => {
    if (url === currentUrl) return;
    setIsLoading(true);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl(url);
  };

  const handleNavigate = (e) => {
    e.preventDefault();
    let target = inputValue.trim();
    if (!target) return;
    let finalUrl = '';
    if (!target.includes('.') && !target.includes('://')) {
      finalUrl = `https://www.google.com/search?igu=1&q=${encodeURIComponent(target)}`;
    } else {
      if (!target.startsWith('http')) {
        finalUrl = `https://${target}`;
      } else {
        finalUrl = target;
      }
    }
    navigateTo(finalUrl);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      iframeRef.current.src = currentSrc;
    }
  };

  const handleHome = () => {
    navigateTo(HOME_PAGE);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f0f2f5] font-sans">
      <div className="flex flex-col border-b border-slate-300 shadow-sm bg-slate-100">
        <div className="flex items-center gap-2 p-2">
          <div className="flex items-center gap-1">
            <button
              onClick={handleBack}
              disabled={historyIndex === 0}
              className="p-1.5 rounded-full hover:bg-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
              title="Voltar"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 rounded-full hover:bg-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-700"
              title="Avançar"
            >
              <ArrowRight size={16} />
            </button>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-full hover:bg-slate-300 transition-colors text-slate-700"
              title="Recarregar"
            >
              <RotateCw size={14} className={clsx(isLoading && "animate-spin")} />
            </button>
            <button
              onClick={handleHome}
              className="p-1.5 rounded-full hover:bg-slate-300 transition-colors text-slate-700"
              title="Página Inicial"
            >
              <Home size={16} />
            </button>
          </div>

          <form onSubmit={handleNavigate} className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
               {currentUrl.includes('https') ? <Lock size={12} className="text-green-600" /> : <Globe size={12} />}
            </div>
            <input
              type="text"
              className="w-full bg-white border border-slate-300 rounded-[3px] py-1 pl-8 pr-8 text-sm text-slate-700 outline-none focus:border-blue-400 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all shadow-inner h-8 font-sans"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Star size={14} className="text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </form>
        </div>
      </div>

      <div className="flex-1 relative bg-white w-full h-full overflow-hidden">
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            </div>
        )}

        <iframe
            ref={iframeRef}
            src={currentUrl}
            title="Browser"
            className="w-full h-full border-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
            onLoad={() => setIsLoading(false)}
        />

        <div className="absolute bottom-0 right-0 bg-white/90 px-2 py-0.5 text-[9px] text-slate-400 pointer-events-none rounded-tl">
            Powered by React OS
        </div>
      </div>
    </div>
  );
};
