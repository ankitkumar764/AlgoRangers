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
  const score = confidence?.score ?? 0;
  const pct = Math.round(score * 100);
  const isLow = confidence?.flag === 'low_confidence';

  return (
    <div className={`glass border rounded-[24px] p-5 ${isLow ? 'border-brand-amber/30 bg-brand-amber/5' : 'border-brand-emerald/30 bg-brand-emerald/5'} flex flex-col h-full`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-black uppercase tracking-widest text-surface-text flex items-center gap-2">
          <Activity size={16} className={isLow ? 'text-brand-amber' : 'text-brand-emerald'} />
          System Confidence
        </h4>
        <span className={`text-2xl font-black ${isLow ? 'text-brand-amber' : 'text-brand-emerald'}`}>{pct}%</span>
      </div>
      <div className="h-2 bg-surface-text/10 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full rounded-full ${isLow ? 'bg-brand-amber' : 'bg-brand-emerald'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className="bg-[#0a0a0a] border border-surface-border rounded-xl p-4 mt-auto">
        <pre className="text-[10px] text-brand-emerald font-mono leading-relaxed overflow-x-auto">
{JSON.stringify({
  system_confidence: Number((confidence?.score ?? 0).toFixed(2)),
  data_quality: Number((confidence?.data_quality ?? 0).toFixed(2)),
  validation_strength: Number((confidence?.validation_strength ?? 0).toFixed(2)),
  model_certainty: Number((confidence?.model_certainty ?? 0).toFixed(2))
}, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const RiskPanel = ({ risks, systemConfidence, timeEstimate }) => {
  if (!risks) return null;

  return (
    <div className="container mx-auto px-6 mt-8 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-8 md:p-10 rounded-[40px] border border-surface-border"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <h3 className="text-2xl font-black text-surface-text flex items-center gap-3">
              <ShieldCheck className="text-brand-amber" size={28} />
              Predictive Risk Assessment
            </h3>
            <p className="text-sm text-surface-muted mt-2">Machine-computed failure vectors and system confidence evaluation.</p>
          </div>
          {timeEstimate?.estimated_completion && (
            <div className="glass px-6 py-4 rounded-3xl border border-brand-blue/20 text-center bg-brand-blue/5">
              <span className="text-3xl font-black text-brand-blue block leading-none">{Math.round(timeEstimate.total_days)} Days</span>
              <p className="text-xs text-surface-muted font-bold uppercase tracking-widest mt-2">Time-To-Job-Ready</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Risk Warnings */}
          <div className="lg:col-span-2 space-y-4">
            {risks.length === 0 ? (
              <div className="glass border border-brand-emerald/20 bg-brand-emerald/5 p-8 rounded-[24px] text-center flex flex-col items-center justify-center h-full">
                <ShieldCheck size={48} className="text-brand-emerald mb-4" />
                <p className="text-lg font-black text-brand-emerald">No Critical Risks Detected</p>
                <div className="bg-[#0a0a0a] border border-surface-border p-4 rounded-xl mt-6 inline-flex text-left">
                  <pre className="text-xs text-brand-emerald font-mono">
{JSON.stringify({ risk: [] }, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {risks.map((risk, i) => {
                  const cfg = SEVERITY_CONFIG[risk.severity] || SEVERITY_CONFIG.LOW;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={`border rounded-[24px] overflow-hidden flex flex-col md:flex-row ${cfg.bg}`}
                    >
                      <div className="p-5 flex items-start gap-4 flex-1">
                        <Icon size={24} className={`${cfg.color} mt-1 flex-shrink-0`} />
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black text-surface-text">{risk.skill}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-surface-text/10 ${cfg.color}`}>
                              {risk.severity} RISK
                            </span>
                          </div>
                          <p className={`text-xs font-bold ${cfg.color} mb-1 bg-black/20 p-2 rounded-lg border border-black/10 inline-block`}>
                            {risk.detail}
                          </p>
                          <p className="text-xs text-surface-muted mt-2">💡 {risk.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {risks.length > 0 && (
              <div className="bg-[#0a0a0a] border border-surface-border p-4 rounded-xl mt-4">
                <pre className="text-[10px] text-brand-amber font-mono overflow-x-auto">
{JSON.stringify({
  risk: risks.map(r => r.detail)
}, null, 2)}
                </pre>
              </div>
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
