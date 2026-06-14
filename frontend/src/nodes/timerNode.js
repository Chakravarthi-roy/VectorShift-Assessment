import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { CustomSelect } from '../customSelect';
import { useStore } from '../store';

const icon = <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>;

export const TimerNode = ({ id, data }) => {
  const [duration, setDuration] = useState(data?.duration || '1');
  const [unit, setUnit] = useState(data?.unit || 'seconds');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-input` },
    { type: 'source', position: Position.Right, id: `${id}-output` },
  ];

  const unitOptions = [
    { value: 'milliseconds', label: 'Milliseconds' },
    { value: 'seconds', label: 'Seconds' },
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
  ];

  return (
    <BaseNode id={id} title="Timer" icon={icon} description="Add a delay before the next step in the pipeline." handles={handles} headerColor="#1C2536">
      <label style={labelStyle}>
        Duration
        <input style={inputStyle} type="number" min="1" value={duration}
          onChange={(e) => { setDuration(e.target.value); updateNodeField(id, 'duration', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Unit
        <CustomSelect value={unit} options={unitOptions}
          onChange={(e) => { setUnit(e.target.value); updateNodeField(id, 'unit', e.target.value); }}
        />
      </label>
      <div style={badgeStyle}>Delay: {duration} {unit}</div>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const inputStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none' };
const badgeStyle = { fontSize: '11px', color: '#1C2536', fontWeight: '600', textAlign: 'center', padding: '4px', borderTop: '1px solid #e2e8f0', marginTop: '2px' };