"""
Confidence Engine
Formula: confidence = (freq_weight × mentions) + (project_weight × project_presence) + (exp_weight × years)
- Detect exaggeration signals
- Normalize to [0, 1]
"""
import re
from typing import Tuple

FREQ_WEIGHT = 0.3
PROJECT_WEIGHT = 0.4
EXP_WEIGHT = 0.3

def _count_mentions(skill: str, text: str) -> int:
    """Count valid word-boundary occurrences of a skill in text."""
    pattern = r'\b' + re.escape(skill) + r'\b'
    return len(re.findall(pattern, text, re.IGNORECASE))

def _detect_project_presence(skill: str, text: str) -> bool:
    """Detect if a skill is mentioned in the context of a project or work experience."""
    # Find area around skill mention
    pattern = r'(?i)(.{0,120}' + re.escape(skill) + r'.{0,120})'
    contexts = re.findall(pattern, text, re.IGNORECASE)
    project_keywords = r'\b(project|built|developed|implemented|created|worked|used|deployed|integrated|maintained)\b'
    for ctx in contexts:
        if re.search(project_keywords, ctx, re.IGNORECASE):
            return True
    return False

def _extract_years_of_experience(skill: str, text: str) -> float:
    """Try to extract years of experience near a skill mention."""
    # Patterns: "3 years of React", "React (2 yrs)", "experienced in X for 4 years"
    pattern = r'(\d+(?:\.\d+)?)\s*(?:year|yr)s?\s*(?:of\s*)?(?:experience\s*(?:with|in)?\s*)?' + re.escape(skill)
    alt_pattern = re.escape(skill) + r'\s*[\(\-\s]+\s*(\d+(?:\.\d+)?)\s*(?:year|yr)'
    match = re.search(pattern, text, re.IGNORECASE) or re.search(alt_pattern, text, re.IGNORECASE)
    if match:
        return min(float(match.group(1)), 10.0)  # Cap at 10 years
    return 0.0

def _detect_exaggeration(skill: str, text: str, mentions: int) -> bool:
    """
    Detect exaggeration signals:
    - Skill appears many times but no project context
    - Claims high experience but skill is mentioned only once
    """
    if mentions > 5 and not _detect_project_presence(skill, text):
        return True
    return False

def calculate_confidence(skill: str, text: str) -> Tuple[float, dict]:
    """
    Full confidence calculation with signal breakdown.
    Returns (confidence_score, signal_details)
    """
    mentions = _count_mentions(skill, text)
    if mentions == 0:
        return 0.0, {"mentions": 0, "project_presence": False, "years": 0.0, "exaggeration": False}

    project_present = _detect_project_presence(skill, text)
    years = _extract_years_of_experience(skill, text)
    exaggerated = _detect_exaggeration(skill, text, mentions)

    # Normalize mentions to [0,1] (cap at 6 occurrences = 1.0)
    freq_score = min(mentions / 6.0, 1.0)

    # Project presence binary → score
    project_score = 1.0 if project_present else 0.3

    # Experience score: normalize to [0,1] (5+ years = 1.0)
    exp_score = min(years / 5.0, 1.0) if years > 0 else 0.2

    # Weighted combination
    confidence = (
        (FREQ_WEIGHT * freq_score) +
        (PROJECT_WEIGHT * project_score) +
        (EXP_WEIGHT * exp_score)
    )

    # Apply exaggeration penalty (no project)
    if exaggerated:
        confidence *= 0.6

    confidence = round(min(max(confidence, 0.0), 0.98), 3)

    signals = {
        "mentions": mentions,
        "project_presence": project_present,
        "years": years,
        "exaggeration": exaggerated,
        "freq_score": round(freq_score, 3),
        "project_score": round(project_score, 3),
        "exp_score": round(exp_score, 3)
    }
    return confidence, signals
