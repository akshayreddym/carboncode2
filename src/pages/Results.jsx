import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { Home, ArrowLeft, Trophy, TrendingDown, Zap } from 'lucide-react';
import { calcSimulationResults } from '../data';

const DEFAULT_RESULT = calcSimulationResults('boiler', {
  efficiency: 82, fuelOpt: 60, carbonCapture: true, wasteHeat: true,
});

const COMPONENT_LABELS = { boiler: '🔥 Boiler', turbine: '⚙️ Turbine', chimney: '🌫️ Chimney' };

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result || DEFAULT_RESULT;
  const component = location.state?.component || 'boiler';

  const reduction = result.base - result.reduced;
  const pct = parseFloat(result.pctReduction);
  const sustainScore = result.sustainScore;
  const effImprovement = (pct * 0.35).toFixed(1);
  const creditTons = Math.round(reduction * 0.72);
  const creditValue = (creditTons * 8.4).toFixed(0);

  const barData = [
    { name: 'Before', co2: result.base, fill: '#ef4444' },
    { name: 'After', co2: result.reduced, fill: '#22c55e' },
  ];

  const breakdownData = [
    { name: 'Combustion Opt.', value: Math.round(pct * 40), fill: '#3b82f6' },
    { name: 'Fuel Reduction', value: Math.round(pct * 30), fill: '#06b6d4' },
    { name: 'Carbon Capture', value: Math.round(pct * 20), fill: '#22c55e' },
    { name: 'Other Measures', value: Math.round(pct * 10), fill: '#eab308' },
  ];

  return (
    <div className="main-content">
      <div className="page-header animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-green">✓ Simulation Complete</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Component: {COMPONENT_LABELS[component]}</span>
            </div>
            <div className="page-title">🏆 Optimization Results</div>
            <div className="page-subtitle">Summary of emission reduction outcomes and sustainability impact</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              <ArrowLeft size={14} /> Back to Simulation
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              <Home size={14} /> Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card animate-in animate-delay-1" style={{ borderLeft: '3px solid var(--green)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>CO₂ REDUCED</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--green)', letterSpacing: -1 }}>
            {reduction.toLocaleString()} t
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>tons per day</div>
        </div>
        <div className="card animate-in animate-delay-2" style={{ borderLeft: '3px solid var(--accent-blue)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>EMISSION REDUCTION</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--accent-blue)', letterSpacing: -1 }}>
            {pct}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>from baseline</div>
        </div>
        <div className="card animate-in animate-delay-3" style={{ borderLeft: '3px solid var(--yellow)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>EFFICIENCY GAIN</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--yellow)', letterSpacing: -1 }}>
            +{effImprovement}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>plant efficiency</div>
        </div>
        <div className="card animate-in animate-delay-4" style={{ borderLeft: '3px solid var(--accent-cyan)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>RISK LEVEL</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: pct > 25 ? 'var(--green)' : 'var(--yellow)', letterSpacing: -1 }}>
            {pct > 25 ? 'LOW' : 'MED'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>after optimization</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Bar Chart */}
        <div className="card animate-in animate-delay-2">
          <div className="section-title">📊 Before vs After Emissions</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toLocaleString()}`} />
              <Tooltip formatter={v => [`${v.toLocaleString()} t CO₂`, '']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Bar dataKey="co2" radius={[8, 8, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sustainability Score */}
        <div className="card animate-in animate-delay-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="section-title" style={{ marginBottom: 20, alignSelf: 'flex-start' }}>
            <Trophy size={14} color="var(--yellow)" /> Sustainability Score
          </div>
          <div className="score-ring">
            <div className="score-num">{sustainScore}</div>
            <div className="score-label">/ 100</div>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: sustainScore >= 70 ? 'var(--green)' : 'var(--yellow)', marginBottom: 8 }}>
            {sustainScore >= 80 ? 'Excellent' : sustainScore >= 65 ? 'Good' : 'Moderate'}
          </div>
          <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${sustainScore}%`, height: '100%', background: `linear-gradient(to right, var(--accent-blue), var(--green))`, borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{sustainScore}% sustainability compliance</div>
        </div>
      </div>

      {/* Strategy Breakdown + Carbon Credits */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Strategy Breakdown */}
        <div className="card animate-in animate-delay-3">
          <div className="section-title">🎯 Strategy Breakdown</div>
          {breakdownData.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.fill, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.fill }}>{item.value}%</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${item.value}%`, background: item.fill }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carbon Credits */}
        <div className="card animate-in animate-delay-4">
          <div className="section-title">🌿 Carbon Credit Estimate</div>
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>CREDITS EARNED</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--green)', letterSpacing: -1, marginBottom: 4 }}>
              {creditTons.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>tonnes CO₂e certified credits</div>
            <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: '14px 20px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ESTIMATED MARKET VALUE</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--green)' }}>₹{parseInt(creditValue).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@ ₹8.40 / tonne (Indian Carbon Market)</div>
            </div>
            <div style={{ background: 'var(--accent-blue-dim)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '12px 20px' }}>
              <div style={{ fontSize: 12, color: 'var(--accent-blue)' }}>
                <Zap size={12} style={{ display: 'inline', marginRight: 4 }} />
                Eligible under India's PAT Scheme & BEE 2030 targets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Measures */}
      <div className="card animate-in animate-delay-4" style={{ marginBottom: 24 }}>
        <div className="section-title">✅ Measures Applied</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {result.measures.map((m, i) => (
            <div key={i} style={{ background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: 13, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 6 }}>
              ✓ {m}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
          <Home size={16} /> Back to Dashboard
        </button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/simulation')}>
          <ArrowLeft size={16} /> Re-simulate
        </button>
        <button className="btn btn-success btn-lg" onClick={() => navigate('/analysis')}>
          📋 View Analysis
        </button>
      </div>
    </div>
  );
}
