// ui.js
// Main pipeline canvas — drag/drop, lock, clear canvas, edge deletion, toast

import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls, Background, MiniMap,
  ReactFlowProvider,
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

// Toast notification
const Toast = ({ message }) => (
  <div style={toastStyle}>🔒 {message}</div>
);

// Clear Canvas confirmation modal
const ClearModal = ({ onConfirm, onCancel }) => (
  <div style={overlayStyle}>
    <div style={modalStyle}>
      <div style={modalHeaderStyle}>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
          🗑️ Clear Canvas?
        </span>
      </div>
      <p style={modalBodyStyle}>
        This will remove all nodes and edges from the canvas. This action cannot be undone.
      </p>
      <div style={modalFooterStyle}>
        <button style={cancelBtnStyle} onClick={onCancel}>Cancel</button>
        <button style={confirmBtnStyle} onClick={onConfirm}>Clear</button>
      </div>
    </div>
  </div>
);

const Flow = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [toast, setToast] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    clearCanvas,
  } = useStore(selector, shallow);

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

  const onKeyDown = useCallback((event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (isLocked) { showToast('Pipeline is locked. Unlock to make changes.'); return; }
      const selectedEdges = edges.filter((e) => e.selected);
      if (selectedEdges.length > 0) {
        onEdgesChange(selectedEdges.map((e) => ({ id: e.id, type: 'remove' })));
      }
    }
  }, [edges, onEdgesChange, isLocked]);

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
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#cbd5e1" gap={gridSize} variant="dots" />
        <Controls onInteractiveChange={(isInteractive) => setIsLocked(!isInteractive)}>
          {/* Clear Canvas Button */}
          <div className="clear-btn-wrapper">
            <button
              onClick={() => {
                if (isLocked) { showToast('Pipeline is locked. Unlock to make changes.'); return; }
                setShowClearModal(true);
              }}
              style={controlBtnStyle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12H6.5L5 9zm5 2v8h1v-8h-1zm3 0v8h1v-8h-1zM9 4h6V2H9v2z"/>
              </svg>
            </button>
            <div className="clear-btn-tooltip">Clear canvas</div>
          </div>
        </Controls>
        <MiniMap nodeColor="#1C2536" maskColor="rgba(248,250,252,0.7)" />
      </ReactFlow>

      {/* Toast */}
      {toast && <Toast message={toast} />}

      {/* Clear Canvas Modal */}
      {showClearModal && (
        <ClearModal
          onConfirm={() => { clearCanvas(); setShowClearModal(false); }}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </div>
  );
};

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

const overlayStyle = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(2px)',
};

const modalStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  width: '340px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  fontFamily: 'Inter, sans-serif',
};

const modalHeaderStyle = {
  padding: '20px 20px 12px',
  borderBottom: '1px solid #e2e8f0',
};

const modalBodyStyle = {
  padding: '16px 20px',
  fontSize: '13px',
  color: '#64748b',
  lineHeight: '1.6',
  margin: 0,
};

const modalFooterStyle = {
  display: 'flex',
  gap: '10px',
  padding: '12px 20px 20px',
};

const cancelBtnStyle = {
  flex: 1,
  padding: '9px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
  color: '#64748b',
};

const confirmBtnStyle = {
  flex: 1,
  padding: '9px',
  borderRadius: '8px',
  border: 'none',
  background: '#ef4444',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};