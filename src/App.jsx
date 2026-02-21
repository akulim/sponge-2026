import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Droplets, Activity, AlertTriangle, CheckCircle2, 
  ShieldAlert, TrendingDown, TrendingUp, TrendingUpDown 
} from "lucide-react";

// 1. Define Basic State
  const [mode, setMode] = useState("after");
  const [range, setRange] = useState("7d");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // 2. Calculate Water & Scores
  const seedString = `${selectedDate}-${range}`;
  const waterLevel = useMemo(() => {
    const val = seededValue(seedString);
    return clamp(0.5 + val * 0.4, 0.1, 0.95);
  }, [seedString]);

  const score = Math.round(waterLevel * 100);
  const isBefore = mode === "before";
  const displayScore = isBefore ? 92 : score; 
  const displayWater = isBefore ? 0.98 : waterLevel;

  // 3. Define 's' FIRST
  const s = isBefore 
    ? statusStyles.elevated 
    : (score > 66 ? statusStyles.elevated : score > 33 ? statusStyles.monitor : statusStyles.stable);

  // 4. NOW define StatusIcon using 's'
  const StatusIcon = s.icon;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-mono">
      <div className="max-w-5xl mx-auto">
        
        {/* MODE TOGGLE BUTTONS */}
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl w-fit mb-8 border border-zinc-800">
          <button 
            onClick={() => setMode("before")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${isBefore ? "bg-red-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            PRE-UPGRADE (2024)
          </button>
          <button 
            onClick={() => setMode("after")}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${!isBefore ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            GOWANUS 2026 ACTIVE
          </button>
        </div>

        {/* HEADER */}
        <header className="mb-10 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            System Status: <span className={isBefore ? "text-red-500" : "text-blue-500"}>
              {isBefore ? "CRITICAL FAILURE" : "SENSORS ONLINE"}
            </span>
          </h1>
        </header>

        {/* MAIN RISK CARD */}
        <CustomCard className={`mb-6 border-l-4 ${isBefore ? "border-red-600 animate-pulse" : "border-blue-600"}`}>
          <p className="text-zinc-500 text-[10px] uppercase font-bold">Contamination Risk</p>
          <h2 className="text-6xl font-black" style={{ color: isBefore ? "#ef4444" : s.color }}>
            {displayScore}
          </h2>
          {isBefore && <p className="text-red-500 text-[10px] mt-2 font-bold">⚠️ OVERFLOW DETECTED: UNTREATED SEWAGE DRIFT</p>}
        </CustomCard>

        {/* TANK FOCUS */}
        <div className="mb-10">
          <CustomCard className="h-64 relative overflow-hidden bg-zinc-950">
            <motion.div 
              animate={{ height: `${displayWater * 100}%` }}
              className={`absolute bottom-0 left-0 right-0 ${isBefore ? "bg-red-900/40 border-red-500" : "bg-blue-600/40 border-blue-400"} border-t-2`}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-7xl font-black opacity-30">{Math.round(displayWater * 100)}%</span>
            </div>
          </CustomCard>
        </div>

        {/* BOTTOM SCORECARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <CustomCard>
            <span className="text-[10px] text-zinc-500 block mb-2 uppercase">pH Balance</span>
            <span className="text-4xl font-bold">{isBefore ? "5.1" : "7.2"}</span>
            {isBefore && <span className="text-[10px] text-red-500 block">ACIDIC</span>}
          </CustomCard>

          <CustomCard>
            <span className="text-[10px] text-zinc-500 block mb-2 uppercase">Vegetation Health</span>
            <span className={`text-4xl font-bold ${isBefore ? "text-zinc-700" : "text-white"}`}>
              {isBefore ? "NO DATA" : "84%"}
            </span>
            {!isBefore && <span className="text-[10px] text-emerald-500 block">BIOSWALE ACTIVE</span>}
          </CustomCard>

          <CustomCard>
            <span className="text-[10px] text-zinc-500 block mb-2 uppercase">Conductivity</span>
            <span className="text-4xl font-bold">{isBefore ? "890" : "410"}</span>
          </CustomCard>
        </div>
      </div>
    </div>
  );
}









