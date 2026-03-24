// Shared data & simulation utilities for Carbon Code platform
export const PLANT_DATA = {
  name: "Ramagundam Super Thermal Power Station",
  location: "Telangana, India",
  capacity: "2600 MW",
  co2Today: 4820,
  powerGenerated: 1843,
  efficiency: 74.2,
  emissionIntensity: 2.61,
  riskLevel: "High",
};

export const EMISSION_TREND = [
  { time: "00:00", co2: 4200, limit: 5000 },
  { time: "02:00", co2: 4050, limit: 5000 },
  { time: "04:00", co2: 3900, limit: 5000 },
  { time: "06:00", co2: 4300, limit: 5000 },
  { time: "08:00", co2: 4750, limit: 5000 },
  { time: "10:00", co2: 5100, limit: 5000 },
  { time: "12:00", co2: 5400, limit: 5000 },
  { time: "14:00", co2: 5200, limit: 5000 },
  { time: "16:00", co2: 4980, limit: 5000 },
  { time: "18:00", co2: 5300, limit: 5000 },
  { time: "20:00", co2: 4820, limit: 5000 },
  { time: "22:00", co2: 4600, limit: 5000 },
];

export const COMPONENTS = {
  boiler: {
    id: "boiler",
    label: "Boiler",
    icon: "🔥",
    level: "High",
    color: "red",
    co2: 2180,
    pct: 45.2,
    cause: "Incomplete combustion due to sub-optimal air-fuel ratio. Excess unburned carbon particles exit with flue gas, driving up CO₂ and particulate emissions significantly.",
    suggestions: [
      "Optimize air-fuel ratio to 1.15:1 stoichiometric ratio",
      "Install O₂ trim control for real-time combustion feedback",
      "Implement soot blowing cycles every 4 hours",
      "Switch to beneficiated coal with lower ash content",
    ],
  },
  turbine: {
    id: "turbine",
    label: "Turbine",
    icon: "⚙️",
    level: "Medium",
    color: "yellow",
    co2: 1050,
    pct: 21.8,
    cause: "Steam leakage and blade degradation reduce thermodynamic efficiency, indirectly increasing fuel burn per unit of power generated.",
    suggestions: [
      "Replace turbine blades with advanced coated alloys",
      "Reduce steam leakage via upgraded gland seals",
      "Optimize steam pressure to 165 bar / 540°C",
      "Schedule predictive maintenance every 8000 operating hours",
    ],
  },
  chimney: {
    id: "chimney",
    label: "Chimney / Flue Gas",
    icon: "🌫️",
    level: "High",
    color: "red",
    co2: 1590,
    pct: 33.0,
    cause: "Direct emission point for all combustion byproducts. Lack of adequate scrubbing and capture technology allows raw flue gases to escape into atmosphere.",
    suggestions: [
      "Install Wet Flue Gas Desulfurization (FGD) scrubbers",
      "Deploy post-combustion CO₂ capture amine systems",
      "Add electrostatic precipitators for particulate removal",
      "Monitor NOx/SOx with CEMS (Continuous Emission Monitoring)",
    ],
  },
  cooling: {
    id: "cooling",
    label: "Cooling Tower",
    icon: "🏭",
    level: "Low",
    color: "green",
    co2: 0,
    pct: 0,
    cause: "Cooling towers primarily dissipate heat into the atmosphere via evaporation and are not a direct source of CO₂ emissions.",
    suggestions: [
      "Maintain drift eliminators to reduce water loss",
      "Use treated recycled water to reduce freshwater usage",
      "Optimize fan motor speed with VFDs",
      "Conduct quarterly biological fouling inspections",
    ],
  },
};

