# main.py
# FastAPI backend for VectorShift pipeline parser
# Receives nodes and edges, counts them, and checks if they form a DAG

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# ─── CORS ────────────────────────────────────────────────────────────────────
# Allow the React frontend (localhost:3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ──────────────────────────────────────────────────────────────────
class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}

class Edge(BaseModel):
    id: str
    source: str
    target: str

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

# ─── DAG Check ───────────────────────────────────────────────────────────────
def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the pipeline forms a Directed Acyclic Graph (DAG).
    Uses DFS-based cycle detection.
    A pipeline is a DAG if there are no cycles — meaning data
    always flows forward and never loops back.
    """
    # Build adjacency list from edges
    graph: Dict[str, List[str]] = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in graph:
            graph[edge.source].append(edge.target)

    # DFS cycle detection
    # Each node has 3 states:
    # 0 = unvisited, 1 = currently being visited, 2 = fully visited
    state: Dict[str, int] = {node.id: 0 for node in nodes}

    def has_cycle(node_id: str) -> bool:
        if state[node_id] == 1:  # currently in stack = cycle found!
            return True
        if state[node_id] == 2:  # already fully processed = safe
            return False

        state[node_id] = 1  # mark as being visited

        for neighbor in graph.get(node_id, []):
            if has_cycle(neighbor):
                return True

        state[node_id] = 2  # mark as fully visited
        return False

    # Check every node (graph may not be fully connected)
    for node in nodes:
        if state[node.id] == 0:
            if has_cycle(node.id):
                return False  # cycle found → not a DAG

    return True  # no cycles found → is a DAG

# ─── Routes ──────────────────────────────────────────────────────────────────
@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag,
    }