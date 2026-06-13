import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

const icon = <><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></>;

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const vars = [];
  let match;
  const regex = new RegExp(VARIABLE_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (!vars.includes(match[1])) vars.push(match[1]);
  }
  return vars;
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState(220);
  const [nodeHeight, setNodeHeight] = useState(80);
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);
    if (textareaRef.current) {
      const lines = currText.split('\n');
      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, '');
      const estimatedWidth = Math.max(220, Math.min(400, longestLine.length * 8 + 60));
      const estimatedHeight = Math.max(80, Math.min(600, lines.length * 24 + 80));
      setNodeWidth(estimatedWidth);
      setNodeHeight(estimatedHeight);
    }
  }, [currText]);

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-output` },
    ...variables.map((varName, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${varName}`,
      style: { top: `${((index + 1) / (variables.length + 1)) * 100}%` },
    })),
  ];

  return (
    <BaseNode id={id} title="Text" icon={icon} description="Write text with dynamic {{variable}} handles." handles={handles} width={nodeWidth} minHeight={nodeHeight}>
      <label style={labelStyle}>
        Text
        <textarea
          ref={textareaRef}
          style={{ ...textareaStyle, minHeight: `${Math.max(60, currText.split('\n').length * 24)}px` }}
          value={currText}
          onChange={(e) => { setCurrText(e.target.value); updateNodeField(id, 'text', e.target.value); }}
        />
      </label>
      {variables.length > 0 && (
        <div style={variableContainerStyle}>
          {variables.map((varName) => (
            <span key={varName} style={variableBadgeStyle}>← {varName}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: '500', width: '100%' };
const textareaStyle = { boxSizing: 'border-box', width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#1e293b', background: '#f8fafc', outline: 'none', resize: 'none', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' };
const variableContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '4px', borderTop: '1px solid #e2e8f0', paddingTop: '6px', marginTop: '2px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' };
const variableBadgeStyle = { fontSize: '11px', color: '#8b5cf6', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '4px', padding: '2px 6px', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };