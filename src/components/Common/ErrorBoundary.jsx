import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return {
      hasError: true,
      errorId: Math.random().toString(36).substr(2, 9)
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para monitoramento
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Aqui você pode enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Implementar integração com serviço de monitoramento
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    // Exemplo: enviar para API de logging
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // }).catch(console.error);
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      // Se um componente de fallback customizado foi fornecido
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
            onGoHome={this.handleGoHome}
          />
        );
      }

      // UI de erro padrão
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-super-dark-bg dark:to-super-dark-secondary flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-super-dark-secondary rounded-2xl shadow-xl border dark:border-super-dark-border p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-super-dark-text-primary mb-2">
                Algo deu errado
              </h2>
              
              <p className="text-gray-600 dark:text-super-dark-text-secondary">
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver o problema.
              </p>
            </div>

            {/* Error ID para suporte */}
            {this.state.errorId && (
              <div className="mb-6 p-3 bg-gray-50 dark:bg-super-dark-bg rounded-lg">
                <p className="text-xs text-gray-500 dark:text-super-dark-text-secondary">
                  ID do Erro: <code className="font-mono">{this.state.errorId}</code>
                </p>
              </div>
            )}

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-super-dark-text-secondary mb-2 flex items-center">
                  <Bug className="w-4 h-4 mr-2" />
                  Detalhes do Erro (Dev)
                </summary>
                <div className="bg-gray-50 dark:bg-super-dark-bg rounded-lg p-3 text-xs">
                  <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400 mb-2">
                    {this.state.error.message}
                  </pre>
                  {this.state.error.stack && (
                    <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 text-xs overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Ações */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-super-dark-text-primary font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Início
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-super-dark-text-primary font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Recarregar
                </button>
              </div>
            </div>

            {/* Link para suporte */}
            <div className="mt-6 pt-6 border-t dark:border-super-dark-border">
              <p className="text-xs text-gray-500 dark:text-super-dark-text-secondary">
                Se o problema persistir, entre em contato com{' '}
                <a
                  href="mailto:suporte@prospectrad ar.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  nosso suporte
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente wrapper para usar com hooks
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);

  const handleError = React.useCallback((error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

// HOC para componentes funcionais
export const withErrorBoundary = (Component, fallback) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Componente de erro simples para casos específicos
export const SimpleErrorFallback = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-super-dark-text-primary mb-2">
      Erro ao carregar
    </h3>
    <p className="text-gray-600 dark:text-super-dark-text-secondary mb-4">
      {error?.message || 'Ocorreu um erro inesperado'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Tentar Novamente
      </button>
    )}
  </div>
);

export default ErrorBoundary;
