// BaseNode.js
import { Handle } from 'reactflow';

export const BaseNode = ({ 
  id, 
  title, 
  handles = [], 
  children, 
  width = 200, 
  minHeight = 80,
  maxHeight = 'none',
  headerColor = '#1C2536',
}) => {
  return (
    <div style={{
      width: width,
      minHeight: minHeight,
      maxHeight: maxHeight,
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      boxSizing: 'border-box',
      // No overflow here — let children (dropdowns) escape freely
    }}>

      {/* Header — rounded top corners only */}
      <div style={{
        background: headerColor,
        color: '#ffffff',
        padding: '8px 12px',
        fontWeight: '600',
        fontSize: '13px',
        letterSpacing: '0.3px',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: '9px 9px 0 0',
      }}>
        {title}
      </div>

      {/* Body */}
      <div style={{
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {children}
      </div>

      {/* Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            background: handle.type === 'source' ? '#6366f1' : '#8b5cf6',
            width: '10px',
            height: '10px',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px #6366f1',
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};