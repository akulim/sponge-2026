import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Droplets, Activity, AlertTriangle, CheckCircle2, 
  ShieldAlert, TrendingDown, TrendingUp, TrendingUpDown 
} from "lucide-react";

// --- HELPERS (Instead of utils.js) ---
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const seededValue = (seed) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  const x = Math.sin(h) * 10000;
  return x - Math.floor(x);
};

// --- STYLES ---
const statusStyles = {
  stable: { label: "Stable", icon: CheckCircle2, pill: "bg-emerald-900/40 text-emerald-300 border-emerald-700", color: "#10b981" },
  monitor: { label: "Monitor", icon: AlertTriangle, pill: "bg-amber-900/40 text-amber-300 border-amber-700", color: "#f59e0b" },
  elevated: { label: "Elevated Risk", icon: ShieldAlert, pill: "bg-rose-900/40 text-rose-300 border-rose-700", color: "#ef4444" },
};

// --- COMPONENTS (Inside same file for simplicity) ---
const CustomCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-[#121212] border border-zinc-800 p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

export default function BrooklynDashboard() {
  const [range, setRange] = useState("7d");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Simulated Data Logic
  const seedString = `${selectedDate}-${range}`;
  const waterLevel = useMemo(() => {
    const val = seededValue(seedString);
    return clamp(0.5 + val * 0.4, 0.1, 0.95);
  }, [seedString]);

  const score = Math.round(waterLevel * 100);
  const s = score > 66 ? statusStyles.elevated : score > 33 ? statusStyles.monitor : statusStyles.stable;
  const StatusIcon = s.icon;

  return (
   <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            Gowanus 2026 <span className="text-blue-500">Water Dashboard</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-mono text-sm">Real-time Canal Filtration Monitoring // Brooklyn, NY</p>
        </header>

        {/* MAIN FOCUS: CONTAMINATION RISK */}
        <div className="mb-10">
          <CustomCard className="bg-gradient-to-br from-[#121212] to-[#0a0a0a] border-l-4 border-l-red-600">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-1">Current Contamination Alert</p>
                <h2 className="text-7xl font-black tracking-tighter">HIGH RISK</h2>
                <p className="text-zinc-400 max-w-sm mt-2 text-sm italic">Heavy particulate drift detected near 3rd St. bridge. Vegetation filtration at 40% capacity.</p>
              </div>
              
              {/* Massive Score Focus */}
              <div className="relative flex items-center justify-center h-48 w-48 rounded-full border-8 border-red-900/30">
                <div className="text-center">
                  <span className="block text-5xl font-black text-red-500">{score}</span>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Risk Index</span>
                </div>
              </div>
            </div>
          </CustomCard>
        </div>

        {/* THREE FOCUS SCORECARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: pH Balance */}
          <CustomCard className="flex flex-col justify-between h-64 border-t-2 border-t-blue-500">
            <div>
              <div className="flex justify-between items-center mb-4">
                <Droplets className="text-blue-400" size={28} />
                <span className="text-[10px] font-bold text-blue-400 border border-blue-400/30 px-2 py-1 rounded">STABLE</span>
              </div>
              <h3 className="text-lg font-bold">pH Level</h3>
              <p className="text-zinc-500 text-xs italic">Acidity monitoring</p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">7.2</span>
              <div className="w-full bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[72%]" />
              </div>
            </div>
          </CustomCard>

          {/* Card 2: Vegetation Condition */}
          <CustomCard className="flex flex-col justify-between h-64 border-t-2 border-t-emerald-500">
            <div>
              <div className="flex justify-between items-center mb-4">
                <Activity className="text-emerald-400" size={28} />
                <span className="text-[10px] font-bold text-emerald-400 border border-emerald-400/30 px-2 py-1 rounded">OPTIMAL</span>
              </div>
              <h3 className="text-lg font-bold">Vegetation Health</h3>
              <p className="text-zinc-500 text-xs italic">Bioswale filtration efficiency</p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">88%</span>
              <div className="w-full bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[88%]" />
              </div>
            </div>
          </CustomCard>

          {/* Card 3: Conductivity */}
          <CustomCard className="flex flex-col justify-between h-64 border-t-2 border-t-amber-500">
            <div>
              <div className="flex justify-between items-center mb-4">
                <ShieldAlert className="text-amber-400" size={28} />
                <span className="text-[10px] font-bold text-amber-400 border border-amber-400/30 px-2 py-1 rounded">DRIFTING</span>
              </div>
              <h3 className="text-lg font-bold">Conductivity</h3>
              <p className="text-zinc-500 text-xs italic">Salinity and dissolved solids</p>
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">420 <span className="text-sm font-normal text-zinc-500">µS</span></span>
              <div className="w-full bg-zinc-800 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[65%]" />
              </div>
            </div>
          </CustomCard>

        </div>
      </div>
    </div>
  );
}


