import React, { useState } from 'react';
import { X, Search, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { analyzeEnvironment } from '../lib/api';

export default function AnalyzeModal({ isOpen, onClose, onPlantRecommendation }) {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const res = await analyzeEnvironment();
      setAnalysisResult(res);
    } catch (e) {
      console.error('Failed to run analysis:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-surface border border-border w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg text-accent">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Stage 1: ANALYZE — Environment Vulnerability Scan
              </h2>
              <p className="text-xs text-muted">Scan attack surface exposure and identify uncovered high-risk assets</p>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!analysisResult && !loading && (
            <div className="text-center py-10 space-y-4">
              <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto text-accent">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Scan Deception Coverage & Vulnerabilities</h3>
                <p className="text-sm text-muted max-w-md mx-auto mt-1">
                  Llama 3.2 AI scans all 5 simulated company assets, checks active decoy protection, and prioritizes uncovered attack surfaces for decoy planting.
                </p>
              </div>
              <button
                onClick={handleRunAnalysis}
                className="bg-accent hover:bg-[#ff8533] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 mx-auto"
              >
                <Search className="w-4 h-4" />
                Scan Environment & Analyze Exposure
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3">
              <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto" />
              <p className="text-sm font-medium text-white">AI Engine Scanning Deception Environment...</p>
              <p className="text-xs text-muted">Checking active honey-tokens against high-value target assets</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-bg border border-border p-3 rounded-lg text-xs">
                <span className="text-muted">AI Intelligence Engine:</span>
                <span className="font-semibold text-accent flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {analysisResult.provider || 'Claude API (Anthropic)'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-muted">
                Attack Paths & Protection Status
              </h3>

              <div className="space-y-3">
                {analysisResult.attackPaths?.map((path, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg flex flex-col gap-2 border transition-all ${
                      !path.is_covered
                        ? 'bg-accent/5 border-accent/40 shadow-sm'
                        : 'bg-bg border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!path.is_covered ? (
                          <AlertCircle className="w-5 h-5 text-accent shrink-0" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-low shrink-0" />
                        )}
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {path.path}
                          </h4>
                          <span className="text-[11px] text-muted font-mono">{path.asset_name} ({path.asset_type})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!path.is_covered ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-accent/20 text-accent border border-accent/40 animate-pulse">
                            UNCOVERED EXPOSURE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-low/20 text-low border border-low/30">
                            PROTECTED
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          path.risk_level === 'HIGH' ? 'bg-high/20 text-high' : 'bg-med/20 text-med'
                        }`}>
                          {path.risk_level}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted leading-relaxed">{path.reason}</p>

                    <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        {!path.is_covered ? (
                          <span className="text-accent font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Rec: {path.recommended_decoy}
                          </span>
                        ) : (
                          <span className="text-low font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Decoys: {path.existing_decoys?.join(', ')}
                          </span>
                        )}
                      </div>

                      {onPlantRecommendation && (
                        <button
                          onClick={() => {
                            onPlantRecommendation(path.asset_id, path.recommended_decoy);
                            onClose();
                          }}
                          className={`flex items-center gap-1 font-semibold text-xs px-3 py-1 rounded-md transition-colors ${
                            !path.is_covered
                              ? 'bg-accent hover:bg-[#ff8533] text-white shadow'
                              : 'text-muted hover:text-white border border-border'
                          }`}
                        >
                          {!path.is_covered ? 'Plant Decoy Now (Reach 100%)' : 'Add Decoy'} <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg/50 flex justify-end gap-2">
          {analysisResult && (
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-muted hover:text-white border border-border rounded-lg transition-colors"
            >
              Re-scan
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
  );
}
