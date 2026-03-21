from pydantic import BaseModel
from typing import List, Optional, Dict, Any

# ── Request Models ──────────────────────────────────

class ScoreRequest(BaseModel):
    resume_skills: List[str]
    jd_skills: List[str]

class GapAnalysisRequest(BaseModel):
    resume_skills: List[str]
    jd_skills: List[str]

class RoadmapRequest(BaseModel):
    missing_skills: List[str]
    user_skills: List[str]

class QuizRequest(BaseModel):
    jd_skills: List[str]
    resume_skills: List[str]
    verified_scores: Optional[Dict[str, float]] = None  # {skill: confidence_score}

class AnalyzeRequest(BaseModel):
    """Full pipeline request (for JSON-based submissions)."""
    resume_text: str
    jd_text: str

# ── Response Models ─────────────────────────────────

class ScoreResponse(BaseModel):
    score: int
    reasoning: Optional[str] = None
    tier: Optional[str] = None
    training_weeks: Optional[int] = None
    hiring_recommendation: Optional[str] = None

class GapAnalysisResponse(BaseModel):
    missing_skills: List[str]

class RoadmapStep(BaseModel):
    step: int
    title: str
    type: str
    reasoning: Optional[str] = None
    resource_link: Optional[str] = None

class RoadmapResponse(BaseModel):
    roadmap: List[RoadmapStep]

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_option_index: int
    reasoning: str

class QuizResponse(BaseModel):
    questions: List[QuizQuestion]

# ── New Rich Response Models ────────────────────────

class SkillObject(BaseModel):
    name: str
    confidence: float
    signals: Optional[Dict[str, Any]] = None

class RankedGap(BaseModel):
    skill: str
    importance: float
    required_level: float
    current_score: float
    gap_magnitude: float
    action: str  # LEARN | REVISE | SKIP
    category: Optional[str] = None
    learning_time: Optional[int] = None
    difficulty: Optional[int] = None

class PathStep(BaseModel):
    step: int
    skill: str
    action: str
    effective_days: int
    difficulty: int
    importance: float
    category: str
    transfer_applied: bool
    is_prerequisite: bool

class LearningPath(BaseModel):
    path_name: str
    steps: List[PathStep]
    total_days: int
    skill_count: int
    skill_coverage: int
    avg_difficulty: float
    risk_score: float
    recommended: bool
    justification: str

class ReasoningItem(BaseModel):
    skill: str
    action: str
    current_score: float
    required_level: float
    gap_magnitude: float
    importance: float
    learning_time: int
    difficulty: int
    category: str
    reasons: List[str]
    transfer_note: str
    is_auto_inserted: bool

class RiskWarning(BaseModel):
    type: str
    severity: str
    skill: str
    detail: str
    recommendation: str

class SystemConfidence(BaseModel):
    score: float
    flag: str
    data_quality: float
    validation_strength: float
    model_certainty: float

class HiringRecommendation(BaseModel):
    score: int
    tier: str
    recommendation: str
    training_weeks: int

class TimeEstimate(BaseModel):
    total_days: int
    total_weeks: float
    estimated_completion: str

class FullAnalysisResponse(BaseModel):
    # 10 required outputs
    extracted_skills: List[SkillObject]
    verified_scores: List[RankedGap]
    ranked_gaps: List[RankedGap]
    optimal_path: Dict[str, Any]
    alternative_path: Dict[str, Any]
    time_estimate: TimeEstimate
    reasoning_trace: List[ReasoningItem]
    system_confidence: SystemConfidence
    risk_prediction: List[RiskWarning]
    hiring_recommendation: HiringRecommendation
    # Backward compat
    score: int
    tier: str
    training_weeks: int
    skills: List[str]
    skillsFull: List[SkillObject]
    missingSkills: List[str]
    jdSkills: List[str]
    roadmap: List[Dict[str, Any]]
    auto_inserted_prerequisites: List[str]
