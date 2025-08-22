import { useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

// 📝 Note Node: Rich text/Markdown
const NoteNode = ({ data, isConnectable, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(data.content || 'Enter your note here...');

  const handleSave = () => {
    data.onChange && data.onChange(noteContent);
    setIsEditing(false);
  };

  return (
    <div className="p-3 rounded-md border border-emerald-500 bg-zinc-800 shadow-lg">
      {data.isResizing && selected && (
        <NodeResizer 
          minWidth={150} 
          minHeight={50}
          isVisible={selected}
          lineClassName="border-emerald-500"
          handleClassName="h-3 w-3 bg-white border-2 border-emerald-500 rounded"
        />
      )}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-lg mr-2">📝</span>
          <span className="font-medium text-emerald-400">Note</span>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="p-1 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100"
        >
          {isEditing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          )}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="w-full h-32 bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="text-zinc-100 whitespace-pre-wrap break-words">
          {noteContent}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-emerald-500"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-emerald-500"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default NoteNode;
