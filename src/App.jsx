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
  <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <header className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white">
              Gowanus 2026 <span className="text-blue-500">Water Dashboard</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1">SENSORS ACTIVE // CANAL SECTOR 7</p>
          </div>
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1 text-xs outline-none text-zinc-400"
          >
            <option value="24h">L-24H</option>
            <option value="7d">L-7D</option>
          </select>
        </header>

        {/* 1. TOP SECTION: LEAD RISK SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <CustomCard className="md:col-span-4 flex flex-col md:flex-row justify-between items-center bg-zinc-900/30 border-l-4 border-red-600">
            <div>
              <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Contamination Risk Index</p>
              <h2 className="text-6xl font-black" style={{ color: s.color }}>{score}</h2>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-2 ${s.pill}`}>
                <StatusIcon size={14} />
                <span className="text-[10px] font-bold uppercase">{s.label}</span>
              </div>
              <p className="text-zinc-500 text-[10px] block">LAST UPDATED: {new Date().toLocaleTimeString()}</p>
            </div>
          </CustomCard>
        </div>

        {/* 2. MAIN FOCUS: THE STORMWATER TANK */}
        <div className="mb-10">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-3 ml-1">Stormwater Tank Capacity</p>
          <CustomCard className="relative h-64 overflow-hidden bg-zinc-950 border-zinc-700 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
            {/* Water Animation */}
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${waterLevel * 100}%` }}
              transition={{ type: "spring", stiffness: 20, damping: 10 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 to-blue-500/50 backdrop-blur-sm border-t-2 border-blue-400"
            />
            
            {/* Overlay Grid Lines (Industrial Look) */}
            <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
              {[75, 50, 25].map(tick => (
                <div key={tick} className="border-t border-zinc-800/50 flex items-start">
                  <span className="text-[9px] text-zinc-600 ml-2 mt-1">{tick}%</span>
                </div>
              ))}
            </div>

            {/* Centered Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-8xl font-black text-white/20 tabular-nums">
                 {Math.round(waterLevel * 100)}%
               </span>
               <span className="text-xs font-bold text-blue-300 tracking-widest uppercase">Volume Occupied</span>
            </div>
          </CustomCard>
        </div>

        {/* 3. BOTTOM SECTION: THE 3 SCORECARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: pH */}
          <CustomCard className="border-t-2 border-t-blue-500">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">pH Balance</span>
              <Droplets className="text-blue-500" size={18} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tighter">7.24</span>
              <span className="text-[10px] text-emerald-400">NORMAL</span>
            </div>
          </CustomCard>

          {/* Card 2: Contamination/Vegetation */}
          <CustomCard className="border-t-2 border-t-emerald-500">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Bioswale Health</span>
              <Activity className="text-emerald-500" size={18} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tighter">84%</span>
              <span className="text-[10px] text-zinc-500">OPTIMAL</span>
            </div>
          </CustomCard>

          {/* Card 3: Conductivity */}
          <CustomCard className="border-t-2 border-t-amber-500">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Conductivity</span>
              <ShieldAlert className="text-amber-500" size={18} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tracking-tighter">410</span>
              <span className="text-[10px] text-amber-500">DRIFTING</span>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
}



