// toolbar.js
import { useState } from 'react';
import { DraggableNode } from './draggableNode';

const icons = {
  customInput: <><polyline points="13 8 13 16"/><path d="M3 12h10M8 8l-5 4 5 4"/><path d="M13 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6"/></>,
  llm: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></>,
  customOutput: <><path d="M11 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6"/><polyline points="11 8 11 16"/><path d="M21 12H11m5-4 5 4-5 4"/></>,
  text: <><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></>,
  promptNode: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  filterNode: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
  noteNode: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  apiNode: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  timerNode: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
};

// Chevron SVG — points up when expanded, down when collapsed
const Chevron = ({ up }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
    viewBox="0 0 24 24" fill="none" stroke="#64748b"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  >
    {up
      ? <polyline points="18 15 12 9 6 15" />   // chevron up
      : <polyline points="6 9 12 15 18 9" />    // chevron down
    }
  </svg>
);

export const PipelineToolbar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={wrapperStyle}>
      {/* Main toolbar — slides up/down */}
      <div style={{
        ...toolbarStyle,
        maxHeight: expanded ? '80px' : '0px',
        opacity: expanded ? 1 : 0,
        paddingTop: expanded ? '12px' : '0',
        paddingBottom: expanded ? '12px' : '0',
        overflow: 'hidden',
      }}>
        <span className="toolbar-title">⚡ VectorShift</span>
        <div className="toolbar-divider" />
        <div className="toolbar-nodes">
          <DraggableNode type='customInput' label='Input' icon={icons.customInput} />
          <DraggableNode type='llm' label='LLM' icon={icons.llm} />
          <DraggableNode type='customOutput' label='Output' icon={icons.customOutput} />
          <DraggableNode type='text' label='Text' icon={icons.text} />
          <DraggableNode type='promptNode' label='Prompt' icon={icons.promptNode} />
          <DraggableNode type='filterNode' label='Filter' icon={icons.filterNode} />
          <DraggableNode type='noteNode' label='Note' icon={icons.noteNode} />
          <DraggableNode type='apiNode' label='API Call' icon={icons.apiNode} />
          <DraggableNode type='timerNode' label='Timer' icon={icons.timerNode} />
        </div>
      </div>

      {/* Chevron toggle button — small semicircle */}
      <div style={chevronWrapperStyle}>
        <div style={chevronBtnStyle} onClick={() => setExpanded(!expanded)}>
          <Chevron up={expanded} />
        </div>
      </div>
    </div>
  );
};

const wrapperStyle = {
  background: '#ffffff',
  borderBottom: 'none',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  zIndex: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
};

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px 20px',
  borderBottom: '1px solid #e2e8f0',
  transition: 'max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease',
};

const chevronWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  height: '0px',
};

const chevronBtnStyle = {
  position: 'absolute',
  top: '-1px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '72px',
  height: '28px',
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderTop: 'none',
  borderRadius: '0 0 36px 36px',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
  zIndex: 11,
};