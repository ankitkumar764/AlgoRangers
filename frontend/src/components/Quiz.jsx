import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, ChevronRight, CheckCircle2, AlertCircle, Clock,
  Lightbulb, Code2, Wrench, BarChart2, Target, HelpCircle, ArrowRight
} from 'lucide-react';
import { fetchQuiz } from '../services/api';

const TYPE_CONFIG = {
  conceptual:  { icon: Brain,     color: 'text-brand-blue',    bg: 'bg-brand-blue/10 border-brand-blue/20',       label: 'Conceptual' },
  code_output: { icon: Code2,     color: 'text-brand-cyan',    bg: 'bg-brand-cyan/10 border-brand-cyan/20',       label: 'Code Analysis' },
  debugging:   { icon: Wrench,    color: 'text-brand-amber',   bg: 'bg-brand-amber/10 border-brand-amber/20',     label: 'Debugging' },
  scenario:    { icon: Target,    color: 'text-brand-emerald', bg: 'bg-brand-emerald/10 border-brand-emerald/20', label: 'Scenario' },
  tradeoff:    { icon: BarChart2, color: 'text-purple-400',    bg: 'bg-purple-500/10 border-purple-500/20',       label: 'Trade-off' },
};

const QUESTION_TIME = 90; // seconds per question

const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// ─── Timer Component ──────────────────────────────────────────────────────────
const Timer = ({ seconds, onExpire }) => {
  const pct = (seconds / QUESTION_TIME) * 100;
  const color = seconds > 30 ? '#06b6d4' : seconds > 10 ? '#f59e0b' : '#ef4444';

  useEffect(() => {
    if (seconds === 0) onExpire?.();
  }, [seconds, onExpire]);

  return (
    <div className="flex items-center gap-2">
      <Clock size={14} className="text-surface-muted" />
      <div className="relative w-24 h-1.5 bg-surface-text/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: color, width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-xs font-black" style={{ color }}>{formatTime(seconds)}</span>
    </div>
  );
};

// ─── Helper thresholds ────────────────────────────────────────────────────────
const VALIDATED_THRESHOLD = 0.65;   // ≥ 65%  → Skill Validated ✅
const REVISE_THRESHOLD    = 0.40;   // 40–64% → Needs Revision ⚠️
                                     // < 40%  → Added to Skill Gap ❌

