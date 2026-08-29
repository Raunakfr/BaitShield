import React from 'react';
import { Shield, Search, PlusCircle, UserCheck, LogOut } from 'lucide-react';

export default function Header({ connected, user, onLogout, onOpenAnalyze, onOpenPlant }) {
  return (
    <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield className="text-accent w-7 h-7" />
          <h1 className="text-white font-bold text-xl tracking-tight">BaitShield</h1>
          <span className="bg-accent/20 text-accent text-xs font-semibold px-2 py-0.5 rounded border border-accent/30">
            DEMO MVP
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAnalyze}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-bg hover:bg-border text-xs font-semibold text-white border border-border rounded-lg transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-accent" />
          <span>Stage 1: Analyze</span>
        </button>

        <button
          onClick={onOpenPlant}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-bg hover:bg-border text-xs font-semibold text-white border border-border rounded-lg transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 text-accent" />
          <span>Stage 2: Plant Decoy</span>
        </button>

        <div className="h-5 w-px bg-border mx-1" />

        <div className="flex items-center gap-2 bg-bg px-3 py-1.5 rounded-lg border border-border">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-low animate-pulse' : 'bg-muted'}`} />
          <span className="text-xs font-medium text-muted font-mono">
            {connected ? 'WebSocket Live' : 'Disconnected'}
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-2 border-l border-border pl-3">
            <div className="flex items-center gap-1.5 bg-low/10 border border-low/30 text-low px-2.5 py-1 rounded-lg text-xs font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{user.username || 'admin'} (2FA)</span>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="text-muted hover:text-white p-1.5 rounded-lg hover:bg-border transition-colors"
                title="Logout from SOC Console"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
