import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AlertsList({ alerts }) {
  const getSeverityStyle = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-high/20 text-high';
      case 'medium': return 'bg-med/20 text-med';
      case 'low': return 'bg-low/20 text-low';
      default: return 'bg-muted/20 text-muted';
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'just now';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
        {alerts.length > 0 && (
          <span className="bg-accent/20 text-accent text-xs font-bold px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {alerts.length === 0 ? (
          <div className="text-muted text-sm text-center py-8">
            No alerts yet — run the simulation
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <div key={idx} className="bg-bg border border-border p-3 rounded-lg flex gap-3 animate-[fadeIn_0.3s_ease-out]">
              <div className="mt-0.5">
                <AlertTriangle className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${getSeverityStyle(alert.severity)}`}>
                    {alert.severity || 'MEDIUM'}
                  </span>
                  <span className="text-xs text-muted whitespace-nowrap ml-2">
                    {getTimeAgo(alert.timestamp)}
                  </span>
                </div>
                <div className="text-sm font-mono text-white truncate">
                  {alert.decoy_name || alert.target || 'Unknown Decoy'}
                </div>
                <div className="text-xs text-muted flex justify-between mt-1">
                  <span>{alert.action || 'ACCESS'}</span>
                  <span className="truncate ml-2">{alert.source_ip || alert.source || 'unknown'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
