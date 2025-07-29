import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import MockDraft from './pages/MockDraft';
import Prospects from './pages/Prospects';
import ProspectDetail from './pages/ProspectDetail';
import Compare from './pages/Compare';
import DraftHistory from './pages/DraftHistory';


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
            <Route path="compare" element={<Compare />} />
            <Route path="watchlist" element={<div className="p-8 text-center text-gray-500">Página de favoritos em breve...</div>} />
            <Route path="trending" element={<div className="p-8 text-center text-gray-500">Página de tendências em breve...</div>} />
            <Route path="draft-history" element={<DraftHistory />} />
          </Route>
        </Routes>
        
        {/* ...existing code... */}
      </Router>
    </QueryClientProvider>
  );
}

export default App;
