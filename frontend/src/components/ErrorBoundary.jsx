import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="glass p-12 rounded-[40px] border-brand-amber/20 max-w-2xl mx-auto">
            <AlertCircle size={60} className="text-brand-amber mx-auto mb-6" />
            <h2 className="text-3xl font-black text-surface-text mb-4">UI Encountered an Error</h2>
            <p className="text-surface-muted mb-8 font-medium">
              We're sorry, but the dashboard failed to load. This can happen if the AI response is malformed.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 mx-auto hover:brightness-110 transition-all"
            >
              <RefreshCcw size={20} /> Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
