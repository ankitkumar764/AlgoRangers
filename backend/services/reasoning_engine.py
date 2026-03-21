"""
Reasoning Engine
Generates explainable, per-skill decision traces.
Format: {skill} selected because:
  - Gap explanation
  - Dependency reasoning
  - Priority reasoning
"""
from typing import List, Dict, Optional
from services.skill_ontology import SKILL_ONTOLOGY, TRANSFER_LEARNING_MAP


DECISION_THRESHOLDS = {
    "SKIP": 0.75,    # final_score >= 0.75
    "REVISE": 0.40,  # 0.40 <= final_score < 0.75
    # Below 0.40 → LEARN
}


def get_action(final_score: float) -> str:
    """Determine SKIP / REVISE / LEARN based on final_score."""
    if final_score >= DECISION_THRESHOLDS["SKIP"]:
        return "SKIP"
    elif final_score >= DECISION_THRESHOLDS["REVISE"]:
        return "REVISE"
    else:
        return "LEARN"


def _check_transfer(skill: str, user_skills: List[str]) -> Optional[str]:
    """Return transfer learning note if applicable."""
    for existing, transfers in TRANSFER_LEARNING_MAP.items():
        if existing in user_skills:
            for target, days_saved, _ in transfers:
                if target == skill:
                    return f"Transfer learning from {existing} saves ~{days_saved} days."
    return None


def generate_skill_reasoning(
    skill: str,
    current_score: float,
    required_level: float,
    importance: float,
    jd_skills: List[str],
    user_skills: List[str],
    is_auto_inserted: bool = False,
    gap_magnitude: float = 0.0
) -> Dict:
    """
    Build a full reasoning trace for a single skill.
    Returns structured reasoning object.
    """
    meta = SKILL_ONTOLOGY.get(skill, {})
    deps = meta.get("dependencies", [])
    action = get_action(current_score)
    transfer_note = _check_transfer(skill, user_skills)

    reasons = []

    # Gap explanation
    if current_score < 0.5:
        reasons.append(f"Current proficiency ({round(current_score * 100)}%) is below required level ({round(required_level * 100)}%).")
    elif action == "REVISE":
        reasons.append(f"Proficiency ({round(current_score * 100)}%) needs reinforcement to meet role expectations.")
    elif action == "SKIP":
        reasons.append(f"Strong proficiency ({round(current_score * 100)}%) verified. No action needed.")

    # JD requirement reasoning
    if skill in jd_skills:
        reasons.append(f"Explicitly required in Job Description (importance: {round(importance * 100)}%).")
    elif is_auto_inserted:
        reasons.append(f"Auto-inserted as a prerequisite — not in JD but needed for dependent skills.")

    # Dependency reasoning
    if deps:
        met_deps = [d for d in deps if d in user_skills]
        unmet_deps = [d for d in deps if d not in user_skills]
        if met_deps:
            reasons.append(f"Prerequisites met: {', '.join(met_deps)}.")
        if unmet_deps:
            reasons.append(f"⚠️ Unmet prerequisites: {', '.join(unmet_deps)} — auto-added to learning path.")

    # Transfer learning
    if transfer_note:
        reasons.append(transfer_note)

    # Priority reasoning
    if importance >= 0.9:
        reasons.append("Extremely high priority — core skill for this role.")
    elif importance >= 0.75:
        reasons.append("High priority — strongly valued in the target role.")

    return {
        "skill": skill,
        "action": action,
        "current_score": round(current_score, 3),
        "required_level": round(required_level, 3),
        "gap_magnitude": round(gap_magnitude, 3),
        "importance": round(importance, 3),
        "learning_time": meta.get("learning_time", 7),
        "difficulty": meta.get("difficulty", 2),
        "category": meta.get("category", "General"),
        "reasons": reasons,
        "transfer_note": transfer_note or "",
        "is_auto_inserted": is_auto_inserted
    }


def generate_full_reasoning_trace(
    jd_skills: List[str],
    user_skills: List[str],
    skill_scores: Dict[str, float],    # { skill_name: final_score }
    auto_inserted: List[str]
) -> List[Dict]:
    """
    Generate reasoning for all skills in the learning path.
    """
    trace = []
    all_relevant_skills = jd_skills + [s for s in auto_inserted if s not in jd_skills]

    for skill in all_relevant_skills:
        meta = SKILL_ONTOLOGY.get(skill, {})
        current_score = skill_scores.get(skill, 0.0)
        required_level = 0.8  # Target proficiency level
        importance = meta.get("importance", 0.7)
        gap_magnitude = importance * max(0, required_level - current_score)
        is_auto = skill in auto_inserted and skill not in jd_skills

        reasoning = generate_skill_reasoning(
            skill=skill,
            current_score=current_score,
            required_level=required_level,
            importance=importance,
            jd_skills=jd_skills,
            user_skills=user_skills,
            is_auto_inserted=is_auto,
            gap_magnitude=gap_magnitude
        )
        trace.append(reasoning)

    # Sort: LEARN first, then REVISE, then SKIP
    order = {"LEARN": 0, "REVISE": 1, "SKIP": 2}
    trace.sort(key=lambda x: (order.get(x["action"], 3), -x["importance"]))
    return trace
