// toolbar.js
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="toolbar-wrapper">
      <span className="toolbar-title">⚡ VectorShift</span>
      <div className="toolbar-divider" />
      <div className="toolbar-nodes">
        <DraggableNode type='customInput' label='Input' />
        <DraggableNode type='llm' label='LLM' />
        <DraggableNode type='customOutput' label='Output' />
        <DraggableNode type='text' label='Text' />
        <DraggableNode type='promptNode' label='Prompt' />
        <DraggableNode type='filterNode' label='Filter' />
        <DraggableNode type='noteNode' label='Note' />
        <DraggableNode type='apiNode' label='API Call' />
        <DraggableNode type='timerNode' label='Timer' />
      </div>
    </div>
  );
};