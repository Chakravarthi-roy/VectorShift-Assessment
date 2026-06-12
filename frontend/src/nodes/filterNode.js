// filterNode.js
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { CustomSelect } from '../customSelect';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const [operator, setOperator] = useState(data?.operator || 'contains');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-input` },
    { type: 'source', position: Position.Right, id: `${id}-passed`, style: { top: '35%' } },
    { type: 'source', position: Position.Right, id: `${id}-failed`, style: { top: '65%' } },
  ];

  const operatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
  ];

  return (
    <BaseNode id={id} title="Filter" handles={handles}>
      <label style={labelStyle}>
        Operator
        <CustomSelect
          value={operator}
          options={operatorOptions}
          onChange={(e) => { setOperator(e.target.value); updateNodeField(id, 'operator', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Value
        <input style={inputStyle} type="text" value={condition} placeholder="e.g. hello"
          onChange={(e) => { setCondition(e.target.value); updateNodeField(id, 'condition', e.target.value); }}
        />
      </label>
      <div style={hintStyle}>
        <span style={{ color: '#6366f1' }}>● Pass</span>
        <span style={{ color: '#f43f5e' }}>● Fail</span>
      </div>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const inputStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none' };
const hintStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', padding: '4px 0', borderTop: '1px solid #e2e8f0', marginTop: '2px' };