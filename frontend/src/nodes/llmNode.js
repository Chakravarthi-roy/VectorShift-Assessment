import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';

const icon = <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></>;

export const LLMNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-system`, style: { top: '38%' } },
    { type: 'target', position: Position.Left, id: `${id}-prompt`, style: { top: '62%' } },
    { type: 'source', position: Position.Right, id: `${id}-response` },
  ];

  return (
    <BaseNode id={id} title="LLM" icon={icon} description="Connect prompts to get a response from a language model." handles={handles}>
      <div style={rowStyle}>
        <span style={labelStyle}>System</span>
        <span style={labelStyle}>Prompt</span>
      </div>
      <div style={badgeStyle}>✦ Language Model</div>
    </BaseNode>
  );
};

const rowStyle = { display: 'flex', flexDirection: 'column', gap: '14px', paddingLeft: '4px' };
const labelStyle = { fontSize: '11px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' };
const badgeStyle = { fontSize: '11px', color: '#6366f1', fontWeight: '600', textAlign: 'center', padding: '4px', borderTop: '1px solid #e2e8f0', marginTop: '2px' };