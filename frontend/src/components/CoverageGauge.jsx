import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

export default function CoverageGauge({ coverage, decoys }) {
  const percentage = coverage?.percentage || 0;
  const covered = coverage?.covered || 0;
  const total = coverage?.total || 0;
  
  const triggeredCount = decoys.filter(d => d.triggered).length;
  const plantedCount = decoys.length;

  const data = [
    { name: 'Coverage', value: percentage, fill: '#F97316' }
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-white self-start mb-4">Deception Coverage</h2>
      
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: '#1E3054' }} dataKey="value" cornerRadius={5} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-accent">{percentage}%</span>
        </div>
      </div>
      
      <p className="text-sm text-muted mt-2 text-center">
        {covered} of {total} attack surfaces covered
      </p>

      <div className="flex items-center gap-4 mt-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-muted">Planted</span>
          <span className="font-semibold text-white">{plantedCount}</span>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="flex flex-col items-center">
          <span className="text-muted">Triggered</span>
          <span className="font-semibold text-high">{triggeredCount}</span>
        </div>
      </div>
    </div>
  );
}
