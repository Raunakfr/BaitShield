import React, { useState } from 'react';
import { FileCode, Key, FileText, Globe, Trash2, Copy, Check, Eye } from 'lucide-react';
import DecoyDetailModal from './DecoyDetailModal';

export default function DecoyInventory({ decoys, onDeleteDecoy, onTestDecoy }) {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedDecoy, setSelectedDecoy] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'file': return <FileText className="w-4 h-4 text-accent" />;
      case 'credential': return <Key className="w-4 h-4 text-accent" />;
      case 'api_key': return <FileCode className="w-4 h-4 text-accent" />;
      default: return <Globe className="w-4 h-4 text-accent" />;
    }
  };

  const handleCopyAttackUrl = (e, decoy) => {
    e.stopPropagation();
    const host = window.location.hostname || 'localhost';
    const attackUrl = `http://${host}:3001/decoy/${decoy.id}`;
    navigator.clipboard.writeText(attackUrl);
    setCopiedId(decoy.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenDetail = (decoy) => {
    setSelectedDecoy(decoy);
    setDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Decoy Inventory</h2>
        <span className="bg-border text-muted text-xs font-bold px-2 py-1 rounded-full">
          {decoys.length} Deployed
        </span>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted uppercase bg-bg sticky top-0">
            <tr>
              <th className="px-3 py-3 font-medium">Name</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-surface">
            {decoys.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-muted">
                  No decoys deployed
                </td>
              </tr>
            ) : (
              decoys.map((decoy, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleOpenDetail(decoy)}
                  className="hover:bg-bg/50 transition-colors cursor-pointer group"
                >
                  <td className="px-3 py-3 font-mono text-white whitespace-nowrap">
                    <div>
                      <div className="font-bold text-xs group-hover:text-accent transition-colors flex items-center gap-1.5">
                        <span>{decoy.name || decoy.id}</span>
                      </div>
                      <div className="text-[10px] text-muted truncate max-w-[140px]">{decoy.path}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 text-muted text-xs">
                      {getTypeIcon(decoy.type)}
                      <span className="capitalize">{decoy.type || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {decoy.triggered ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-high/20 text-high border border-high/30">
                        Triggered
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-low/20 text-low border border-low/30">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetail(decoy)}
                        className="text-muted hover:text-white p-1.5 rounded hover:bg-border transition-colors"
                        title="View Full Decoy Details & Content"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleCopyAttackUrl(e, decoy)}
                        className="text-muted hover:text-accent p-1.5 rounded hover:bg-accent/10 transition-colors"
                        title="Copy Live HTTP Attack Link (for external device attack)"
                      >
                        {copiedId === decoy.id ? (
                          <Check className="w-3.5 h-3.5 text-low" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {onDeleteDecoy && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDecoy(decoy.id);
                          }}
                          className="text-muted hover:text-high p-1.5 rounded hover:bg-high/10 transition-colors"
                          title="Remove Decoy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DecoyDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        decoy={selectedDecoy}
        onDeleteDecoy={onDeleteDecoy}
        onTestDecoy={onTestDecoy}
      />
    </div>
  );
}
