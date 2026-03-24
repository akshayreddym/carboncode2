import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Flame, Cog, Wind, Zap, Info } from 'lucide-react';
import { calcSimulationResults } from '../data';

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div className="toggle-wrap">
      <div>
        <div className="toggle-label">{label}</div>
        {sub && <div className="toggle-sub">{sub}</div>}
      </div>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

function Slider({ name, min, max, value, unit, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="slider-wrap">
      <div className="slider-top">
        <span className="slider-name">{name}</span>
        <span className="slider-val">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ background: `linear-gradient(to right, var(--accent-blue) ${pct}%, var(--border-bright) ${pct}%)` }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'boiler', label: 'Boiler', icon: <Flame size={14} /> },
  { id: 'turbine', label: 'Turbine', icon: <Cog size={14} /> },
  { id: 'chimney', label: 'Chimney', icon: <Wind size={14} /> },
];

const COMPONENT_INFO = {
  boiler: { desc: 'High direct impact on CO₂. Combustion optimisation yields the largest emission reduction gains.', weightage: 'High', color: 'var(--red)' },
  turbine: { desc: 'Indirect impact. Improving thermodynamic efficiency reduces fuel needed per MWh.', weightage: 'Medium', color: 'var(--yellow)' },
  chimney: { desc: 'High direct impact. End-of-pipe capture and scrubbing remove CO₂ before atmospheric release.', weightage: 'High', color: 'var(--red)' },
};

