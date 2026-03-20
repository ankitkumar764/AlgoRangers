import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Brain, AlertCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { fetchQuiz } from '../services/api';

const Quiz = ({ jdSkills, resumeSkills, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuiz(jdSkills, resumeSkills);
        setQuestions(data.questions);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [jdSkills, resumeSkills]);

  const handleAnswer = (index) => {
    setSelectedOption(index);
    setShowFeedback(true);
    
    if (index === questions[currentQuestion].correct_option_index) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-surface-muted font-black uppercase tracking-widest text-xs">Generating Reasoning Challenge...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-2xl text-center">
        <motion.div 
          className="glass p-10 rounded-[32px] border-surface-border"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-brand-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-brand-emerald" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-surface-text">Validation Complete!</h2>
          <div className="bg-surface-text/5 p-6 rounded-2xl mb-8">
             <span className="text-4xl font-black text-brand-blue block">{Math.round((score/questions.length)*100)}%</span>
             <p className="text-xs text-surface-muted font-bold uppercase tracking-widest mt-1">Conceptual Mastery Score</p>
          </div>
          <button 
            onClick={onComplete}
            className="w-full bg-brand-blue text-white py-5 rounded-[24px] font-black text-lg shadow-xl hover:brightness-110 transition-all active:scale-95"
          >
            Update My SkillGraph
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-blue/10 rounded-2xl">
            <Brain className="text-brand-blue" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-surface-text">Reasoning Assessment</h2>
            <p className="text-[10px] text-surface-muted font-black tracking-[0.2em] uppercase">Phase {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-xs font-black text-surface-muted uppercase tracking-widest">Mastery</span>
           <div className="text-xl font-black text-brand-blue">{score}/{questions.length}</div>
        </div>
      </div>

      <motion.div 
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[40px] border-surface-border relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5"><HelpCircle size={120} /></div>
        
        <h3 className="text-2xl font-black mb-10 text-surface-text leading-tight relative z-10">
          {q.question}
        </h3>

        <div className="space-y-4 relative z-10">
          {q.options.map((option, index) => (
            <button
              key={index}
              disabled={showFeedback}
              onClick={() => handleAnswer(index)}
              className={`w-full text-left p-6 glass rounded-2xl border transition-all flex justify-between items-center group font-bold text-sm ${
                showFeedback 
                ? index === q.correct_option_index 
                  ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' 
                  : index === selectedOption 
                    ? 'border-brand-amber bg-brand-amber/10 text-brand-amber'
                    : 'border-surface-border opacity-50'
                : 'border-surface-border hover:border-brand-blue hover:bg-brand-blue/5 text-surface-text'
              }`}
            >
              <span className="flex-1">{option}</span>
              {!showFeedback && <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              {showFeedback && index === q.correct_option_index && <CheckCircle2 size={18} />}
              {showFeedback && index === selectedOption && index !== q.correct_option_index && <AlertCircle size={18} />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 pt-8 border-t border-surface-border"
            >
              <div className="flex gap-4 p-6 bg-brand-blue/5 rounded-3xl border border-brand-blue/10">
                <div className="p-2 bg-brand-blue/10 rounded-xl h-fit"><Lightbulb size={20} className="text-brand-blue" /></div>
                <div>
                  <h4 className="font-black text-brand-blue text-xs uppercase tracking-widest mb-2">Conceptual Intelligence</h4>
                  <p className="text-sm text-surface-muted leading-relaxed italic">
                    {q.reasoning}
                  </p>
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full mt-6 bg-surface-text text-surface-bg py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                Next Challenge <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-8 w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
        ></motion.div>
      </div>
    </div>
  );
};

export default Quiz;
