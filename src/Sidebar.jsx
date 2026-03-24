import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Map, BarChart3, Sliders, Trophy, Home, Zap
} from 'lucide-react';

const NAV = [
  { to: '/', icon: <Home size={15} />, label: 'Home' },
  { to: '/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
  { to: '/hotspot', icon: <Map size={15} />, label: 'Hotspot Map' },
  { to: '/analysis', icon: <BarChart3 size={15} />, label: 'Analysis' },
  { to: '/simulation', icon: <Sliders size={15} />, label: 'Simulation' },
  { to: '/results', icon: <Trophy size={15} />, label: 'Results' },
];

export default function Sidebar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">⚡</div>
        <div>
          <div className="sidebar-logo-text">CarbonCode</div>
          <div className="sidebar-logo-sub">Emission Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            end={item.to === '/'}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-status">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span className="status-dot" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>LIVE Monitoring</span>
        </div>
        <div className="status-label">Ramagundam STPS • Telangana</div>
        <div className="status-label" style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Zap size={10} color="var(--yellow)" />
          1843 MW generating
        </div>
      </div>
    </aside>
  );
}
