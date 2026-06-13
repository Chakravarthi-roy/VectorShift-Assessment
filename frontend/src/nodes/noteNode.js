import { useState } from 'react';
import { BaseNode } from '../BaseNode';
import { useStore } from '../store';

const icon = <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>;

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode id={id} title="Note" icon={icon} description="Leave a comment or annotation on the canvas." handles={[]} headerColor="#f59e0b" width={220} minHeight={80} maxHeight={300}>
      <textarea
        style={textareaStyle}
        value={note}
        placeholder="Write a note or comment here..."
        onChange={(e) => { setNote(e.target.value); updateNodeField(id, 'note', e.target.value); }}
        rows={4}
      />
    </BaseNode>
  );
};

const textareaStyle = { boxSizing: 'border-box', width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '12px', color: '#1e293b', background: '#fffbeb', outline: 'none', resize: 'none', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' };