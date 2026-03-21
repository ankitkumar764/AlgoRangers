"""
Graph Engine
- Build DAG from skill dependencies (ontology-grounded)
- Topological sort (Kahn's algorithm)
- Auto-insert missing prerequisites into learning path
- Cycle detection
"""
from collections import defaultdict, deque
from typing import List, Dict, Set, Tuple
from services.skill_ontology import SKILL_ONTOLOGY


def build_dag(skills_to_learn: List[str]) -> Dict[str, List[str]]:
    """
    Build a Directed Acyclic Graph for the skills that need to be learned.
    Automatically includes required prerequisites even if not in the original list.
    Returns: { skill: [prerequisites] }
    """
    dag = {}
    visited: Set[str] = set()

    def add_with_deps(skill: str):
        if skill in visited:
            return
        visited.add(skill)
        meta = SKILL_ONTOLOGY.get(skill)
        if not meta:
            dag[skill] = []
            return
        deps = meta.get("dependencies", [])
        dag[skill] = deps
        for dep in deps:
            add_with_deps(dep)

    for skill in skills_to_learn:
        add_with_deps(skill)

    return dag


def dependencies_met(skill: str, visited: Set[str], graph: Dict[str, List[str]]) -> bool:
    """Strict DAG enforcement as required by constraints."""
    for dep in graph.get(skill, []):
        if dep not in visited:
            return False
    return True


def topological_sort(dag: Dict[str, List[str]]) -> Tuple[List[str], bool]:
    """
    Kahn's Algorithm for topological sort.
    Returns (sorted_order, has_cycle)
    """
    in_degree: Dict[str, int] = defaultdict(int)
    adjacency: Dict[str, List[str]] = defaultdict(list)

    # Build adjacency list (prerequisite → dependent)
    all_nodes = set(dag.keys())
    for skill, deps in dag.items():
        for dep in deps:
            adjacency[dep].append(skill)
            in_degree[skill] += 1
            all_nodes.add(dep)

    # Ensure all nodes are in in_degree
    for node in all_nodes:
        if node not in in_degree:
            in_degree[node] = 0

    queue = deque([n for n in all_nodes if in_degree[n] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adjacency[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    has_cycle = len(order) != len(all_nodes)
    return order, has_cycle


def get_learning_order(skills_to_learn: List[str]) -> Tuple[List[str], List[str], bool]:
    """
    Full pipeline: build DAG → topological sort → detect auto-inserted prerequisites.
    Returns: (ordered_path, auto_inserted_prerequisites, has_cycle)
    """
    original_set = set(skills_to_learn)
    dag = build_dag(skills_to_learn)

    ordered, has_cycle = topological_sort(dag)

    # Identify skills that were auto-inserted as prerequisites
    auto_inserted = [s for s in ordered if s not in original_set]

    # Explicitly enforce dependencies_met validation
    visited = set()
    for skill in ordered:
        if not dependencies_met(skill, visited, dag):
            has_cycle = True
            break
        visited.add(skill)

    # Filter ordered to only include skills in the DAG
    final_order = [s for s in ordered if s in dag]

    return final_order, auto_inserted, has_cycle
