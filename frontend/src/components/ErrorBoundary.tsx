import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-full text-center shadow-sm">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-text mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">We encountered an unexpected error. Please try refreshing the page or returning home.</p>
            <div className="bg-red-50 text-red-800 text-xs p-4 rounded-md mb-6 overflow-auto text-left">
              {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              className="bg-accent text-white px-6 py-2 rounded-md hover:bg-opacity-90 font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
