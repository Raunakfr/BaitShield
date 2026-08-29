import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F1F38] text-white p-8 font-sans flex items-center justify-center">
          <div className="bg-[#162440] border border-red-500/50 p-6 rounded-xl max-w-2xl w-full shadow-2xl space-y-4">
            <h1 className="text-xl font-bold text-red-400">BaitShield Frontend Render Error</h1>
            <p className="text-sm text-gray-300">An unexpected React rendering error occurred:</p>
            <pre className="bg-black/50 border border-border p-4 rounded text-xs text-red-300 overflow-x-auto whitespace-pre-wrap font-mono">
              {this.state.error?.toString() || 'Unknown error'}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#F97316] text-white px-4 py-2 rounded font-semibold text-xs hover:bg-[#ff8533]"
            >
              Reload Dashboard
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
  </React.StrictMode>,
)