// ─── Score Result Screen ──────────────────────────────────────────────────────
const ScoreScreen = ({ results, onComplete }) => {
  const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
  const avgScore   = Math.round((totalScore / Math.max(results.length, 1)) * 100);

  const validated = results.filter(r => (r.score || 0) >= VALIDATED_THRESHOLD);
  const revise    = results.filter(r => (r.score || 0) >= REVISE_THRESHOLD && (r.score || 0) < VALIDATED_THRESHOLD);
  const gapAdded  = results.filter(r => (r.score || 0) < REVISE_THRESHOLD);

  const overallLabel =
    avgScore >= 70 ? 'Strong Domain Expertise'
    : avgScore >= 45 ? 'Partial Validation'
    : 'Multiple Gaps Identified';
  const overallColor =
    avgScore >= 70 ? 'text-brand-emerald'
    : avgScore >= 45 ? 'text-brand-amber'
    : 'text-red-400';
  const overallBg =
    avgScore >= 70 ? 'bg-brand-emerald/10 border-brand-emerald/20'
    : avgScore >= 45 ? 'bg-brand-amber/10 border-brand-amber/20'
    : 'bg-red-500/10 border-red-500/20';

  const handleDone = () => {
    // Pass back structured update to App.jsx
    onComplete(avgScore, {
      newGapSkills: gapAdded.map(r => r.skill),
      reviseSkills: revise.map(r => r.skill),
      results,
    });
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <motion.div
        className="glass p-10 rounded-[40px] border border-surface-border"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} className="text-brand-blue" />
          </div>
          <h2 className="text-3xl font-black text-surface-text mb-1">Skill Validation Complete!</h2>
          <p className="text-surface-muted text-sm">Based on your answers, here's your updated skill profile</p>
        </div>

        {/* Overall Score */}
        <div className={`rounded-2xl p-5 mb-6 text-center border ${overallBg}`}>
          <span className={`text-5xl font-black block mb-1 ${overallColor}`}>{avgScore}%</span>
          <p className={`text-xs font-black uppercase tracking-widest ${overallColor}`}>{overallLabel}</p>
          <div className="flex justify-center gap-4 mt-3 text-xs font-bold">
            <span className="text-brand-emerald">✅ {validated.length} Validated</span>
            <span className="text-brand-amber">⚠️ {revise.length} Needs Revision</span>
            <span className="text-red-400">❌ {gapAdded.length} Added to Gap</span>
          </div>
        </div>

        {/* ─── Skills Added to Gap ── most important section ─── */}
        {gapAdded.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-red-400 uppercase tracking-widest mb-3">
              <AlertCircle size={14} />
              Skills Added to Skill Gap — Study These
            </h3>
            <div className="space-y-3">
              {gapAdded.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-red-500/8 border border-red-500/20 rounded-2xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-sm font-black text-surface-text">{r.skill}</span>
                      <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        Added to Gap
                      </span>
                    </div>
                    <span className="text-lg font-black text-red-400">{Math.round((r.score || 0) * 100)}%</span>
                  </div>

                  {/* What to work on */}
                  {r.concepts_missed?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1.5">
                        📌 Work on these concepts:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.concepts_missed.map(c => (
                          <span key={c} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What they got right */}
                  {r.concepts_found?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.concepts_found.map(c => (
                        <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Skills Needing Revision ─── */}
        {revise.length > 0 && (
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-sm font-black text-brand-amber uppercase tracking-widest mb-3">
              <AlertCircle size={14} />
              Needs Deeper Practice
            </h3>
            <div className="space-y-3">
              {revise.map((r, i) => (
                <div key={i} className="bg-brand-amber/8 border border-brand-amber/20 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-black text-surface-text">{r.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-brand-amber uppercase bg-brand-amber/10 px-2 py-0.5 rounded-full border border-brand-amber/20">
                        Revise
                      </span>
                      <span className="text-base font-black text-brand-amber">{Math.round((r.score || 0) * 100)}%</span>
                    </div>
                  </div>
                  {r.concepts_missed?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-black text-brand-amber uppercase tracking-wider mb-1.5">
                        ⚡ Brush up on:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {r.concepts_missed.map(c => (
                          <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-amber/10 text-brand-amber border border-brand-amber/20">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Validated Skills ─── */}
        {validated.length > 0 && (
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-sm font-black text-brand-emerald uppercase tracking-widest mb-3">
              <CheckCircle2 size={14} />
              Validated Domain Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {validated.map((r, i) => (
                <div key={i} className="flex items-center gap-2 bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-2 rounded-xl">
                  <span className="text-sm font-black text-brand-emerald">✅ {r.skill}</span>
                  <span className="text-xs font-bold text-brand-emerald/70">{Math.round((r.score || 0) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleDone}
          className="w-full bg-gradient-to-r from-brand-cyan to-brand-blue text-white py-5 rounded-[24px] font-black text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
        >
          {gapAdded.length > 0
            ? `Update Dashboard + Add ${gapAdded.length} Skill${gapAdded.length > 1 ? 's' : ''} to Gap`
            : 'See Updated Dashboard'}
          <ArrowRight size={20} />
        </button>
      </motion.div>
    </div>
  );
};


// ─── Main Quiz Component ──────────────────────────────────────────────────────
const Quiz = ({ jdSkills, resumeSkills, verifiedScores, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [inFollowUp, setInFollowUp] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchQuiz(jdSkills || [], resumeSkills || [], verifiedScores || []);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Quiz load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jdSkills, resumeSkills, verifiedScores]);

  // Timer per question
  useEffect(() => {
    if (loading || finished || submitted) return;
    startTimeRef.current = Date.now();
    setTimeLeft(QUESTION_TIME);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSkip();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, loading, finished, inFollowUp]);

  const q = questions[current];
  const typeCfg = TYPE_CONFIG[q?.type] || TYPE_CONFIG.conceptual;
  const TypeIcon = typeCfg.icon;

  const handleSkip = useCallback(() => {
    // Auto-submit with empty if time runs out
    recordResult(0, [], q?.keywords || [], false);
  }, [current, q]);

  const recordResult = (score, found, missed, needsFollowUp) => {
    setResults(prev => [
      ...prev,
      {
        skill: q?.skill,
        type: q?.type,
        score,
        concepts_found: found,
        concepts_missed: missed,
      }
    ]);
    if (needsFollowUp && !inFollowUp) {
      setInFollowUp(true);
      setFeedback({ score, concepts_found: found, concepts_missed: missed, needs_follow_up: true });
    } else {
      moveNext();
    }
  };

  const moveNext = () => {
    setAnswer('');
    setFeedback(null);
    setSubmitted(false);
    setInFollowUp(false);
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
    } else {
      setFinished(true);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    clearInterval(timerRef.current);
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);

    try {
      const res = await fetch('http://localhost:8000/score-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answer,
          keywords: q?.keywords || [],
          time_taken_seconds: timeTaken
        })
      });
      const data = await res.json();
      setSubmitted(true);
      setFeedback(data);
      recordResult(data.score, data.concepts_found || [], data.concepts_missed || [], data.needs_follow_up && !inFollowUp);
    } catch (err) {
      // Fallback: basic scoring
      const found = (q?.keywords || []).filter(kw => answer.toLowerCase().includes(kw.toLowerCase()));
      const score = found.length / Math.max(q?.keywords?.length || 1, 1);
      setSubmitted(true);
      setFeedback({ score, concepts_found: found, concepts_missed: [], needs_follow_up: false });
      recordResult(score, found, [], false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-surface-muted font-black uppercase tracking-widest text-xs">
          Analyzing skill gaps and selecting questions...
        </p>
      </div>
    );
  }

  if (finished) {
    return <ScoreScreen results={results} onComplete={onComplete} />;
  }

  if (!q) return null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-blue/10 rounded-2xl">
            <Brain className="text-brand-blue" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-surface-text">Skill Validation</h2>
            <p className="text-[10px] text-surface-muted font-black tracking-widest uppercase">
              Question {current + 1} of {questions.length}
              {inFollowUp && ' — Follow-up'}
            </p>
          </div>
        </div>
        <Timer seconds={timeLeft} onExpire={handleSkip} />
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1.5 bg-surface-text/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full"
          animate={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${current}-${inFollowUp}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass p-8 rounded-[40px] border border-surface-border"
        >
          {/* Skill + Type Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${typeCfg.bg} ${typeCfg.color}`}>
              <TypeIcon size={11} />
              {typeCfg.label}
            </span>
            <span className="text-xs font-black text-surface-muted bg-surface-text/5 px-3 py-1 rounded-full border border-surface-border">
              {q.skill}
            </span>
            {inFollowUp && (
              <span className="text-[10px] font-black text-brand-amber bg-brand-amber/10 border border-brand-amber/20 px-2 py-1 rounded-full uppercase tracking-wider">
                Deeper dive →
              </span>
            )}
          </div>

          {/* Question */}
          <div className="mb-6">
            {/* Render code blocks if present */}
            {q.question.includes('```') ? (
              <div className="space-y-3">
                {q.question.split(/(```[\s\S]*?```)/g).map((part, i) => {
                  if (part.startsWith('```')) {
                    const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
                    return (
                      <pre key={i} className="bg-surface-text/5 border border-surface-border rounded-xl p-4 text-xs font-mono text-brand-cyan overflow-x-auto whitespace-pre">
                        {code}
                      </pre>
                    );
                  }
                  return <p key={i} className="text-lg font-black text-surface-text leading-snug">{part.trim()}</p>;
                })}
              </div>
            ) : (
              <p className="text-lg font-black text-surface-text leading-snug">
                {inFollowUp ? q.follow_up : q.question}
              </p>
            )}
          </div>

          {/* Answer Area */}
          {!submitted ? (
            <>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here — explain your reasoning, not just the definition..."
                rows={5}
                className="w-full bg-surface-text/5 border border-surface-border rounded-2xl p-4 text-surface-text text-sm font-medium resize-none outline-none focus:border-brand-blue transition-colors placeholder:text-surface-muted/50 mb-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-surface-muted font-bold">
                  {answer.split(/\s+/).filter(Boolean).length} words — aim for at least 30
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answer.trim().length < 5}
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-cyan to-brand-blue text-white px-6 py-3 rounded-xl font-black text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Evaluating...' : 'Submit Answer'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            /* Feedback Panel */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Score */}
              <div className={`rounded-2xl p-4 ${(feedback?.score || 0) >= 0.6 ? 'bg-brand-emerald/10 border border-brand-emerald/20' : 'bg-brand-amber/10 border border-brand-amber/20'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-surface-text">Answer Quality</span>
                  <span className={`text-xl font-black ${(feedback?.score || 0) >= 0.6 ? 'text-brand-emerald' : 'text-brand-amber'}`}>
                    {Math.round((feedback?.score || 0) * 100)}%
                  </span>
                </div>
                {/* Concepts */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {feedback?.concepts_found?.map(c => (
                    <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-emerald/20 text-brand-emerald">✓ {c}</span>
                  ))}
                  {feedback?.concepts_missed?.slice(0, 4).map(c => (
                    <span key={c} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">✗ {c}</span>
                  ))}
                </div>
              </div>

              {feedback?.needs_follow_up && !inFollowUp && (
                <div className="flex items-center gap-2 text-xs text-brand-amber font-bold bg-brand-amber/10 border border-brand-amber/20 rounded-xl px-4 py-2">
                  <AlertCircle size={14} />
                  Answer was brief — a follow-up question is coming to go deeper.
                </div>
              )}

              <button
                onClick={moveNext}
                className="w-full bg-surface-text/5 border border-surface-border text-surface-text py-3.5 rounded-2xl font-black text-sm hover:bg-surface-text/10 transition-all flex items-center justify-center gap-2"
              >
                {current < questions.length - 1 ? 'Next Question' : 'See Results'}
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
