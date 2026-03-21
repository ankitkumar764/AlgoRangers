def calculate_readiness_score(resume_skills: list[str], jd_skills: list[str]) -> dict:
    """Calculates interview readiness score based on skill overlap."""
    if not jd_skills:
        return {"score": 0, "reasoning": "No skills requested in Job Description."}
        
    resume_set = {s.lower() for s in resume_skills}
    jd_set = {s.lower() for s in jd_skills}
    
    matches = jd_set.intersection(resume_set)
    # Score out of 100 based on percentage of jd skills matched
    score = int((len(matches) / len(jd_set)) * 100) if len(jd_set) > 0 else 0
    
    reasoning = f"Matched {len(matches)} out of {len(jd_set)} required skills. Missing: {len(jd_skills) - len(matches)}."
    
    # Advanced Hiring Intelligence Logic
    missing_count = len(jd_set) - len(matches)
    
    # Estimate training (1 week per 2 missing skills, capped at 8)
    training_weeks = min(max(1, (missing_count // 2)), 8) if missing_count > 0 else 0
    
    # Tiering logic
    if score >= 85:
        tier = "Elite Match"
        recommendation = "Direct Hire - Immediate Productivity"
    elif score >= 60:
        tier = "Trainable Talent"
        recommendation = f"Hire with {training_weeks}-week Onboarding"
    else:
        tier = "Potential Growth"
        recommendation = "Consider for Junior/Intern roles"

    return {
        "score": score,
        "reasoning": reasoning,
        "tier": tier,
        "training_weeks": training_weeks,
        "hiring_recommendation": recommendation
    }
