import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { AlertTriangle, TrendingUp, Zap, Activity, Wind, Cpu, Map, BarChart3, Sliders } from 'lucide-react';
import { PLANT_DATA, EMISSION_TREND } from '../data';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-blue)' }}>{payload[0]?.value?.toLocaleString()} t CO₂</p>
        {payload[1] && <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 2 }}>Limit: {payload[1]?.value?.toLocaleString()}</p>}
      </div>
    );
  }
  return null;
};

function MetricCard({ title, value, sub, color, icon, delay }) {
  return (
    <div className={`card animate-in animate-delay-${delay}`} style={{ borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div className="card-title">{title}</div>
        <div style={{ color, opacity: 0.7 }}>{icon}</div>
      </div>
      <div className="card-value" style={{ color }}>{value}</div>
      <div className="card-sub">{sub}</div>
    </div>
  );
}

function ComponentStatus({ label, icon, status, color, pct }) {
  const colors = { red: 'var(--red)', yellow: 'var(--yellow)', green: 'var(--green)' };
  const c = colors[color];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 22, width: 36, textAlign: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: c }} />
          </div>
          <span style={{ fontSize: 11, color: c, fontWeight: 700, whiteSpace: 'nowrap' }}>{pct}%</span>
        </div>
      </div>
      <span className={`badge badge-${color === 'red' ? 'red' : color === 'yellow' ? 'yellow' : 'green'}`}>{status}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const liveEmission = (4820 + (tick % 3) * 47 - 23).toLocaleString();

  return (
    <div className="main-content">
      {/* Header */}
      <div className="page-header animate-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span className="badge badge-red" style={{ animation: 'pulse 2s infinite' }}>● LIVE</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Ramagundam STPS • Updated {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="page-title">Operations Dashboard</div>
            <div className="page-subtitle">Carbon Intelligence Platform – Coal Thermal Power Monitoring</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/hotspot')}>
              <Map size={14} /> Hotspot Map
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/simulation')}>
              <Sliders size={14} /> Optimize
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid-5" style={{ marginBottom: 20 }}>
        <MetricCard title="CO₂ Emissions" value={`${liveEmission} t`} sub="Tons today (live)" color="var(--red)" icon={<Activity size={16} />} delay="1" />
        <MetricCard title="Power Generated" value="1,843 MW" sub="Of 2,600 MW capacity" color="var(--accent-blue)" icon={<Zap size={16} />} delay="2" />
        <MetricCard title="Plant Efficiency" value="74.2%" sub="↓ 3.1% from last week" color="var(--yellow)" icon={<TrendingUp size={16} />} delay="3" />
        <MetricCard title="Emission Intensity" value="2.61" sub="CO₂ per MWh (t/MWh)" color="var(--accent-cyan)" icon={<Wind size={16} />} delay="4" />
        <MetricCard title="Risk Level" value="HIGH" sub="Action required" color="var(--red)" icon={<AlertTriangle size={16} />} delay="4" />
      </div>

      {/* Charts + Hotspot Summary Row */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Emission Trend */}
        <div className="card animate-in animate-delay-2" style={{ gridColumn: '1' }}>
          <div className="section-title">
            <Activity size={14} /> Emission Trend – Last 24 Hours
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={EMISSION_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} width={55} tickFormatter={v => `${(v/1000).toFixed(1)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={5000} stroke="var(--red)" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: 'Limit', fill: 'var(--red)', fontSize: 10 }} />
              <Line type="monotone" dataKey="co2" stroke="var(--accent-blue)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: 'var(--accent-blue)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alerts + Hotspot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Alerts */}
          <div className="card animate-in animate-delay-3">
            <div className="section-title"><AlertTriangle size={14} /> Active Alerts</div>
            <div className="alert-item alert-red">
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>High CO₂ spike detected</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Flue gas CO₂ exceeded 5,100 t at 10:00–12:00. Boiler combustion anomaly.</div>
              </div>
            </div>
            <div className="alert-item alert-yellow">
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Boiler efficiency dropped</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Efficiency fell to 68.4% — below safe threshold of 72%. Fuel consumption elevated.</div>
              </div>
            </div>
            <div className="alert-item alert-yellow">
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>Turbine steam pressure variance</div>
                <div style={{ fontSize: 11, opacity: 0.8 }}>Pressure dropped 7% below set-point. Gland seal inspection recommended.</div>
              </div>
            </div>
          </div>

          {/* Hotspot Summary */}
          <div className="card animate-in animate-delay-4">
            <div className="section-title"><Cpu size={14} /> Hotspot Summary</div>
            {[
              { label: 'Boiler', icon: '🔥', color: 'red', level: 'High', pct: '45.2% of total' },
              { label: 'Chimney', icon: '🌫️', color: 'red', level: 'High', pct: '33.0% of total' },
              { label: 'Turbine', icon: '⚙️', color: 'yellow', level: 'Medium', pct: '21.8% of total' },
              { label: 'Cooling', icon: '🏭', color: 'green', level: 'Low', pct: 'Minimal' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.pct}</div>
                  </div>
                </div>
                <span className={`badge badge-${item.color === 'red' ? 'red' : item.color === 'yellow' ? 'yellow' : 'green'}`}>{item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plant Component Status */}
      <div className="card animate-in animate-delay-3" style={{ marginBottom: 20 }}>
        <div className="section-title"><Cpu size={14} /> Plant Component Status</div>
        <ComponentStatus label="Boiler – Unit 1 & 2" icon="🔥" status="Critical" color="red" pct={82} />
        <ComponentStatus label="Turbine Assembly" icon="⚙️" status="Warning" color="yellow" pct={61} />
        <ComponentStatus label="Chimney / Flue Stack" icon="🌫️" status="Critical" color="red" pct={90} />
        <ComponentStatus label="Cooling Tower" icon="🏭" status="Normal" color="green" pct={25} />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="animate-in animate-delay-4">
        <button className="btn btn-danger btn-lg" onClick={() => navigate('/hotspot')}>
          <Map size={16} /> View Hotspot Map
        </button>
        <button className="btn btn-ghost btn-lg" onClick={() => navigate('/analysis')}>
          <BarChart3 size={16} /> Analyze Plant
        </button>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/simulation')}>
          <Sliders size={16} /> Optimize Emissions
        </button>
      </div>
    </div>
  );
}
