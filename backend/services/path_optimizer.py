"""
Path Optimizer — Cost-Based Optimization
Generates Path A (Fast-track) and Path B (Deep-learning)
cost(path) = Σ learning_time + Σ difficulty_penalty + Σ dependency_penalty + Σ redundancy_penalty
"""
from typing import List, Dict, Tuple
from services.skill_ontology import SKILL_ONTOLOGY, TRANSFER_LEARNING_MAP

DIFFICULTY_PENALTY_SCALE = 2   # days per difficulty point above 3
DEPENDENCY_PENALTY = 1         # extra day per missing prerequisite (auto-inserted)
REDUNDANCY_PENALTY = 0         # future: penalize overlapping knowledge areas

def _apply_transfer_learning(skill: str, user_skills: List[str]) -> Tuple[float, float]:
    """
    Check if user has a transferable skill that reduces learning time.
    Returns (time_reduction_days, confidence_boost)
    """
    total_time_reduction = 0
    total_conf_boost = 0
    for existing_skill, transfers in TRANSFER_LEARNING_MAP.items():
        if existing_skill in user_skills:
            for target, time_red, conf_boost in transfers:
                if target == skill:
                    total_time_reduction += time_red
                    total_conf_boost += conf_boost
    return total_time_reduction, min(total_conf_boost, 0.3)


def compute_skill_cost(skill: str, user_skills: List[str], auto_inserted: List[str], skill_gaps: Dict[str, float]) -> Dict:
    """Calculate total cost for a single skill using exact formula: time + diff*2 + gap*3."""
    meta = SKILL_ONTOLOGY.get(skill, {})
    base_time = meta.get("learning_time", 7)
    difficulty = meta.get("difficulty", 2)
    gap = skill_gaps.get(skill, 0.0)

    cost = base_time + (difficulty * 2) + (gap * 3)

    return {
        "skill": skill,
        "base_time": base_time,
        "difficulty": difficulty,
        "gap": gap,
        "effective_time": cost  # Store exact computed cost here
    }


def generate_paths(
    ordered_skills: List[str],
    user_skills: List[str],
    auto_inserted: List[str],
    skill_gaps: Dict[str, float]
) -> Tuple[Dict, Dict]:
    """
    Generate Path A (Fast-track) and Path B (Deep-learning).
    
    Path A — Fast-track:
    - Only the most critical skills (importance ≥ 0.8)
    - Minimum viable coverage
    - Optimized for speed
    
    Path B — Deep-learning:
    - All required skills including important adjacents
    - Full prerequisite chain
    - Optimized for robustness
    """
    all_costs = {s: compute_skill_cost(s, user_skills, auto_inserted, skill_gaps) for s in ordered_skills}

    # Path A: Only very high importance skills
    path_a_skills = [
        s for s in ordered_skills
        if SKILL_ONTOLOGY.get(s, {}).get("importance", 0) >= 0.90
    ]
    if not path_a_skills:
        path_a_skills = ordered_skills[:max(len(ordered_skills) // 2, 1)]

    # Path B: All skills
    path_b_skills = ordered_skills

    def build_path_summary(skill_list: List[str], path_name: str, multiplier: float = 1.0) -> Dict:
        steps = []
        total_time = 0
        total_diff = 0

        for rank, skill in enumerate(skill_list, 1):
            cost_data = all_costs.get(skill, {})
            meta = SKILL_ONTOLOGY.get(skill, {})
            time_red, conf_boost = _apply_transfer_learning(skill, user_skills)
            
            # Apply mastery multiplier to the effective time
            eff_time = round(cost_data.get("effective_time", 7) * multiplier)
            total_time += eff_time
            total_diff += meta.get("difficulty", 2)

            steps.append({
                "step": rank,
                "skill": skill,
                "action": "LEARN",
                "effective_days": eff_time,
                "difficulty": meta.get("difficulty", 2),
                "importance": meta.get("importance", 0.5),
                "category": meta.get("category", "General"),
                "transfer_applied": time_red > 0,
                "transfer_reduction_days": time_red,
                "is_prerequisite": skill in auto_inserted,
                "reasoning": f"{'Auto-inserted prerequisite for' if skill in auto_inserted else 'Required by JD:'} {skill}"
            })

        avg_diff = round(total_diff / max(len(skill_list), 1), 1)
        skill_coverage = len([s for s in skill_list if s not in auto_inserted])
        risk_score = round(min(avg_diff / 5.0, 1.0), 2)

        return {
            "path_name": path_name,
            "steps": steps,
            "total_days": int(total_time),
            "skill_count": len(skill_list),
            "skill_coverage": skill_coverage,
            "avg_difficulty": avg_diff,
            "risk_score": risk_score,
            "recommended": path_name == "Path A — Fast-Track" # Default recommendation for speed
        }

    path_a = build_path_summary(path_a_skills, "Path A — Fast-Track", multiplier=1.0)
    path_b = build_path_summary(path_b_skills, "Path B — Deep Learning", multiplier=1.5) # Deep learning takes 50% longer

    # Logic: If Deep Learning is actually faster (unlikely with 1.5x), recommend it
    if path_b["total_days"] < path_a["total_days"]:
        path_b["recommended"] = True
        path_a["recommended"] = False
    else:
        path_a["recommended"] = True
        path_b["recommended"] = False

    # Build justification
    if path_a["recommended"]:
        path_a["justification"] = f"Saves {path_b['total_days'] - path_a['total_days']} days. Covers all critical JD requirements."
        path_b["justification"] = f"Provides deeper mastery with {path_b['skill_count']} skills. Better for senior roles."
    else:
        path_b["justification"] = "Recommended for comprehensive role readiness."
        path_a["justification"] = "Consider for time-constrained situations."

    return path_a, path_b
