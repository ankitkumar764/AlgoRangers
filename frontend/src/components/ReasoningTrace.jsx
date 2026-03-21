import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SkipForward, BookOpen, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

const ACTION_CONFIG = {
  SKIP:   { icon: SkipForward, color: 'text-brand-emerald', bg: 'bg-brand-emerald/10 border-brand-emerald/30', label: 'SKIP' },
  REVISE: { icon: RefreshCw,   color: 'text-brand-amber',   bg: 'bg-brand-amber/10 border-brand-amber/30',     label: 'REVISE' },
  LEARN:  { icon: BookOpen,    color: 'text-brand-blue',    bg: 'bg-brand-blue/10 border-brand-blue/30',       label: 'LEARN' },
};

const ReasoningCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = ACTION_CONFIG[item.action] || ACTION_CONFIG.LEARN;
  const Icon = cfg.icon;
  const gapPercent = Math.round(item.gap_magnitude * 100);
  const currentPercent = Math.round(item.current_score * 100);
  const requiredPercent = Math.round(item.required_level * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`glass border rounded-[20px] overflow-hidden ${cfg.bg}`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-surface-text/5`}>
          <Icon size={16} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-surface-text truncate">{item.skill}</span>
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-surface-text/10 text-surface-muted">
              {item.category}
            </span>
            {item.is_auto_inserted && (
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber">
                AUTO-PREREQ
              </span>
            )}
          </div>
          {/* Mini progress bar */}
          <div className="mt-1.5 h-1.5 w-full bg-surface-text/10 rounded-full overflow-hidden max-w-[160px]">
            <div className="h-full bg-brand-blue/50 rounded-full relative">
              <motion.div
                className={`absolute top-0 left-0 h-full rounded-full ${item.action === 'SKIP' ? 'bg-brand-emerald' : 'bg-brand-blue'}`}
                initial={{ width: 0 }}
                animate={{ width: `${currentPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <span className={`text-sm font-black ${cfg.color}`}>{currentPercent}%</span>
            <p className="text-[9px] text-surface-muted">/{requiredPercent}%</p>
          </div>
          <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
            {item.action}
          </span>
          {expanded ? <ChevronUp size={14} className="text-surface-muted" /> : <ChevronDown size={14} className="text-surface-muted" />}
        </div>
      </button>

      {/* Expanded reasoning */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 overflow-hidden"
          >
            <div className="pt-3 border-t border-surface-border/50 space-y-2">
              {item.reasons?.map((reason, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-surface-muted">
                  <ArrowRight size={10} className="text-brand-blue mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-surface-border/30">
                <div className="text-center">
                  <span className="text-xs font-black text-surface-text">{item.learning_time}d</span>
                  <p className="text-[9px] text-surface-muted">Learning Time</p>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-surface-text">{item.difficulty}/5</span>
                  <p className="text-[9px] text-surface-muted">Difficulty</p>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-surface-text">{Math.round(item.importance * 100)}%</span>
                  <p className="text-[9px] text-surface-muted">Importance</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ReasoningTrace = ({ trace }) => {
  const [showAll, setShowAll] = useState(false);
  if (!trace?.length) return null;

  const learnCount = trace.filter(t => t.action === 'LEARN').length;
  const reviseCount = trace.filter(t => t.action === 'REVISE').length;
  const skipCount = trace.filter(t => t.action === 'SKIP').length;
  const displayed = showAll ? trace : trace.slice(0, 5);

  return (
    <div className="container mx-auto px-6 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-8 rounded-[40px] border border-surface-border"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-surface-text flex items-center gap-2">
              <BookOpen className="text-brand-blue" size={22} />
              Reasoning Trace
            </h3>
            <p className="text-sm text-surface-muted mt-1">Every decision is explainable. Click any skill to see why.</p>
          </div>
          <div className="flex gap-2">
            {[['LEARN', learnCount, 'text-brand-blue','bg-brand-blue/10'], ['REVISE', reviseCount, 'text-brand-amber','bg-brand-amber/10'], ['SKIP', skipCount, 'text-brand-emerald','bg-brand-emerald/10']].map(([label, count, color, bg]) => (
              <div key={label} className={`${bg} px-3 py-1.5 rounded-xl text-center`}>
                <span className={`text-sm font-black ${color} block`}>{count}</span>
                <p className={`text-[9px] font-black uppercase ${color}`}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {displayed.map((item, i) => (
            <ReasoningCard key={item.skill} item={item} index={i} />
          ))}
        </div>

        {trace.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full text-center text-xs font-bold text-brand-blue hover:text-brand-blue/80 transition-colors py-2"
          >
            {showAll ? 'Show Less' : `Show ${trace.length - 5} More Skills`}
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ReasoningTrace;
