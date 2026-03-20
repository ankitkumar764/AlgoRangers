# 🚀 SkillGraph AI — Adaptive Onboarding & Career Acceleration Engine

> Explainable Skill Intelligence System with Graph-Based Learning Optimization

---

## 🧠 Overview

SkillGraph AI is an advanced system that analyzes a candidate’s **Resume** against a **Job Description (JD)** and generates a **personalized, adaptive learning roadmap**.

Unlike traditional systems, it does not simply recommend content — it:

* ✅ Verifies user skills (not blind trust)
* ✅ Identifies true skill gaps
* ✅ Understands skill dependencies
* ✅ Generates optimized learning paths
* ✅ Explains every decision (Reasoning Trace)
* ✅ Supports both **job seekers and companies**

👉 This is not a recommender system.
👉 This is a **Skill Decision Engine**.

---

## 🎯 Problem Statement

Current onboarding and learning systems are inefficient:

* ❌ One-size-fits-all training
* ❌ Experienced users waste time
* ❌ Beginners get overwhelmed
* ❌ No explanation behind recommendations

👉 There is no system that connects:
**Hiring → Skill Validation → Learning → Onboarding**

---

## 🧨 What Makes This System Different

* ❌ Does NOT trust resumes blindly
* ✅ Verifies skills using validation logic
* ✅ Uses dependency-aware skill graph
* ✅ Generates optimized learning sequence (not random suggestions)
* ✅ Provides reasoning trace for every decision
* ✅ Fully grounded (no hallucinated outputs)

---

## ⚙️ System Workflow

```text
Resume + JD
     ↓
Skill Extraction
     ↓
Skill Normalization
     ↓
Confidence Scoring
     ↓
Skill Validation (Quiz / Logic)
     ↓
Final Skill Score
     ↓
Weighted Skill Gap Analysis
     ↓
Skill Dependency Graph (DAG)
     ↓
Adaptive Path Generation
     ↓
Course Grounding
     ↓
Reasoning Trace + Output
```

---

## 🧠 Core Intelligence

### 🔹 Skill Confidence

Confidence is calculated using:

* Frequency in resume
* Project mentions
* Experience signals

---

### 🔹 Skill Validation

We verify skills using micro-assessments:

* Conceptual questions
* Scenario-based questions

---

### 🔹 Weighted Skill Gap

```
gap = importance × (required - current)
```

---

### 🔹 Dependency-Aware Pathing

Skills are structured as a graph:

```
JavaScript → React → System Design
          → Node → Microservices
```

The system ensures:

* prerequisites are satisfied
* learning order is logical

---

## 🧾 Reasoning Trace Example

```
Skill: React

Reason:
- Required by Job Description  
- Missing in user profile  
- Depends on JavaScript  

→ Therefore, JavaScript is recommended first
```

---

## 🧠 Core Features

* Intelligent Skill Extraction
* Skill Gap Analysis (weighted)
* Confidence Scoring
* Skill Validation (quiz-based)
* Adaptive Learning Path
* Reasoning Trace
* Interview Readiness Score
* Hiring Intelligence

---

## 🏢 Company Use Case

SkillGraph AI enables companies to:

* Generate personalized onboarding plans
* Identify employee skill gaps
* Reduce training time
* Improve hiring decisions

### Example Output:

* Skill Match: 75%
* Verified Skill: 60%
* Recommendation: Trainable candidate (2 weeks)

---

## 🏗️ Tech Stack

### Frontend

* React.js
* TailwindCSS
* ShadCN UI

### Backend

* FastAPI (Python)

### AI / NLP

* OpenAI / LLM APIs
* Sentence Transformers

### Database

* MongoDB

---

## 📂 Project Structure

```
project/
│
├── frontend/
├── backend/
├── models/
├── data/
├── README.md
└── Dockerfile
```

---

## 👥 Team Responsibilities

### 🧠 Ankit — Backend + AI + Core Logic

* Skill extraction engine
* Skill normalization
* Confidence scoring
* Skill validation system
* Skill gap algorithm
* Graph-based adaptive engine
* Reasoning logic
* Backend APIs (FastAPI)

---

### 💻 Raushan — Frontend + UI/UX + Integration

* UI/UX design
* Upload interface
* Dashboard visualization
* Roadmap visualization
* Reasoning display
* API integration
* User interaction & flow

---

## 🤝 Shared Responsibilities

* Testing (edge cases, fake resumes)
* Demo video
* Presentation (5 slides)
* Final documentation

---

## 📥 Usage

1. Upload Resume
2. Paste Job Description
3. Click Analyze
4. View:

   * Skills
   * Gap
   * Roadmap
   * Reasoning
   * Readiness Score

---

## 📊 Evaluation Alignment

* Technical Sophistication → Graph-based adaptive engine
* Reliability → Dataset-grounded outputs
* Reasoning Trace → Fully explainable decisions
* UX → Clean visualization
* Scalability → Multi-domain support

---

## 🔮 Future Improvements

* Real-time feedback loop
* Reinforcement learning optimization
* Skill decay tracking
* Cross-domain skill transfer

---

## 🏆 Final Statement

SkillGraph AI transforms onboarding from:

❌ Static training
→
✅ Intelligent, adaptive skill evolution

👉 Bridging:
**Learning ↔ Hiring ↔ Productivity**

---
