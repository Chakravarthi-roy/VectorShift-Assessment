// store.js
import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  getNodeID: (type) => {
    const existingNodes = get().nodes;
    // Get all numbers currently used by this type
    const usedNumbers = existingNodes
      .filter((n) => n.type === type)
      .map((n) => {
        const parts = n.id.split('-');
        return parseInt(parts[parts.length - 1]);
      })
      .filter((n) => !isNaN(n));

    // Find the smallest unused number starting from 1
    let counter = 1;
    while (usedNumbers.includes(counter)) {
      counter++;
    }
    return `${type}-${counter}`;
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' }
      }, get().edges),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },
  // Clears all nodes and edges from the canvas
  clearCanvas: () => {
    set({ nodes: [], edges: [] });
  },
}));