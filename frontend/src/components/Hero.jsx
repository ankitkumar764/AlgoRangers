import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const Hero = ({ onAnalyze }) => {
  const [jdText, setJdText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setLocalError(null);
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile) {
      setLocalError("Please upload your resume first!");
      return;
    }
    if (!jdText.trim()) {
      setLocalError("Please paste the job description!");
      return;
    }
    setLocalError(null);
    onAnalyze(selectedFile, jdText);
  };

  return (
    <section className="container mx-auto px-6 py-20 text-center mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 px-4 py-2 rounded-full border border-brand-blue/20 text-brand-blue text-sm font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
          AI-Powered Career Engine
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] gradient-text tracking-tight">
          Accelerate Your Career <br /> With Precision
        </h1>
        <p className="text-surface-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Upload your resume and the job description. Our AI will identify skill gaps and generate a personalized learning roadmap.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="glass max-w-4xl mx-auto p-10 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-[32px] border-surface-border relative z-20"
      >
        {/* Resume Upload */}
        <div className="text-left">
          <label className="block mb-3 font-bold text-surface-text">1. Your Resume</label>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            id="resume-upload"
            accept=".pdf,.docx,.txt"
          />
          <div 
            onClick={() => fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all group h-[140px] flex flex-col justify-center items-center ${
              selectedFile ? 'border-brand-emerald bg-brand-emerald/5' : 'border-surface-border hover:border-brand-blue'
            }`}
          >
            {selectedFile ? (
              <>
                <CheckCircle size={32} className="text-brand-emerald mb-2" />
                <p className="text-xs text-brand-emerald font-black truncate max-w-full px-4">{selectedFile.name}</p>
              </>
            ) : (
              <>
                <Upload size={32} className="mx-auto mb-2 text-surface-muted group-hover:text-brand-blue transition-colors" />
                <p className="text-xs text-surface-muted font-bold">PDF / DOCX / TXT</p>
              </>
            )}
          </div>
        </div>

        {/* JD Input */}
        <div className="text-left">
          <label className="block mb-3 font-bold text-surface-text">2. Job Description</label>
          <textarea 
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            id="jd-input"
            className="w-full h-[140px] bg-surface-text/5 border border-surface-border rounded-2xl p-4 text-surface-text font-bold resize-none outline-none focus:border-brand-blue transition-colors placeholder:text-surface-muted/50"
          ></textarea>
        </div>

        <div className="md:col-span-2 mt-4">
          <AnimatePresence>
            {localError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-brand-amber/10 border border-brand-amber/20 text-brand-amber p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2"
              >
                <AlertCircle size={18} /> {localError}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleAnalyzeClick} 
            id="generate-btn"
            className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue text-white py-5 rounded-2xl font-black text-lg shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:brightness-110 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 group"
          >
            Generate Adaptive Roadmap 
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
