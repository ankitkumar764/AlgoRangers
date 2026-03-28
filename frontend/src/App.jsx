import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import TeamSection from './components/TeamSection';
import ResultDashboard from './components/ResultDashboard';
import Roadmap from './components/Roadmap';
import Quiz from './components/Quiz';
import ThinkingDrawer from './components/ThinkingDrawer';
import ErrorBoundary from './components/ErrorBoundary';
import PathComparison from './components/PathComparison';
import ReasoningTrace from './components/ReasoningTrace';
import RiskPanel from './components/RiskPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import * as api from './services/api';

function AppContent() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeStepData, setActiveStepData] = useState(null);

  const handleAnalyze = async (file, jd) => {
    setAnalyzing(true);
    setError(null);
    setAnalysisData(null);
    try {
      const data = await api.analyzeResume(file, jd);
      setAnalysisData(data);
      setShowDashboard(true);
    } catch (err) {
      console.error("App: Analysis failed", err);
      setError(err.message || "AI Engine connection failed.");
      setShowDashboard(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartQuiz = () => {
    setShowDashboard(false);
    setShowQuiz(true);
  };

  const handleExploreStep = (step) => {
    setActiveStepData(step);
    setIsDrawerOpen(true);
  };

  const handleQuizComplete = async (score, updates = {}) => {
    setShowQuiz(false);
    setShowDashboard(true);

    // Merge quiz-confirmed gaps into the existing analysis data
    if (updates?.newGapSkills?.length > 0 || updates?.reviseSkills?.length > 0) {
      setAnalysisData(prev => {
        if (!prev) return prev;
        const existingGaps = new Set(prev.missingSkills || []);
        // Add skills where quiz score < 40% to the skill gap
        updates.newGapSkills?.forEach(s => existingGaps.add(s));
        // Mark revise skills distinctly (optional: could tag them differently)
        const reviseSet = new Set(updates.reviseSkills || []);
        return {
          ...prev,
          missingSkills: Array.from(existingGaps),
          quizResults:   updates.results || [],
          quizGapSkills: updates.newGapSkills || [],
          quizReviseSkills: Array.from(reviseSet),
        };
      });
    }

    await api.submitQuizResults(score, 4);
  };

  const resetAnalysis = () => {
    setShowDashboard(false);
    setShowQuiz(false);
    setError(null);
    setAnalysisData(null);
    setAnalyzing(false);
    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    const el = document.getElementById('upload-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      <div className="neural-mesh" />

      <Header
        onGetStarted={handleGetStarted}
        onReset={resetAnalysis}
        showDashboard={showDashboard || showQuiz}
      />

      <main className="pt-20 pb-20 relative z-10">
        <AnimatePresence mode="wait">

          {/* ─── QUIZ VIEW ─── */}
          {showQuiz ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Quiz
                jdSkills={analysisData?.jdSkills}
                resumeSkills={analysisData?.skills}
                verifiedScores={analysisData?.verified_scores}
                onComplete={handleQuizComplete}
              />
            </motion.div>

          ) : !showDashboard ? (

            /* ─── LANDING PAGE ─── */
            <motion.div
              key="landing"
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
            >
              <Hero onAnalyze={handleAnalyze} />
              <FeaturesSection />
              <TeamSection />

              {/* Loading Overlay */}
              {analyzing && (
                <div className="fixed inset-0 bg-surface-bg/85 backdrop-blur-md flex flex-col items-center justify-center z-[1000]">
                  <div className="w-16 h-16 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin" />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                    className="mt-6 text-xl font-bold gradient-text"
                  >
                    AI Engine is computing your career path...
                  </motion.p>
                  <p className="text-surface-muted text-xs mt-2 font-medium">
                    Running 14-module intelligence pipeline...
                  </p>
                </div>
              )}
            </motion.div>

          ) : (

            /* ─── DASHBOARD VIEW ─── */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Dashboard Controls */}
              <div className="container mx-auto px-6 text-right mt-5 flex justify-end gap-3">
                {!error && analysisData && (
                  <button
                    onClick={handleStartQuiz}
                    className="glass px-4 py-2 rounded-lg text-sm font-bold border border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5 transition-colors"
                  >
                    Start Skill Validation
                  </button>
                )}
                <button
                  onClick={resetAnalysis}
                  className="glass px-4 py-2 rounded-lg text-sm font-medium border border-surface-border hover:bg-black/5 transition-colors"
                >
                  ← New Analysis
                </button>
              </div>

              <ErrorBoundary>
                <ResultDashboard
                  score={analysisData?.score}
                  skills={analysisData?.skills}
                  skillsFull={analysisData?.skillsFull}
                  missingSkills={analysisData?.missingSkills}
                  jdSkills={analysisData?.jdSkills}
                  tier={analysisData?.tier}
                  trainingWeeks={analysisData?.training_weeks || analysisData?.trainingWeeks}
                  hiringRecommendation={analysisData?.hiringRecommendation}
                  internalScores={analysisData?.verified_scores}
                  error={error}
                  onRetry={resetAnalysis}
                />

                {analysisData && !error && (
                  <>
                    <Roadmap steps={analysisData.roadmap} onExplore={handleExploreStep} />
                    <PathComparison
                      optimalPath={analysisData.optimal_path}
                      alternativePath={analysisData.alternative_path}
                    />
                    <ReasoningTrace trace={analysisData.reasoning_trace} />
                    <RiskPanel
                      risks={analysisData.risk_prediction}
                      systemConfidence={analysisData.system_confidence}
                      timeEstimate={analysisData.time_estimate}
                    />
                  </>
                )}
              </ErrorBoundary>

              <footer className="container mx-auto px-6 py-20 text-center">
                <p className="text-surface-muted text-sm border-t border-surface-border pt-10">
                  © 2026 AlgoRangers — Explainable AI Career Engine. Built with ❤️ by Ankit &amp; Raushan.
                </p>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ThinkingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        stepData={activeStepData}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
