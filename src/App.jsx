import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HotspotMap from './pages/HotspotMap';
import Analysis from './pages/Analysis';
import Simulation from './pages/Simulation';
import Results from './pages/Results';
import './index.css';

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className={isHome ? '' : 'app-shell'}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hotspot" element={<HotspotMap />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
