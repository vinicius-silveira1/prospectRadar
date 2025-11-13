import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LeagueProvider } from './context/LeagueContext.jsx';
import './index.css';

// Cria uma instância do QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LeagueProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LeagueProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
