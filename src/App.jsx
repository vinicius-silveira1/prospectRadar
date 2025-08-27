import { useState, useEffect } from 'react';
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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RadarScoreExplained from './pages/RadarScoreExplained';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import Welcome from './pages/Welcome'; // Importe a página Welcome
import OnboardingModal from './components/Onboarding/OnboardingModal'; // Importe o Onboarding

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem('hasCompletedOnboarding');
    if (hasCompleted !== 'true') {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <>
      <OnboardingModal 
        show={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
      <BrowserRouter>
        <Routes>
          {/* Rotas que usam o layout principal (com Header) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="prospects" element={<Prospects />} />
            <Route path="prospects/:id" element={<ProspectDetail />} />
            <Route path="compare" element={<Compare />} />
            <Route path="mock-draft" element={<MockDraft />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="trending" element={<Trending />} />
            <Route path="draft-history" element={<DraftHistory />} />
            <Route path="about" element={<About />} />
            <Route path="radar-score-explained" element={<RadarScoreExplained />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="success" element={<Success />} />
            <Route path="welcome" element={<Welcome />} />
          </Route>

          {/* Rotas de autenticação (sem o layout principal) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;