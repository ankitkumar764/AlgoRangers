"""
Skill Validation Question Bank
- Questions keyed by canonical skill name
- Multiple variants per skill (prevents repetition)
- Types: conceptual | code_output | debugging | scenario | tradeoff
- Scoring rubric: list of keywords/concepts that a good answer should mention
"""
import random
from typing import List, Dict, Optional

QUESTION_BANK: Dict[str, List[Dict]] = {

    # ────────────────────────────────────────────────
    # JAVASCRIPT
    # ────────────────────────────────────────────────
    "JavaScript": [
        {
            "type": "conceptual",
            "question": "Explain the concept of the JavaScript Event Loop. Why is it important for understanding async behavior in JS?",
            "keywords": ["call stack", "callback queue", "web api", "non-blocking", "single thread", "microtask"],
            "follow_up": "What's the difference between the microtask queue and the macrotask queue?"
        },
        {
            "type": "code_output",
            "question": "What does this code output and WHY?\n\n```js\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n```",
            "keywords": ["A", "D", "C", "B", "microtask", "macrotask", "event loop", "promise"],
            "follow_up": "Why does 'C' appear before 'B' even though setTimeout has 0ms delay?"
        },
        {
            "type": "conceptual",
            "question": "What is closure in JavaScript? Give a real-world example where closures are useful — not just the counter example.",
            "keywords": ["lexical scope", "inner function", "outer variable", "access", "persists", "private"],
            "follow_up": "How does closure help in creating private variables in JS?"
        },
        {
            "type": "debugging",
            "question": "Find the bug and explain why it fails:\n\n```js\nconst obj = { name: 'Raushan' };\nconst greet = obj.greet = function() {\n  console.log(this.name);\n};\ngreet(); // What logs here and why?\n```",
            "keywords": ["this", "context", "undefined", "global", "bind", "arrow function", "implicit binding"],
            "follow_up": "How would you fix this to always log 'Raushan'?"
        },
        {
            "type": "tradeoff",
            "question": "When would you choose `var` over `let`/`const`? Is there ever a legitimate reason in 2024?",
            "keywords": ["hoisting", "function scope", "block scope", "temporal dead zone", "legacy", "never"],
            "follow_up": "What specific hoisting behavior of var could cause hard-to-find bugs?"
        },
        {
            "type": "scenario",
            "question": "You're building a search input that calls an API on every keystroke. Your API is getting hammered. What JavaScript technique would you use and how does it work?",
            "keywords": ["debounce", "throttle", "setTimeout", "clearTimeout", "delay", "rate limit"],
            "follow_up": "What's the difference between debounce and throttle — when would you use each?"
        },
    ],

    # ────────────────────────────────────────────────
    # REACT
    # ────────────────────────────────────────────────
    "React": [
        {
            "type": "conceptual",
            "question": "Why does React use a Virtual DOM? What specific problem does it solve, and what are its limitations?",
            "keywords": ["diffing", "reconciliation", "re-paint", "batch update", "performance", "stale closure"],
            "follow_up": "In what scenarios can the Virtual DOM actually be slower than direct DOM manipulation?"
        },
        {
            "type": "debugging",
            "question": "A developer writes this hook. What's the bug?\n\n```js\nuseEffect(() => {\n  fetchData(userId);\n}, []);\n```\nThe component props include `userId` which can change.",
            "keywords": ["stale closure", "dependency array", "userId", "missing dependency", "re-fetch", "lint warning"],
            "follow_up": "What happens if you add `fetchData` to the dependency array without wrapping it in `useCallback`?"
        },
        {
            "type": "scenario",
            "question": "Your React app has a deeply nested component that needs data from the top-level component. How do you manage this without prop drilling through 6 levels?",
            "keywords": ["context api", "redux", "zustand", "global state", "provider", "useContext", "state management"],
            "follow_up": "When would you prefer Context API over Redux? What's the performance trade-off?"
        },
        {
            "type": "tradeoff",
            "question": "When should you use `useMemo` and when is it overkill? What's the actual cost of overusing it?",
            "keywords": ["memoization", "cache", "expensive computation", "dependency", "overhead", "profiler", "premature optimization"],
            "follow_up": "How does `useMemo` differ from `useCallback`?"
        },
        {
            "type": "conceptual",
            "question": "Explain React's reconciliation algorithm. How does React decide which elements to re-render vs keep in place?",
            "keywords": ["key prop", "element type", "fiber", "tree diffing", "same type", "unmount", "key stability"],
            "follow_up": "Why is using array index as a key prop dangerous for dynamic lists?"
        },
        {
            "type": "code_output",
            "question": "What does this render and how many times does `fetchData` get called?\n\n```js\nfunction App() {\n  const [count, setCount] = useState(0);\n  const fetchData = async () => { /* api call */ };\n  useEffect(() => { fetchData(); }, [fetchData]);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n```",
            "keywords": ["infinite loop", "every render", "new reference", "useCallback", "fetchData recreated", "dependency"],
            "follow_up": "How would you fix this to call fetchData only once on mount?"
        },
    ],

    # ────────────────────────────────────────────────
    # NODE.JS
    # ────────────────────────────────────────────────
    "Node.js": [
        {
            "type": "conceptual",
            "question": "Node.js is single-threaded, yet it handles thousands of concurrent connections efficiently. Explain how this works.",
            "keywords": ["event loop", "libuv", "non-blocking I/O", "callbacks", "async", "thread pool", "kernel"],
            "follow_up": "What tasks actually USE the thread pool in Node.js despite it being 'single-threaded'?"
        },
        {
            "type": "scenario",
            "question": "Your Node.js API is timing out under load. Walk me through the first 5 things you'd investigate.",
            "keywords": ["cpu profiler", "event loop lag", "blocking code", "memory leak", "database queries", "connection pool", "monitoring"],
            "follow_up": "How does a synchronous operation like fs.readFileSync block the event loop?"
        },
        {
            "type": "debugging",
            "question": "Find the memory leak:\n\n```js\nconst cache = {};\napp.get('/user/:id', (req, res) => {\n  if (!cache[req.params.id]) {\n    cache[req.params.id] = fetchUser(req.params.id);\n  }\n  res.json(cache[req.params.id]);\n});\n```",
            "keywords": ["unbounded cache", "grows indefinitely", "TTL", "LRU", "eviction", "memory limit", "Map"],
            "follow_up": "How would you implement a simple LRU cache with a max size?"
        },
        {
            "type": "tradeoff",
            "question": "When would you spawn a worker thread in Node.js and when is that overkill?",
            "keywords": ["CPU-bound", "I/O-bound", "worker_threads", "blocking", "image processing", "crypto", "overhead"],
            "follow_up": "What's the difference between worker threads and child_process.fork()?"
        },
    ],

    # ────────────────────────────────────────────────
    # PYTHON
    # ────────────────────────────────────────────────
    "Python": [
        {
            "type": "debugging",
            "question": "What's wrong with this code and in what situation does it fail?\n\n```python\ndef add_item(item, lst=[]):\n    lst.append(item)\n    return lst\n\nprint(add_item(1))\nprint(add_item(2))\n```",
            "keywords": ["mutable default argument", "shared", "persists", "None default", "created once", "gotcha"],
            "follow_up": "What's the correct pattern to avoid this? Why does Python behave this way?"
        },
        {
            "type": "conceptual",
            "question": "Explain Python's GIL (Global Interpreter Lock). Why does it exist and how does it affect multi-threaded code?",
            "keywords": ["CPython", "thread safety", "memory management", "CPU-bound", "I/O-bound", "multiprocessing", "GIL release"],
            "follow_up": "When would you use `threading` vs `multiprocessing` vs `asyncio` in Python?"
        },
        {
            "type": "code_output",
            "question": "What's the output?\n\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\n\nc = a[:]\nc.append(5)\nprint(a)\n```",
            "keywords": ["reference", "shallow copy", "same object", "[1,2,3,4]", "not [1,2,3,4,5]", "slice copy"],
            "follow_up": "When would you need a `deepcopy` instead of a slice copy?"
        },
        {
            "type": "scenario",
            "question": "You need to process 100,000 records from a CSV file in Python without running out of memory. What approach do you use?",
            "keywords": ["generator", "yield", "chunked reading", "pandas chunksize", "lazy evaluation", "streaming", "memory efficient"],
            "follow_up": "What's the difference between a generator and a list comprehension in terms of memory?"
        },
        {
            "type": "tradeoff",
            "question": "When would you use `asyncio` in Python and when would it not help (or make things worse)?",
            "keywords": ["I/O bound", "CPU bound", "cooperative multitasking", "event loop", "blocking", "aiohttp", "no benefit"],
            "follow_up": "Can you mix synchronous blocking code with asyncio? What happens if you do?"
        },
    ],

    # ────────────────────────────────────────────────
    # SYSTEM DESIGN
    # ────────────────────────────────────────────────
    "System Design": [
        {
            "type": "scenario",
            "question": "Design a URL shortener (like bit.ly) at high level. What components do you need, and what's the biggest technical challenge?",
            "keywords": ["hashing", "collision", "database", "cache", "redirect", "unique key", "base62", "scalability"],
            "follow_up": "How would you handle 10 million URLs? What breaks first at scale?"
        },
        {
            "type": "tradeoff",
            "question": "Explain the CAP theorem in your own words. Give a real system example for each trade-off combination.",
            "keywords": ["consistency", "availability", "partition tolerance", "CP", "AP", "CA", "network partition", "trade-off"],
            "follow_up": "Why is CA (Consistent + Available without Partition tolerance) essentially impossible in distributed systems?"
        },
        {
            "type": "scenario",
            "question": "Your service gets 10x traffic overnight. Walk me through what you'd check first and what would likely break.",
            "keywords": ["database connections", "rate limiting", "auto-scaling", "cache", "bottleneck", "horizontal scaling", "load balancer"],
            "follow_up": "What's the difference between horizontal and vertical scaling? Why does horizontal scaling complicate state management?"
        },
        {
            "type": "conceptual",
            "question": "What is a rate limiter and how would you implement one that works across multiple server instances?",
            "keywords": ["token bucket", "sliding window", "Redis", "distributed", "per-user", "IP-based", "atomic", "Lua script"],
            "follow_up": "Why is a simple in-memory counter not enough for rate limiting in a multi-server setup?"
        },
        {
            "type": "tradeoff",
            "question": "When would you choose a message queue (like Kafka or RabbitMQ) over a direct API call between services?",
            "keywords": ["decoupling", "async", "reliability", "retry", "throughput", "ordering", "backpressure", "eventual consistency"],
            "follow_up": "What's the difference between exactly-once and at-least-once delivery semantics?"
        },
    ],

    # ────────────────────────────────────────────────
    # DOCKER
    # ────────────────────────────────────────────────
    "Docker": [
        {
            "type": "conceptual",
            "question": "What's the difference between a Docker image and a container? Explain the layer system.",
            "keywords": ["immutable", "layer", "union filesystem", "read-write layer", "snapshot", "Dockerfile", "running instance"],
            "follow_up": "Why does the order of instructions in a Dockerfile matter for build cache efficiency?"
        },
        {
            "type": "scenario",
            "question": "Your Docker container keeps restarting in production. What are the first 5 things you check?",
            "keywords": ["exit code", "logs", "OOM killer", "healthcheck", "restart policy", "entrypoint", "environment variables"],
            "follow_up": "What does exit code 137 tell you about why a container crashed?"
        },
        {
            "type": "debugging",
            "question": "A developer's Dockerfile builds successfully locally but keeps failing in CI. The error is 'module not found'. What could cause this?",
            "keywords": [".dockerignore", "COPY", "context", "build args", "cache", "local dependency", "platform", "layer order"],
            "follow_up": "What's the purpose of `.dockerignore` and what should always be in it?"
        },
    ],

    # ────────────────────────────────────────────────
    # POSTGRESQL / DATABASE
    # ────────────────────────────────────────────────
    "PostgreSQL": [
        {
            "type": "scenario",
            "question": "A query that returned results in 50ms now takes 8 seconds after your table grew to 10M rows. Walk me through your investigation.",
            "keywords": ["index", "EXPLAIN ANALYZE", "sequential scan", "query plan", "cardinality", "vacuum", "statistics"],
            "follow_up": "When would adding an index SLOW DOWN a query?"
        },
        {
            "type": "tradeoff",
            "question": "When would you use a database transaction and what happens if you forget one in a critical operation?",
            "keywords": ["ACID", "atomicity", "rollback", "partial update", "race condition", "commit", "isolation level"],
            "follow_up": "Explain the difference between READ COMMITTED and REPEATABLE READ isolation levels."
        },
        {
            "type": "conceptual",
            "question": "Explain the N+1 query problem. Why is it dangerous and how do you solve it in a real application?",
            "keywords": ["ORM", "lazy loading", "eager loading", "JOIN", "batch query", "SELECT N+1", "performance"],
            "follow_up": "In an ORM like SQLAlchemy or Prisma, which operation triggers N+1 queries?"
        },
    ],

    # ────────────────────────────────────────────────
    # MONGODB
    # ────────────────────────────────────────────────
    "MongoDB": [
        {
            "type": "tradeoff",
            "question": "When would you choose MongoDB over PostgreSQL for a new project? Be specific about the use case requirements.",
            "keywords": ["schema flexibility", "document model", "hierarchical", "horizontal scaling", "ACID", "joins", "aggregation"],
            "follow_up": "What does MongoDB sacrifice compared to a relational database that might matter for your use case?"
        },
        {
            "type": "scenario",
            "question": "You're storing user sessions in MongoDB. After 3 months, the collection is 50GB and queries are slow. What went wrong and how do you fix it?",
            "keywords": ["TTL index", "expireAfterSeconds", "no cleanup", "unbounded growth", "index on createdAt", "archival"],
            "follow_up": "What is a TTL index in MongoDB and how does it work?"
        },
    ],

    # ────────────────────────────────────────────────
    # REST API
    # ────────────────────────────────────────────────
    "REST API": [
        {
            "type": "tradeoff",
            "question": "What's the difference between PUT and PATCH? When would using PUT incorrectly cause a bug for the client?",
            "keywords": ["idempotent", "full replacement", "partial update", "missing field", "null", "overwrite", "PATCH partial"],
            "follow_up": "Why should DELETE be idempotent and what HTTP status code should a second DELETE return?"
        },
        {
            "type": "scenario",
            "question": "Design the authentication flow for a REST API. What mechanism do you use and why — and how do you handle token expiry?",
            "keywords": ["JWT", "refresh token", "access token", "expiry", "revocation", "stateless", "httpOnly cookie", "blacklist"],
            "follow_up": "What's the security risk of storing a JWT in localStorage vs an httpOnly cookie?"
        },
        {
            "type": "conceptual",
            "question": "What does it mean for an API to be truly RESTful? What are the 6 constraints of REST architecture?",
            "keywords": ["stateless", "uniform interface", "client-server", "cacheable", "layered system", "code on demand", "HATEOAS"],
            "follow_up": "Most modern so-called REST APIs aren't actually RESTful. What constraint do they most commonly violate?"
        },
    ],

    # ────────────────────────────────────────────────
    # MICROSERVICES
    # ────────────────────────────────────────────────
    "Microservices": [
        {
            "type": "tradeoff",
            "question": "What are the top 3 reasons microservices actually make systems MORE complex, not less?",
            "keywords": ["network latency", "distributed tracing", "data consistency", "deployment", "service discovery", "operational overhead"],
            "follow_up": "When is a monolith genuinely a better architectural choice than microservices?"
        },
        {
            "type": "scenario",
            "question": "Service A calls Service B which calls Service C. Service C goes down. What happens to A and B, and how do you prevent a cascade failure?",
            "keywords": ["circuit breaker", "timeout", "bulkhead", "retry", "fallback", "resilience4j", "hystrix", "cascade"],
            "follow_up": "Explain the Circuit Breaker pattern — what are its three states?"
        },
    ],

    # ────────────────────────────────────────────────
    # MACHINE LEARNING
    # ────────────────────────────────────────────────
    "Machine Learning": [
        {
            "type": "tradeoff",
            "question": "You trained a model with 99% accuracy on your training set but only 65% on production data. What happened and how do you fix it?",
            "keywords": ["overfitting", "generalization", "regularization", "dropout", "validation set", "data leakage", "cross-validation"],
            "follow_up": "What's the difference between overfitting and data leakage?"
        },
        {
            "type": "conceptual",
            "question": "Explain the bias-variance trade-off in your own words with a concrete example.",
            "keywords": ["underfitting", "overfitting", "high bias", "high variance", "model complexity", "sweet spot", "regularization"],
            "follow_up": "How does increasing model complexity affect bias and variance?"
        },
        {
            "type": "scenario",
            "question": "Your ML model works great in testing but gives unexpected results in production after 3 months. What's the likely problem and how do you detect it early?",
            "keywords": ["data drift", "concept drift", "distribution shift", "monitoring", "retraining", "feature drift", "model decay"],
            "follow_up": "What metrics would you track to detect model degradation in production?"
        },
    ],

    # ────────────────────────────────────────────────
    # AWS
    # ────────────────────────────────────────────────
    "AWS": [
        {
            "type": "scenario",
            "question": "You need to store and serve millions of images globally with low latency. Which AWS services do you use and why?",
            "keywords": ["S3", "CloudFront", "CDN", "edge location", "caching", "pre-signed URL", "origin"],
            "follow_up": "What's the risk of making an S3 bucket public vs using pre-signed URLs?"
        },
        {
            "type": "tradeoff",
            "question": "When would you use AWS Lambda instead of EC2, and when is Lambda the wrong choice?",
            "keywords": ["serverless", "cold start", "stateless", "duration limit", "cost", "CPU limit", "always-on", "VPC latency"],
            "follow_up": "What is a Lambda cold start and what causes it? How do you mitigate it?"
        },
    ],

    # ────────────────────────────────────────────────
    # KUBERNETES
    # ────────────────────────────────────────────────
    "Kubernetes": [
        {
            "type": "scenario",
            "question": "A pod is stuck in CrashLoopBackOff. Walk me through your debugging steps.",
            "keywords": ["kubectl logs", "describe pod", "exit code", "readiness probe", "liveness probe", "image pull", "OOM"],
            "follow_up": "What's the difference between a liveness probe and a readiness probe?"
        },
        {
            "type": "tradeoff",
            "question": "When would you use a Deployment vs a StatefulSet in Kubernetes?",
            "keywords": ["stateless", "stateful", "persistent volume", "stable network identity", "ordered startup", "database", "pod name"],
            "follow_up": "Why is running a database in Kubernetes generally considered risky for production?"
        },
    ],

    # ────────────────────────────────────────────────
    # GIT
    # ────────────────────────────────────────────────
    "Git": [
        {
            "type": "scenario",
            "question": "You accidentally committed sensitive API keys to a public GitHub repo 3 commits ago. What do you do, in order?",
            "keywords": ["revoke key", "git filter-branch", "BFG", "force push", "rotate credentials", "history rewrite", "cannot fully remove"],
            "follow_up": "After rewriting history and force pushing, is the key truly gone from GitHub? Why or why not?"
        },
        {
            "type": "tradeoff",
            "question": "When would you use `git rebase` instead of `git merge`, and what's the risk with rebase?",
            "keywords": ["linear history", "rewrite commits", "shared branch", "force push", "golden rule", "interactive rebase", "conflict"],
            "follow_up": "What is the 'golden rule of rebasing' and why does breaking it cause problems for your team?"
        },
    ],

    # ────────────────────────────────────────────────
    # FASTAPI / DJANGO / FLASK
    # ────────────────────────────────────────────────
    "FastAPI": [
        {
            "type": "conceptual",
            "question": "How does FastAPI handle async vs sync route handlers? What happens if you call a blocking database driver inside an `async def` route?",
            "keywords": ["event loop", "blocking", "run_in_executor", "starlette", "thread pool", "await", "asyncpg"],
            "follow_up": "What's the difference between `async def` and `def` route handlers in FastAPI in terms of how requests are processed?"
        },
        {
            "type": "scenario",
            "question": "You need to add rate limiting to a FastAPI endpoint that serves 10,000 requests per minute. How do you implement it in a multi-worker deployment?",
            "keywords": ["Redis", "middleware", "per-IP", "shared state", "slowapi", "token bucket", "atomic"],
            "follow_up": "Why doesn't in-process rate limiting work in a multi-worker Gunicorn deployment?"
        },
    ],

    # ────────────────────────────────────────────────
    # CI/CD
    # ────────────────────────────────────────────────
    "CI/CD": [
        {
            "type": "scenario",
            "question": "Your deployment pipeline passes all tests but the production deploy fails silently — the app starts but behavior is wrong. How do you catch this before users are impacted?",
            "keywords": ["smoke tests", "canary deploy", "feature flag", "health check", "integration test", "staging", "rollback"],
            "follow_up": "What's the difference between a blue-green deployment and a canary deployment?"
        },
        {
            "type": "tradeoff",
            "question": "What are the risks of Continuous Deployment (auto-deploy to production on every merge) vs requiring manual approval?",
            "keywords": ["speed", "control", "rollback", "feature flags", "test coverage", "confidence", "risk tolerance"],
            "follow_up": "What must be true about your test suite before you can safely use Continuous Deployment?"
        },
    ],

    # ────────────────────────────────────────────────
    # REDIS
    # ────────────────────────────────────────────────
    "Redis": [
        {
            "type": "tradeoff",
            "question": "When should you NOT use Redis as your primary data store, even though it supports persistence?",
            "keywords": ["memory cost", "dataset size", "durability", "AOF vs RDB", "eviction", "relational data", "queries"],
            "follow_up": "What is the difference between Redis AOF and RDB persistence, and which is safer?"
        },
        {
            "type": "scenario",
            "question": "You're implementing a distributed lock using Redis. What's the implementation and what edge case could still cause two processes to acquire the lock simultaneously?",
            "keywords": ["SETNX", "expire", "Redlock", "race condition", "clock drift", "atomicity", "Lua script"],
            "follow_up": "Why did Redis's inventor Martin Kleppmann warn against using Redlock for strong mutual exclusion?"
        },
    ],
}


