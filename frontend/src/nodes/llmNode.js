// llmNode.js
// The LLM node — connects a system prompt and user prompt, outputs a response.
// Uses BaseNode for all shared structure and styling.

import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      style: { top: '37%' },
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: '63%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`,
    },
  ];

  return (
    <BaseNode id={id} title="LLM" handles={handles}>
      <div style={rowStyle}>
        <span style={labelStyle}>System</span>
        <span style={labelStyle}>Prompt</span>
      </div>
      <div style={descStyle}>
        Connect a system prompt and a user prompt to get a response from the LLM.
      </div>
      <div style={badgeStyle}>
        ✦ Language Model
      </div>
    </BaseNode>
  );
};

const rowStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingLeft: '4px',
};

const labelStyle = {
  fontSize: '11px',
  color: '#94a3b8',
  fontWeight: '500',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const descStyle = {
  fontSize: '11px',
  color: '#64748b',
  lineHeight: '1.5',
  padding: '6px 8px',
  background: '#f8fafc',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
};

const badgeStyle = {
  fontSize: '11px',
  color: '#6366f1',
  fontWeight: '600',
  textAlign: 'center',
  padding: '4px',
  borderTop: '1px solid #e2e8f0',
  marginTop: '2px',
};