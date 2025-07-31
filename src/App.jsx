import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Prospects from './pages/Prospects';
import Compare from './pages/Compare';
import MockDraft from './pages/MockDraft';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Watchlist from './pages/Watchlist';
import ProspectDetail from './pages/ProspectDetail';
import Trending from './pages/Trending';
import DraftHistory from './pages/DraftHistory';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas que usam o layout principal (com Header) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="prospects/:id" element={<ProspectDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="draft" element={<MockDraft />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="trending" element={<Trending />} />
          <Route path="draft-history" element={<DraftHistory />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Rotas de autenticação (sem o layout principal) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
