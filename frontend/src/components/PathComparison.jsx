import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BookOpen, CheckCircle, Clock, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';

const PathCard = ({ path, isRecommended, title }) => {
  const steps = path?.steps || [];
  if (!path || !steps.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass p-8 rounded-[28px] border flex flex-col gap-6 w-full ${isRecommended ? 'border-brand-blue/40 bg-brand-blue/5' : 'border-surface-border'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xl font-black text-surface-text tracking-widest">{title}</h4>
          {isRecommended && (
            <span className="text-[10px] font-black text-brand-blue bg-brand-blue/15 px-3 py-1 rounded-full mt-2 inline-block tracking-widest uppercase">
              ⚡ RECOMMENDED BY AI
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-brand-blue">{Math.round(path.total_days)}</span>
          <p className="text-xs text-surface-muted font-bold uppercase tracking-widest">Days Required</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Skills Engineered', value: path.skill_count },
          { label: 'Avg Difficulty', value: `${path.avg_difficulty}/5` },
          { label: 'Risk Factor', value: `${Math.round(path.risk_score * 100)}%` },
        ].map(stat => (
          <div key={stat.label} className="bg-surface-text/5 rounded-2xl p-4 text-center border border-surface-border/50">
            <span className="text-2xl font-black text-surface-text block">{stat.value}</span>
            <p className="text-[10px] text-surface-muted font-bold uppercase tracking-widest leading-tight mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Logic Tracing list */}
      <div>
        <h5 className="text-[10px] uppercase font-black tracking-widest text-surface-muted mb-3">Computed Skill Trace</h5>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, i) => (
            <span key={i} className="text-[11px] font-bold bg-surface-text/[0.08] border border-surface-border px-3 py-1.5 rounded-xl text-surface-text">
              {step.skill}
              {step.transfer_applied && <span className="text-brand-emerald ml-1">⚡</span>}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const PathComparison = ({ optimalPath, alternativePath }) => {
  if (!optimalPath?.steps?.length && !alternativePath?.steps?.length) return null;

  // Determine which is fast and which is deep based on days OR backend flag
  const optDays = optimalPath?.total_days || 0;
  const altDays = alternativePath?.total_days || 0;
  
  const isOptimalFast = optDays <= altDays;
  const fastPath = isOptimalFast ? optimalPath : alternativePath;
  const deepPath = isOptimalFast ? alternativePath : optimalPath;
  
  const [activeTab, setActiveTab] = useState('fast'); // 'fast' | 'deep'

  return (
    <div className="container mx-auto px-6 mt-12 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-10 rounded-[40px] border border-surface-border"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <h3 className="text-2xl font-black text-surface-text flex items-center gap-3">
              <Cpu className="text-brand-cyan" size={28} />
              Alternative Path Computation
            </h3>
            <div className="bg-[#0a0a0a] border border-surface-border p-3 rounded-xl mt-4 inline-flex">
              <pre className="text-xs text-brand-emerald font-mono">
                {`{
  "fast_time": "${Math.round(fastPath?.total_days || 0)} days",
  "deep_time": "${Math.round(deepPath?.total_days || 0)} days",
  "delta": "${Math.round(Math.abs((deepPath?.total_days || 0) - (fastPath?.total_days || 0)))} days"
}`}
              </pre>
            </div>
          </div>
          
          <div className="flex bg-surface-text/5 p-1.5 rounded-2xl border border-surface-border self-stretch md:self-auto">
            <button 
              onClick={() => setActiveTab('fast')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'fast' ? 'bg-brand-blue text-white shadow-lg' : 'text-surface-muted hover:text-surface-text'}`}
            >
              Fast Track
            </button>
            <button 
              onClick={() => setActiveTab('deep')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'deep' ? 'bg-brand-blue text-white shadow-lg' : 'text-surface-muted hover:text-surface-text'}`}
            >
              Deep Learning
            </button>
          </div>
        </div>

        <div className="w-full relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'fast' ? (
              <PathCard key="fast" path={fastPath} isRecommended={isOptimalFast && fastPath.recommended} title="Fast Track" />
            ) : (
              <PathCard key="deep" path={deepPath} isRecommended={!isOptimalFast && deepPath.recommended} title="Deep Learning" />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PathComparison;
