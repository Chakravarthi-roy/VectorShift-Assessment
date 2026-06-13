import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { CustomSelect } from '../customSelect';
import { useStore } from '../store';

const icon = <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>;

export const APINode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-body`, style: { top: '38%' } },
    { type: 'target', position: Position.Left, id: `${id}-headers`, style: { top: '62%' } },
    { type: 'source', position: Position.Right, id: `${id}-response` },
  ];

  const methodOptions = [
    { value: 'GET', label: 'GET', color: '#10b981' },
    { value: 'POST', label: 'POST', color: '#6366f1' },
    { value: 'PUT', label: 'PUT', color: '#f59e0b' },
    { value: 'DELETE', label: 'DELETE', color: '#f43f5e' },
  ];

  return (
    <BaseNode id={id} title="API Call" icon={icon} description="Make an HTTP request to an external API." handles={handles} width={230}>
      <label style={labelStyle}>
        URL
        <input style={inputStyle} type="text" value={url} placeholder="https://api.example.com/data"
          onChange={(e) => { setUrl(e.target.value); updateNodeField(id, 'url', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Method
        <CustomSelect value={method} options={methodOptions}
          onChange={(e) => { setMethod(e.target.value); updateNodeField(id, 'method', e.target.value); }}
        />
      </label>
      <div style={hintStyle}>
        <span>Body ↑  Headers ↓</span>
        <span>Response →</span>
      </div>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const inputStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none' };
const hintStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '4px', marginTop: '2px' };