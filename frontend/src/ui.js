// ui.js
// Main pipeline canvas — drag/drop, lock, clear canvas, edge deletion, toast

import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls, Background, MiniMap,
  useReactFlow, ReactFlowProvider,
} from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { PromptNode } from './nodes/promptNode';
import { FilterNode } from './nodes/filterNode';
import { NoteNode } from './nodes/noteNode';
import { APINode } from './nodes/apiNode';
import { TimerNode } from './nodes/timerNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  promptNode: PromptNode,
  filterNode: FilterNode,
  noteNode: NoteNode,
  apiNode: APINode,
  timerNode: TimerNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  clearCanvas: state.clearCanvas,
});

// Toast notification component
const Toast = ({ message, onClose }) => (
  <div style={toastStyle}>
    🔒 {message}
  </div>
);

const Flow = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    clearCanvas,
  } = useStore(selector, shallow);

  // Show toast for 2.5 seconds
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: `${type}` });

  const onDrop = useCallback((event) => {
    event.preventDefault();
    if (isLocked) { showToast('Pipeline is locked. Unlock to make changes.'); return; }
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = appData?.nodeType;
      if (typeof type === 'undefined' || !type) return;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: getInitNodeData(nodeID, type) });
    }
  }, [reactFlowInstance, isLocked]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle keyboard delete — blocked when locked
  const onKeyDown = useCallback((event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (isLocked) {
        showToast('Pipeline is locked. Unlock to make changes.');
        return;
      }
      const selectedEdges = edges.filter((e) => e.selected);
      if (selectedEdges.length > 0) {
        onEdgesChange(selectedEdges.map((e) => ({ id: e.id, type: 'remove' })));
      }
    }
  }, [edges, onEdgesChange, isLocked]);

  // Block node dragging when locked
  const handleNodesChange = useCallback((changes) => {
    if (isLocked) {
      const nonMoveChanges = changes.filter((c) => c.type !== 'position');
      if (changes.some((c) => c.type === 'position')) {
        showToast('Pipeline is locked. Unlock to make changes.');
      }
      if (nonMoveChanges.length > 0) onNodesChange(nonMoveChanges);
      return;
    }
    onNodesChange(changes);
  }, [onNodesChange, isLocked]);

  // Block new connections when locked
  const handleConnect = useCallback((connection) => {
    if (isLocked) { showToast('Pipeline is locked. Unlock to make changes.'); return; }
    onConnect(connection);
  }, [onConnect, isLocked]);

  return (
    <div
      ref={reactFlowWrapper}
      className="canvas-wrapper"
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ outline: 'none', position: 'relative' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        deleteKeyCode={isLocked ? null : ['Delete', 'Backspace']}
        nodesDraggable={!isLocked}
        fitView
      >
        <Background color="#cbd5e1" gap={gridSize} variant="dots" />
        <Controls>
          {/* Clear Canvas Button */}
          <button
            title="Clear canvas"
            onClick={() => {
              if (isLocked) { showToast('Pipeline is locked. Unlock to make changes.'); return; }
              if (window.confirm('Clear all nodes and edges?')) clearCanvas();
            }}
            style={controlBtnStyle}
          >
            🗑
          </button>
          {/* Lock/Unlock Button */}
          <button
            title={isLocked ? 'Unlock pipeline' : 'Lock pipeline'}
            onClick={() => setIsLocked(!isLocked)}
            style={{
              ...controlBtnStyle,
              background: isLocked ? '#fee2e2' : '#ffffff',
            }}
          >
            {isLocked ? '🔒' : '🔓'}
          </button>
        </Controls>
        <MiniMap nodeColor="#1C2536" maskColor="rgba(248,250,252,0.7)" />
      </ReactFlow>

      {/* Toast notification */}
      {toast && <Toast message={toast} />}
    </div>
  );
};

// Wrap with ReactFlowProvider so useReactFlow works
export const PipelineUI = () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);

// ─── Styles ──────────────────────────────────────────────────────────────────
const controlBtnStyle = {
  width: '100%',
  background: '#ffffff',
  border: 'none',
  borderBottom: '1px solid #e2e8f0',
  padding: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const toastStyle = {
  position: 'absolute',
  top: '16px',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#1C2536',
  color: '#ffffff',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 999,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
};