import React, { useState } from 'react';
import { X, FileCode, Key, FileText, Globe, Copy, Check, ShieldAlert, ExternalLink, Trash2, Play, Clock, HardDrive, Terminal } from 'lucide-react';

export default function DecoyDetailModal({ decoy, isOpen, onClose, onDeleteDecoy, onTestDecoy }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !decoy) return null;

  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'file': return <FileText className="w-5 h-5 text-accent" />;
      case 'credential': return <Key className="w-5 h-5 text-accent" />;
      case 'api_key': return <FileCode className="w-5 h-5 text-accent" />;
      default: return <Globe className="w-5 h-5 text-accent" />;
    }
  };

  const host = window.location.hostname || 'localhost';
  const attackUrl = `http://${host}:3001/decoy/${decoy.id}`;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-surface border border-border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-xl">
              {getTypeIcon(decoy.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{decoy.name}</h2>
                {decoy.triggered ? (
                  <span className="bg-high/20 text-high border border-high/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    TRIGGERED
                  </span>
                ) : (
                  <span className="bg-low/20 text-low border border-low/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    ACTIVE DECOY
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">Digital Bait Decoy Asset Inspection</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-muted hover:text-white p-1.5 rounded-lg hover:bg-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Live HTTP Attack Link (Hero Banner) */}
          <div className="bg-bg border border-accent/40 p-4 rounded-xl space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-semibold text-white">
              <span className="flex items-center gap-1.5 text-accent">
                <ExternalLink className="w-4 h-4" />
                Live HTTP Attack Link (For Multi-PC / Mobile Attack)
              </span>
              <span className="text-[10px] text-muted font-mono">Port 3001</span>
            </div>
            
            <div className="flex items-center gap-2 bg-surface border border-border p-2.5 rounded-lg font-mono text-xs text-accent break-all">
              <span className="flex-1 truncate">{attackUrl}</span>
              <button
                onClick={() => copyToClipboard(attackUrl, 'attackUrl')}
                className="bg-accent hover:bg-[#ff8533] text-white px-3 py-1.5 rounded text-xs font-semibold font-sans flex items-center gap-1 shrink-0 transition-colors"
              >
                {copiedField === 'attackUrl' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Attack Link
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted leading-relaxed">
              Open or <code className="text-accent">curl</code> this URL from any PC or phone on the same Wi-Fi to trigger a real 100% confidence alert live on the dashboard.
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-bg border border-border p-3.5 rounded-lg space-y-1">
              <span className="text-muted text-[10px] uppercase font-sans font-semibold block flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-accent" /> Target Asset Surface
              </span>
              <span className="text-white font-bold text-sm block font-sans">
                {decoy.asset_name || 'Engineering File Share'}
              </span>
              <span className="text-muted text-[11px] block capitalize">Type: {decoy.asset_type || decoy.type}</span>
            </div>

            <div className="bg-bg border border-border p-3.5 rounded-lg space-y-1">
              <span className="text-muted text-[10px] uppercase font-sans font-semibold block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-accent" /> Planted Timestamp
              </span>
              <span className="text-white font-bold text-xs block">
                {decoy.planted_at ? new Date(decoy.planted_at).toLocaleString() : 'Active'}
              </span>
              <span className="text-muted text-[11px] block">ID: {decoy.id}</span>
            </div>
          </div>

          {/* Full Path */}
          <div className="bg-bg border border-border p-3.5 rounded-lg text-xs space-y-1 font-mono">
            <div className="flex items-center justify-between text-muted text-[10px] font-sans font-semibold uppercase">
              <span>Full Decoy Path in System</span>
              <button
                onClick={() => copyToClipboard(decoy.path, 'path')}
                className="text-muted hover:text-white flex items-center gap-1 transition-colors"
              >
                {copiedField === 'path' ? <Check className="w-3 h-3 text-low" /> : <Copy className="w-3 h-3" />}
                Copy Path
              </button>
            </div>
            <div className="text-white font-bold text-xs break-all">{decoy.path}</div>
          </div>

          {/* Decoy Content Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-accent" />
                Decoy Honey-Token Content Preview
              </span>
              <button
                onClick={() => copyToClipboard(decoy.content_preview, 'content')}
                className="text-xs text-muted hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                {copiedField === 'content' ? <Check className="w-3.5 h-3.5 text-low" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Content
              </button>
            </div>

            <div className="bg-bg border border-border p-4 rounded-xl font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-48 border-l-4 border-l-accent">
              {decoy.content_preview || 'No preview content available'}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-bg/50 flex flex-wrap items-center justify-between gap-3">
          {onDeleteDecoy && (
            <button
              onClick={() => {
                onDeleteDecoy(decoy.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-high hover:bg-high/10 border border-high/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Decoy
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {onTestDecoy && (
              <button
                onClick={() => {
                  onTestDecoy(decoy.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-accent hover:bg-[#ff8533] text-white rounded-lg transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Simulate Attack on Decoy
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold bg-border hover:bg-border/80 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
