import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, RefreshCw, BookOpen, ChevronRight, ExternalLink } from 'lucide-react';

const Roadmap = ({ steps, onExplore }) => {
  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-black mb-10 gradient-text">Adaptive Learning Path</h2>
      
      <div className="relative pl-10">
        {/* Connector Line */}
        <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-blue to-transparent opacity-30"></div>

        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass mb-6 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 relative group rounded-3xl border-surface-border"
          >
            {/* Dot indicator */}
            <div 
              className="absolute -left-[34px] w-4.5 h-4.5 rounded-full z-10"
              style={{ 
                background: getStepColor(step.type),
                boxShadow: `0 0 15px ${getStepColor(step.type)}`
              }}
            ></div>

            <div className="bg-surface-text/5 p-4 rounded-2xl group-hover:bg-surface-text/10 transition-colors border-surface-border">
              {getStepIcon(step.type)}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-lg font-black text-surface-text">{step.title}</h4>
                <span 
                  className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md leading-relaxed tracking-wider"
                  style={{ 
                    background: `${getStepColor(step.type)}20`,
                    color: getStepColor(step.type),
                    border: `1px solid ${getStepColor(step.type)}40`
                  }}
                >
                  {step.type}
                </span>
              </div>
              <p className="text-sm text-surface-muted font-medium leading-relaxed mb-3">{step.description || step.reasoning}</p>
              
              {step.resource_link && (
                <a 
                  href={step.resource_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-black text-brand-cyan hover:underline uppercase tracking-tighter"
                >
                  <ExternalLink size={12} /> Recommended Resource: {new URL(step.resource_link).hostname}
                </a>
              )}
            </div>

            <button 
              onClick={() => onExplore(step)}
              className="flex items-center gap-2 text-xs font-black text-brand-blue uppercase tracking-widest px-4 py-2 rounded-xl bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/20 transition-all opacity-0 group-hover:opacity-100"
            >
              Why this? <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const getStepColor = (type) => {
  switch (type.toLowerCase()) {
    case 'learn': return '#06b6d4'; // Cyan
    case 'revise': return '#f59e0b'; // Amber
    case 'skip': return '#10b981'; // Emerald
    default: return '#3b82f6'; // Blue
  }
};

const getStepIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'learn': return <PlayCircle size={24} className="text-brand-cyan" />;
    case 'revise': return <RefreshCw size={24} className="text-brand-amber" />;
    case 'skip': return <BookOpen size={24} className="text-brand-emerald" />;
    default: return <BookOpen size={24} className="text-brand-blue" />;
  }
};

export default Roadmap;
