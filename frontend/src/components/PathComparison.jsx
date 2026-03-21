import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

const ACTION_CONFIG = {
  SKIP:   { icon: CheckCircle,  color: 'text-brand-emerald', bg: 'bg-brand-emerald/10 border-brand-emerald/20', label: 'SKIP' },
  REVISE: { icon: TrendingUp,   color: 'text-brand-amber',   bg: 'bg-brand-amber/10 border-brand-amber/20',     label: 'REVISE' },
  LEARN:  { icon: BookOpen,     color: 'text-brand-blue',    bg: 'bg-brand-blue/10 border-brand-blue/20',       label: 'LEARN' },
};

const PathCard = ({ path, isOptimal }) => {
  const steps = path?.steps || [];
  if (!path || !steps.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-6 rounded-[28px] border flex flex-col gap-4 ${isOptimal ? 'border-brand-blue/40 bg-brand-blue/5' : 'border-surface-border'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-surface-text uppercase tracking-widest">{path.path_name}</h4>
          {isOptimal && (
            <span className="text-[10px] font-black text-brand-blue bg-brand-blue/15 px-2 py-0.5 rounded-full mt-1 inline-block tracking-wider">
              ⚡ RECOMMENDED
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-surface-text">{path.total_days}</span>
          <p className="text-[10px] text-surface-muted font-bold uppercase">Days</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Skills', value: path.skill_count },
          { label: 'Avg Difficulty', value: `${path.avg_difficulty}/5` },
          { label: 'Risk', value: `${Math.round(path.risk_score * 100)}%` },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-text/5 rounded-xl p-3 text-center">
            <span className="text-lg font-black text-surface-text block">{stat.value}</span>
            <p className="text-[10px] text-surface-muted font-bold uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Skills list */}
      <div className="flex flex-wrap gap-2">
        {steps.slice(0, 6).map((step, i) => (
          <span key={i} className="text-[11px] font-bold bg-surface-text/8 border border-surface-border px-2.5 py-1 rounded-lg text-surface-text">
            {step.skill}
            {step.transfer_applied && <span className="text-brand-emerald ml-1">⚡</span>}
          </span>
        ))}
        {steps.length > 6 && (
          <span className="text-[11px] font-bold text-surface-muted px-2">+{steps.length - 6} more</span>
        )}
      </div>

      {/* Justification */}
      {path.justification && (
        <p className="text-xs text-surface-muted italic border-t border-surface-border pt-3">
          {path.justification}
        </p>
      )}
    </motion.div>
  );
};

const PathComparison = ({ optimalPath, alternativePath }) => {
  if (!optimalPath?.steps?.length && !alternativePath?.steps?.length) return null;

  const timeSaved = Math.abs(
    (optimalPath?.total_days || 0) - (alternativePath?.total_days || 0)
  );

  return (
    <div className="container mx-auto px-6 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-[40px] border border-surface-border"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-surface-text flex items-center gap-2">
              <Zap className="text-brand-blue" size={22} />
              Multi-Path Intelligence
            </h3>
            <p className="text-sm text-surface-muted mt-1">
              {timeSaved > 0 && `Fast-track saves ${timeSaved} days vs deep-learning path.`} Choose your journey.
            </p>
          </div>
          <div className="glass px-4 py-2 rounded-full border border-brand-blue/20 text-xs font-black text-brand-blue">
            Cost-Optimized
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {optimalPath?.recommended
            ? <><PathCard path={optimalPath} isOptimal={true} /><PathCard path={alternativePath} isOptimal={false} /></>
            : <><PathCard path={alternativePath} isOptimal={false} /><PathCard path={optimalPath} isOptimal={true} /></>
          }
        </div>
      </motion.div>
    </div>
  );
};

export default PathComparison;
