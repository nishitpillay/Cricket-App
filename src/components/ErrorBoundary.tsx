import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-lg mx-auto my-8 rounded-2xl bg-[#1c1b1b] border border-red-500/40 text-white shadow-2xl animate-fade-in text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 mx-auto flex items-center justify-center text-red-400">
            <span className="material-symbols-outlined text-[32px]">warning</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-white">
              {this.props.fallbackTitle || 'Component Encountered an Issue'}
            </h3>
            <p className="text-xs text-[#c4c9ac] mt-1.5 leading-relaxed">
              We recovered gracefully from an unexpected error. Your profile data and settings remain safe.
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-red-300/80 mt-2 bg-black/40 p-2 rounded-lg break-words">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Try Again</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
