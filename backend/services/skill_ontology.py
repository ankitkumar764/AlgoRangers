"""
Skill Ontology & Dependency Graph
- Predefined skill objects with metadata
- Dependency relationships (DAG)
- Normalization aliases
- Transfer learning pairs
"""
from typing import Dict, List, Optional

# Skill Object Schema:
# { importance: 0-1, difficulty: 1-5, learning_time: days, dependencies: [] }
SKILL_ONTOLOGY: Dict[str, dict] = {
    # === FRONTEND ===
    "JavaScript": {
        "importance": 0.95, "difficulty": 3, "learning_time": 14, "dependencies": [],
        "category": "Frontend", "tags": ["web", "scripting"]
    },
    "TypeScript": {
        "importance": 0.85, "difficulty": 3, "learning_time": 7, "dependencies": ["JavaScript"],
        "category": "Frontend", "tags": ["typed", "web"]
    },
    "React": {
        "importance": 0.95, "difficulty": 3, "learning_time": 14, "dependencies": ["JavaScript"],
        "category": "Frontend", "tags": ["ui", "component", "spa"]
    },
    "Next.js": {
        "importance": 0.85, "difficulty": 3, "learning_time": 7, "dependencies": ["React"],
        "category": "Frontend", "tags": ["ssr", "fullstack"]
    },
    "Vue": {
        "importance": 0.70, "difficulty": 2, "learning_time": 10, "dependencies": ["JavaScript"],
        "category": "Frontend", "tags": ["ui", "component"]
    },
    "Angular": {
        "importance": 0.65, "difficulty": 4, "learning_time": 14, "dependencies": ["TypeScript"],
        "category": "Frontend", "tags": ["enterprise", "spa"]
    },
    "TailwindCSS": {
        "importance": 0.75, "difficulty": 1, "learning_time": 3, "dependencies": ["CSS"],
        "category": "Frontend", "tags": ["styling"]
    },
    "CSS": {
        "importance": 0.80, "difficulty": 2, "learning_time": 7, "dependencies": [],
        "category": "Frontend", "tags": ["styling", "web"]
    },
    "HTML": {
        "importance": 0.80, "difficulty": 1, "learning_time": 5, "dependencies": [],
        "category": "Frontend", "tags": ["markup", "web"]
    },
    "Redux": {
        "importance": 0.70, "difficulty": 3, "learning_time": 5, "dependencies": ["React"],
        "category": "Frontend", "tags": ["state", "management"]
    },
    # === BACKEND ===
    "Python": {
        "importance": 0.95, "difficulty": 2, "learning_time": 14, "dependencies": [],
        "category": "Backend", "tags": ["scripting", "ai", "general"]
    },
    "Node.js": {
        "importance": 0.90, "difficulty": 3, "learning_time": 10, "dependencies": ["JavaScript"],
        "category": "Backend", "tags": ["runtime", "server"]
    },
    "Express": {
        "importance": 0.80, "difficulty": 2, "learning_time": 5, "dependencies": ["Node.js"],
        "category": "Backend", "tags": ["framework", "api"]
    },
    "FastAPI": {
        "importance": 0.85, "difficulty": 2, "learning_time": 5, "dependencies": ["Python"],
        "category": "Backend", "tags": ["api", "async"]
    },
    "Django": {
        "importance": 0.75, "difficulty": 3, "learning_time": 10, "dependencies": ["Python"],
        "category": "Backend", "tags": ["framework", "web"]
    },
    "Flask": {
        "importance": 0.70, "difficulty": 2, "learning_time": 5, "dependencies": ["Python"],
        "category": "Backend", "tags": ["framework", "api"]
    },
    "Java": {
        "importance": 0.80, "difficulty": 4, "learning_time": 21, "dependencies": [],
        "category": "Backend", "tags": ["enterprise", "oop"]
    },
    "Spring Boot": {
        "importance": 0.75, "difficulty": 4, "learning_time": 14, "dependencies": ["Java"],
        "category": "Backend", "tags": ["enterprise", "framework"]
    },
    "Go": {
        "importance": 0.75, "difficulty": 3, "learning_time": 14, "dependencies": [],
        "category": "Backend", "tags": ["systems", "concurrent"]
    },
    "GraphQL": {
        "importance": 0.75, "difficulty": 3, "learning_time": 5, "dependencies": ["Node.js"],
        "category": "Backend", "tags": ["api", "query"]
    },
    "REST API": {
        "importance": 0.90, "difficulty": 2, "learning_time": 5, "dependencies": [],
        "category": "Backend", "tags": ["api", "http"]
    },
    "Microservices": {
        "importance": 0.85, "difficulty": 4, "learning_time": 14, "dependencies": ["Docker", "REST API"],
        "category": "Backend", "tags": ["architecture", "distributed"]
    },
    "System Design": {
        "importance": 0.90, "difficulty": 5, "learning_time": 21, "dependencies": ["REST API", "Database"],
        "category": "Backend", "tags": ["architecture", "scalability"]
    },
    # === DATABASE ===
    "PostgreSQL": {
        "importance": 0.85, "difficulty": 3, "learning_time": 7, "dependencies": [],
        "category": "Database", "tags": ["sql", "relational"]
    },
    "MySQL": {
        "importance": 0.75, "difficulty": 2, "learning_time": 5, "dependencies": [],
        "category": "Database", "tags": ["sql", "relational"]
    },
    "MongoDB": {
        "importance": 0.80, "difficulty": 2, "learning_time": 5, "dependencies": [],
        "category": "Database", "tags": ["nosql", "document"]
    },
    "Redis": {
        "importance": 0.75, "difficulty": 2, "learning_time": 3, "dependencies": [],
        "category": "Database", "tags": ["cache", "nosql"]
    },
    "Elasticsearch": {
        "importance": 0.65, "difficulty": 3, "learning_time": 7, "dependencies": [],
        "category": "Database", "tags": ["search", "nosql"]
    },
    "Database": {
        "importance": 0.85, "difficulty": 2, "learning_time": 5, "dependencies": [],
        "category": "Database", "tags": ["sql", "general"]
    },
    # === DEVOPS / CLOUD ===
    "Docker": {
        "importance": 0.90, "difficulty": 3, "learning_time": 7, "dependencies": [],
        "category": "DevOps", "tags": ["container", "devops"]
    },
    "Kubernetes": {
        "importance": 0.80, "difficulty": 4, "learning_time": 14, "dependencies": ["Docker"],
        "category": "DevOps", "tags": ["orchestration", "cluster"]
    },
    "CI/CD": {
        "importance": 0.85, "difficulty": 3, "learning_time": 7, "dependencies": ["Git"],
        "category": "DevOps", "tags": ["automation", "pipeline"]
    },
    "AWS": {
        "importance": 0.90, "difficulty": 4, "learning_time": 14, "dependencies": [],
        "category": "Cloud", "tags": ["cloud", "infra"]
    },
    "Azure": {
        "importance": 0.80, "difficulty": 3, "learning_time": 10, "dependencies": [],
        "category": "Cloud", "tags": ["cloud", "microsoft"]
    },
    "GCP": {
        "importance": 0.75, "difficulty": 3, "learning_time": 10, "dependencies": [],
        "category": "Cloud", "tags": ["cloud", "google"]
    },
    "Terraform": {
        "importance": 0.75, "difficulty": 4, "learning_time": 7, "dependencies": ["AWS"],
        "category": "DevOps", "tags": ["iac", "cloud"]
    },
    "Jenkins": {
        "importance": 0.65, "difficulty": 3, "learning_time": 5, "dependencies": ["CI/CD"],
        "category": "DevOps", "tags": ["automation"]
    },
    "GitHub Actions": {
        "importance": 0.80, "difficulty": 2, "learning_time": 3, "dependencies": ["Git"],
        "category": "DevOps", "tags": ["automation", "ci"]
    },
    "Git": {
        "importance": 0.95, "difficulty": 2, "learning_time": 3, "dependencies": [],
        "category": "DevOps", "tags": ["vcs", "essential"]
    },
    # === SECURITY ===
    "OAuth": {
        "importance": 0.80, "difficulty": 3, "learning_time": 3, "dependencies": ["REST API"],
        "category": "Security", "tags": ["auth", "protocol"]
    },
    "JWT": {
        "importance": 0.80, "difficulty": 2, "learning_time": 2, "dependencies": ["REST API"],
        "category": "Security", "tags": ["auth", "token"]
    },
    # === ML / AI ===
    "Machine Learning": {
        "importance": 0.85, "difficulty": 4, "learning_time": 30, "dependencies": ["Python"],
        "category": "AI", "tags": ["ml", "data"]
    },
    "Deep Learning": {
        "importance": 0.80, "difficulty": 5, "learning_time": 30, "dependencies": ["Machine Learning"],
        "category": "AI", "tags": ["neural", "ai"]
    },
    "TensorFlow": {
        "importance": 0.75, "difficulty": 4, "learning_time": 14, "dependencies": ["Machine Learning"],
        "category": "AI", "tags": ["framework", "dl"]
    },
    "PyTorch": {
        "importance": 0.80, "difficulty": 4, "learning_time": 14, "dependencies": ["Machine Learning"],
        "category": "AI", "tags": ["framework", "dl"]
    },
    "Pandas": {
        "importance": 0.80, "difficulty": 2, "learning_time": 5, "dependencies": ["Python"],
        "category": "AI", "tags": ["data", "analysis"]
    },
    "NumPy": {
        "importance": 0.75, "difficulty": 2, "learning_time": 3, "dependencies": ["Python"],
        "category": "AI", "tags": ["numerical"]
    },
    "Scikit-learn": {
        "importance": 0.80, "difficulty": 3, "learning_time": 7, "dependencies": ["Python", "NumPy"],
        "category": "AI", "tags": ["ml", "algorithms"]
    },
    "NLP": {
        "importance": 0.70, "difficulty": 4, "learning_time": 14, "dependencies": ["Machine Learning"],
        "category": "AI", "tags": ["language", "ai"]
    },
    # === SOFT/PROCESS ===
    "Agile": {
        "importance": 0.75, "difficulty": 1, "learning_time": 2, "dependencies": [],
        "category": "Process", "tags": ["methodology"]
    },
    "Scrum": {
        "importance": 0.70, "difficulty": 1, "learning_time": 2, "dependencies": ["Agile"],
        "category": "Process", "tags": ["methodology"]
    },
}

