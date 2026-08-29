import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AttackGraph({ graphData }) {
  const hasData = graphData && graphData.nodes && graphData.nodes.length > 0;

  if (!hasData) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-muted">
        <ShieldAlert className="w-8 h-8 mb-2 opacity-40 text-accent" />
        <p className="text-sm font-semibold text-white">No Attack Path Traversal</p>
        <p className="text-xs text-muted mt-1">Simulate an attack or trigger a decoy to generate graph nodes</p>
      </div>
    );
  }

  const nodes = graphData.nodes || [];
  const edges = graphData.links || graphData.edges || [];

  // Wider SVG canvas to fit full IP addresses without truncation
  const width = 720;
  const height = 250;

  const nodePositions = new Map();

  nodes.forEach((node, idx) => {
    const isAttacker = node.type === 'attacker' || node.id === 'attacker';
    if (isAttacker) {
      nodePositions.set(node.id, {
        x: 100,
        y: height / 2,
        label: node.label || `Attacker (${node.ip || '192.168.1.200'})`,
        type: 'attacker'
      });
    } else {
      const stepIndex = idx;
      const totalDecoys = nodes.length - 1;
      const spacingX = Math.min(140, (width - 240) / Math.max(1, totalDecoys));
      const x = 240 + (stepIndex - 1) * spacingX;
      // Stagger Y positions slightly for clean layout
      const y = height / 2 + (stepIndex % 2 === 0 ? 38 : -38);
      nodePositions.set(node.id, {
        x,
        y,
        label: node.label || node.id,
        type: 'decoy',
        severity: node.severity
      });
    }
  });

  return (
    <div className="w-full h-full relative flex items-center justify-center p-2 bg-[#162440] rounded-lg overflow-hidden">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="22"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#F97316" />
          </marker>

          <filter id="glow-attacker" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="glow-decoy" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Draw Edges */}
        {edges.map((edge, idx) => {
          const sourcePos = nodePositions.get(edge.source);
          const targetPos = nodePositions.get(edge.target);

          if (!sourcePos || !targetPos) return null;

          const midX = (sourcePos.x + targetPos.x) / 2;
          const midY = (sourcePos.y + targetPos.y) / 2 - 12;

          return (
            <g key={idx}>
              {/* Path line */}
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="#F97316"
                strokeWidth="2"
                strokeDasharray="4 2"
                opacity="0.8"
                markerEnd="url(#arrow)"
              />

              {/* Action label badge */}
              {edge.label && (
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-26"
                    y="-9"
                    width="52"
                    height="18"
                    rx="4"
                    fill="#0F1F38"
                    stroke="#F97316"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#F97316"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {edge.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Draw Nodes */}
        {Array.from(nodePositions.entries()).map(([id, pos]) => {
          const isAttacker = pos.type === 'attacker';
          const circleColor = isAttacker ? '#EF4444' : '#F97316';
          const strokeColor = isAttacker ? '#FCA5A5' : '#FFEDD5';

          return (
            <g key={id} transform={`translate(${pos.x}, ${pos.y})`} className="cursor-pointer">
              {/* Outer pulsing ring */}
              <circle
                r="15"
                fill={circleColor}
                opacity="0.3"
                filter={isAttacker ? 'url(#glow-attacker)' : 'url(#glow-decoy)'}
              >
                <animate attributeName="r" values="13;18;13" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Node Circle */}
              <circle
                r="11"
                fill={circleColor}
                stroke={strokeColor}
                strokeWidth="2"
              />

              {/* Node Icon */}
              {isAttacker ? (
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">☠</text>
              ) : (
                <circle r="3.5" fill="#FFFFFF" />
              )}

              {/* Node Label — Full IP / Decoy Name rendered without truncation */}
              <text
                x="0"
                y="26"
                textAnchor="middle"
                fill="#F8FAFC"
                fontSize="10.5"
                fontWeight="700"
                fontFamily="monospace"
              >
                {pos.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
