import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './contexts/AppProvider';
import AuthProvider from './contexts/AuthProvider';
import { Routes } from './Routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export { App };
