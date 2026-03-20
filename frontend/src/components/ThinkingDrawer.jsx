import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Target, Lightbulb } from 'lucide-react';

const ThinkingDrawer = ({ isOpen, onClose, stepData }) => {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1001]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md glass border-l border-surface-border z-[1002] shadow-2xl p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <Brain className="text-brand-blue" size={24} />
                <h2 className="text-xl font-black text-surface-text">AI Reasoning Trace</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-text/5 rounded-full transition-colors"
              >
                <X size={20} className="text-surface-muted" />
              </button>
            </div>

            {stepData && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-4">Focus Area</h3>
                  <div className="glass p-4 rounded-2xl border-brand-blue/20 bg-brand-blue/5">
                    <p className="font-bold text-surface-text">{stepData.title}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Target size={20} className="text-brand-amber" />
                    </div>
                    <div>
                      <h4 className="font-black text-surface-text text-sm mb-1">Gap Analysis</h4>
                      <p className="text-sm text-surface-muted leading-relaxed">
                        The AI detected that while you have basic knowledge of {stepData.title}, the job description requires advanced proficiency in performance optimization and architectural patterns.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Lightbulb size={20} className="text-brand-emerald" />
                    </div>
                    <div>
                      <h4 className="font-black text-surface-text text-sm mb-1">Strategic Recommendation</h4>
                      <p className="text-sm text-surface-muted leading-relaxed">
                        Priority {stepData.type === 'learn' ? 'High' : 'Medium'}. Master these concepts to increase your interview readiness by approximately 15%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-surface-border">
                  <p className="text-[10px] text-surface-muted font-black uppercase tracking-widest text-center">
                    Logic powered by SkillGraph Engine v2.4
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ThinkingDrawer;