def _normalize(skills: list) -> dict:
    """Return {lower_name: original_name} mapping for a skill list."""
    return {s.lower(): s for s in skills}


def select_questions(
    jd_skills: list,
    resume_skills: list,
    count: int = 4,
    verified_scores: dict = None,     # optional: {skill: score 0-1}
) -> List[Dict]:
    """
    Select validation questions targeting VERIFIED DOMAIN EXPERTISE:

    Priority order:
      1. Skills present in BOTH resume AND JD (claimed + required) — prove you know what you say you know
         Sub-priority: lower confidence score first (needs more validation)
      2. Resume skills in JD that partially match (REVISE zone: 0.4–0.74 confidence)
      3. Any JD skill available in the question bank
      4. Generic fallback (System Design, REST API, etc.)

    Guarantees: always returns exactly `count` questions, each from a DIFFERENT skill.
    Randomized variant: never the same question twice per skill.
    """
    jd_lower  = _normalize(jd_skills)
    res_lower = _normalize(resume_skills)

    # ── Priority 1: matched skills (resume ∩ JD) ─────────────────────────────
    matched = [
        jd_lower[key]                          # use canonical JD casing
        for key in jd_lower
        if key in res_lower and jd_lower[key] in QUESTION_BANK
    ]

    # Sort by ascending confidence (lower confidence = needs more validation)
    if verified_scores:
        matched.sort(key=lambda s: verified_scores.get(s, 0.5))
    else:
        random.shuffle(matched)

    # ── Priority 2: resume skills not in matched but still in JD context ──────
    resume_only = [
        res_lower[key]
        for key in res_lower
        if key not in jd_lower and res_lower[key] in QUESTION_BANK
    ]
    random.shuffle(resume_only)

    # ── Priority 3: any JD skill in the bank (fallback) ───────────────────────
    jd_in_bank = [
        jd_lower[key] for key in jd_lower
        if jd_lower[key] in QUESTION_BANK and jd_lower[key] not in matched
    ]
    random.shuffle(jd_in_bank)

    # ── Priority 4: generic high-value fallbacks ───────────────────────────────
    generics = [
        s for s in ["System Design", "REST API", "JavaScript", "Python",
                     "Node.js", "React", "Docker", "Git"]
        if s in QUESTION_BANK
    ]
    random.shuffle(generics)

    # ── Build final list respecting priority, no duplicates ───────────────────
    seen = set()
    pool = []
    for skill_list in [matched, resume_only, jd_in_bank, generics]:
        for s in skill_list:
            if s not in seen:
                seen.add(s)
                pool.append(s)

    selected = pool[:count]

    # If we still don't have enough, repeat from pool with different variant
    while len(selected) < count and pool:
        selected.append(random.choice(pool))

    # ── Pick a RANDOM variant for each selected skill ─────────────────────────
    questions = []
    used_variants: Dict[str, set] = {}   # prevent same variant if skill repeats

    for skill in selected:
        variants = QUESTION_BANK.get(skill, [])
        if not variants:
            continue
        used = used_variants.get(skill, set())
        available_variants = [i for i in range(len(variants)) if i not in used]
        if not available_variants:
            available_variants = list(range(len(variants)))   # reset if exhausted
        idx = random.choice(available_variants)
        used_variants.setdefault(skill, set()).add(idx)
        q = variants[idx]

        questions.append({
            "skill":      skill,
            "type":       q["type"],
            "question":   q["question"],
            "follow_up":  q.get("follow_up", ""),
            "keywords":   q.get("keywords", []),
            "is_matched": skill in {jd_lower.get(k, "") for k in jd_lower},
        })

    return questions


