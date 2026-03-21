import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Target, Lightbulb, Clock, BarChart2, AlertTriangle, Zap } from 'lucide-react';

const ACTION_COLOR = {
  learn:  { bg: 'bg-brand-blue/10 border-brand-blue/20', text: 'text-brand-blue', label: 'LEARN' },
  revise: { bg: 'bg-brand-amber/10 border-brand-amber/20', text: 'text-brand-amber', label: 'REVISE' },
  skip:   { bg: 'bg-brand-emerald/10 border-brand-emerald/20', text: 'text-brand-emerald', label: 'SKIP' },
};

const DIFF_LABEL = ['', 'Beginner', 'Easy', 'Intermediate', 'Advanced', 'Expert'];

const ThinkingDrawer = ({ isOpen, onClose, stepData }) => {
  const actionCfg = ACTION_COLOR[(stepData?.type || 'learn').toLowerCase()] || ACTION_COLOR.learn;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-surface-border z-[1002] shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 backdrop-blur-xl bg-surface-bg/80 border-b border-surface-border px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Brain className="text-brand-blue" size={22} />
                <h2 className="text-lg font-black text-surface-text">AI Reasoning Trace</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-text/5 rounded-full transition-colors"
                aria-label="Close drawer"
              >
                <X size={20} className="text-surface-muted" />
              </button>
            </div>

            {stepData ? (
              <div className="p-6 space-y-6">
                {/* Skill Name + Action Badge */}
                <div className={`border rounded-2xl p-4 ${actionCfg.bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-black text-surface-text">{stepData.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${actionCfg.bg} ${actionCfg.text}`}>
                      {actionCfg.label}
                    </span>
                  </div>
                  {stepData.category && (
                    <p className="text-xs text-surface-muted font-bold uppercase tracking-wider">{stepData.category}</p>
                  )}
                </div>

                {/* Skill Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {stepData.learning_time != null && (
                    <div className="glass border border-surface-border rounded-2xl p-4 flex items-center gap-3">
                      <Clock size={18} className="text-brand-blue flex-shrink-0" />
                      <div>
                        <span className="text-lg font-black text-surface-text block">{stepData.learning_time}d</span>
                        <p className="text-[10px] text-surface-muted font-bold uppercase">Learning Time</p>
                      </div>
                    </div>
                  )}
                  {stepData.difficulty != null && (
                    <div className="glass border border-surface-border rounded-2xl p-4 flex items-center gap-3">
                      <BarChart2 size={18} className="text-brand-amber flex-shrink-0" />
                      <div>
                        <span className="text-lg font-black text-surface-text block">{stepData.difficulty}/5</span>
                        <p className="text-[10px] text-surface-muted font-bold uppercase">{DIFF_LABEL[stepData.difficulty] || 'Difficulty'}</p>
                      </div>
                    </div>
                  )}
                  {stepData.importance != null && (
                    <div className="glass border border-surface-border rounded-2xl p-4 flex items-center gap-3">
                      <Target size={18} className="text-brand-emerald flex-shrink-0" />
                      <div>
                        <span className="text-lg font-black text-surface-text block">{Math.round(stepData.importance * 100)}%</span>
                        <p className="text-[10px] text-surface-muted font-bold uppercase">JD Importance</p>
                      </div>
                    </div>
                  )}
                  {stepData.transfer_applied && (
                    <div className="glass border border-brand-emerald/20 bg-brand-emerald/5 rounded-2xl p-4 flex items-center gap-3">
                      <Zap size={18} className="text-brand-emerald flex-shrink-0" />
                      <div>
                        <span className="text-sm font-black text-brand-emerald block">Active</span>
                        <p className="text-[10px] text-surface-muted font-bold uppercase">Transfer Learning</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reasoning */}
                {stepData.reasoning && (
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-black text-brand-blue uppercase tracking-widest mb-3">
                      <Lightbulb size={14} />
                      Why This Skill?
                    </h4>
                    <div className="glass border border-surface-border rounded-2xl p-4">
                      <p className="text-sm text-surface-muted leading-relaxed">{stepData.reasoning}</p>
                    </div>
                  </div>
                )}

                {/* Auto-inserted prerequisite warning */}
                {stepData.is_prerequisite && (
                  <div className="flex items-start gap-3 bg-brand-amber/10 border border-brand-amber/20 rounded-2xl p-4">
                    <AlertTriangle size={16} className="text-brand-amber mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-brand-amber">Auto-Inserted Prerequisite</p>
                      <p className="text-xs text-surface-muted mt-1">
                        This skill was not in your resume or the JD, but is required as a foundation for other skills in your path. The system added it automatically.
                      </p>
                    </div>
                  </div>
                )}

                {/* Transfer note */}
                {stepData.transfer_note && (
                  <div className="flex items-start gap-3 bg-brand-emerald/10 border border-brand-emerald/20 rounded-2xl p-4">
                    <Zap size={16} className="text-brand-emerald mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-surface-muted">{stepData.transfer_note}</p>
                  </div>
                )}

                {/* Resource Link */}
                {stepData.resource_link && (
                  <a
                    href={stepData.resource_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-cyan to-brand-blue text-white py-3.5 rounded-2xl font-black text-sm hover:brightness-110 transition-all"
                  >
                    <Lightbulb size={16} />
                    Start Learning →
                  </a>
                )}

                <p className="text-[10px] text-surface-muted font-bold uppercase tracking-widest text-center pt-4 border-t border-surface-border">
                  Logic powered by AlgoRangers SkillGraph Engine v2.0
                </p>
              </div>
            ) : (
              <div className="p-6 text-center text-surface-muted text-sm pt-20">
                <Brain size={40} className="text-surface-muted mx-auto mb-4 opacity-40" />
                <p>Select a roadmap step to see its reasoning.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThinkingDrawer;
