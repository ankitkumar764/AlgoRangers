"""
Master AI Engine — Full Pipeline Orchestration v3.0
====================================================
REAL FORMULAS — NO STUBS — NO MOCKS

Pipeline:
  Input → Extraction → Normalization → Confidence Scoring → Transfer Learning
  → Weighted Gap → DAG Ordering → Cost-Based Path Optimization
  → Multi-Path Comparison → Reasoning → Risk → System Confidence → Output
"""
import re
from typing import List, Dict, Any, Tuple

from services.skill_ontology import (
    SKILL_ONTOLOGY, TECHNICAL_SKILLS_LIBRARY as LIBRARY,
    normalize_skill, get_all_canonical_skills,
    TRANSFER_LEARNING_MAP
)
from services.confidence_engine import calculate_confidence
from services.graph_engine import get_learning_order
from services.path_optimizer import generate_paths, _apply_transfer_learning
from services.risk_engine import detect_risks, compute_system_confidence
from services.reasoning_engine import generate_full_reasoning_trace, get_action

# Alias for backward compatibility
TECHNICAL_SKILLS_LIBRARY = get_all_canonical_skills()

# ─── Constants ────────────────────────────────────────────────────────────────
REQUIRED_LEVEL = 0.80          # Target proficiency threshold
EXAGGERATION_TIER_PENALTY = 1  # Hiring tier drops by this many tiers per exaggerated skill


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 1 — Skill Extraction + Normalization
# ─────────────────────────────────────────────────────────────────────────────

async def extract_skills(text: str, is_resume: bool = True) -> List[Dict[str, Any]]:
    """
    Extract skills from text using the ontology + alias normalization.

    Algorithm:
      1. Scan all canonical skills via word-boundary regex
      2. For JD text: also tokenize and alias-normalize for short skill mentions
      3. Compute confidence for each found skill

    Returns: [{ name, confidence, signals }]
    """
    results = []
    found_names = set()

    for skill in TECHNICAL_SKILLS_LIBRARY:
        conf, signals = calculate_confidence(skill, text)
        if conf > 0:
            results.append({
                "name": skill,
                "confidence": conf,
                "signals": signals
            })
            found_names.add(skill)

    # For JD text: tokenize and alias-normalize to catch shorthand like "reactjs", "k8s"
    if not is_resume:
        tokens = re.split(r'[\s,\-/|()]+', text)
        for token in tokens:
            token = token.strip().rstrip('.').rstrip(',')
            if len(token) < 2:
                continue
            canonical = normalize_skill(token)
            if canonical and canonical not in found_names:
                results.append({"name": canonical, "confidence": 0.80, "signals": {}})
                found_names.add(canonical)

    if not results:
        results = [{"name": "Software Engineering", "confidence": 0.5, "signals": {}}]

    return results


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 2 — Transfer Learning Boost
# ─────────────────────────────────────────────────────────────────────────────

def _get_transfer_boost(skill: str, user_skills: List[str]) -> float:
    """
    If the user has a related skill, apply a confidence boost to this skill.

    Uses TRANSFER_LEARNING_MAP from skill_ontology.
    Formula: boost = conf_boost (capped at 0.25 total)

    Example: User knows Java → 10% confidence boost when scoring Node.js
    """
    total_boost = 0.0
    for existing_skill, transfers in TRANSFER_LEARNING_MAP.items():
        if existing_skill in user_skills:
            for target, _time_reduction, conf_boost in transfers:
                if target == skill:
                    total_boost += conf_boost
    return min(total_boost, 0.25)


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 3 — Weighted Readiness Score
# ─────────────────────────────────────────────────────────────────────────────