# Normalization aliases: maps variations → canonical skill name
SKILL_ALIASES: Dict[str, str] = {
    "reactjs": "React", "react.js": "React", "react js": "React",
    "nodejs": "Node.js", "node js": "Node.js",
    "nextjs": "Next.js", "next js": "Next.js",
    "tailwind": "TailwindCSS", "tailwind css": "TailwindCSS",
    "postgres": "PostgreSQL", "psql": "PostgreSQL",
    "mongo": "MongoDB", "mongoose": "MongoDB",
    "k8s": "Kubernetes", "kube": "Kubernetes",
    "aws s3": "AWS", "ec2": "AWS", "lambda": "AWS",
    "github actions": "GitHub Actions",
    "spring": "Spring Boot",
    "sklearn": "Scikit-learn",
    "pytorch": "PyTorch", "torch": "PyTorch",
    "tensorflow": "TensorFlow", "tf": "TensorFlow",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "js": "JavaScript", "es6": "JavaScript",
    "ts": "TypeScript",
    "py": "Python",
    "rest": "REST API", "restful": "REST API",
    "ci cd": "CI/CD", "cicd": "CI/CD",
    "jwt tokens": "JWT",
    "oauth2": "OAuth",
    "graphql api": "GraphQL",
    "microservice": "Microservices",
    "system design interview": "System Design",
}

