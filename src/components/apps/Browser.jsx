import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCw, Home, Lock, Star, Globe, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

export const Browser = ({ initialUrl }) => {
  const HOME_PAGE = initialUrl || 'https://www.google.com/webhp?igu=1';

  const [currentUrl, setCurrentUrl] = useState(HOME_PAGE);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([HOME_PAGE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const navigateTo = (url) => {
    if (url === currentUrl) return;
    setIframeError(false);
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
      setIframeError(false);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setIframeError(false);
      setCurrentUrl(history[newIndex]);
      setIsLoading(true);
    }
  };

  const handleRefresh = () => {
    setIframeError(false);
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

  const detectIframeBlocked = () => {
    setIsLoading(false);
    try {
      if (!iframeRef.current) return;
      const doc = iframeRef.current.contentDocument;
      if (doc && doc.body) {
        const bodyText = doc.body.innerText || '';
        if (
          bodyText.includes('frame-ancestors') ||
          bodyText.includes('X-Frame-Options') ||
          bodyText.includes('Refused to display') ||
          bodyText.includes('Refused to frame') ||
          bodyText.includes('ERR_BLOCKED_BY_RESPONSE')
        ) {
          setIframeError(true);
        } else {
          setIframeError(false);
        }
      }
    } catch {
      setIframeError(false);
    }
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

        {iframeError ? (
          <div className="absolute inset-0 bg-[#ece9d8] flex flex-col items-center justify-center p-8 font-tahoma">
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <svg viewBox="0 0 80 80" className="w-full h-full">
                <circle cx="40" cy="40" r="38" fill="none" stroke="#003399" strokeWidth="3" />
                <path d="M25 25 L55 55 M55 25 L25 55" stroke="#003399" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-[#003399] text-lg font-bold mb-2" style={{ fontFamily: 'Tahoma, sans-serif' }}>
              Internet Explorer cannot display the webpage
            </h2>
            <p className="text-gray-700 text-sm mb-1 text-center max-w-md" style={{ fontFamily: 'Tahoma, sans-serif' }}>
              This site uses security restrictions (X-Frame-Options) that prevent it from being displayed in a frame.
            </p>
            <p className="text-gray-500 text-xs mb-6 text-center max-w-md" style={{ fontFamily: 'Tahoma, sans-serif' }}>
              Most sites like GitHub, Google and social networks block framing for security reasons.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.open(currentUrl, '_blank')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#87b3ff] to-[#1647b3] text-white text-sm border border-[#003399] rounded-[3px] cursor-pointer hover:brightness-110 shadow-md font-tahoma"
              >
                <ExternalLink size={14} />
                <span>Open in new tab</span>
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-b from-[#fff] to-[#ccc] text-gray-800 text-sm border border-gray-400 rounded-[3px] cursor-pointer hover:brightness-110 shadow-sm font-tahoma"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <iframe
              ref={iframeRef}
              src={currentUrl}
              title="Browser"
              className="w-full h-full border-none"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
              onLoad={() => { setTimeout(detectIframeBlocked, 1500); }}
          />
        )}

        <div className="absolute bottom-0 right-0 bg-white/90 px-2 py-0.5 text-[9px] text-slate-400 pointer-events-none rounded-tl" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            Powered by React OS
        </div>
      </div>
    </div>
  );
};
