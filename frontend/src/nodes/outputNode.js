import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { CustomSelect } from '../customSelect';
import { useStore } from '../store';

const icon = <><path d="M11 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6"/><polyline points="11 8 11 16"/><path d="M21 12H11m5-4 5 4-5 4"/></>;

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-value` }
  ];

  const typeOptions = [
    { value: 'Text', label: 'Text' },
    { value: 'Image', label: 'Image' },
  ];

  return (
    <BaseNode id={id} title="Output" icon={icon} description="Displays the final result of the pipeline." handles={handles}>
      <label style={labelStyle}>
        Name
        <input style={inputStyle} type="text" value={currName}
          onChange={(e) => { setCurrName(e.target.value); updateNodeField(id, 'outputName', e.target.value); }}
        />
      </label>
      <label style={labelStyle}>
        Type
        <CustomSelect value={outputType} options={typeOptions}
          onChange={(e) => { setOutputType(e.target.value); updateNodeField(id, 'outputType', e.target.value); }}
        />
      </label>
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const inputStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none' };