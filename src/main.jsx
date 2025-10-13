import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LeagueProvider } from './context/LeagueContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LeagueProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LeagueProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
