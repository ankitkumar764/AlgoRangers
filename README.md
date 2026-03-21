<div align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<h1 align="center">🤖 AlgoRangers: Explainable Skill Decision Engine</h1>

> **A deterministic, 14-module AI pipeline that moves beyond simple keyword matching.** AlgoRangers verifies skills natively via ontologies, enforces strict dependency graphs using Kahn's algorithm, and dynamically optimizes learning paths based on transfer learning and computed time-cost functions.

---

## 🌟 The Problem We Solve

Traditional hiring platforms and "AI Resume Scanners" suffer from fundamental flaws: they rely on binary keyword extraction, ignore skill dependencies (e.g., suggesting *React* before *JavaScript*), and treat all missing skills equally. 

**AlgoRangers solves this by introducing mathematical rigor into talent assessment:**

| Capability | The Industry Standard | The AlgoRangers Approach |
|---|---|---|
| **Skill Detection** | Simple Regex / Keyword Match | Context-aware ontological scanning with experience & project weightings. |
| **Gap Analysis** | "Missing 3 keywords" | Weighted gap magnitude: `Importance × (Required - Actual Score)`. |
| **Learning Path** | Alphabetical checklists | Live Directed Acyclic Graph (DAG) generation utilizing topological sorts. |
| **Confidence Scoring**| "98% Match" | Multi-variable weighted readiness score penalized by detected exaggeration. |

---

## 🔥 Proprietary Engine Features

### 1. The Confidence Engine
We don't just ask *if* a skill exists; we calculate *how well* it's understood.
* **Base Formula:** `(Frequency × 0.4) + (Project Context × 0.35) + (Years Experience × 0.25)`
* **Exaggeration Guard:** If a candidate mentions a skill 5+ times but provides zero project context, the engine automatically triggers a massive confidence penalty to punish buzzword stuffing.

### 2. Transfer Learning Optimization
If the engine detects `Java` on a resume, but the job requires `Node.js`, the system automatically applies a **Transfer Learning Boost**. It acknowledges the shared paradigm, boosting the `Node.js` confidence threshold by 10% and reducing the required estimated learning time by 3 days.

### 3. Topological Cost Optimizer 
Our backend runs Kahn's Algorithm to generate strict prerequisite chains. It computes the absolute fastest route to hire-readiness using a proprietary cost function:
`Cost = Learning Time + (Difficulty Penalty) + (Dependency Depth Penalty) - (Transfer Reduction)`

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AlgoRangers AI Pipeline                          │
│                                                                       │
│  Input                                                                │
│  ┌──────────┐  ┌──────────┐                                          │
│  │ Resume   │  │  JD Text │                                          │
│  │ PDF/TXT  │  │ (string) │                                          │
│  └────┬─────┘  └────┬─────┘                                         │
│       └──────┬───────┘                                               │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 1: Extraction │ ← Word-boundary regex + ontology scan    │
│  │  skill_ontology.py    │   50+ skills, aliases: "reactjs"→"React" │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 2: Confidence │ ← confidence = freq×0.4                  │
│  │  confidence_engine.py │              + project×0.35              │
│  │                       │              + experience×0.25           │
│  │                       │   Exaggeration: ×0.75 penalty            │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 3: Transfer   │ ← Java known → Node.js: +0.10 conf       │
│  │  Learning Boost       │              -3 days learning time        │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 4: Weighted   │ ← score = Σ(importance×final_score)      │
│  │  Readiness Score      │           / Σ(importance) × 100          │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 5: Gap Engine │ ← gap = importance × max(0, 0.8−score)  │
│  │  ai_engine.py         │   Sorted DESC by gap magnitude            │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 6: DAG Engine │ ← Kahn's Algorithm: topological sort     │
│  │  graph_engine.py      │   Auto-insert missing prerequisites       │
│  │                       │   Cycle detection                         │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 7: Path       │ ← cost(skill) = learning_time            │
│  │  Optimizer            │             + max(0, diff−3) × 2         │
│  │  path_optimizer.py    │             + dep_penalty                 │
│  │                       │             − transfer_reduction          │
│  │                       │   Path A: high-importance only (fast)     │
│  │                       │   Path B: all skills (deep)               │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 8: Risk       │ ← 5 checks: weak prereq, steep jump,     │
│  │  risk_engine.py       │   missing prereq, low-conf hard skill,    │
│  │                       │   skill overload                          │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 9: Reasoning  │ ← Per-skill JSON trace: gap, importance, │
│  │  reasoning_engine.py  │   dependency, transfer, priority rank     │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 10: System    │ ← sys_conf = data_quality×0.4            │
│  │  Confidence           │            + validation×0.4              │
│  │  risk_engine.py       │            + model_certainty×0.2         │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│  ┌───────────────────────┐                                           │
│  │  MODULE 11: Hiring    │ ← Weighted score + exaggeration penalty  │
│  │  Intelligence         │   HIRE / HIRE_WITH_TRAINING / TRAIN /    │
│  │                       │   REJECT with explicit reasoning          │
│  └───────────┬───────────┘                                           │
│              ▼                                                        │
│         JSON Output                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Core Algorithms (with Formulas)