export default function Simulation() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedComponent = location.state?.selectedComponent;

  const [activeComponent, setActiveComponent] = useState(passedComponent || 'boiler');

  // Boiler controls
  const [boilerEff, setBoilerEff] = useState(70);
  const [fuelOpt, setFuelOpt] = useState(40);
  const [carbonCapture, setCarbonCapture] = useState(false);
  const [wasteHeat, setWasteHeat] = useState(false);

  // Turbine controls
  const [turbineEff, setTurbineEff] = useState(72);
  const [steamPressure, setSteamPressure] = useState(30);
  const [leakageReduction, setLeakageReduction] = useState(false);
  const [maintenanceOpt, setMaintenanceOpt] = useState(false);

  // Chimney controls
  const [filterEff, setFilterEff] = useState(35);
  const [chimneyCapture, setChimneyCapture] = useState(false);
  const [scrubber, setScrubber] = useState(false);
  const [exhaustOpt, setExhaustOpt] = useState(25);

  const [ran, setRan] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const controls = activeComponent === 'boiler'
    ? { efficiency: boilerEff, fuelOpt, carbonCapture, wasteHeat }
    : activeComponent === 'turbine'
    ? { efficiency: turbineEff, steamPressure, leakageReduction, maintenanceOpt }
    : { filterEff, carbonCapture: chimneyCapture, scrubber, exhaustOpt };

  // Live preview
  const liveResult = calcSimulationResults(activeComponent, controls);
  const chartData = [
    { label: 'Current', value: liveResult.base, fill: '#ef4444' },
    { label: 'Simulated', value: liveResult.reduced, fill: '#22c55e' },
  ];

  function handleRun() {
    setSimResult(liveResult);
    setRan(true);
  }

  function handleViewResults() {
    navigate('/results', { state: { result: simResult, component: activeComponent } });
  }

  const info = COMPONENT_INFO[activeComponent];

  return (
    <div className="main-content">
      <div className="page-header animate-in">
        <div className="page-title">⚙️ Simulation & Optimization</div>
        <div className="page-subtitle">Adjust controls for each plant component and simulate emission outcomes</div>
      </div>

      {/* Component Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-card)', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid var(--border)' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`btn ${activeComponent === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ border: 'none', gap: 6 }}
            onClick={() => { setActiveComponent(tab.id); setRan(false); }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left – Controls */}
        <div>
          {/* Component Info */}
          <div className="card animate-in" style={{ marginBottom: 16, borderLeft: `3px solid ${info.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Info size={13} color={info.color} />
              <div style={{ fontSize: 13, fontWeight: 700 }}>
                {activeComponent === 'boiler' ? '🔥 Boiler' : activeComponent === 'turbine' ? '⚙️ Turbine' : '🌫️ Chimney'} Simulation
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 11, background: info.color + '22', color: info.color, padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>
                {info.weightage} Impact
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{info.desc}</div>
          </div>

          <div className="card animate-in animate-delay-1">
            <div className="section-title"><Zap size={14} /> Optimization Controls</div>

            {activeComponent === 'boiler' && (
              <>
                <Slider name="Boiler Efficiency" min={50} max={90} value={boilerEff} unit="%" onChange={setBoilerEff} />
                <Slider name="Fuel Optimization" min={0} max={100} value={fuelOpt} unit="%" onChange={setFuelOpt} />
                <Toggle label="Carbon Capture System" sub="Post-combustion CO₂ absorption" checked={carbonCapture} onChange={setCarbonCapture} />
                <Toggle label="Waste Heat Recovery" sub="Economiser on flue gas" checked={wasteHeat} onChange={setWasteHeat} />
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Preventive Measures Applied</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Optimize air-fuel ratio (stoichiometric 1.15:1)</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Implement real-time O₂ trim control</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Reduce slagging via soot blowing cycles</div>
                </div>
              </>
            )}

            {activeComponent === 'turbine' && (
              <>
                <Slider name="Turbine Efficiency" min={50} max={95} value={turbineEff} unit="%" onChange={setTurbineEff} />
                <Slider name="Steam Pressure Optimization" min={0} max={100} value={steamPressure} unit="%" onChange={setSteamPressure} />
                <Toggle label="Leakage Reduction" sub="Upgraded gland seal technology" checked={leakageReduction} onChange={setLeakageReduction} />
                <Toggle label="Maintenance Optimization" sub="Predictive maintenance schedule" checked={maintenanceOpt} onChange={setMaintenanceOpt} />
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Preventive Measures Applied</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Improve blade efficiency with coated alloys</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Reduce steam leakage via gland seals</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Optimize steam pressure to 165 bar / 540°C</div>
                </div>
              </>
            )}

            {activeComponent === 'chimney' && (
              <>
                <Slider name="Emission Filter Efficiency" min={0} max={100} value={filterEff} unit="%" onChange={setFilterEff} />
                <Slider name="Exhaust Gas Optimization" min={0} max={100} value={exhaustOpt} unit="%" onChange={setExhaustOpt} />
                <Toggle label="Carbon Capture System" sub="MEA solvent post-combustion capture" checked={chimneyCapture} onChange={setChimneyCapture} />
                <Toggle label="Flue Gas Scrubber (FGD)" sub="Wet desulfurization system" checked={scrubber} onChange={setScrubber} />
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Preventive Measures Applied</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Install wet FGD scrubbers (SO₂ removal)</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Enable post-combustion CO₂ capture</div>
                  <div className="suggestion-item"><div className="suggestion-dot" />Improve particulate filtration (ESP)</div>
                </div>
              </>
            )}

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }} onClick={handleRun}>
              <Zap size={16} /> Run Scenario
            </button>
          </div>
        </div>

        {/* Right – Live Results */}
        <div>
          <div className="card animate-in animate-delay-2" style={{ marginBottom: 16 }}>
            <div className="section-title">📊 Emission Comparison (Live Preview)</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v.toLocaleString()}`} />
                <Tooltip formatter={(v) => [`${v.toLocaleString()} t`, 'CO₂']} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card animate-in animate-delay-3" style={{ marginBottom: 16 }}>
            <div className="section-title">📉 Estimated Net Impact</div>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--green)', letterSpacing: -2 }}>
                {liveResult.pctReduction}%
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>emission reduction estimated</div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CURRENT</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)' }}>{liveResult.base.toLocaleString()} t</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'var(--text-muted)' }}>→</div>
              <div style={{ flex: 1, background: 'var(--green-dim)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>SIMULATED</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>{liveResult.reduced.toLocaleString()} t</div>
              </div>
            </div>
            <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ width: `${liveResult.pctReduction}%`, height: '100%', background: 'linear-gradient(to right, var(--accent-blue), var(--green))', borderRadius: 4, transition: 'width 0.6s ease' }} />
            </div>
          </div>

          <div className="card animate-in animate-delay-4" style={{ marginBottom: 16 }}>
            <div className="section-title">💡 Smart Recommendations</div>
            {liveResult.measures.map((m, i) => (
              <div key={i} className="suggestion-item">
                <div className="suggestion-dot" style={{ background: 'var(--green)' }} />
                {m}
              </div>
            ))}
            {liveResult.measures.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Adjust sliders and toggles to see recommendations.</div>
            )}
          </div>

          {ran && (
            <button className="btn btn-success btn-lg animate-in" style={{ width: '100%', justifyContent: 'center' }} onClick={handleViewResults}>
              📊 View Full Results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
