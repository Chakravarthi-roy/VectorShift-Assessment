// BaseNode.js
// Shared template for all nodes
// Props: id, title, icon, description, handles, children, width, minHeight, headerColor

import { Handle } from 'reactflow';
import { useStore } from './store';

export const BaseNode = ({
  id,
  title,
  icon,
  description,
  handles = [],
  children,
  width = 220,
  minHeight = 80,
  maxHeight = 'none',
  headerColor = '#1C2536',
}) => {
  const onNodesChange = useStore((state) => state.onNodesChange);

  const handleDelete = () => {
    onNodesChange([{ id, type: 'remove' }]);
  };

  // Get node label e.g. "customInput-1" → "input_1"
  const nodeLabel = id
    .replace('customInput-', 'input_')
    .replace('customOutput-', 'output_')
    .replace('Node-', '_')
    .replace('llm-', 'llm_')
    .replace('text-', 'text_')
    .replace('promptNode-', 'prompt_')
    .replace('filterNode-', 'filter_')
    .replace('noteNode-', 'note_')
    .replace('apiNode-', 'api_')
    .replace('timerNode-', 'timer_');

  return (
    <div style={{
      width,
      maxWidth: width,
      minHeight,
      maxHeight,
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      boxSizing: 'border-box',
    }}>

      {/* Header */}
      <div style={{
        background: headerColor,
        color: '#ffffff',
        padding: '8px 10px',
        borderRadius: '11px 11px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
      }}>
        {/* Left side — icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {icon && (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="#ffffff"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              {icon}
            </svg>
          )}
          <span style={{ fontWeight: '600', fontSize: '13px', letterSpacing: '0.2px' }}>
            {title}
          </span>
        </div>

        {/* Close button with tooltip */}
        <div style={{ position: 'relative' }} className="delete-btn-wrapper">
          <button
            onClick={handleDelete}
            style={closeBtnStyle}
            className="delete-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
              viewBox="0 0 24 24" fill="none" stroke="#ffffff"
              strokeWidth="2.5" strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div style={tooltipStyle} className="delete-tooltip">
            Delete node
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div style={descriptionStyle}>{description}</div>
      )}

      {/* Node ID badge */}
      <div style={badgeWrapperStyle}>
        <span style={badgeStyle}>{nodeLabel}</span>
      </div>

      {/* Body */}
      <div style={{
        padding: '8px 12px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {children}
      </div>

      {/* Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            background: handle.type === 'source' ? '#6366f1' : '#8b5cf6',
            width: '10px',
            height: '10px',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px #6366f1',
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};

const tooltipStyle = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: '50%',
  transform: 'translateX(-50%)',
  background: '#ffffff',
  color: '#1C2536',
  fontSize: '11px',
  fontWeight: '500',
  padding: '4px 8px',
  borderRadius: '6px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  opacity: 0,
  transition: 'opacity 0.15s ease',
  zIndex: 9999,
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  border: '1px solid #e2e8f0',
};

const closeBtnStyle = {
  background: 'rgba(255,255,255,0.15)',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  padding: '3px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.15s ease',
  flexShrink: 0,
};

const descriptionStyle = {
  fontSize: '11px',
  color: '#94a3b8',
  padding: '6px 12px 0',
  lineHeight: '1.5',
};

const badgeWrapperStyle = {
  padding: '6px 12px 0',
};

const badgeStyle = {
  display: 'inline-block',
  fontSize: '11px',
  color: '#6366f1',
  background: '#f5f3ff',
  border: '1px solid #ddd6fe',
  borderRadius: '20px',
  padding: '2px 10px',
  fontWeight: '500',
};