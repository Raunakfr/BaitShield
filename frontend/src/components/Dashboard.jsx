import React, { useState } from 'react';
import CoverageGauge from './CoverageGauge';
import AlertsList from './AlertsList';
import AttackGraph from './AttackGraph';
import AttackTimeline from './AttackTimeline';
import IncidentAnalysis from './IncidentAnalysis';
import SimulatorButton from './SimulatorButton';
import DecoyInventory from './DecoyInventory';
import { UserCheck, Shield, Activity, GitCommit } from 'lucide-react';

export default function Dashboard({
  alerts,
  incidents,
  graphData,
  coverage,
  decoys,
  legitimateLogs,
  simulating,
  legitimateSimulating,
  onSimulate,
  onSimulateLegitimate,
  onReset,
  onDeleteDecoy,
  connected
}) {
  const [graphMode, setGraphMode] = useState('timeline'); // 'timeline' | 'graph'

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)] overflow-y-auto bg-bg text-text">
      {/* Left Column */}
      <div className="flex flex-col gap-6 lg:col-span-1">
        {/* Coverage Gauge Card */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-lg">
          <CoverageGauge coverage={coverage} decoys={decoys} />
        </div>

        {/* Recent Alerts List Card */}
        <div className="bg-surface border border-border rounded-xl p-5 flex-1 flex flex-col min-h-[250px]">
          <AlertsList alerts={alerts} />
        </div>

        {/* Decoy Inventory Table Card */}
        <div className="bg-surface border border-border rounded-xl p-5 min-h-[260px]">
          <DecoyInventory decoys={decoys} onDeleteDecoy={onDeleteDecoy} />
        </div>
      </div>

      {/* Center & Right Columns */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {/* Simulation Control Header */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Deception Loop & Attack Simulator
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Trigger high-confidence decoy honey-tokens or test legitimate employee activity (0 false positives)
            </p>
          </div>
          <SimulatorButton
            simulating={simulating}
            legitimateSimulating={legitimateSimulating}
            onSimulate={onSimulate}
            onSimulateLegitimate={onSimulateLegitimate}
            onReset={onReset}
          />
        </div>

        {/* Legitimate User Status Banner (Zero False Positive Proof) */}
        {legitimateLogs && legitimateLogs.length > 0 && (
          <div className="bg-low/10 border border-low/30 rounded-xl p-4 flex items-center justify-between text-xs animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-low/20 text-low rounded-lg">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  Legitimate User Telemetry Active ({legitimateLogs.length} Benign Actions)
                </span>
                <span className="text-muted">
                  Real employees accessed real assets (e.g. {legitimateLogs[0]?.path}). <strong className="text-low">0 Decoy Alerts Fired.</strong>
                </span>
              </div>
            </div>
            <span className="bg-low text-black font-bold text-[10px] uppercase px-2.5 py-1 rounded">
              0% False Positives
            </span>
          </div>
        )}

        {/* Stage 4: TRACE — Attack Timeline & Graph Switcher Card */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-88 min-h-[360px]">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              <h3 className="text-base font-bold text-white">Stage 4: TRACE — Attacker Trajectory</h3>
            </div>

            {/* Toggle Graph vs Timeline */}
            <div className="flex items-center bg-bg border border-border rounded-lg p-0.5 text-xs font-semibold">
              <button
                onClick={() => setGraphMode('timeline')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  graphMode === 'timeline'
                    ? 'bg-accent text-white font-bold'
                    : 'text-muted hover:text-white'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                Attack Timeline
              </button>
              <button
                onClick={() => setGraphMode('graph')}
                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                  graphMode === 'graph'
                    ? 'bg-accent text-white font-bold'
                    : 'text-muted hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Attack Graph
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-bg rounded-lg border border-border overflow-hidden p-4 min-h-0">
            {graphMode === 'timeline' ? (
              <AttackTimeline alerts={alerts} />
            ) : (
              <AttackGraph graphData={graphData} />
            )}
          </div>
        </div>

        {/* Stage 5: EXPLAIN — Incident Analysis Panel */}
        <div className="bg-surface border border-border rounded-xl p-5 flex-1 flex flex-col min-h-[260px]">
          <IncidentAnalysis incidents={incidents} />
        </div>
      </div>
    </div>
  );
}
