// customSelect.js
// Custom dropdown — stays inside the node, no portal needed

import { useState, useRef, useEffect } from 'react';

export const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} style={wrapperStyle}>
      <div
        style={{
          ...triggerStyle,
          borderColor: open ? '#6366f1' : '#e2e8f0',
          boxShadow: open ? '0 0 0 2px rgba(99,102,241,0.3)' : 'none',
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ color: selected.color || '#1e293b' }}>{selected.label}</span>
        <svg
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s ease', flexShrink: 0 }}
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#64748b" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {open && (
        <div style={dropdownStyle}>
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                ...optionStyle,
                background: option.value === value ? '#f5f3ff' : '#ffffff',
                color: option.color || '#1e293b',
                fontWeight: option.value === value ? '600' : '400',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange({ target: { value: option.value } });
                setOpen(false);
              }}
            >
              {option.value === value && (
                <span style={{ color: '#6366f1', marginRight: '6px' }}>✓</span>
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const wrapperStyle = {
  position: 'relative',
  width: '100%',
  userSelect: 'none',
  zIndex: 9999,
};

const triggerStyle = {
  boxSizing: 'border-box',
  width: '100%',
  padding: '5px 8px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  fontSize: '12px',
  background: '#f8fafc',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'border-color 0.15s ease',
};

const dropdownStyle = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  right: 0,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  zIndex: 9999,
  overflowY: 'auto',
  maxHeight: '180px',
};

const optionStyle = {
  padding: '8px 10px',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
};