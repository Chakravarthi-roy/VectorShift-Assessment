// draggableNode.js
export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      style={{ flexDirection: 'column', gap: '4px', height: '56px' }}
    >
      {icon && (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          {icon}
        </svg>
      )}
      <span style={{ color: '#fff', fontSize: '11px' }}>{label}</span>
    </div>
  );
};