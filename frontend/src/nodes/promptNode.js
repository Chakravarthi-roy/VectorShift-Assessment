import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { CustomSelect } from '../customSelect';
import { useStore } from '../store';

const icon = <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>;

export const PromptNode = ({ id, data }) => {
  const [prompt, setPrompt] = useState(data?.prompt || '');
  const [role, setRole] = useState(data?.role || 'user');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-context` },
    { type: 'source', position: Position.Right, id: `${id}-prompt` },
  ];

  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'system', label: 'System' },
    { value: 'assistant', label: 'Assistant' },
  ];

  return (
    <BaseNode id={id} title="Prompt" icon={icon} description="Write a prompt template with a role for the LLM." handles={handles}>
      <label style={labelStyle}>
        Role
        <CustomSelect value={role} options={roleOptions}
          onChange={(e) => { setRole(e.target.value); updateNodeField(id, 'role', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Prompt Template
        <textarea style={textareaStyle} value={prompt} placeholder="Write your prompt here..."
          onChange={(e) => { setPrompt(e.target.value); updateNodeField(id, 'prompt', e.target.value); }}
          rows={3}
        />
      </label>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const inputStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none' };
const textareaStyle = { ...inputStyle, resize: 'none', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' };