### 4.1 Confidence Scoring
```python
# confidence_engine.py
freq_score    = min(mentions / 6.0, 1.0)          # cap at 6 occurrences
project_score = 1.0 if project_context else 0.3
exp_score     = min(years / 5.0, 1.0) if years > 0 else 0.2

confidence = (
    0.40 * freq_score +
    0.35 * project_score +
    0.25 * exp_score
)

if exaggerated:       # >5 mentions, no project context
    confidence *= 0.75
```

### 4.2 Transfer Learning Boost
```python
# ai_engine.py + skill_ontology.py
# If user knows Java → Node.js learning is cheaper and confidence is higher
TRANSFER_LEARNING_MAP = {
    "Java":   [("Node.js", 3, 0.10), ("Python", 2, 0.05)],
    "Python": [("JavaScript", 2, 0.05), ("Node.js", 3, 0.10)],
    "React":  [("Vue", 4, 0.15), ("Angular", 3, 0.10)],
    ...
}
transfer_boost = sum(conf_boost for matching transfers)  # capped at 0.25
final_score = min(1.0, raw_confidence + transfer_boost)
```

### 4.3 Weighted Readiness Score
```python
# ai_engine.py — NOT a count ratio
score = (
    Σ(importance_i × final_score_i)
    ─────────────────────────────── × 100
         Σ(importance_i)
)
```

### 4.4 Gap Magnitude
```python
# ai_engine.py
required_level = 0.80   # 80% proficiency expected
gap = importance × max(0, required_level - final_score)
# Sorted DESC — highest gap = first to learn
```

### 4.5 Graph (DAG) Engine — Kahn's Algorithm
```python
# graph_engine.py
def topological_sort(dag):
    in_degree = compute_in_degrees(dag)
    queue = [n for n in dag if in_degree[n] == 0]
    order = []
    while queue:
        node = queue.pop()
        order.append(node)
        for neighbor in adjacency[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    has_cycle = len(order) != len(all_nodes)
    return order, has_cycle
```

### 4.6 Path Cost Function
```python
# path_optimizer.py
def cost(skill):
    base      = learning_time                       # days from ontology
    diff_pen  = max(0, difficulty - 3) * 2         # higher than level 3 → +2 days/level
    dep_pen   = 1 if auto_inserted else 0           # missing prereq overhead
    transfer  = time_reduction from transfer map
    return base + diff_pen + dep_pen - transfer     # minimized by path optimizer
```

### 4.7 System Confidence
```python
# risk_engine.py
data_quality      = min(resume_skill_count / 10.0, 1.0)
validation_str    = avg_confidence_score
model_certainty   = min(jd_skill_count / 5.0, 1.0)

system_confidence = (
    0.40 * data_quality +
    0.40 * validation_str +
    0.20 * model_certainty
)
```

---

## 5. Data Structures

