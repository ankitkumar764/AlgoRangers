# 🎨 AlgoRangers Frontend — SkillGraph AI Interface

> Intelligence-Driven UI for Adaptive Learning & Skill Analysis

---

## 🧠 Overview

This frontend powers the **SkillGraph AI system**, delivering a clean and interactive interface for:

* Resume & JD analysis
* Skill gap visualization
* Adaptive learning roadmap
* Reasoning trace display

👉 Focus is not just design — but **clarity of intelligence**

---

## ⚡ Key Features

### 🎯 Intelligence-Driven UI

* Skill Gap Visualization
* Adaptive Learning Path (Skip / Revise / Learn)
* Reasoning Trace Panel
* Interview Readiness Score

---

### 📂 Input System

* Resume upload (PDF / DOCX)
* Job Description input

---

### 📊 Visualization

* Skill match vs missing
* Readiness score gauge
* Roadmap timeline

---

### 🔄 Dynamic Behavior

* Real-time UI updates based on backend output
* Adaptive rendering of roadmap

---

## 🛠️ Tech Stack

* React.js (Vite)
* TailwindCSS
* Framer Motion (animations)
* Lucide React (icons)

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ResultDashboard.jsx
│   │   └── Roadmap.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
└── package.json
```

---

## 🔗 Backend Integration

Frontend consumes APIs:

* `/parse-resume`
* `/parse-jd`
* `/analyze-gap`
* `/generate-roadmap`
* `/get-score`

All UI components dynamically render based on backend intelligence.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

---

### 2. Run development server

```bash
npm run dev
```

App runs at:
http://localhost:5173/

---

### 3. Build production

```bash
npm run build
```

---

## 👥 Responsibilities

### 💻 Raushan (Frontend Lead)

* UI/UX design system
* Layout & responsiveness
* Roadmap visualization
* Reasoning display
* API integration
* State management

---

### 🤝 Support (Ankit)

* API contract definition
* Backend response structuring
* Integration debugging

---

## 📅 Upcoming UI Features

* Quiz Interface (Skill Validation)
* Export Roadmap (PDF)
* Graph-based roadmap visualization
* Dark/Light theme toggle

---

## 🧪 UX Principles

* Minimal, distraction-free design
* Clear information hierarchy
* Focus on decision clarity
* Fast interaction and feedback

---

## 🏆 Final Note

This frontend is designed to:

* Surface system intelligence clearly
* Make complex analysis understandable
* Deliver a smooth, engaging experience

👉 Not just UI — **Intelligence Visualization Layer**

---
