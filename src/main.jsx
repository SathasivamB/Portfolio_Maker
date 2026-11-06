import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './style.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled rendering error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('portfolio_studio_user');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#12151e] border border-rose-500/30 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center text-xl font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-white">Interface Recovery</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The application encountered a transient layout error. Click below to refresh your session state safely.
            </p>
            <div className="p-3 bg-black/50 border border-zinc-800 rounded-lg text-left text-[11px] font-mono text-rose-300 max-h-32 overflow-y-auto">
              {this.state.error?.message || 'Unknown render exception'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg shadow-indigo-600/30"
            >
              Reset Session & Reload Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
