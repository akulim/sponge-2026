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
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Droplets className="text-blue-500 w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">Brooklyn Water Quality</h1>
          </div>
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7d</option>
            <option value="30d">Last 30d</option>
          </select>
        </header>

        {/* Main Risk Card */}
        <motion.div 
          animate={{ backgroundColor: s.color + "15" }}
          className="rounded-3xl border border-zinc-800 p-8 mb-8 transition-colors"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Lead Risk Score</p>
              <h2 className="text-6xl font-black" style={{ color: s.color }}>{score}</h2>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${s.pill}`}>
              <StatusIcon size={18} />
              <span className="text-sm font-bold uppercase">{s.label}</span>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              className="h-full"
              style={{ backgroundColor: s.color }}
            />
          </div>
        </motion.div>

        {/* Grid Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <CustomCard>
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="text-blue-400" /></div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">IN RANGE</span>
            </div>
            <p className="text-zinc-500 text-xs">Conductivity</p>
            <p className="text-2xl font-bold">240 <span className="text-sm font-normal text-zinc-500">µS/cm</span></p>
          </CustomCard>

          <CustomCard className={score > 60 ? "border-red-900/50" : ""}>
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg"><AlertTriangle className="text-amber-400" /></div>
              <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20 uppercase font-bold">Drifting</span>
            </div>
            <p className="text-zinc-500 text-xs">Turbidity</p>
            <p className="text-2xl font-bold">{(0.2 + (waterLevel * 0.8)).toFixed(2)} <span className="text-sm font-normal text-zinc-500">NTU</span></p>
          </CustomCard>

          <CustomCard>
             <p className="text-zinc-500 text-xs mb-2 uppercase font-bold tracking-tighter">Stormwater Tank</p>
             <div className="relative h-24 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                <motion.div 
                  animate={{ height: `${waterLevel * 100}%` }}
                  className="absolute bottom-0 w-full bg-blue-600/40 backdrop-blur-sm border-t border-blue-400"
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono">
                  {Math.round(waterLevel * 100)}% CAPACITY
                </div>
             </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
}
