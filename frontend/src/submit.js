// submit.js
// Sends pipeline nodes and edges to the backend and shows a result modal

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const [modal, setModal] = useState(null); // holds response data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setModal(null);

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error('Server error. Please try again.');
      }

      const data = await response.json();
      setModal(data);
    } catch (err) {
      setError(err.message || 'Could not connect to backend. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Submit Button */}
      <div className="submit-wrapper">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Analyzing...' : 'Submit'}
        </button>
      </div>

      {/* Result Modal */}
      {modal && (
        <div style={overlayStyle} onClick={() => setModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={modalHeaderStyle}>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>
                Pipeline Analysis
              </span>
              <button style={closeButtonStyle} onClick={() => setModal(null)}>✕</button>
            </div>

            {/* Stats */}
            <div style={statsRowStyle}>
              <div style={statCardStyle}>
                <span style={statNumberStyle}>{modal.num_nodes}</span>
                <span style={statLabelStyle}>Nodes</span>
              </div>
              <div style={statCardStyle}>
                <span style={statNumberStyle}>{modal.num_edges}</span>
                <span style={statLabelStyle}>Edges</span>
              </div>
            </div>

            {/* DAG Result */}
            <div style={{
              ...dagBadgeStyle,
              background: modal.is_dag ? '#f0fdf4' : '#fff1f2',
              border: `1px solid ${modal.is_dag ? '#86efac' : '#fecdd3'}`,
            }}>
              <span style={{ fontSize: '24px' }}>
                {modal.is_dag ? '✅' : '❌'}
              </span>
              <div>
                <div style={{
                  fontWeight: '700',
                  fontSize: '14px',
                  color: modal.is_dag ? '#15803d' : '#be123c',
                }}>
                  {modal.is_dag ? 'Valid DAG' : 'Not a DAG'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  {modal.is_dag
                    ? 'Your pipeline has no cycles — data flows correctly!'
                    : 'Your pipeline has cycles — data cannot flow correctly.'}
                </div>
              </div>
            </div>

            {/* Close */}
            <button style={dismissButtonStyle} onClick={() => setModal(null)}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && (
        <div style={overlayStyle} onClick={() => setError(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>Error</span>
              <button style={closeButtonStyle} onClick={() => setError(null)}>✕</button>
            </div>
            <div style={{ padding: '16px', color: '#be123c', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
            <button style={dismissButtonStyle} onClick={() => setError(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(2px)',
};

const modalStyle = {
  background: '#ffffff',
  borderRadius: '16px',
  width: '360px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  fontFamily: 'Inter, sans-serif',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 20px 16px',
  borderBottom: '1px solid #e2e8f0',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '16px',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: '4px',
  lineHeight: 1,
};

const statsRowStyle = {
  display: 'flex',
  gap: '12px',
  padding: '16px 20px',
};

const statCardStyle = {
  flex: 1,
  background: '#f8fafc',
  borderRadius: '10px',
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid #e2e8f0',
};

const statNumberStyle = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#1C2536',
  lineHeight: 1,
};

const statLabelStyle = {
  fontSize: '12px',
  color: '#64748b',
  fontWeight: '500',
};

const dagBadgeStyle = {
  margin: '0 20px',
  borderRadius: '10px',
  padding: '14px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const dismissButtonStyle = {
  display: 'block',
  width: 'calc(100% - 40px)',
  margin: '16px 20px',
  padding: '10px',
  background: '#1C2536',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};