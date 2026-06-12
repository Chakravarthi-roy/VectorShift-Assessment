// textNode.js
// Smart text node with two special features:
// 1. Auto-resizes as the user types more text
// 2. Detects {{variableName}} patterns and creates dynamic input handles

import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

// Regex to find valid JS variable names inside {{ }}
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

// Extract unique variable names from text
const extractVariables = (text) => {
  const vars = [];
  let match;
  const regex = new RegExp(VARIABLE_REGEX.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    if (!vars.includes(match[1])) {
      vars.push(match[1]);
    }
  }
  return vars;
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState(200);
  const [nodeHeight, setNodeHeight] = useState(80);
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    const vars = extractVariables(currText);
    setVariables(vars);

    if (textareaRef.current) {
      const lines = currText.split('\n');
      const longestLine = lines.reduce((a, b) => a.length > b.length ? a : b, '');

      // Max width: 400px, Max height: 600px — intentional limits to keep
      // nodes readable and canvas organized. Adjust as needed.
      const estimatedWidth = Math.max(200, Math.min(400, longestLine.length * 8 + 60));

      // Vertical limit is more generous than horizontal since users type more vertically
      const lineCount = lines.length;
      const estimatedHeight = Math.max(80, Math.min(600, lineCount * 24 + 80));

      setNodeWidth(estimatedWidth);
      setNodeHeight(estimatedHeight);
    }
  }, [currText]);

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
    },
    ...variables.map((varName, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${varName}`,
      style: {
        top: `${((index + 1) / (variables.length + 1)) * 100}%`,
      },
    })),
  ];

  return (
    <BaseNode
      id={id}
      title="Text"
      handles={handles}
      width={nodeWidth}
      minHeight={nodeHeight}
    >
      <label style={labelStyle}>
        Text
        <textarea
          ref={textareaRef}
          style={{
            ...textareaStyle,
            width: '100%',
            minHeight: `${Math.max(60, (currText.split('\n').length) * 24)}px`,
          }}
          value={currText}
          onChange={(e) => {
            setCurrText(e.target.value);
            updateNodeField(id, 'text', e.target.value);
          }}
        />
      </label>

      {variables.length > 0 && (
        <div style={variableContainerStyle}>
          {variables.map((varName) => (
            <span key={varName} style={variableBadgeStyle}>
              ← {varName}
            </span>
          ))}
        </div>
      )}
    </BaseNode>
  );
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '12px',
  color: '#64748b',
  fontWeight: '500',
  width: '100%',
};

const textareaStyle = {
  boxSizing: 'border-box',
  padding: '6px 8px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '12px',
  color: '#1e293b',
  background: '#f8fafc',
  outline: 'none',
  resize: 'none',
  lineHeight: '1.5',
  fontFamily: 'Inter, sans-serif',
  transition: 'all 0.1s ease',
};

const variableContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  borderTop: '1px solid #e2e8f0',
  paddingTop: '6px',
  marginTop: '2px',
  width: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
};

const variableBadgeStyle = {
  fontSize: '11px',
  color: '#8b5cf6',
  background: '#f5f3ff',
  border: '1px solid #ddd6fe',
  borderRadius: '4px',
  padding: '2px 6px',
  fontWeight: '600',
  maxWidth: '120px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};