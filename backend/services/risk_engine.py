"""
Risk Engine — Failure & Risk Prediction
Detects:
- Weak prerequisites
- Steep learning jumps
- Inconsistent skill profiles
- Low system confidence flags
"""
from typing import List, Dict
from services.skill_ontology import SKILL_ONTOLOGY


SEVERITY_HIGH = "HIGH"
SEVERITY_MEDIUM = "MEDIUM"
SEVERITY_LOW = "LOW"


def detect_risks(
    resume_skills: List[str],
    missing_skills: List[str],
    skill_scores: Dict[str, float],
    auto_inserted_prerequisites: List[str]
) -> List[Dict]:
    """
    Run all risk detection checks.
    Returns a list of risk warnings with severity and recommendation.
    """
    risks = []
    resume_set = {s.lower() for s in resume_skills}

    # 1. Weak Prerequisites
    for skill in missing_skills:
        meta = SKILL_ONTOLOGY.get(skill, {})
        deps = meta.get("dependencies", [])
        for dep in deps:
            dep_score = skill_scores.get(dep, 0)
            if dep.lower() not in resume_set and dep_score < 0.4:
                risks.append({
                    "type": "WEAK_PREREQUISITE",
                    "severity": SEVERITY_HIGH,
                    "skill": skill,
                    "detail": f"Prerequisite '{dep}' is weak or missing before learning '{skill}'.",
                    "recommendation": f"Learn '{dep}' first to avoid confusion."
                })

    # 2. Steep Learning Jumps (>= 2 difficulty difference between consecutive skills)
    all_target = missing_skills
    for i in range(len(all_target) - 1):
        curr = all_target[i]
        nxt = all_target[i + 1]
        curr_diff = SKILL_ONTOLOGY.get(curr, {}).get("difficulty", 1)
        nxt_diff = SKILL_ONTOLOGY.get(nxt, {}).get("difficulty", 1)
        if nxt_diff - curr_diff >= 2:
            risks.append({
                "type": "STEEP_JUMP",
                "severity": SEVERITY_MEDIUM,
                "skill": nxt,
                "detail": f"Difficulty jumps from {curr_diff}/5 ({curr}) to {nxt_diff}/5 ({nxt}).",
                "recommendation": f"Consider adding a bridge skill or spending extra time on '{curr}'."
            })

    # 3. Auto-Inserted Prerequisites (potential learning burden)
    if auto_inserted_prerequisites:
        for prereq in auto_inserted_prerequisites:
            risks.append({
                "type": "MISSING_PREREQUISITE",
                "severity": SEVERITY_MEDIUM,
                "skill": prereq,
                "detail": f"'{prereq}' was auto-added as a prerequisite — not in resume or JD.",
                "recommendation": f"Handle '{prereq}' as foundational learning before proceeding."
            })

    # 4. High-Difficulty skill with low confidence
    for skill, score in skill_scores.items():
        meta = SKILL_ONTOLOGY.get(skill, {})
        if meta.get("difficulty", 1) >= 4 and score < 0.4:
            risks.append({
                "type": "LOW_CONFIDENCE_HARD_SKILL",
                "severity": SEVERITY_MEDIUM,
                "skill": skill,
                "detail": f"'{skill}' is high difficulty (level {meta.get('difficulty')}/5) but confidence is only {round(score * 100)}%.",
                "recommendation": f"Allocate extra time and practice projects for '{skill}'."
            })

    # 5. General skill overload
    if len(missing_skills) > 8:
        risks.append({
            "type": "SKILL_OVERLOAD",
            "severity": SEVERITY_LOW,
            "skill": "Overall Path",
            "detail": f"{len(missing_skills)} skills needed — this is a long learning journey.",
            "recommendation": "Prioritize fast-track path (Path A) first. Tackle deep learning path later."
        })

    # Deduplicate by skill+type
    seen = set()
    unique_risks = []
    for r in risks:
        key = f"{r['type']}:{r['skill']}"
        if key not in seen:
            seen.add(key)
            unique_risks.append(r)

    # Sort by severity
    severity_order = {SEVERITY_HIGH: 0, SEVERITY_MEDIUM: 1, SEVERITY_LOW: 2}
    unique_risks.sort(key=lambda x: severity_order.get(x["severity"], 3))
    return unique_risks


def compute_system_confidence(
    resume_skill_count: int,
    jd_skill_count: int,
    avg_confidence: float,
    validation_score: float = 0.5
) -> Dict:
    """
    system_confidence = data_quality × validation_strength × model_certainty
    """
    # Data quality: how many skills were found (more = better)
    data_quality = min(resume_skill_count / 10.0, 1.0)

    # Validation strength: how strong the confidence scores are
    validation_strength = avg_confidence

    # Model certainty: based on JD richness
    model_certainty = min(jd_skill_count / 5.0, 1.0)

    system_confidence = (
        data_quality *
        validation_strength *
        model_certainty
    )
    system_confidence = round(min(system_confidence, 1.0), 3)

    flag = "low_confidence" if system_confidence < 0.6 else "confident"

    return {
        "score": system_confidence,
        "flag": flag,
        "data_quality": round(data_quality, 3),
        "validation_strength": round(validation_strength, 3),
        "model_certainty": round(model_certainty, 3)
    }
