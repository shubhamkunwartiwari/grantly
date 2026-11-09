import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-bg flex items-center justify-center p-6 text-ink-primary">
          <div className="max-w-md w-full bg-surface-card border border-border-hairline rounded-[16px] p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-semantic-danger-bg text-semantic-danger flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl font-medium tracking-tight">
              Something went quietly wrong
            </h1>
            <p className="text-ink-muted text-sm leading-relaxed">
              We encountered an unexpected display issue. Your saved scholarships, tracker tasks, and profile remain securely stored in your browser.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-surface-raised rounded-[8px] text-xs font-mono text-ink-faint text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button
                variant="primary"
                onClick={this.handleReload}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Reload Page
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleReset}
                leftIcon={<Home className="w-4 h-4" />}
              >
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