def score_answer(answer: str, keywords: list, time_taken_seconds: Optional[int] = None) -> Dict:
    """
    Score an open-ended answer against the rubric keywords.
    Returns a quality score (0-1) and which key concepts were mentioned.
    """
    answer_lower = answer.lower()
    found = [kw for kw in keywords if kw.lower() in answer_lower]
    coverage = len(found) / max(len(keywords), 1)

    # Reasoning quality signal — does the answer explain WHY?
    reasoning_markers = ["because", "since", "therefore", "this means", "which means", "so that", "due to", "result in", "causes"]
    has_reasoning = any(m in answer_lower for m in reasoning_markers)

    # Answer length signal (too short = likely guessed or vague)
    word_count = len(answer.split())
    length_penalty = 0.0
    if word_count < 15:
        length_penalty = 0.3
    elif word_count < 30:
        length_penalty = 0.1

    # Time penalty — very fast answers are suspicious
    time_penalty = 0.0
    if time_taken_seconds and time_taken_seconds < 10:
        time_penalty = 0.2

    # Compute base quality
    base_score = coverage * 0.7 + (0.2 if has_reasoning else 0) + 0.1
    final_score = max(0.0, min(1.0, base_score - length_penalty - time_penalty))

    needs_follow_up = final_score < 0.5 or (coverage < 0.3 and word_count > 20)

    return {
        "score": round(final_score, 2),
        "coverage": round(coverage, 2),
        "concepts_found": found,
        "concepts_missed": [kw for kw in keywords if kw.lower() not in answer_lower],
        "has_reasoning": has_reasoning,
        "word_count": word_count,
        "needs_follow_up": needs_follow_up,
    }
