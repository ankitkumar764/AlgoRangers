<div align="center">
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/framer--motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
</div>

<h1 align="center">AlgoRangers Frontend: Intelligence Visualization Layer</h1>

> **The user interface should never abstract away the AI's reasoning.** This specialized frontend is engineered to parse, visualize, and interactively display the highly complex deterministic outputs produced by the AlgoRangers AI Decision Engine.

## ✨ Core Philosophy

Unlike typical dashboard applications that simply dump API JSON into tables, the AlgoRangers frontend is an **Intelligence Visualization Layer**. It translates complex mathematical cost optimizations, Directed Acyclic Graphs (DAGs), and Confidence Constraints into an intuitive, transparent, and aesthetically premium user experience.

---

## 🚀 Key Technical Features

### Advanced State & Visualization
- **Deterministic UI Rendering:** Visualizes skill readiness scores using interactive radar charts and smooth animated gauges.
- **Topological Roadmap Sequencing:** Parses the backend's Kahn Algorithm DAG arrays and transforms them into interactive step-by-step UI timelines.
- **Micro-interactions:** Built entirely with `framer-motion` to provide a tactile, responsive feel to every AI generation phase.
- **Dynamic Reasoning Traces:** An off-canvas "Thinking Drawer" that exposes the actual mathematical reasoning, ontological matching, and penalization logic behind every single AI-generated recommendation.

### Premium Aesthetic System
- **Glassmorphism & Neural Mesh:** Utilizes modern translucent UI patterns mixed with an animated neural network background (`TailwindCSS v4`).
- **Responsive Adaptive Theming:** Fully supports system preference overrides with built-in Light and Dark themes optimized for readability of dense intelligence data.
- **Native Context Sharing:** Integrates the Web Share API and `html-to-image` for high-fidelity export of AI-Verified Skill Graphs directly to PNG or system clipboards.
- **Client-Side PDF Generation:** Instant generation of the 14-Module Intelligence Report via customized `jsPDF` integration.

---

## 📐 Architecture & Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ResultDashboard.jsx   # Core intelligence viz (Radar, Guages)
│   │   ├── Roadmap.jsx           # DAG Interactive Timeline
│   │   ├── Quiz.jsx              # Active Skill Verification Engine
│   │   ├── ReasoningTrace.jsx    # Transparency Layer Display
│   │   └── ThinkingDrawer.jsx    # Off-canvas logic inspect viewer
│   ├── context/
│   │   └── ThemeContext.jsx      # Global theming (Default: Light Mode)
│   ├── services/
│   │   └── api.js                # API client bound to FastAPI endpoints
│   ├── App.jsx                   # Primary Application Router & State
│   └── index.css                 # Global Tailwind v4 directives & custom utilities
└── package.json
```

---

## 🔌 API Integration Surface

The UI acts as a thin client to the AI engine, consuming the following interfaces:
- `POST /analyze` - Consumes PDF binary and unstructured JD text. Expects the full 14-module intelligence trace.
- `POST /quiz/submit` - Feeds interactive verification results back into the AI to re-calculate the candidate's optimal DAG path footprint.

---

## 🛠 Setup & Development

### Prerequisites
- Node.js v18+
- npm or pnpm

### Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Launch Development Server**
   ```bash
   npm run dev
   ```
   > The application will mount at `http://localhost:5173`. Any changes to the Tailwind `@utility` directives or React components will hot-reload automatically via Vite.

---

## 🎨 UI/UX Principles Enforced

1. **Zero Dark Patterns:** Transparency is key. The user must always know *why* a skill was flagged as a gap.
2. **Focus on Actionability:** The roadmap is not a static list; it inherently displays the dependency mapping and time-cost estimates computed by the backend.
3. **No Placeholders:** If the AI is computing, it shows real-time progress of the pipeline. If the model outputs risk factors, they are flagged unmistakably as actionable insights.
