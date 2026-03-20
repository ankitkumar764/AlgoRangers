import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ResultDashboard from './components/ResultDashboard';
import Roadmap from './components/Roadmap';
import Quiz from './components/Quiz';
import ThinkingDrawer from './components/ThinkingDrawer';
import ErrorBoundary from './components/ErrorBoundary';
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

  const handleQuizComplete = async (score) => {
    setShowQuiz(false);
    setShowDashboard(true);
    await api.submitQuizResults(score, 3);
  };

  const resetAnalysis = () => {
    setShowDashboard(false);
    setError(null);
    setAnalysisData(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      <div className="neural-mesh"></div>
      
      <Header />
      
      <main className="pb-20 relative z-10">
        <AnimatePresence mode="wait">
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
                onComplete={handleQuizComplete} 
              />
            </motion.div>
          ) : !showDashboard ? (
            <motion.div
              key="landing"
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
            >
              <Hero onAnalyze={handleAnalyze} />
              
              {analyzing && (
                <div className="fixed inset-0 bg-surface-bg/85 backdrop-blur-md flex flex-col items-center justify-center z-[1000]">
                  <div className="w-16 h-16 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin"></div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                    className="mt-6 text-xl font-bold gradient-text"
                  >
                    AI Engine is calculating your career path...
                  </motion.p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="container mx-auto px-6 text-right mt-5 flex justify-end gap-3">
                {!error && analysisData && (
                  <button 
                    onClick={handleStartQuiz}
                    className="glass px-4 py-2 rounded-lg text-sm font-bold border-brand-blue/30 text-brand-blue hover:bg-brand-blue/5 transition-colors"
                  >
                    Start Skill Validation
                  </button>
                )}
                <button 
                  onClick={resetAnalysis} 
                  className="glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  New Analysis
                </button>
              </div>
              
              <ErrorBoundary>
                <ResultDashboard 
                  score={analysisData?.score} 
                  skills={analysisData?.skills} 
                  skillsFull={analysisData?.skillsFull}
                  missingSkills={analysisData?.missingSkills} 
                  tier={analysisData?.tier}
                  trainingWeeks={analysisData?.trainingWeeks}
                  hiringRecommendation={analysisData?.hiringRecommendation}
                  error={error}
                  onRetry={resetAnalysis}
                />
                
                {analysisData && !error && (
                  <Roadmap steps={analysisData.roadmap} onExplore={handleExploreStep} />
                )}
              </ErrorBoundary>
              
              <footer className="container mx-auto px-6 py-20 text-center">
                <p className="text-surface-muted text-sm border-t border-surface-border pt-10">
                  © 2026 AlgoRangers Engine. Built for Career Acceleration.
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
