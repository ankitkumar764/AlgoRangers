import React from 'react';
import { motion } from 'framer-motion';

const SkillRadar = ({ skills, marketMatch }) => {
  const size = 300;
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / skills.length;

  const getPoints = (data) => {
    return data.map((value, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (value / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');
  };

  const candidatePoints = getPoints(marketMatch.candidate);
  const requirementPoints = getPoints(marketMatch.requirement);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Hexagons */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <polygon
            key={i}
            points={getPoints(skills.map(() => scale * 100))}
            className="fill-none stroke-surface-border"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {skills.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              className="stroke-surface-border opacity-30"
            />
          );
        })}

        {/* Requirement Area (Market) */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.3, scale: 1 }}
          points={requirementPoints}
          className="fill-slate-500/20 stroke-slate-500"
          strokeWidth="2"
        />

        {/* Candidate Area */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          points={candidatePoints}
          className="fill-brand-blue/30 stroke-brand-blue"
          strokeWidth="3"
        />

        {/* Skill Labels */}
        {skills.map((skill, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={Math.cos(angle) > 0 ? "start" : "end"}
              alignmentBaseline="middle"
              className="fill-surface-text text-[10px] font-bold uppercase tracking-tighter"
            >
              {skill}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default SkillRadar;
