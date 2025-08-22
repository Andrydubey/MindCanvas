import { useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

// ✅ Task Node: Progress tracking
const TaskNode = ({ data, isConnectable, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskContent, setTaskContent] = useState(data.content || 'Enter your task here...');
  const [isCompleted, setIsCompleted] = useState(data.isCompleted || false);
  const [dueDate, setDueDate] = useState(data.dueDate || '');
  const [priority, setPriority] = useState(data.priority || 'medium');

  const handleSave = () => {
    if (data.onChange) {
      data.onChange({
        content: taskContent,
        isCompleted,
        dueDate,
        priority
      });
    }
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  return (
    <div className={`p-3 rounded-md border ${isCompleted ? 'border-green-500' : 'border-emerald-500'} bg-zinc-800 shadow-lg`}>
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
          <span className="text-lg mr-2">✅</span>
          <span className="font-medium text-emerald-400">Task</span>
        </div>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${priorityColors[priority]}`}></div>
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
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="w-full h-16 bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 mb-2"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            autoFocus
          />
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-1 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Priority</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-1 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4"
                checked={isCompleted}
                onChange={() => setIsCompleted(!isCompleted)}
              />
              Completed
            </label>
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="text-zinc-100">
          <div className="flex items-start mb-2">
            <input
              type="checkbox"
              className="mr-2 mt-1 h-4 w-4"
              checked={isCompleted}
              onChange={() => {
                const newValue = !isCompleted;
                setIsCompleted(newValue);
                if (data.onChange) {
                  data.onChange({
                    content: taskContent,
                    isCompleted: newValue,
                    dueDate,
                    priority
                  });
                }
              }}
            />
            <span className={isCompleted ? 'line-through text-zinc-500' : ''}>{taskContent}</span>
          </div>
          
          {dueDate && (
            <div className="text-xs text-zinc-400 mt-1">
              Due: {new Date(dueDate).toLocaleDateString()}
            </div>
          )}
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

export default TaskNode;
