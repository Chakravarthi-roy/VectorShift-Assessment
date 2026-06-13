// store.js
// Auto-saves nodes and edges to localStorage so canvas persists on reload

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

// Load saved canvas from localStorage on startup
const loadFromStorage = () => {
  try {
    const nodes = JSON.parse(localStorage.getItem('vs_nodes') || '[]');
    const edges = JSON.parse(localStorage.getItem('vs_edges') || '[]');
    return { nodes, edges };
  } catch {
    return { nodes: [], edges: [] };
  }
};

// Save canvas to localStorage
const saveToStorage = (nodes, edges) => {
  try {
    localStorage.setItem('vs_nodes', JSON.stringify(nodes));
    localStorage.setItem('vs_edges', JSON.stringify(edges));
  } catch {
    console.warn('Could not save canvas to localStorage');
  }
};

const saved = loadFromStorage();

export const useStore = create((set, get) => ({
  nodes: saved.nodes,
  edges: saved.edges,

  getNodeID: (type) => {
    const existingNodes = get().nodes;
    const usedNumbers = existingNodes
      .filter((n) => n.type === type)
      .map((n) => {
        const parts = n.id.split('-');
        return parseInt(parts[parts.length - 1]);
      })
      .filter((n) => !isNaN(n));

    let counter = 1;
    while (usedNumbers.includes(counter)) counter++;
    return `${type}-${counter}`;
  },

  addNode: (node) => {
    const nodes = [...get().nodes, node];
    saveToStorage(nodes, get().edges);
    set({ nodes });
  },

  onNodesChange: (changes) => {
    const nodes = applyNodeChanges(changes, get().nodes);
    saveToStorage(nodes, get().edges);
    set({ nodes });
  },

  onEdgesChange: (changes) => {
    const edges = applyEdgeChanges(changes, get().edges);
    saveToStorage(get().nodes, edges);
    set({ edges });
  },

  onConnect: (connection) => {
    const edges = addEdge({
      ...connection,
      type: 'smoothstep',
      animated: true,
      markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
    }, get().edges);
    saveToStorage(get().nodes, edges);
    set({ edges });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    const nodes = get().nodes.map((node) => {
      if (node.id === nodeId) {
        node.data = { ...node.data, [fieldName]: fieldValue };
      }
      return node;
    });
    saveToStorage(nodes, get().edges);
    set({ nodes });
  },

  // Clears canvas and localStorage
  clearCanvas: () => {
    saveToStorage([], []);
    set({ nodes: [], edges: [] });
  },
}));