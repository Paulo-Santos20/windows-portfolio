import React from 'react';

export class WindowErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#ece9d8] p-4 font-tahoma">
          <div className="w-12 h-12 mb-3 flex items-center justify-center">
            <svg viewBox="0 0 48 48" className="w-full h-full">
              <circle cx="24" cy="24" r="22" fill="none" stroke="#cc0000" strokeWidth="2.5" />
              <path d="M16 16 L32 32 M32 16 L16 32" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[#cc0000] text-xs text-center" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            This application encountered an error and needs to close.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-3 px-3 py-1 text-[11px] bg-gradient-to-b from-[#87b3ff] to-[#1647b3] text-white border border-[#003399] rounded-[3px] cursor-pointer"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