def _compute_weighted_score(
    jd_skills: List[str],
    confidence_map: Dict[str, float],
    resume_skills: List[str]
) -> int:
    """
    Real weighted readiness score.

    Formula:
      score = Σ(importance_i × final_score_i) / Σ(importance_i) × 100

    This is NOT a simple match count ratio — it weights skills by their
    importance in the ontology and the user's actual proficiency score.
    """
    numerator = 0.0
    denominator = 0.0

    for skill in jd_skills:
        meta = SKILL_ONTOLOGY.get(skill, {})
        importance = meta.get("importance", 0.7)
        raw_conf = confidence_map.get(skill, 0.0)
        transfer_boost = _get_transfer_boost(skill, resume_skills)
        final_score = min(1.0, raw_conf + transfer_boost)

        numerator += importance * final_score
        denominator += importance

    if denominator == 0:
        return 0

    return round((numerator / denominator) * 100)


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 4 — Exaggeration Analysis
# ─────────────────────────────────────────────────────────────────────────────

def _analyze_exaggeration(resume_skills_raw: List[Dict]) -> Dict:
    """
    Count and classify exaggeration signals from the resume.

    An exaggerated skill is one where:
    - Mentions > 5 but no project context (from confidence_engine signals)

    Returns:
      { exaggerated_skills: [...], exaggeration_count: int, penalty_applied: bool }
    """
    exaggerated = [
        s["name"] for s in resume_skills_raw
        if s.get("signals", {}).get("exaggeration", False)
    ]
    return {
        "exaggerated_skills": exaggerated,
        "exaggeration_count": len(exaggerated),
        "penalty_applied": len(exaggerated) > 0
    }


# ─────────────────────────────────────────────────────────────────────────────
# MODULE 5 — Full Analysis Pipeline
# ─────────────────────────────────────────────────────────────────────────────