### Skill Object (Ontology Node)
```python
"React": {
    "importance":    0.95,       # 0-1: role criticality
    "difficulty":    3,          # 1-5: learning complexity  
    "learning_time": 14,         # days to reach proficiency
    "dependencies":  ["JavaScript"],  # prerequisite skills (DAG edges)
    "category":      "Frontend",
    "tags":          ["ui", "component", "spa"]
}
```

### Gap Object
```python
{
    "skill":          "React",
    "importance":     0.95,
    "required_level": 0.80,
    "current_score":  0.32,       # confidence + transfer_boost
    "raw_confidence": 0.22,
    "transfer_boost": 0.10,       # from knowing JavaScript
    "gap_magnitude":  0.456,      # 0.95 × (0.80 - 0.32)
    "action":         "LEARN",    # LEARN / REVISE / SKIP
    "learning_time":  14,
    "difficulty":     3
}
```

### Reasoning Trace Object
```python
{
    "skill":         "React",
    "action":        "LEARN",
    "current_score": 0.32,
    "gap_magnitude": 0.456,
    "importance":    0.95,
    "reasons": [
        "Current proficiency (32%) is below required level (80%).",
        "Explicitly required in Job Description (importance: 95%).",
        "⚠️ Unmet prerequisites: JavaScript — auto-added to learning path.",
        "Extremely high priority — core skill for this role."
    ],
    "transfer_note": "Transfer learning from Python saves ~2 days."
}
```

### Risk Object
```python
{
    "type":           "WEAK_PREREQUISITE",
    "severity":       "HIGH",
    "skill":          "React",
    "detail":         "Prerequisite 'JavaScript' is weak or missing before learning 'React'.",
    "recommendation": "Learn 'JavaScript' first to avoid confusion."
}
```

---

## 6. API Documentation

### POST `/analyze` — Full Pipeline
```
Content-Type: multipart/form-data
Body:
  file     (File)   → Resume PDF or TXT
  jd_text  (string) → Job Description text

Response: Full 15-field output including all pipeline results
```

### POST `/analyze-profile` — Spec-Exact Output
```
Content-Type: multipart/form-data
Body: same as /analyze

Response:
{
  "skills":            [...],       // extracted resume skills
  "verified_scores":   [...],       // per-skill gap objects
  "skill_gap":         [...],       // skills where action = LEARN
  "optimal_path":      {...},       // Path A or B (lower cost)
  "alternative_path":  {...},
  "time_estimate":     "~42 days (6.0 weeks)",
  "reasoning":         [...],       // structured trace per skill
  "risk":              [...],       // risk warnings with severity
  "system_confidence": {...},       // { score, flag, data_quality, ... }
  "hiring_decision":   "HIRE_WITH_TRAINING"
}
```

### POST `/generate-quiz` — Skill Validation Quiz
```json
Body: {
  "jd_skills":       ["React", "Python", "Docker"],
  "resume_skills":   ["Python", "Django"],
  "verified_scores": {"Python": 0.6, "React": 0.2}
}

Response: {
  "questions": [{
    "skill":     "Python",
    "type":      "scenario",
    "question":  "You're debugging a memory leak in a Python service...",
    "follow_up": "How would you identify which objects are not being garbage collected?",
    "keywords":  ["gc", "tracemalloc", "weakref", "profiler"]
  }],
  "count": 4
}
```

### POST `/score-answer` — Open-Ended Scoring
```json
Body: {
  "answer":              "I would use tracemalloc to track allocations...",
  "keywords":            ["tracemalloc", "gc", "profiler"],
  "time_taken_seconds":  45
}

Response: {
  "score":           0.72,
  "concepts_found":  ["tracemalloc", "gc"],
  "concepts_missed": ["profiler", "weakref"],
  "needs_follow_up": false,
  "speed_flag":      false
}
```

### GET `/roadmap`
```
?jd_skills=React,Docker,Python&resume_skills=Python

Response: {
  "roadmap":    [...steps in cost-optimized order],
  "total_days": 35,
  "path_name":  "Path A — Fast-Track",
  "auto_inserted": ["JavaScript"]
}
```

---

## 7. Setup Instructions

