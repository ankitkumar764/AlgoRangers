import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Download, Share2, RefreshCcw, TrendingUp, Clock, Award, ShieldCheck } from 'lucide-react';
import SkillRadar from './SkillRadar';
import MagneticButton from './MagneticButton';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

const CATEGORIES = {
  "Backend": ["Node.js", "FastAPI", "Python", "Go", "Java", "Ruby", "PHP", "Express", "Django"],
  "Frontend": ["React", "Vue", "Angular", "TailwindCSS", "CSS", "HTML", "TypeScript", "JavaScript", "Next.js"],
  "Cloud": ["AWS", "Azure", "GCP", "Cloud", "S3", "Lambda", "EC2", "Serverless"],
  "DevOps": ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Terraform", "Ansible", "GitLab"],
  "Database": ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQL", "Database", "Firestore"],
  "Security": ["OAuth", "JWT", "Security", "Auth", "Encryption", "Cybersecurity"]
};

const ResultDashboard = ({ 
  score, 
  skills, 
  skillsFull,
  missingSkills, 
  tier, 
  trainingWeeks, 
  hiringRecommendation, 
  error, 
  onRetry 
}) => {
  const dashboardRef = useRef(null);
  const radarRef = useRef(null);

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-12 rounded-[40px] border-brand-amber/20 max-w-2xl mx-auto"
        >
          <AlertCircle size={60} className="text-brand-amber mx-auto mb-6" />
          <h2 className="text-3xl font-black text-surface-text mb-4">Analysis Interrupted</h2>
          <p className="text-surface-muted mb-8 font-medium">
            {error || "We encountered a technical glitch while communicating with the AI Engine. Please check your connection or try again."}
          </p>
          <button 
            onClick={onRetry}
            className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 mx-auto hover:brightness-110 transition-all"
          >
            <RefreshCcw size={20} /> Retry Analysis
          </button>
        </motion.div>
      </div>
    );
  }

  if (!skills || !missingSkills) return null;

  // Dynamic Radar Calculation
  const radarSkills = Object.keys(CATEGORIES);
  const candidateScores = radarSkills.map(cat => {
    const catSkills = CATEGORIES[cat];
    const userMatches = skills.filter(s => catSkills.some(cs => s.toLowerCase().includes(cs.toLowerCase())));
    if (userMatches.length === 0) return 20; // Base floor for visual
    return Math.min(40 + userMatches.length * 20, 100);
  });

  const requirementScores = radarSkills.map(cat => {
    const catSkills = CATEGORIES[cat];
    const missingInCat = missingSkills.filter(s => catSkills.some(cs => s.toLowerCase().includes(cs.toLowerCase())));
    const existingInCat = skills.filter(s => catSkills.some(cs => s.toLowerCase().includes(cs.toLowerCase())));
    const totalRequired = missingInCat.length + existingInCat.length;
    if (totalRequired === 0) return 30; // Default requirement
    return Math.min(50 + totalRequired * 15, 100);
  });

  const marketMatch = {
    candidate: candidateScores,
    requirement: requirementScores
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleExportPDF = async () => {
    try {
      const element = dashboardRef.current;
      if (!element) return;
      
      const imgData = await toPng(element, {
        pixelRatio: window.devicePixelRatio || 1.5,
        backgroundColor: '#0a0a0a'
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('AlgoRangers-Roadmap-Analysis.pdf');
    } catch (e) {
      console.error("PDF Export failed:", e);
      alert("Failed to export PDF: " + (e.message || "Unknown error"));
    }
  };

  const handleExportGraph = async () => {
    try {
      const element = radarRef.current;
      if (!element) return;
      
      const imgData = await toPng(element, {
        pixelRatio: window.devicePixelRatio || 2,
        backgroundColor: '#0a0a0a'
      });
      
      let shared = false;
      
      if (navigator.share) {
        try {
          const blob = dataURItoBlob(imgData);
          const file = new File([blob], 'AlgoRangers-Verified-Graph.png', { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'My AI Verified Skills',
              text: 'Check out my AI verified skill graph from AlgoRangers!',
              files: [file]
            });
            shared = true;
          }
        } catch (shareError) {
          console.warn("Web Share API failed, falling back to download:", shareError);
        }
      }
      
      if (!shared) {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'AlgoRangers-Verified-Graph.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error("Graph Export failed:", e);
      alert("Failed to export Graph image: " + (e.message || "Unknown error"));
    }
  };

  return (
    <div className="container mx-auto px-6 pt-5 pb-10" ref={dashboardRef}>

      {/* Hero Impact Block */}
      {trainingWeeks != null && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 border-2 border-brand-cyan/40 p-8 rounded-[32px] text-center mb-10 overflow-hidden relative"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-cyan/30 blur-3xl rounded-full mix-blend-screen"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-blue/30 blur-3xl rounded-full mix-blend-screen"></div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white relative z-10 tracking-tight">
            🎯 You can be job-ready in <span className="text-brand-cyan">{trainingWeeks * 7 || 18} days</span>
          </h2>
        </motion.div>
      )}

      {/* Decision Flow Explanation */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-[24px] border-surface-border mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative"
      >
        <div>
          <h3 className="text-sm font-black text-surface-muted uppercase tracking-widest mb-4">How we computed this</h3>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs font-bold text-surface-text">
            <span className="flex items-center gap-2 bg-surface-text/5 px-3 py-1.5 rounded-lg border border-surface-border/50">
              <span className="bg-brand-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span> Extracted exact skills
            </span>
            <span className="text-surface-muted">→</span>
            <span className="flex items-center gap-2 bg-surface-text/5 px-3 py-1.5 rounded-lg border border-surface-border/50">
              <span className="bg-brand-emerald text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span> Verified knowledge depth
            </span>
            <span className="text-surface-muted">→</span>
            <span className="flex items-center gap-2 bg-surface-text/5 px-3 py-1.5 rounded-lg border border-surface-border/50">
              <span className="bg-brand-amber text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">3</span> Enforced dependency graph
            </span>
            <span className="text-surface-muted">→</span>
            <span className="flex items-center gap-2 bg-brand-blue/10 px-3 py-1.5 rounded-lg border border-brand-blue/30 text-brand-blue">
              <span className="bg-brand-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">4</span> Mathematically optimized path
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Score & Hiring Intelligence */}
        <div className="flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 text-center rounded-[32px] border-surface-border flex flex-col items-center"
            ref={radarRef}
          >
            <div className="flex justify-between w-full mb-6 relative z-20">
               <h3 className="text-sm font-extrabold text-surface-muted uppercase tracking-widest">Market Alignment</h3>
               <Info size={16} className="text-surface-muted cursor-help" />
            </div>
            <div className="mb-8 py-4 relative z-20 text-center">
              <SkillRadar skills={radarSkills} marketMatch={marketMatch} />
              <div className="mt-4 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-blue"></div> You</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Market</div>
              </div>
            </div>
            <div className="w-full bg-surface-text/5 p-6 rounded-2xl border border-surface-border relative z-20">
               <span className="text-4xl font-black text-brand-blue mb-1 block">{score}%</span>
               <p className="text-xs text-surface-muted font-bold tracking-widest uppercase">Actual Match Readiness</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-[32px] border-brand-blue/20 bg-brand-blue/5 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={80} /></div>
            <h3 className="text-xs font-black text-brand-blue uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Award size={16} /> Hiring Intelligence
            </h3>
            <div className="space-y-4 relative z-10">
              <div>
                <span className="text-2xl font-black text-surface-text block">{tier || "Elite Match"}</span>
                <p className="text-xs text-surface-muted font-bold mt-1 uppercase tracking-wider italic">{hiringRecommendation || "Direct Hire Recommended"}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-surface-border">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue"><Clock size={20} /></div>
                <div>
                  <span className="text-sm font-black text-surface-text block">~{trainingWeeks || 2} Weeks</span>
                  <p className="text-[10px] text-surface-muted font-bold uppercase">Onboarding Time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Skills Lists */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[32px] border-surface-border"
          >
            <h4 className="flex items-center gap-2 mb-8 font-black text-surface-text text-lg">
              <ShieldCheck className="text-brand-emerald" size={24} /> Skill Confidence Display
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {verifiedScores ? Object.entries(verifiedScores).map(([skillName, confidenceNum], index) => (
                <div key={index} className="bg-surface-text/5 border border-surface-border p-4 rounded-2xl flex flex-col gap-2 hover:bg-surface-text/10 transition-colors">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-black text-surface-text">
                      {skillName} <span className="text-brand-blue font-bold px-2">→</span> {Math.round(confidenceNum * 100)}%
                    </span>
                    <span className="text-[10px] font-black text-brand-emerald uppercase tracking-tighter bg-brand-emerald/10 px-2 py-0.5 rounded-md">
                      AI Verified
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-text/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${confidenceNum * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    ></motion.div>
                  </div>
                </div>
              )) : (
                <p className="text-surface-muted text-sm font-bold">No internal scoring available for this profile.</p>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-[32px] border-surface-border"
          >
            <h4 className="flex items-center gap-2 mb-6 font-black text-surface-text text-lg">
              <AlertCircle className="text-brand-amber" size={24} /> Critical Learning Gaps
            </h4>
            <div className="flex flex-wrap gap-3">
              {missingSkills.map((skill, index) => (
                <span key={index} className="bg-brand-amber/10 border border-brand-amber/20 text-brand-amber px-5 py-2.5 rounded-2xl text-sm font-black shadow-sm hover:translate-y-[-2px] transition-transform cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <MagneticButton 
               onClick={handleExportPDF}
               className="bg-gradient-to-r from-brand-blue to-brand-cyan text-white py-5 rounded-[24px] font-black text-sm shadow-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
                <Download size={20} /> Download Intelligence PDF
             </MagneticButton>
             <MagneticButton 
               onClick={handleExportGraph}
               className="glass py-5 rounded-[24px] font-black text-sm border-surface-border text-surface-text hover:bg-surface-text/5 transition-all flex items-center justify-center gap-3 active:scale-95"
             >
                <Share2 size={20} /> Export AI-Verified Graph
             </MagneticButton>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultDashboard;