async def run_full_analysis(
    resume_text: str,
    jd_text: str
) -> Dict[str, Any]:
    """
    Full deterministic pipeline — 12 steps:

    Step 1:  Extract + normalize resume skills
    Step 2:  Extract + normalize JD skills
    Step 3:  Compute confidence scores per skill
    Step 4:  Apply transfer learning boosts to confidence
    Step 5:  Compute real weighted readiness score
    Step 6:  Compute weighted skill gaps (importance × gap)
    Step 7:  DAG topological sort + auto-insert prerequisites
    Step 8:  Cost-based path optimization (Path A / Path B)
    Step 9:  Risk detection (5 checks)
    Step 10: Per-skill reasoning trace
    Step 11: System confidence = data_quality × validation × certainty
    Step 12: Hiring intelligence using weighted score + exaggeration penalty
    """

    # ── Step 1+2: Skill Extraction ──────────────────────────────────────────
    resume_skills_raw = await extract_skills(resume_text, is_resume=True)
    jd_skills_raw = await extract_skills(jd_text, is_resume=False)

    resume_skills = [s["name"] for s in resume_skills_raw]
    jd_skills = [s["name"] for s in jd_skills_raw]

    # ── Step 3: Confidence Map ──────────────────────────────────────────────
    confidence_map: Dict[str, float] = {
        s["name"]: s["confidence"] for s in resume_skills_raw
    }

    # ── Step 4: Exaggeration Analysis ──────────────────────────────────────
    exaggeration = _analyze_exaggeration(resume_skills_raw)

    # ── Step 5: Weighted Readiness Score ───────────────────────────────────
    # Formula: Σ(importance × final_score) / Σ(importance) × 100
    score = _compute_weighted_score(jd_skills, confidence_map, resume_skills)

    # ── Step 6: Weighted Gap Calculation ───────────────────────────────────
    # Formula: gap = importance × max(0, required_level - final_score)
    # final_score = min(1.0, confidence + transfer_boost)
    ranked_gaps = []
    for skill in jd_skills:
        meta = SKILL_ONTOLOGY.get(skill, {})
        importance = meta.get("importance", 0.7)
        raw_conf = confidence_map.get(skill, 0.0)

        # Apply transfer learning boost to confidence
        transfer_boost = _get_transfer_boost(skill, resume_skills)
        final_score = min(1.0, raw_conf + transfer_boost)

        # Real gap formula exactly as constrained
        gap = importance * max(0.0, REQUIRED_LEVEL - final_score)
        
        prereqs = meta.get("prerequisites", [])
        dependency_missing = any(req not in resume_skills for req in prereqs)
        if dependency_missing:
            gap += 1.5  # penalty
            
        gap_magnitude = gap
        action = get_action(final_score)

        ranked_gaps.append({
            "skill": skill,
            "importance": importance,
            "required_level": REQUIRED_LEVEL,
            "current_score": round(final_score, 3),
            "raw_confidence": round(raw_conf, 3),
            "transfer_boost": round(transfer_boost, 3),
            "gap_magnitude": round(gap_magnitude, 3),
            "action": action,
            "category": meta.get("category", "General"),
            "learning_time": meta.get("learning_time", 7),
            "difficulty": meta.get("difficulty", 2)
        })

    # Sort gaps: highest gap first (most critical to learn)
    ranked_gaps.sort(key=lambda x: x["gap_magnitude"], reverse=True)

    # ── Step 7: DAG + Topological Sort ─────────────────────────────────────
    # Skills requiring action in dependency order
    skills_to_learn = [g["skill"] for g in ranked_gaps if g["action"] != "SKIP"]
    ordered_path, auto_inserted, has_cycle = get_learning_order(skills_to_learn)

    # ── Step 8: Cost-Based Path Optimization ───────────────────────────────
    # cost(skill) = learning_time + difficulty * 2 + gap * 3
    skill_gaps_map = {g["skill"]: g["gap_magnitude"] for g in ranked_gaps}
    path_a, path_b = generate_paths(ordered_path, resume_skills, auto_inserted, skill_gaps_map)

    # ── Step 9: Risk Detection ──────────────────────────────────────────────
    skill_score_map = {g["skill"]: g["current_score"] for g in ranked_gaps}
    risks = detect_risks(
        resume_skills=resume_skills,
        missing_skills=skills_to_learn,
        skill_scores=skill_score_map,
        auto_inserted_prerequisites=auto_inserted
    )

    # ── Step 10: Reasoning Trace ────────────────────────────────────────────
    reasoning_trace = generate_full_reasoning_trace(
        jd_skills=jd_skills,
        user_skills=resume_skills,
        skill_scores=skill_score_map,
        auto_inserted=auto_inserted
    )

    # ── Step 11: System Confidence ──────────────────────────────────────────
    # system_confidence = data_quality × validation_strength × model_certainty
    avg_conf = (
        sum(confidence_map.values()) / max(len(confidence_map), 1)
    )
    system_confidence = compute_system_confidence(
        resume_skill_count=len(resume_skills),
        jd_skill_count=len(jd_skills),
        avg_confidence=avg_conf
    )

    # ── Step 12: Hiring Intelligence ────────────────────────────────────────
    # Exaggeration penalty: each exaggerated skill reduces tier
    effective_score = score
    exag_count = exaggeration["exaggeration_count"]

    # Score penalty for exaggeration (each exaggerated skill → -3 points cap at -15)
    exaggeration_score_penalty = min(exag_count * 3, 15)
    effective_score = max(0, score - exaggeration_score_penalty)

    if effective_score >= 85:
        tier = "Elite Match"
        hiring_recommendation = "Direct Hire — Immediate Productivity"
        training_weeks = 0
        hiring_decision = "HIRE"
    elif effective_score >= 65:
        training_weeks = max(1, len(skills_to_learn) // 2)
        tier = "Trainable Talent"
        hiring_recommendation = f"Hire with {training_weeks}-week Onboarding"
        hiring_decision = "HIRE_WITH_TRAINING"
    elif effective_score >= 45:
        training_weeks = max(2, len(skills_to_learn))
        tier = "Potential Growth"
        hiring_recommendation = "Consider for Junior/Intern roles — significant training required"
        hiring_decision = "TRAIN_FIRST"
    else:
        training_weeks = max(4, len(skills_to_learn) + 2)
        tier = "Significant Gap"
        hiring_recommendation = "Not ready for current role — recommend upskilling program"
        hiring_decision = "REJECT"

    # Exaggeration warning in decision
    exaggeration_note = ""
    if exag_count > 0:
        exaggeration_note = (
            f"⚠️ {exag_count} skill(s) appear exaggerated on resume "
            f"({', '.join(exaggeration['exaggerated_skills'][:3])}). "
            f"Score adjusted from {score}% to {effective_score}%."
        )

    # Time estimate from optimal path
    optimal_path = path_a if path_a.get("recommended") else path_b
    total_days = optimal_path.get("total_days", 0)

    return {
        # ── Primary Output Contract (spec-format) ──
        "skills":              resume_skills,
        "verified_scores":     ranked_gaps,
        "skill_gap":           [g for g in ranked_gaps if g["action"] == "LEARN"],
        "optimal_path":        path_a if path_a.get("recommended") else path_b,
        "alternative_path":    path_b if path_a.get("recommended") else path_a,
        "time_estimate":       {
            "total_days": int(total_days),
            "total_weeks": round(total_days / 7, 1),
            "estimated_completion": f"~{int(total_days)} days ({round(total_days / 7, 1)} weeks)"
        },
        "reasoning":           reasoning_trace,
        "risk":                risks,
        "system_confidence":   system_confidence,
        "hiring_decision":     hiring_decision,

        # ── Extended Output ──
        "extracted_skills":    resume_skills_raw,
        "ranked_gaps":         ranked_gaps,
        "reasoning_trace":     reasoning_trace,
        "risk_prediction":     risks,
        "hiring_recommendation": {
            "score":              score,
            "effective_score":    effective_score,
            "tier":               tier,
            "recommendation":     hiring_recommendation,
            "hiring_decision":    hiring_decision,
            "training_weeks":     training_weeks,
            "exaggeration_note":  exaggeration_note,
            "exaggeration_detail": exaggeration
        },

        # ── Backward-compatible fields for frontend ──
        "score":               effective_score,
        "tier":                tier,
        "training_weeks":      training_weeks,
        "hiringRecommendation": hiring_recommendation,
        "skillsFull":          resume_skills_raw,
        "missingSkills":       [g["skill"] for g in ranked_gaps if g["action"] == "LEARN"],
        "jdSkills":            jd_skills,
        "auto_inserted_prerequisites": auto_inserted,

        # ── Roadmap for frontend Roadmap component ──
        "roadmap": [
            {
                "step":          i + 1,
                "title":         step["skill"],
                "type":          step["action"].lower(),
                "reasoning":     " ".join(step.get("reasons", []))[:300],
                "resource_link": (
                    f"https://www.google.com/search?q=learn+"
                    f"{step['skill'].replace(' ', '+')}"
                ),
                "learning_time": step.get("learning_time", 7),
                "difficulty":    step.get("difficulty", 2),
                "importance":    step.get("importance", 0.7),
                "transfer_note": step.get("transfer_note", ""),
                "is_auto_inserted": step.get("is_auto_inserted", False),
            }
            for i, step in enumerate(
                [r for r in reasoning_trace if r["action"] != "SKIP"][:8]
            )
        ],
    }


# ─────────────────────────────────────────────────────────────────────────────
# Legacy helpers — kept for backward compatibility
# ─────────────────────────────────────────────────────────────────────────────

async def generate_adaptive_roadmap(missing_skills, user_skills):
    """Legacy roadmap generation (backward compat only)."""
    steps = []
    for i, skill in enumerate(missing_skills[:5]):
        meta = SKILL_ONTOLOGY.get(skill, {})
        steps.append({
            "step":          i + 1,
            "title":         f"Master {skill}",
            "type":          "learn",
            "reasoning":     f"{skill} is required by the JD and not sufficiently covered in your resume.",
            "resource_link": f"https://www.google.com/search?q=learn+{skill.replace(' ', '+')}",
        })
    return steps


async def generate_conceptual_quiz(jd_skills, resume_skills):
    """Legacy stub — quiz is now handled by /generate-quiz endpoint with real question bank."""
    from data.question_bank import select_questions
    return select_questions(jd_skills=jd_skills, resume_skills=resume_skills, count=4)
