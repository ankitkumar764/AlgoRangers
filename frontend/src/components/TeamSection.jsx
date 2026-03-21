import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Cpu, Github, Linkedin } from 'lucide-react';

const TEAM = [
  {
    name: 'Ankit',
    role: 'Backend & AI Systems',
    icon: Cpu,
    color: 'text-brand-blue',
    bg: 'bg-brand-blue/10 border-brand-blue/20',
    responsibilities: [
      'Skill Extraction & Confidence Engine',
      'DAG Construction & Path Optimization',
      'Risk Prediction & Reasoning Engine',
      'FastAPI Backend & Data Contracts',
    ],
    tag: 'System Brain'
  },
  {
    name: 'Raushan',
    role: 'Frontend & UX Engineering',
    icon: Code2,
    color: 'text-brand-cyan',
    bg: 'bg-brand-cyan/10 border-brand-cyan/20',
    responsibilities: [
      'Intelligence Dashboard & Radar Chart',
      'Multi-Path Comparison UI',
      'Reasoning Trace & Risk Panels',
      'API Integration & State Management',
    ],
    tag: 'Product Experience'
  }
];

const TeamSection = () => {
  return (
    <section id="team-section" className="container mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-brand-emerald/10 px-4 py-2 rounded-full border border-brand-emerald/20 text-brand-emerald text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
          The AlgoRangers Team
        </div>
        <h2 className="text-4xl md:text-5xl font-black gradient-text mb-4 tracking-tight">
          Built by Engineers, for Engineers.
        </h2>
        <p className="text-surface-muted text-lg max-w-xl mx-auto">
          Two builders who believed career acceleration should be driven by systems intelligence, not guesswork.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {TEAM.map((member, i) => {
          const Icon = member.icon;
          return (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`glass border rounded-[32px] p-8 ${member.bg}`}
            >
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${member.bg}`}>
                <Icon size={32} className={member.color} />
              </div>

              {/* Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-black text-surface-text">{member.name}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${member.bg} ${member.color}`}>
                    {member.tag}
                  </span>
                </div>
                <p className={`text-sm font-bold ${member.color}`}>{member.role}</p>
              </div>

              {/* Responsibilities */}
              <ul className="space-y-2.5">
                {member.responsibilities.map((resp, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-surface-muted">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${member.color.replace('text-', 'bg-')}`} />
                    {resp}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;
