import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, ArrowRight, Zap } from 'lucide-react';
import { COMPONENTS } from '../data';

const colorMap = {
  red: { border: 'var(--red)', glow: 'var(--red-glow)', badge: 'badge-red', bar: 'var(--red)', label: 'HIGH' },
  yellow: { border: 'var(--yellow)', glow: 'var(--yellow-glow)', badge: 'badge-yellow', bar: 'var(--yellow)', label: 'MEDIUM' },
  green: { border: 'var(--green)', glow: 'var(--green-glow)', badge: 'badge-green', bar: 'var(--green)', label: 'LOW' },
};

const COMP_ORDER = ['boiler', 'turbine', 'chimney', 'cooling'];

export default function HotspotMap() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const comp = selected ? COMPONENTS[selected] : null;
  const colors = comp ? colorMap[comp.color] : null;

  return (
    <div className="main-content">
      <div className="page-header animate-in">
        <div className="page-title">🗺️ Plant Hotspot Map</div>
        <div className="page-subtitle">Click a component to explore emission details and preventive recommendations</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20, alignItems: 'start' }}>
        {/* Component Cards */}
        <div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { color: 'var(--red)', label: 'High Emission' },
              { color: 'var(--yellow)', label: 'Medium Emission' },
              { color: 'var(--green)', label: 'Low / No Emission' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>

          {/* Plant Layout Visual */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
            position: 'relative',
          }}>
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: 2 }}>
              Ramagundam STPS — Plant Layout
            </div>

            {/* Flow diagram */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
              {COMP_ORDER.map((key, idx) => {
                const c = COMPONENTS[key];
                const cm = colorMap[c.color];
                const isSelected = selected === key;
                return (
                  <React.Fragment key={key}>
                    <div
                      className={`hotspot-card${isSelected ? ` selected-${c.color}` : ''}`}
                      style={{
                        flex: 1, minWidth: 140,
                        background: isSelected ? `rgba(${c.color === 'red' ? '239,68,68' : c.color === 'yellow' ? '234,179,8' : '34,197,94'},0.08)` : 'var(--bg-card)',
                        borderColor: isSelected ? cm.border : 'var(--border)',
                      }}
                      onClick={() => setSelected(isSelected ? null : key)}
                    >
                      <div className="hotspot-icon">{c.icon}</div>
                      <div className="hotspot-label">{c.label}</div>
                      <div className="hotspot-emission">
                        {c.co2 > 0 ? `${c.co2.toLocaleString()} t CO₂` : 'No direct emission'}
                      </div>
                      <span className={`badge ${cm.badge}`}>{cm.label}</span>
                      <div className="hotspot-bar" style={{ background: `${cm.bar}40`, marginTop: 10 }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', background: cm.bar, borderRadius: 2, transition: 'width 0.5s ease' }} />
                      </div>
                      {c.pct > 0 && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{c.pct}% of plant total</div>}
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: 8, right: 8,
                          width: 8, height: 8, borderRadius: '50%',
                          background: cm.border,
                          boxShadow: `0 0 8px ${cm.glow}`,
                          animation: 'pulse 1.5s infinite'
                        }} />
                      )}
                    </div>
                    {idx < COMP_ORDER.length - 1 && (
                      <div style={{ color: 'var(--text-muted)', fontSize: 20, flexShrink: 0 }}>→</div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Summary Table */}
          <div className="card animate-in animate-delay-2">
            <div className="section-title"><Info size={14} /> Emission Distribution</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <th style={{ textAlign: 'left', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>Component</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>CO₂ (t/day)</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>Share</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {COMP_ORDER.map(key => {
                  const c = COMPONENTS[key];
                  const cm = colorMap[c.color];
                  return (
                    <tr
                      key={key}
                      style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                      onClick={() => setSelected(selected === key ? null : key)}
                    >
                      <td style={{ padding: '10px 0' }}>
                        <span style={{ marginRight: 8 }}>{c.icon}</span>{c.label}
                      </td>
                      <td style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                        {c.co2 > 0 ? c.co2.toLocaleString() : '—'}
                      </td>
                      <td style={{ textAlign: 'right', color: cm.border, fontWeight: 700 }}>
                        {c.pct > 0 ? `${c.pct}%` : '< 1%'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge ${cm.badge}`}>{cm.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {comp && (
          <div className="side-panel animate-in">
            <div style={{ display: 'flex', align: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <div className="side-panel-title">{comp.icon} {comp.label}</div>
                <div className="side-panel-sub">Component emission detail</div>
              </div>
              <span className={`badge ${colors.badge}`} style={{ height: 'fit-content' }}>{colors.label}</span>
            </div>

            <div className="info-block">
              <div className="info-block-label">Emission Level</div>
              <div className="info-block-val" style={{ fontSize: 22, fontWeight: 800, color: colors.border }}>
                {comp.co2 > 0 ? `${comp.co2.toLocaleString()} t/day` : 'No direct emission'}
              </div>
              {comp.pct > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${comp.pct}%`, height: '100%', background: colors.border, borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{comp.pct}% of plant total emissions</div>
                </div>
              )}
            </div>

            <div className="info-block">
              <div className="info-block-label">Root Cause</div>
              <div className="info-block-val">{comp.cause}</div>
            </div>

            <div className="info-block">
              <div className="info-block-label">Preventive Suggestions</div>
              {comp.suggestions.map((s, i) => (
                <div key={i} className="suggestion-item">
                  <div className="suggestion-dot" />
                  {s}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexDirection: 'column', marginTop: 16 }}>
              {comp.id !== 'cooling' && (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => navigate('/simulation', { state: { selectedComponent: comp.id } })}
                >
                  <Zap size={14} /> Simulate This Component <ArrowRight size={14} />
                </button>
              )}
              <button
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setSelected(null)}
              >
                Close Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