export const ANALYSIS_DATA = {
  rootCauses: [
    { id: 1, title: "Poor Combustion Efficiency", description: "Sub-optimal air-fuel ratio leads to incomplete combustion. Unburned carbon exits as CO and soot.", priority: "High", component: "Boiler", impact: 38 },
    { id: 2, title: "Excess Heat Loss", description: "Flue gas exits at temperatures above 180°C — well above the optimal 120°C — wasting significant thermal energy.", priority: "High", component: "Chimney", impact: 28 },
    { id: 3, title: "Turbine Steam Leakage", description: "Gland seal degradation causes steam bypass, reducing turbine work output and forcing higher fuel input.", priority: "Medium", component: "Turbine", impact: 18 },
    { id: 4, title: "Excess Fuel Consumption", description: "Aged coal mills produce inconsistent particle sizes, raising total coal consumption per MWh by ~8%.", priority: "Medium", component: "Boiler", impact: 16 },
  ],
  preventiveMeasures: [
    { id: 1, title: "Optimize Air-Fuel Ratio", description: "Implement closed-loop O₂ control with real-time trim adjustments.", priority: "High", reduction: "12–18%", cost: "₹2.4 Cr" },
    { id: 2, title: "Install Flue Gas Scrubbers", description: "Wet FGD systems to remove SO₂ and reduce overall emission intensity.", priority: "High", reduction: "18–24%", cost: "₹18 Cr" },
    { id: 3, title: "Turbine Blade Overhaul", description: "Upgrade to advanced-alloy turbine blades with thermal barrier coatings.", priority: "Medium", reduction: "8–12%", cost: "₹6.5 Cr" },
    { id: 4, title: "Waste Heat Recovery", description: "Install economisers on flue gas stream to recover heat and pre-heat feedwater.", priority: "Medium", reduction: "10–14%", cost: "₹4.2 Cr" },
    { id: 5, title: "Coal Beneficiation", description: "Pre-wash coal to reduce ash content from 35% to below 20% before combustion.", priority: "Low", reduction: "5–8%", cost: "₹1.8 Cr" },
    { id: 6, title: "Carbon Capture System", description: "Post-combustion capture via MEA solvent absorption for large-scale CO₂ removal.", priority: "Low", reduction: "25–35%", cost: "₹45 Cr" },
  ],
};

export function calcSimulationResults(component, controls) {
  let baseEmission = 4820;
  let reducedEmission = baseEmission;
  let measures = [];

  if (component === "boiler") {
    const effGain = (controls.efficiency - 70) / 100;
    const fuelGain = controls.fuelOpt / 500;
    const captureGain = controls.carbonCapture ? 0.18 : 0;
    const heatGain = controls.wasteHeat ? 0.10 : 0;
    const totalReduction = effGain + fuelGain + captureGain + heatGain;
    reducedEmission = Math.max(baseEmission * (1 - totalReduction), baseEmission * 0.4);
    measures = ["Combustion optimization", "Fuel mix adjustment", controls.carbonCapture ? "Carbon capture active" : null, controls.wasteHeat ? "Waste heat recovery" : null].filter(Boolean);
  } else if (component === "turbine") {
    const effGain = (controls.efficiency - 72) / 200;
    const pressGain = controls.steamPressure / 600;
    const leakGain = controls.leakageReduction ? 0.07 : 0;
    const maintGain = controls.maintenanceOpt ? 0.06 : 0;
    const totalReduction = effGain + pressGain + leakGain + maintGain;
    reducedEmission = Math.max(baseEmission * (1 - totalReduction), baseEmission * 0.6);
    measures = ["Turbine efficiency boost", "Steam pressure optimization", controls.leakageReduction ? "Leakage sealed" : null, controls.maintenanceOpt ? "Maintenance optimized" : null].filter(Boolean);
  } else {
    const filterGain = controls.filterEff / 400;
    const captureGain = controls.carbonCapture ? 0.22 : 0;
    const scrubberGain = controls.scrubber ? 0.18 : 0;
    const exhaustGain = controls.exhaustOpt / 500;
    const totalReduction = filterGain + captureGain + scrubberGain + exhaustGain;
    reducedEmission = Math.max(baseEmission * (1 - totalReduction), baseEmission * 0.35);
    measures = [controls.carbonCapture ? "Carbon capture system" : null, controls.scrubber ? "FGD scrubber" : null, "Enhanced filtration", "Exhaust optimization"].filter(Boolean);
  }

  const pctReduction = ((baseEmission - reducedEmission) / baseEmission) * 100;
  const sustainScore = Math.min(Math.round(40 + pctReduction * 1.4), 98);
  return { base: Math.round(baseEmission), reduced: Math.round(reducedEmission), pctReduction: pctReduction.toFixed(1), measures, sustainScore };
}
