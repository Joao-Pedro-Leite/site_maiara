import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import { AppProvider } from './context/AppContext';
import AudioPlayer from './components/AudioPlayer'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white font-sans">
        <AudioPlayer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;