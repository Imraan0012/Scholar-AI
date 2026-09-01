import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Scholar AI ErrorBoundary Catch]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Scholar AI
              </h1>
              <p className="text-sm text-slate-300">
                Something went wrong while loading this page.
              </p>
            </div>

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
