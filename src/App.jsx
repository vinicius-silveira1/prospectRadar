import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MockDraft from './pages/MockDraft';
import Prospects from './pages/Prospects';
import ProspectDetail from './pages/ProspectDetail';
import Compare from './pages/Compare';
import DraftHistory from './pages/DraftHistory';
import DatabaseComparison from './components/DatabaseComparison';

// Create a client
const queryClient = new QueryClient();

function App() {
  // Configuração de dados reais baseada nas variáveis de ambiente
  const useRealData = import.meta.env.VITE_USE_REAL_DATA === 'true';
  const enableDebug = import.meta.env.VITE_ENABLE_DATA_DEBUG === 'true';
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* Placeholder routes - implementaremos em breve */}
            <Route path="prospects" element={<Prospects />} />
            <Route path="prospects/:id" element={<ProspectDetail />} />
            <Route path="draft" element={<MockDraft />} />
            <Route path="database-evolution" element={<DatabaseComparison />} />
            <Route path="compare" element={<Compare />} />
            <Route path="watchlist" element={<div className="p-8 text-center text-gray-500">Página de favoritos em breve...</div>} />
            <Route path="trending" element={<div className="p-8 text-center text-gray-500">Página de tendências em breve...</div>} />
            <Route path="draft-history" element={<DraftHistory />} />
          </Route>
        </Routes>
        
        {/* Indicador de status dos dados */}
        {useRealData && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg z-50">
            🔴 DADOS AO VIVO - LDB
          </div>
        )}
        
        {/* Debug component em desenvolvimento */}
        {import.meta.env.MODE === 'development' && enableDebug && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg text-xs max-w-xs shadow-lg z-50">
            <div className="font-bold mb-1">🔍 ProspectRadar Debug</div>
            <div>Dados Reais: {useRealData ? '✅ Ativado' : '❌ Desativado'}</div>
            <div>Modo: {import.meta.env.MODE}</div>
            <div>Debug: {enableDebug ? '✅' : '❌'}</div>
          </div>
        )}
      </Router>
    </QueryClientProvider>
  );
}

export default App;
