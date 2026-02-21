import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Droplets, Activity, AlertTriangle, CheckCircle2, 
  ShieldAlert, TrendingDown, TrendingUp, TrendingUpDown 
} from "lucide-react";

// --- HELPERS ---
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

// --- COMPONENTS ---
const CustomCard = ({ children, className = "" }) => (
  <div className={`rounded-2xl bg-[#121212] border border-zinc-800 p-5 shadow-xl ${className}`}>
    {children}
  </div>
);

export default function GowanusDashboard() {
  // 1. State
  const [mode, setMode] = useState("after");
  const [range, setRange] = useState("7d");
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);

  // 2. Logic
  const seedString = `${selectedDate}-${range}`;
  const waterLevel = useMemo(() => {
    const val = seededValue(seedString);
    return clamp(0.5 + val * 0.4, 0.1, 0.95);
  }, [seedString]);

  const score = Math.round(waterLevel * 100);
  const isBefore = mode === "before";
  const displayScore = isBefore ? 92 : score; 
  const displayWater = isBefore ? 0.98 : waterLevel;

  const s = isBefore 
    ? statusStyles.elevated 
    : (score > 66 ? statusStyles.elevated : score > 33 ? statusStyles.monitor : statusStyles.stable);
  
  const StatusIcon = s.icon;

  // 3. UI
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-mono text-sm">
      <div className="max-w-5xl mx-auto">
        
        {/* MODE TOGGLE BUTTONS */}
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl w-fit mb-8 border border-zinc-800">
          <button 
            onClick={() => setMode("before")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${isBefore ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            PRE-UPGRADE (2024)
          </button>
          <button 
            onClick={() => setMode("after")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${!isBefore ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            GOWANUS 2026 ACTIVE
          </button>
        </div>

        {/* HEADER */}
        <header className="mb-10 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
            System Status: <span className={isBefore ? "text-red-500" : "text-blue-500"}>
              {isBefore ? "CRITICAL FAILURE" : "SENSORS ONLINE"}
            </span>
          </h1>
          <p className="text-zinc-500 mt-2 text-[10px] tracking-widest uppercase">Gowanus Canal Monitoring // Brooklyn, NY</p>
        </header>

        {/* MAIN RISK CARD */}
        <CustomCard className={`mb-6 border-l-4 transition-all duration-500 ${isBefore ? "border-red-600 animate-pulse bg-red-950/10" : "border-blue-600 bg-blue-950/10"}`}>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Contamination Risk Index</p>
          <div className="flex justify-between items-end">
            <h2 className="text-7xl font-black tracking-tighter" style={{ color: isBefore ? "#ef4444" : s.color }}>
              {displayScore}
            </h2>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold ${isBefore ? "border-red-500 text-red-500" : "border-zinc-700 text-zinc-400"}`}>
              <StatusIcon size={14} />
              {isBefore ? "SEVERE OVERFLOW" : s.label.toUpperCase()}
            </div>
          </div>
          {isBefore && <p className="text-red-500 text-[10px] mt-4 font-bold border-t border-red-900/50 pt-2 italic">⚠️ DETECTION: Untreated sewage drift detected at Sector 7.</p>}
        </CustomCard>

        {/* TANK FOCUS */}
        <div className="mb-6">
          <p className="text-zinc-500 text-[10px] uppercase font-bold mb-3 tracking-widest">Stormwater Storage Tank Volume</p>
          <CustomCard className="h-64 relative overflow-hidden bg-zinc-950 border-zinc-700">
            <motion.div 
              initial={false}
              animate={{ height: `${displayWater * 100}%` }}
              transition={{ type: "spring", stiffness: 30, damping: 15 }}
              className={`absolute bottom-0 left-0 right-0 ${isBefore ? "bg-gradient-to-t from-red-900/60 to-red-500/40 border-red-500" : "bg-gradient-to-t from-blue-900/60 to-blue-500/40 border-blue-400"} border-t-2`}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-8xl font-black opacity-10 tabular-nums">{Math.round(displayWater * 100)}%</span>
               <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40">Capacity Occupied</span>
            </div>
          </CustomCard>
        </div>

        {/* BOTTOM SCORECARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <CustomCard className="border-t-2 border-blue-500/50">
            <span className="text-[10px] text-zinc-500 block mb-2 uppercase font-bold tracking-widest">pH Balance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">{isBefore ? "5.1" : "7.2"}</span>
              <span className={`text-[10px] font-bold ${isBefore ? "text-red-500" : "text-emerald-500"}`}>
                {isBefore ? "ACIDIC" : "NEUTRAL"}
              </span>
            </div>
          </CustomCard>

          <CustomCard className="border-t-2 border-emerald-500/50">
            <span className="text-[10px] text-zinc-500 block mb-2 uppercase font-bold tracking-widest">Vegetation Health</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold tabular-nums ${isBefore ? "text-zinc-800" : "text-white"}`}>
                {isBefore ? "00" : "84"}%
              </span>
              <span className={`text-[10px] font-bold ${isBefore ? "text-zinc-700" : "text-emerald-500"}`}>
                {isBefore ? "OFFLINE" : "ACTIVE"}
              </span>
            </div>
          </CustomCard>

          <CustomCard className="border-t-2 border-amber-500/50">
            <span className="text-[10px] text-zinc-500 block mb-2 uppercase font-bold tracking-widest">Conductivity</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums">{isBefore ? "890" : "410"}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">µS/cm</span>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
}