### Backend
```bash
# 1. Navigate to backend
cd AlgoRangers/backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # Linux/Mac

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env           # Set GEMINI_API_KEY if using AI fallback

# 5. Start server
uvicorn main:app --reload --port 8000

# Swagger UI: http://localhost:8000/docs
```

### Frontend
```bash
# 1. Navigate to frontend
cd AlgoRangers/frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# App: http://localhost:5173
```

### Requirements
```
fastapi>=0.104.0
uvicorn>=0.24.0
python-multipart>=0.0.6
PyMuPDF>=1.23.0
python-dotenv>=1.0.0
```

---

## 8. Demo Flow

```
1. Open http://localhost:5173

2. Paste this example Job Description:
   "Looking for a senior engineer with React, Node.js, Docker, PostgreSQL,
   REST API experience. System Design knowledge required."

3. Upload resume PDF (or use the demo mode)

4. Click "Analyze"

5. Dashboard shows:
   → Weighted readiness score (not a count ratio)
   → Skill gap with importance weights
   → Learning path A (fast) vs B (deep) with cost comparison
   → Risk warnings (e.g. missing JavaScript before React)
   → Per-skill reasoning traces

6. Click "Start Skill Validation"
   → 4 open-ended questions targeting YOUR claimed skills
   → 90-second timer per question
   → Follow-up questions on weak answers
   → Results: Validated / Needs Revision / Added to Gap

7. Click "Update Dashboard"
   → Skill gap updates with quiz-confirmed weaknesses
```

---

## 9. Edge Case Handling

| Edge Case | Detection | Handling |
|---|---|---|
| **Resume exaggeration** | Mentions > 5, no project context | Confidence × 0.75; hiring score −3pts/skill |
| **Skill mentioned but no depth** | No years, no project context | `exp_score = 0.2` (minimum), confidence stays low |
| **Missing prerequisites** | DAG dependency not in resume | Auto-inserted into learning path, RISK flagged |
| **Multiple valid paths** | Both Path A and B generated | Cost comparison, lower-cost path recommended |
| **No course available** | Not in question bank | Falls back to Google search link for project-based learning |
| **Outdated skill** | Not in SKILL_ONTOLOGY | Treated as unknown, not penalized |
| **Gaming the quiz** | Answer submitted < 5 seconds | Speed flag raised, score multiplied by 0.7 |
| **Low confidence prediction** | `system_confidence < 0.6` | `flag: "low_confidence"` warning surfaced in output |
| **Circular dependencies** | Kahn's algorithm detects cycle | `has_cycle = True`, path generated with cycle-broken order |
| **Empty resume** | No text extracted from PDF | Demo mode activated with sample developer profile |
| **Single-skill JD** | JD has only 1 skill | Path optimizer returns single-step path, no A/B needed |

---

## 10. Why This System Wins

### Against generic skill matching tools:
- **Weighted, not binary** — a skill at 25% and 90% proficiency are NOT treated the same
- **Dependency-aware** — never recommends learning React before JavaScript
- **Transfer-aware** — knowing Java gives you a headstart on Node.js (quantified: 3 days saved)

### Against LLM-only systems:
- **Deterministic** — same input always produces same output, fully reproducible
- **Explainable** — every decision has a JSON reasoning trace, not "AI said so"
- **No hallucination** — all skills, dependencies, and metadata grounded in ontology

### Against static roadmap generators:
- **Cost-optimized** — path chosen by minimizing `Σ cost(skill)`, not alphabetical or random
- **Risk-aware** — detects steep learning jumps and weak prerequisites before you waste time
- **Adaptive** — transfer learning reduces time estimates for related skills you already have

### Differentiating architecture decisions:
1. **DAG-first** — dependency graph built before any recommendations are made
2. **Two-pass scoring** — confidence calculated first, then transfer boost applied on top
3. **Hiring decision uses effective_score** — after exaggeration penalty, not raw confidence
4. **Quiz targets matched skills** — validates what you claim to know, not what you don't (yet)

---

*Built for AlgoRangers Hackathon — Production-grade implementation, not a demo.*
