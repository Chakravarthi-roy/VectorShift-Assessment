// customSelect.js
// Custom dropdown — stays inside the node, no portal needed

import { useState, useRef, useEffect } from 'react';

export const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const [hoveredValue, setHoveredValue] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setHoveredValue(null);
      }
    };
    document.addEventListener('mousedown', handleOutside, true);
    return () => document.removeEventListener('mousedown', handleOutside, true);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} style={wrapperStyle}>
      {/* Trigger */}
      <div
        style={{
          ...triggerStyle,
          borderColor: open ? '#6366f1' : '#e2e8f0',
          boxShadow: open ? '0 0 0 2px rgba(99,102,241,0.3)' : 'none',
        }}
        onClick={() => setOpen((prev) => !prev)}
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

      {/* Dropdown */}
      {open && (
        <div style={dropdownStyle}>
          {options.map((option) => {
            const isSelected = option.value === value;
            const isHovered = option.value === hoveredValue;

            let background = '#ffffff';
            if (isSelected) background = '#f5f3ff';
            if (isHovered && !isSelected) background = '#f1f5f9';
            if (isHovered && isSelected) background = '#ede9fe';

            return (
              <div
                key={option.value}
                style={{ ...optionStyle, background, color: option.color || '#1e293b', fontWeight: isSelected ? '600' : '400' }}
                onClick={() => { onChange({ target: { value: option.value } }); setOpen(false); setHoveredValue(null); }}
                onMouseEnter={() => setHoveredValue(option.value)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <span style={{ width: '16px', marginRight: '6px', color: '#6366f1' }}>
                  {isSelected ? '✓' : ''}
                </span>
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const wrapperStyle = { position: 'relative', width: '100%', userSelect: 'none', zIndex: 9999 };
const triggerStyle = { boxSizing: 'border-box', width: '100%', padding: '5px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'border-color 0.15s ease' };
const dropdownStyle = { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 9999, overflowY: 'auto', maxHeight: '180px' };
const optionStyle = { padding: '8px 10px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'background 0.1s ease' };