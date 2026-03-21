from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from models.schemas import (
    GapAnalysisResponse, RoadmapResponse, ScoreResponse,
    QuizResponse, GapAnalysisRequest, RoadmapRequest,
    ScoreRequest, QuizRequest
)
from services.ai_engine import extract_skills, generate_adaptive_roadmap, generate_conceptual_quiz, run_full_analysis
from services.scorer import calculate_readiness_score
from services.pdf_parser import extract_text_from_pdf

app = FastAPI(
    title="AlgoRangers — AI Decision Engine",
    description=(
        "Production-grade Explainable Skill Decision Engine. "
        "Graph-based dependency reasoning + cost-based path optimization + "
        "weighted confidence scoring. Every decision is deterministic and explainable."
    ),
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AlgoRangers AI Decision Engine v2.0 — /docs for Swagger UI."}


# ────────────────────────────────────────────
# POWER ENDPOINT — Full Pipeline (Single Call)
# ────────────────────────────────────────────

@app.post("/analyze")
async def analyze_full(
    file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    Single unified endpoint — runs the complete 10-module AI pipeline.
    Returns all 10 required outputs: extracted skills, verified scores,
    ranked gaps, optimal path, alternative path, time estimate,
    reasoning trace, system confidence, risk prediction, hiring recommendation.
    """
    try:
        # Parse resume
        if file.filename.lower().endswith(".pdf"):
            contents = await file.read()
            resume_text = extract_text_from_pdf(contents)
        else:
            resume_text = (await file.read()).decode("utf-8")

        if not resume_text.strip():
            # Demo mode: use sample text
            resume_text = "Experienced developer with Python, FastAPI, React, Git, Docker, PostgreSQL, REST API"

        result = await run_full_analysis(resume_text, jd_text)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# ────────────────────────────────────────────────────────────────────────────
# PRIMARY ENDPOINT — Spec-exact output (from prompt requirement)
# POST /analyze-profile
# ────────────────────────────────────────────────────────────────────────────

@app.post("/analyze-profile")
async def analyze_profile(
    file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """
    POST /analyze-profile — Full AI pipeline with spec-format JSON output.

    Returns:
    {
        "skills": [...],
        "verified_scores": {...},
        "skill_gap": [...],
        "optimal_path": [...],
        "alternative_path": [...],
        "time_estimate": "...",
        "reasoning": [...],
        "risk": [...],
        "system_confidence": "...",
        "hiring_decision": "Hire / Train"
    }
    """
    try:
        if file.filename.lower().endswith(".pdf"):
            contents = await file.read()
            resume_text = extract_text_from_pdf(contents)
        else:
            resume_text = (await file.read()).decode("utf-8")

        if not resume_text.strip():
            resume_text = "Experienced developer with Python, FastAPI, React, Git, Docker, PostgreSQL, REST API"

        result = await run_full_analysis(resume_text, jd_text)

        # Return spec-exact contract (matches the prompt's FINAL OUTPUT FORMAT)
        return {
            "skills":             result["skills"],
            "verified_scores":    result["verified_scores"],
            "skill_gap":          result["skill_gap"],
            "optimal_path":       result["optimal_path"],
            "alternative_path":   result["alternative_path"],
            "time_estimate":      result["time_estimate"]["estimated_completion"],
            "reasoning":          result["reasoning"],
            "risk":               result["risk"],
            "system_confidence":  result["system_confidence"],
            "hiring_decision":    result["hiring_decision"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile analysis failed: {str(e)}")


# ────────────────────────────────────────────────────────────────────────────
# GET /roadmap — Fetch cached roadmap from last analysis
# ────────────────────────────────────────────────────────────────────────────

@app.get("/roadmap")
def get_roadmap(jd_skills: str = "", resume_skills: str = ""):
    """
    GET /roadmap — Returns a roadmap given comma-separated skill lists.
    For full roadmap use POST /analyze with a resume file.
    """
    try:
        import asyncio
        from services.path_optimizer import generate_paths
        from services.graph_engine import get_learning_order

        jd_list = [s.strip() for s in jd_skills.split(",") if s.strip()]
        res_list = [s.strip() for s in resume_skills.split(",") if s.strip()]

        if not jd_list:
            return {"roadmap": [], "message": "Provide jd_skills query param (comma-separated)"}

        res_set = {s.lower() for s in res_list}
        missing = [s for s in jd_list if s.lower() not in res_set]
        ordered, auto_inserted, _ = get_learning_order(missing)
        path_a, path_b = generate_paths(ordered, res_list, auto_inserted)

        optimal = path_a if path_a.get("recommended") else path_b
        return {
            "roadmap": optimal.get("steps", []),
            "total_days": optimal.get("total_days", 0),
            "path_name": optimal.get("path_name", ""),
            "auto_inserted": auto_inserted,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ────────────────────────────────────────────────────────────────────────────
# Legacy Endpoints (Backward Compatibility)
# ────────────────────────────────────────────────────────────────────────────

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """Extract skills from a Resume (PDF/Text)"""
    try:
        if file.filename.lower().endswith(".pdf"):
            contents = await file.read()
            text = extract_text_from_pdf(contents)
        else:
            text = (await file.read()).decode("utf-8")
        skills = await extract_skills(text, is_resume=True)
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse-jd")
async def parse_jd(jd_text: str = Form(...)):
    """Extract skills from Job Description"""
    try:
        skills = await extract_skills(jd_text, is_resume=False)
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-gap", response_model=GapAnalysisResponse)
async def analyze_gap(request: GapAnalysisRequest):
    """Compare Resume skills vs JD skills"""
    r_set = {s.lower() for s in request.resume_skills}
    missing = [skill for skill in request.jd_skills if skill.lower() not in r_set]
    return GapAnalysisResponse(missing_skills=missing)

@app.post("/generate-roadmap", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    """Generate adaptive learning roadmap"""
    try:
        roadmap_data = await generate_adaptive_roadmap(request.missing_skills, request.user_skills)
        return RoadmapResponse(roadmap=roadmap_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate roadmap: " + str(e))

@app.post("/generate-quiz")
async def get_quiz(request: QuizRequest):
    """
    Generate skill-specific open-ended questions based on VERIFIED DOMAIN EXPERTISE.
    - Questions target matched skills (resume ∩ JD), not gaps
    - No two runs return the same questions (randomized variant selection)
    - Always returns 4 questions with robust fallback chain
    """
    try:
        from data.question_bank import select_questions
        # Extract verified_scores dict if provided (extra field in request body)
        verified_scores = getattr(request, 'verified_scores', None) or {}
        questions = select_questions(
            jd_skills=request.jd_skills,
            resume_skills=request.resume_skills,
            count=4,
            verified_scores=verified_scores,
        )
        return {"questions": questions, "count": len(questions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate quiz: " + str(e))


@app.post("/score-answer")
async def score_answer(request: dict):
    """Score an open-ended quiz answer against the rubric keywords."""
    try:
        from data.question_bank import score_answer as _score
        result = _score(
            answer=request.get("answer", ""),
            keywords=request.get("keywords", []),
            time_taken_seconds=request.get("time_taken_seconds")
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/get-score", response_model=ScoreResponse)
async def get_score(request: ScoreRequest):
    """Calculate interview readiness score"""
    score_data = calculate_readiness_score(request.resume_skills, request.jd_skills)
    return ScoreResponse(**score_data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
