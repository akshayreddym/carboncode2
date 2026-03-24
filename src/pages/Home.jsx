import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, Wind, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <div className="home-bg-grid" />
      <div className="home-bg-glow" />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="home-badge animate-in">
          <Activity size={12} /> Carbon Intelligence Platform
        </div>

        <h1 className="home-title animate-in animate-delay-1">
          Carbon<span>Code</span>
        </h1>

        <p className="home-subtitle animate-in animate-delay-2">
          Smart emission monitoring and optimization for coal-based thermal power plants.
          Real-time insights. Actionable intelligence. Measurable results.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }} className="animate-in animate-delay-3">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            Enter Dashboard <ArrowRight size={16} />
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/hotspot')}>
            View Hotspot Map
          </button>
        </div>

        <div className="home-stats animate-in animate-delay-4">
          <div className="home-stat">
            <div className="home-stat-val">4,820</div>
            <div className="home-stat-label">Tons CO₂ Today</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-val">1,843</div>
            <div className="home-stat-label">MW Operating</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-val">74.2%</div>
            <div className="home-stat-label">Plant Efficiency</div>
          </div>
          <div className="home-stat">
            <div className="home-stat-val" style={{ color: 'var(--red)' }}>HIGH</div>
            <div className="home-stat-label">Risk Level</div>
          </div>
        </div>

        <div className="home-features animate-in animate-delay-4">
          <div className="home-feature">
            <div className="home-feature-icon">📊</div>
            <div className="home-feature-label">Live Monitoring</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">🗺️</div>
            <div className="home-feature-label">Hotspot Detection</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">🔬</div>
            <div className="home-feature-label">Root Cause Analysis</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">⚙️</div>
            <div className="home-feature-label">Smart Simulation</div>
          </div>
          <div className="home-feature">
            <div className="home-feature-icon">🏆</div>
            <div className="home-feature-label">Results & Credits</div>
          </div>
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: <Zap size={14} />, text: 'Ramagundam STPS • 2600 MW' },
            { icon: <Shield size={14} />, text: 'MoEFCC Compliant' },
            { icon: <Wind size={14} />, text: 'CEMS Integrated' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
