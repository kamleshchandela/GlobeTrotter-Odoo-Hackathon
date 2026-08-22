import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

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

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
          <div className="max-w-[500px] w-full bg-white rounded-[24px] p-8 shadow-[0_20px_50px_rgba(30,20,16,0.1)] border border-[#E8D5B7] text-center">
            <div className="w-16 h-16 bg-[#FFF0F0] rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-[#C0392B]" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[#1E1410] mb-3">Something went wrong</h1>
            <p className="font-jakarta text-[#6B4F3A] mb-8 leading-relaxed">
              We encountered an unexpected error. This might be due to a loading issue or a temporary glitch.
            </p>
            <div className="p-4 bg-[#FEF3E2] rounded-[12px] mb-8 text-left overflow-auto max-h-[150px]">
              <code className="text-xs font-mono-dm text-[#E8640C]">
                {this.state.error?.toString() || "Unknown Error"}
              </code>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 h-12 bg-[#E8640C] text-white rounded-[12px] font-cabinet font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#D5570A] transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 h-12 bg-white border border-[#E8D5B7] text-[#6B4F3A] rounded-[12px] font-cabinet font-semibold text-[15px] flex items-center justify-center gap-2 hover:bg-[#FEF3E2] transition-all"
              >
                <Home className="w-4 h-4" /> Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
