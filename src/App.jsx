import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* Placeholder routes - we'll implement these next */}
            <Route path="prospects" element={<div className="p-8 text-center text-gray-500">Prospects page coming soon...</div>} />
            <Route path="prospects/:id" element={<div className="p-8 text-center text-gray-500">Prospect detail page coming soon...</div>} />
            <Route path="mock-draft" element={<div className="p-8 text-center text-gray-500">Mock Draft page coming soon...</div>} />
            <Route path="compare" element={<div className="p-8 text-center text-gray-500">Compare page coming soon...</div>} />
            <Route path="watchlist" element={<div className="p-8 text-center text-gray-500">Watchlist page coming soon...</div>} />
            <Route path="trending" element={<div className="p-8 text-center text-gray-500">Trending page coming soon...</div>} />
            <Route path="draft-history" element={<div className="p-8 text-center text-gray-500">Draft History page coming soon...</div>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
