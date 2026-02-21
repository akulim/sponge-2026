import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, TrendingUpDown } from "lucide-react";
import { clamp } from "../utils";

export function AnimatedWaterTank({ level }) {
  const percentage = clamp(level * 100, 0, 100);
  return (
    <div className="relative h-40 w-full rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-0 left-0 w-full bg-blue-500/70"
      />
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-zinc-200">
        {percentage.toFixed(0)}% level
      </div>
    </div>
  );
}

export function MiniMetricCard({ title, icon: Icon, value, unit, baseline, delta }) {
  const drifting = value < baseline.low || value > baseline.high;
  return (
    <Card className={`rounded-2xl bg-zinc-900 border-zinc-800 ${drifting ? "border-rose-700" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <Icon className="h-5 w-5 text-zinc-300" />
            </div>
            <CardTitle className="text-sm font-medium text-zinc-100">{title}</CardTitle>
          </div>
          <Badge className={drifting ? "bg-rose-900/40 text-rose-300" : "bg-emerald-900/40 text-emerald-300"}>
            {drifting ? "Drifting" : "In range"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value.toFixed(2)}{unit}</div>
      </CardContent>
    </Card>
  );
}