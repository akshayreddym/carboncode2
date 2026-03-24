import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { ANALYSIS_DATA } from '../data';

const PRIORITY_COLORS = { High: { badge: 'badge-red', border: 'var(--red)' }, Medium: { badge: 'badge-yellow', border: 'var(--yellow)' }, Low: { badge: 'badge-green', border: 'var(--green)' } };

function RootCauseCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const pc = PRIORITY_COLORS[item.priority];
  return (
    <div className="card animate-in" style={{ borderLeft: `3px solid ${pc.border}`, marginBottom: 12, cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <AlertTriangle size={14} color={pc.border} />
            <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className={`badge ${pc.badge}`}>{item.priority} Priority</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⟶ {item.component}</span>
            <span style={{ fontSize: 11, color: pc.border, marginLeft: 'auto', fontWeight: 700 }}>{item.impact}% impact</span>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', marginLeft: 12, flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      {expanded && (
        <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-secondary)', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {item.description}
          <div style={{ marginTop: 12, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: `${item.impact}%`, height: '100%', background: pc.border, borderRadius: 3, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Estimated contribution to total excess emissions</div>
        </div>
      )}
    </div>
  );
}

function MeasureCard({ item }) {
  const pc = PRIORITY_COLORS[item.priority];
  return (
    <div className="card animate-in" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={14} color="var(--green)" />
          <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
        </div>
        <span className={`badge ${pc.badge}`}>{item.priority}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>{item.description}</div>
      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
        <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 6, padding: '4px 10px' }}>
          📉 {item.reduction} reduction
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)' }}>
          💰 Est. {item.cost}
        </div>
      </div>
    </div>
  );
}

export default function Analysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('causes');

  return (
    <div className="main-content">
      <div className="page-header animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="page-title">🔬 Analysis & Preventive Measures</div>
            <div className="page-subtitle">Root cause breakdown and evidence-based emission reduction strategies</div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/simulation')}>
            <Sliders size={14} /> Simulate Fixes
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Root Causes', value: 4, color: 'var(--red)', icon: '⚠️' },
          { label: 'Preventive Measures', value: 6, color: 'var(--accent-blue)', icon: '🛡️' },
          { label: 'Max Reduction', value: '35%', color: 'var(--green)', icon: '📉' },
          { label: 'Priority Actions', value: 2, color: 'var(--yellow)', icon: '🎯' },
        ].map(c => (
          <div key={c.label} className="card animate-in" style={{ borderLeft: `3px solid ${c.color}`, textAlign: 'center' }}>
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.color, marginTop: 4 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-card)', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid var(--border)' }}>
        {[
          { id: 'causes', label: '⚠️ Root Causes' },
          { id: 'measures', label: '🛡️ Preventive Measures' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ border: 'none' }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'causes' && (
        <div>
          <div style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13 }}>
            Click each cause to expand details and view impact assessment.
          </div>
          {ANALYSIS_DATA.rootCauses.map(item => <RootCauseCard key={item.id} item={item} />)}
        </div>
      )}

      {activeTab === 'measures' && (
        <div>
          <div style={{ marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13 }}>
            Ranked by priority. Review each measure for expected emission reduction and estimated cost.
          </div>
          {ANALYSIS_DATA.preventiveMeasures.map(item => <MeasureCard key={item.id} item={item} />)}
        </div>
      )}

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/simulation')}>
          <Sliders size={16} /> Simulate Fixes
        </button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/hotspot')}>
          View Hotspot Map
        </button>
      </div>
    </div>
  );
}
