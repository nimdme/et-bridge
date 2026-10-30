import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ETBridge caught an unhandled render error:', error, errorInfo)
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-3xl p-6 md:p-8 border border-zinc-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Something went wrong</h2>
              <p className="text-xs text-zinc-400 mt-1">
                An unexpected format error occurred while rendering your student data.
              </p>
            </div>
            {this.state.error?.message && (
              <pre className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-rose-300 font-mono text-left overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <RotateCw className="w-4 h-4" />
              <span>Reload App</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
