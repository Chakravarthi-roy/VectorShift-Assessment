// inputNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { CustomSelect } from '../customSelect';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-value` }
  ];

  const typeOptions = [
    { value: 'Text', label: 'Text' },
    { value: 'File', label: 'File' },
  ];

  return (
    <BaseNode id={id} title="Input" handles={handles}>
      <label style={labelStyle}>
        Name
        <input style={inputStyle} type="text" value={currName}
          onChange={(e) => { setCurrName(e.target.value); updateNodeField(id, 'inputName', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Type
        <CustomSelect
          value={inputType}
          options={typeOptions}
          onChange={(e) => { setInputType(e.target.value); updateNodeField(id, 'inputType', e.target.value); }}
        />
      </label>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const inputStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none' };