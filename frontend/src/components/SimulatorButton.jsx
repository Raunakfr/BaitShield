import React from 'react';
import { Play, RotateCcw, Loader2, UserCheck, ShieldCheck } from 'lucide-react';

export default function SimulatorButton({
  simulating,
  legitimateSimulating,
  onSimulate,
  onSimulateLegitimate,
  onReset
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Attacker Simulator Button */}
      <button
        onClick={onSimulate}
        disabled={simulating || legitimateSimulating}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md ${
          simulating 
            ? 'bg-accent/70 cursor-not-allowed' 
            : 'bg-accent hover:bg-[#ff8533] hover:shadow-accent/20'
        }`}
      >
        {simulating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Attacker Intrusion Running...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current text-white" />
            Simulate Attacker
          </>
        )}
      </button>

      {/* Legitimate User Simulator Button (0 False Positives Demo) */}
      <button
        onClick={onSimulateLegitimate}
        disabled={simulating || legitimateSimulating}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
          legitimateSimulating
            ? 'bg-low/20 text-low border-low/40 cursor-not-allowed'
            : 'bg-bg hover:bg-low/10 text-white border-low/40 hover:border-low'
        }`}
      >
        {legitimateSimulating ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-low" />
            <span className="text-low font-bold">Simulating Employees...</span>
          </>
        ) : (
          <>
            <UserCheck className="w-3.5 h-3.5 text-low" />
            <span>Simulate Legitimate User</span>
            <span className="bg-low/20 text-low text-[10px] font-bold px-1.5 py-0.5 rounded">0 FP</span>
          </>
        )}
      </button>

      {/* Reset Demo Button */}
      <button
        onClick={onReset}
        disabled={simulating || legitimateSimulating}
        className="flex items-center gap-1.5 px-3 py-2 text-xs text-muted hover:text-white border border-border rounded-lg hover:bg-border/50 transition-colors ml-auto"
        title="Reset demo telemetry, alerts, and incidents"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset Demo
      </button>
    </div>
  );
}
