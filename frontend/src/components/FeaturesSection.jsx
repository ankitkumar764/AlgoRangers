import React from 'react';
import { motion } from 'framer-motion';
import { Brain, GitGraph, ShieldAlert, Zap, Target, Clock } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10 border-brand-blue/20',
    title: 'Confidence Scoring Engine',
    desc: 'Not just keyword matching. We analyze skill frequency, project context, and years of experience to compute a real confidence score for every skill.'
  },
  {
    icon: GitGraph,
    color: 'text-brand-cyan',
    bg: 'bg-brand-cyan/10 border-brand-cyan/20',
    title: 'Dependency Graph (DAG)',
    desc: 'Skills have prerequisites. Our graph engine uses topological sort to enforce correct learning order — no one learns React before JavaScript here.'
  },
  {
    icon: Target,
    color: 'text-brand-amber',
    bg: 'bg-brand-amber/10 border-brand-amber/20',
    title: 'Cost-Based Path Optimization',
    desc: 'Two paths, one goal. Fast-track (Path A) minimizes time. Deep-learning (Path B) maximizes mastery. You choose based on your timeline.'
  },
  {
    icon: ShieldAlert,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    title: 'Risk & Failure Prediction',
    desc: 'Detects weak prerequisites, steep difficulty jumps, and inconsistent skill profiles before you even start learning — so you never get blindsided.'
  },
  {
    icon: Zap,
    color: 'text-brand-emerald',
    bg: 'bg-brand-emerald/10 border-brand-emerald/20',
    title: 'Transfer Learning Detection',
    desc: 'Already know Java? Learning Node.js takes 3 fewer days. Your existing knowledge accelerates your path automatically.'
  },
  {
    icon: Clock,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Time-to-Competency Model',
    desc: 'Every skill has a calculated learning time including difficulty penalties and dependency overhead. You get an exact day estimate to job readiness.'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features-section" className="container mx-auto px-6 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 px-4 py-2 rounded-full border border-brand-blue/20 text-brand-blue text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Core Intelligence Modules
        </div>
        <h2 className="text-4xl md:text-5xl font-black gradient-text mb-4 tracking-tight">
          Not a Recommender. A Decision Engine.
        </h2>
        <p className="text-surface-muted text-lg max-w-2xl mx-auto leading-relaxed">
          Every output is deterministic, explainable, and reproducible. No hallucinations. No guesses. Pure algorithmic intelligence.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`glass border rounded-[28px] p-6 flex flex-col gap-4 hover:scale-[1.02] transition-all duration-300 ${feature.bg}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-text/5 border ${feature.bg}`}>
                <Icon size={24} className={feature.color} />
              </div>
              <div>
                <h3 className="text-base font-black text-surface-text mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-muted leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 text-center glass border border-brand-blue/20 bg-brand-blue/5 rounded-[40px] p-10"
      >
        <p className="text-xl font-black text-surface-text mb-2">
          The system handles 14 intelligence modules in a single API call.
        </p>
        <p className="text-surface-muted text-sm">
          Resume → Skill Extraction → Confidence Scoring → DAG → Path Optimization → Risk Detection → Reasoning → Output
        </p>
      </motion.div>
    </section>
  );
};

export default FeaturesSection;