# Transfer Learning: if user has skill A, learning B is faster
# Format: { "existing_skill": [("reducible_skill", time_reduction_days, confidence_boost)] }
TRANSFER_LEARNING_MAP: Dict[str, List[tuple]] = {
    "Java":       [("Node.js", 3, 0.1), ("Python", 2, 0.05)],
    "Python":     [("JavaScript", 2, 0.05), ("Node.js", 3, 0.1)],
    "React":      [("Vue", 4, 0.15), ("Angular", 3, 0.1)],
    "PostgreSQL": [("MySQL", 3, 0.2), ("SQLite", 2, 0.25)],
    "Docker":     [("Kubernetes", 3, 0.1)],
    "AWS":        [("Azure", 5, 0.15), ("GCP", 5, 0.15)],
    "Node.js":    [("Express", 2, 0.2)],
    "Machine Learning": [("Deep Learning", 7, 0.2), ("NLP", 5, 0.15)],
}

def normalize_skill(raw: str) -> Optional[str]:
    """Normalize a raw skill string to its canonical ontology name."""
    cleaned = raw.strip().lower()
    if cleaned in SKILL_ALIASES:
        return SKILL_ALIASES[cleaned]
    # Direct match (case-insensitive)
    for canonical in SKILL_ONTOLOGY:
        if canonical.lower() == cleaned:
            return canonical
    return None

def get_skill_metadata(skill_name: str) -> Optional[dict]:
    """Get full metadata for a canonical skill."""
    return SKILL_ONTOLOGY.get(skill_name)

def get_all_canonical_skills() -> List[str]:
    return list(SKILL_ONTOLOGY.keys())

# Alias for backward compat
TECHNICAL_SKILLS_LIBRARY = get_all_canonical_skills()
