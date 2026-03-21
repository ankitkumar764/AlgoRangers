import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, ShieldCheck, Activity } from 'lucide-react';

const SEVERITY_CONFIG = {
  HIGH:   { icon: AlertTriangle, color: 'text-red-400',         bg: 'bg-red-500/10 border-red-500/20',   label: 'HIGH' },
  MEDIUM: { icon: AlertCircle,   color: 'text-brand-amber',     bg: 'bg-brand-amber/10 border-brand-amber/20', label: 'MEDIUM' },
  LOW:    { icon: Info,          color: 'text-brand-blue',      bg: 'bg-brand-blue/10 border-brand-blue/20',   label: 'LOW' },
};

const SystemConfidenceMeter = ({ confidence }) => {
  if (!confidence) return null;
  const pct = Math.round(confidence.score * 100);
  const isLow = confidence.flag === 'low_confidence';

  return (
    <div className={`glass border rounded-[24px] p-5 ${isLow ? 'border-brand-amber/30 bg-brand-amber/5' : 'border-brand-emerald/30 bg-brand-emerald/5'}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-surface-muted flex items-center gap-2">
          <Activity size={14} className={isLow ? 'text-brand-amber' : 'text-brand-emerald'} />
          System Confidence
        </h4>
        <span className={`text-xl font-black ${isLow ? 'text-brand-amber' : 'text-brand-emerald'}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-surface-text/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isLow ? 'bg-brand-amber' : 'bg-brand-emerald'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      {isLow && (
        <p className="text-[10px] text-brand-amber mt-2 font-bold">
          ⚠️ Low confidence — analysis may be incomplete. Provide a richer resume for better results.
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          ['Data Quality', confidence.data_quality],
          ['Validation', confidence.validation_strength],
          ['Certainty', confidence.model_certainty],
        ].map(([label, val]) => (
          <div key={label} className="text-center">
            <span className="text-xs font-black text-surface-text block">{Math.round((val || 0) * 100)}%</span>
            <p className="text-[9px] text-surface-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskPanel = ({ risks, systemConfidence, timeEstimate }) => {
  if (!risks) return null;

  return (
    <div className="container mx-auto px-6 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-8 rounded-[40px] border border-surface-border"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-surface-text flex items-center gap-2">
              <ShieldCheck className="text-brand-amber" size={22} />
              Risk & Intelligence Report
            </h3>
            <p className="text-sm text-surface-muted mt-1">Predictive failure detection and system confidence analysis.</p>
          </div>
          {timeEstimate?.estimated_completion && (
            <div className="glass px-4 py-2 rounded-2xl border border-brand-blue/20 text-center">
              <span className="text-lg font-black text-brand-blue block">{timeEstimate.total_days}d</span>
              <p className="text-[10px] text-surface-muted font-bold uppercase">To Job Readiness</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Warnings */}
          <div className="lg:col-span-2 space-y-3">
            {risks.length === 0 ? (
              <div className="glass border border-brand-emerald/20 bg-brand-emerald/5 p-5 rounded-[20px] text-center">
                <ShieldCheck size={32} className="text-brand-emerald mx-auto mb-2" />
                <p className="text-sm font-black text-brand-emerald">No Critical Risks Detected</p>
                <p className="text-xs text-surface-muted mt-1">Your skill profile is consistent and well-structured.</p>
              </div>
            ) : (
              risks.map((risk, i) => {
                const cfg = SEVERITY_CONFIG[risk.severity] || SEVERITY_CONFIG.LOW;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`border rounded-[18px] p-4 ${cfg.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={16} className={`${cfg.color} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-surface-text">{risk.skill}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-surface-text/10 ${cfg.color}`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-xs text-surface-muted">{risk.detail}</p>
                        <p className={`text-[11px] font-bold mt-1.5 ${cfg.color}`}>
                          💡 {risk.recommendation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* System Confidence */}
          <div>
            <SystemConfidenceMeter confidence={systemConfidence} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskPanel;
