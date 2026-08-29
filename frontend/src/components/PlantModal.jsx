import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Sparkles, FileCode, CheckCircle2, Loader2 } from 'lucide-react';
import { getAssets, plantDecoy } from '../lib/api';

export default function PlantModal({ isOpen, onClose, onDecoyPlanted, defaultAssetId }) {
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [plantedResult, setPlantedResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getAssets().then(data => {
        setAssets(data);
        if (defaultAssetId) setSelectedAssetId(defaultAssetId);
        else if (data.length > 0) setSelectedAssetId(data[0].id);
      }).catch(e => console.error('Failed to fetch assets:', e));
      setPlantedResult(null);
    }
  }, [isOpen, defaultAssetId]);

  if (!isOpen) return null;

  const handlePlant = async () => {
    if (!selectedAssetId) return;
    setLoading(true);
    try {
      const res = await plantDecoy(selectedAssetId, customContext);
      setPlantedResult(res);
      if (onDecoyPlanted) onDecoyPlanted(res.decoy);
    } catch (e) {
      console.error('Planting failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-surface border border-border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-accent/10 border border-accent/20 rounded-lg text-accent">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Stage 2: PLANT — AI Decoy Generator
              </h2>
              <p className="text-xs text-muted">Generate context-aware honey-tokens blending into realistic naming conventions</p>
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
          {!plantedResult ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Select Target Asset Surface
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-bg border border-border text-white text-sm rounded-lg p-3 focus:outline-none focus:border-accent"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type}) — {a.path}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Decoy Purpose / Attacker Bait Context (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prod database credentials with fake AWS secret keys"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  className="w-full bg-bg border border-border text-white text-sm rounded-lg p-3 focus:outline-none focus:border-accent placeholder:text-muted/60"
                />
              </div>

              <div className="bg-bg border border-border p-4 rounded-lg flex items-start gap-3 text-xs text-muted">
                <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">How Llama 3.2 Decoy Generation Works:</span>
                  <p className="mt-0.5">
                    Llama 3.2 inspects the selected asset's directory structure and generates realistic bait (e.g. <code className="text-accent font-mono">deployment-prod.env</code> with synthetic DB credentials). When an attacker accesses this fake file, DETECT fires instantly without false positives.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex items-center gap-2 text-low font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5 text-low" />
                <span>Decoy Successfully Generated & Planted!</span>
              </div>

              <div className="bg-bg border border-border p-4 rounded-lg space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted">Decoy Name:</span>
                  <span className="text-accent font-bold">{plantedResult.decoy.name}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted">Planted Path:</span>
                  <span className="text-white">{plantedResult.decoy.path}</span>
                </div>
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted">Decoy Type:</span>
                  <span className="text-white capitalize">{plantedResult.decoy.type}</span>
                </div>

                <div>
                  <span className="text-muted block mb-1 font-sans font-semibold">Decoy Content Preview:</span>
                  <pre className="bg-surface border border-border p-3 rounded text-[11px] text-gray-300 overflow-x-auto whitespace-pre-wrap">
                    {plantedResult.decoy.content_preview}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border bg-bg/50 flex justify-end gap-3">
          {!plantedResult ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold border border-border text-muted hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePlant}
                disabled={loading}
                className="px-6 py-2 text-xs font-bold bg-accent hover:bg-[#ff8533] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating AI Decoy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate & Plant Decoy
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPlantedResult(null)}
                className="px-4 py-2 text-xs font-semibold border border-border text-muted hover:text-white rounded-lg transition-colors"
              >
                Plant Another Decoy
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 text-xs font-bold bg-accent hover:bg-[#ff8533] text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
