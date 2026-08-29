import React from 'react';
import { ShieldAlert, Terminal, Eye, KeyRound, ListFilter, Clock } from 'lucide-react';

export default function AttackTimeline({ alerts }) {
  const getActionIcon = (action) => {
    switch (action?.toUpperCase()) {
      case 'AUTH_ATTEMPT': return <KeyRound className="w-4 h-4 text-high" />;
      case 'READ': return <Eye className="w-4 h-4 text-accent" />;
      case 'LIST': return <ListFilter className="w-4 h-4 text-med" />;
      default: return <Terminal className="w-4 h-4 text-muted" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH': return 'bg-high/20 text-high border-high/30';
      case 'MEDIUM': case 'MED': return 'bg-med/20 text-med border-med/30';
      case 'LOW': return 'bg-low/20 text-low border-low/30';
      default: return 'bg-muted/20 text-muted border-muted/30';
    }
  };

  const formattedAlerts = [...alerts].reverse(); // Oldest first for timeline progression

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>Attack Timeline (TRACE Stage)</span>
        </h2>
        {alerts.length > 0 && (
          <span className="text-xs text-muted flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            {alerts.length} Step Sequence
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 relative">
        {formattedAlerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-lg">
            <ShieldAlert className="w-8 h-8 text-muted mb-2 opacity-50" />
            <p className="text-sm font-medium text-white">No Threat Trajectory Telemetry</p>
            <p className="text-xs text-muted mt-1">Run the attacker simulation to visualize the intrusion loop timeline</p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {formattedAlerts.map((alert, idx) => (
              <div key={idx} className="relative flex items-start gap-4 animate-[fadeIn_0.3s_ease-out]">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-surface border border-accent flex items-center justify-center shadow-lg z-10">
                  {getActionIcon(alert.action)}
                </div>

                {/* Timeline content card */}
                <div className="flex-1 bg-bg border border-border p-3.5 rounded-lg">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-accent">Step {idx + 1}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity || 'HIGH'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-muted">
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                    </span>
                  </div>

                  <div className="text-sm font-mono font-semibold text-white mb-1">
                    {alert.decoy_name || alert.target || 'Decoy Asset'}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted font-mono pt-1 border-t border-border/40">
                    <span className="text-accent font-semibold">{alert.action || 'READ'}</span>
                    <span>Src: {alert.source_ip || '192.168.1.200'} ({alert.source_host || 'attacker'})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
