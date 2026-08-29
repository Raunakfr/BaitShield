import React from 'react';
import { Sparkles, Cpu, Bot } from 'lucide-react';

export default function IncidentAnalysis({ incidents }) {
  const latestIncident = incidents && incidents.length > 0 ? incidents[0] : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Stage 5: EXPLAIN — AI Incident Analysis</h2>
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        {latestIncident && (
          <span className="bg-accent/10 border border-accent/20 text-accent text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 font-mono">
            <Bot className="w-3.5 h-3.5" />
            {latestIncident.provider || 'Llama 3.2 (Ollama)'}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!latestIncident ? (
          <div className="bg-bg border border-border rounded-lg p-6 h-full flex flex-col items-center justify-center text-center">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse mb-3" />
            <p className="text-muted text-sm font-medium">Waiting for attacker decoy trigger telemetry...</p>
            <p className="text-xs text-muted/70 mt-1 max-w-xs">
              When an attacker touches a planted decoy, DETECT fires immediately and local Llama 3.2 synthesizes intent here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-bg border border-border rounded-lg p-5 flex-1 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
              <div className="text-xs text-muted mb-3 flex justify-between items-center border-b border-border/50 pb-2 font-mono">
                <span className="text-accent font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  INCIDENT REPORT GENERATED
                </span>
                <span>
                  {latestIncident.created_at ? new Date(latestIncident.created_at).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
              <div className="text-sm text-text leading-relaxed whitespace-pre-wrap font-sans flex-1 overflow-y-auto pr-1">
                {latestIncident.summary || latestIncident.explanation || 'Anomalous activity detected in the deception environment.'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted pt-2 border-t border-border/40">
        <span className="text-[11px] italic">100% Deterministic Triggering — Zero False Positives</span>
        <div className="flex items-center gap-1.5 font-mono">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span>Powered by Llama 3.2 (local)</span>
        </div>
      </div>
    </div>
  );
}
