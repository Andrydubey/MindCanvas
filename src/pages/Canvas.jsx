import { useState, useRef, useCallback, useEffect } from 'react'
import ReactFlow, { 
  ReactFlowProvider,
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'

// Node Types
import NoteNode from '../components/nodes/NoteNode'
import TaskNode from '../components/nodes/TaskNode'
import MediaNode from '../components/nodes/MediaNode'
import ChartNode from '../components/nodes/ChartNode'

// Initial nodes
const initialNodes = [
  {
    id: 'main',
    type: 'noteNode',
    position: { x: 400, y: 50 },
    data: { 
      content: 'Welcome to MindCanvas! 🧠✨\n\nThis is your interactive knowledge mapping tool. Drag nodes around, connect them, and organize your thoughts visually.',
      onChange: (content) => console.log('Note content changed:', content)
    }
  },
  // Core Features Section
  {
    id: 'features',
    type: 'noteNode',
    position: { x: 400, y: 200 },
    data: { 
      content: '🛠️ Core Features\n\n• Create different node types\n• Connect related concepts\n• Organize your knowledge visually\n• Save and share your mind maps',
      onChange: (content) => console.log('Note content changed:', content)
    }
  },
  // Note Node Example
  {
    id: 'notes-example',
    type: 'noteNode',
    position: { x: 150, y: 350 },
    data: { 
      content: '📝 Notes\n\nUse note nodes for text content, ideas, and concepts.',
      onChange: (content) => console.log('Note content changed:', content)
    }
  },
  // Task Node Example
  {
    id: 'tasks-example',
    type: 'taskNode',
    position: { x: 400, y: 350 },
    data: { 
      content: 'Create your first mind map',
      isCompleted: false,
      priority: 'high',
      onChange: (data) => console.log('Task updated:', data)
    }
  },
  // Media Node Example
  {
    id: 'media-example',
    type: 'mediaNode',
    position: { x: 650, y: 350 },
    data: { 
      title: 'Visual Thinking',
      type: 'image',
      url: 'https://via.placeholder.com/150/10B981/FFFFFF?text=MindCanvas',
      onChange: (data) => console.log('Media updated:', data)
    }
  },
  // Chart Node Example
  {
    id: 'chart-example',
    type: 'chartNode',
    position: { x: 400, y: 500 },
    data: { 
      title: 'Project Progress',
      chartType: 'bar',
      data: [
        { label: 'Ideas', value: 80 },
        { label: 'Planning', value: 65 },
        { label: 'Execution', value: 45 },
        { label: 'Review', value: 30 }
      ],
      onChange: (data) => console.log('Chart updated:', data)
    }
  },
  // Tips Node
  {
    id: 'tips',
    type: 'noteNode',
    position: { x: 650, y: 200 },
    data: { 
      content: '💡 Quick Tips\n\n• Double-click empty space to create a new node\n• Drag from handles to create connections\n• Use the toolbar to add specific node types\n• Try right-clicking for context menu options',
      onChange: (content) => console.log('Note content changed:', content)
    }
  },
  // Getting Started Tasks
  {
    id: 'getting-started',
    type: 'noteNode',
    position: { x: 150, y: 200 },
    data: { 
      content: '🚀 Getting Started\n\n1. Explore the different node types\n2. Try connecting related nodes\n3. Customize node content\n4. Save your canvas',
      onChange: (content) => console.log('Note content changed:', content)
    }
  }
];

// Initial edges with meaningful connections
const initialEdges = [
  // Main topic to main categories
  { id: 'e-main-features', source: 'main', target: 'features', animated: true, style: { stroke: '#34D399' } },
  { id: 'e-main-getting-started', source: 'main', target: 'getting-started', animated: true, style: { stroke: '#34D399' } },
  { id: 'e-main-tips', source: 'main', target: 'tips', animated: true, style: { stroke: '#34D399' } },
  
  // Features to examples
  { id: 'e-features-notes', source: 'features', target: 'notes-example', style: { stroke: '#94A3B8' } },
  { id: 'e-features-tasks', source: 'features', target: 'tasks-example', style: { stroke: '#94A3B8' } },
  { id: 'e-features-media', source: 'features', target: 'media-example', style: { stroke: '#94A3B8' } },
  { id: 'e-features-chart', source: 'features', target: 'chart-example', style: { stroke: '#94A3B8' } },
  
  // Getting started to task
  { id: 'e-getting-started-task', source: 'getting-started', target: 'tasks-example', style: { stroke: '#94A3B8' } }
];

// Custom node types
const nodeTypes = {
  noteNode: NoteNode,
  taskNode: TaskNode,
  mediaNode: MediaNode,
  chartNode: ChartNode
};

const Canvas = () => {
  const { projectId } = useParams();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState(null);
  const [lastDeletedNode, setLastDeletedNode] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  
  // Update node styles when selection changes
  useEffect(() => {
    if (selectedNode) {
      // Add a visual indicator to the selected node
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            // Add a selection border or highlight to the selected node
            return {
              ...node,
              style: { 
                ...node.style,
                boxShadow: '0 0 0 2px #10B981',
                border: '2px solid #10B981' 
              },
              // Pass resizing state to all nodes
              data: {
                ...node.data,
                isResizing
              }
            };
          } else {
            // Reset styles for other nodes
            const { boxShadow, border, ...otherStyles } = node.style || {};
            return {
              ...node,
              style: otherStyles,
            };
          }
        })
      );
    } else {
      // Reset styles for all nodes when nothing is selected
      setNodes((nds) =>
        nds.map((node) => {
          const { boxShadow, border, ...otherStyles } = node.style || {};
          return {
            ...node,
            style: otherStyles,
          };
        })
      );
    }
  }, [selectedNode, setNodes, isResizing]);
  
  // Update all nodes with resize state when toggled
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isResizing
        }
      }))
    );
  }, [isResizing, setNodes]);
  
  const onConnect = useCallback((params) => 
    setEdges((eds) => addEdge({ 
      ...params, 
      animated: true, 
      style: { stroke: '#34D399' } 
    }, eds)),
  [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      let newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { onChange: (data) => console.log('Node updated:', data) },
      };

      // Set default data based on node type
      switch(type) {
        case 'noteNode':
          newNode.data.content = 'Enter your note here...';
          break;
        case 'taskNode':
          newNode.data.content = 'New task';
          newNode.data.isCompleted = false;
          newNode.data.priority = 'medium';
          break;
        case 'mediaNode':
          newNode.data.title = 'Media';
          newNode.data.type = 'image';
          newNode.data.url = '';
          break;
        case 'chartNode':
          newNode.data.title = 'Chart';
          newNode.data.chartType = 'bar';
          newNode.data.chartData = '10,20,15,25,30';
          newNode.data.chartLabels = 'A,B,C,D,E';
          break;
        default:
          break;
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = (event, node) => {
    // Set the selected node
    setSelectedNode(node);
    
    // Update node style in state to show it's selected
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: n.id === node.id,
        style: {
          ...n.style,
          boxShadow: n.id === node.id ? '0 0 0 2px #10B981' : undefined,
          border: n.id === node.id ? '2px solid #10B981' : undefined,
        },
        // Add resizing property to the selected node
        data: n.id === node.id 
          ? { ...n.data, isResizing }
          : n.data
      }))
    );
    
    // Prevent propagation to stop onPaneClick from firing immediately
    event.stopPropagation();
  };
  
  // Function to undo the last deletion
  const undoDelete = useCallback(() => {
    if (lastDeletedNode) {
      // Restore the node
      setNodes(nodes => [...nodes, lastDeletedNode.node]);
      
      // Restore any connected edges
      if (lastDeletedNode.edges?.length) {
        setEdges(edges => [...edges, ...lastDeletedNode.edges]);
      }
      
      // Show notification
      setNotification({
        message: `Node restored successfully`,
        type: 'success'
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      // Clear the last deleted node
      setLastDeletedNode(null);
    }
  }, [lastDeletedNode, setNodes, setEdges]);

  const onPaneClick = useCallback(() => {
    // Clear the selected node
    setSelectedNode(null);
    
    // Remove styling from all nodes
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: false,
        style: {
          ...n.style,
          boxShadow: undefined,
          border: undefined,
        },
        // Remove resizing property from node data
        data: {
          ...n.data,
          isResizing: false
        }
      }))
    );
    
    // Close the delete confirmation if it's open
    if (showDeleteConfirm) {
      setShowDeleteConfirm(false);
    }
  }, [setNodes, setSelectedNode, showDeleteConfirm, setShowDeleteConfirm]);

  const onDeleteNode = useCallback((node = selectedNode) => {
    if (node) {
      const nodeType = node.type.replace('Node', '');
      
      // Store connected edges before deletion
      const connectedEdges = edges.filter(edge => edge.source === node.id || edge.target === node.id);
      
      // Remove the node
      setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
      
      // Remove any edges connected to this node
      setEdges((edges) => edges.filter(
        (edge) => edge.source !== node.id && edge.target !== node.id
      ));
      
      // Show notification with undo option
      setNotification({
        message: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} node deleted`,
        type: 'success',
        action: 'Undo'
      });
      
      // Store the deleted node and its edges for potential undo
      setLastDeletedNode({
        node,
        edges: connectedEdges
      });
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      // Clear the selected node
      if (node.id === selectedNode?.id) {
        setSelectedNode(null);
      }
    }
  }, [selectedNode, setNodes, setEdges, edges, setNotification, setLastDeletedNode, setSelectedNode]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      localStorage.setItem(`mindcanvas-flow-${projectId || 'default'}`, JSON.stringify(flow));
      
      // In a real app, you would save to a backend here
      console.log('Saved flow:', flow);
      
      // Show temporary save confirmation
      alert('Knowledge map saved successfully!');
    }
  }, [reactFlowInstance, projectId]);

  const onLoad = useCallback(() => {
    const savedFlow = localStorage.getItem(`mindcanvas-flow-${projectId || 'default'}`);
    
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      
      // Fit view to show all nodes
      setTimeout(() => {
        reactFlowInstance.fitView();
      }, 50);
    }
  }, [reactFlowInstance, projectId, setNodes, setEdges]);

  // Add keyboard shortcut for deleting nodes
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Delete key (46) or Backspace key (8)
      if ((event.keyCode === 46 || event.key === 'Delete' || event.keyCode === 8 || event.key === 'Backspace') && selectedNode) {
        // Prevent default action if we're in an input field
        if (event.target.tagName.toLowerCase() !== 'input' && 
            event.target.tagName.toLowerCase() !== 'textarea') {
          event.preventDefault();
          
          // Skip confirmation for keyboard deletion
          onDeleteNode(selectedNode);
        }
      }
      
      // Ctrl/Cmd + Z to undo deletion
      if ((event.ctrlKey || event.metaKey) && (event.keyCode === 90 || event.key === 'z')) {
        if (lastDeletedNode) {
          event.preventDefault();
          undoDelete();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedNode, onDeleteNode, lastDeletedNode, undoDelete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full bg-zinc-900 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2 text-zinc-100 hover:text-emerald-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h2 className="text-xl font-bold text-emerald-400">MindCanvas</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onSave}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Save</span>
          </button>
          <button 
            onClick={onLoad}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.586V16a1 1 0 11-2 0V8.586l-1.293 1.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Load</span>
          </button>
          <button 
            onClick={() => setIsResizing(!isResizing)}
            className={`px-3 py-1 ${isResizing ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-zinc-700 hover:bg-zinc-600'} text-white rounded-md flex items-center space-x-1`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Resize</span>
          </button>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-2 py-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Node Types Menu */}
      {menuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-4 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg z-50 p-3 w-64"
        >
          <h3 className="text-zinc-300 text-sm font-medium mb-2">Add Node</h3>
          <p className="text-zinc-400 text-xs mb-3">Drag and drop a node type onto the canvas</p>
          
          <div className="space-y-2">
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'noteNode')}
              onDragEnd={onDragEnd}
              className="flex items-center space-x-2 p-2 bg-zinc-700 rounded-md cursor-move hover:bg-zinc-600 transition-colors"
            >
              <span className="text-lg">📝</span>
              <span className="text-zinc-200">Note Node</span>
            </div>
            
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'taskNode')}
              onDragEnd={onDragEnd}
              className="flex items-center space-x-2 p-2 bg-zinc-700 rounded-md cursor-move hover:bg-zinc-600 transition-colors"
            >
              <span className="text-lg">✅</span>
              <span className="text-zinc-200">Task Node</span>
            </div>
            
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'mediaNode')}
              onDragEnd={onDragEnd}
              className="flex items-center space-x-2 p-2 bg-zinc-700 rounded-md cursor-move hover:bg-zinc-600 transition-colors"
            >
              <span className="text-lg">🎥</span>
              <span className="text-zinc-200">Media Node</span>
            </div>
            
            <div
              draggable
              onDragStart={(event) => onDragStart(event, 'chartNode')}
              onDragEnd={onDragEnd}
              className="flex items-center space-x-2 p-2 bg-zinc-700 rounded-md cursor-move hover:bg-zinc-600 transition-colors"
            >
              <span className="text-lg">📊</span>
              <span className="text-zinc-200">Chart Node</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Main Canvas */}
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: false }}
            defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
            // Add styling for selected nodes
            nodesFocusable={true}
            nodesDraggable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
            onSelectionChange={(elements) => {
              // Ensure we maintain our selected node state properly
              if (!elements?.nodes?.length && selectedNode) {
                setSelectedNode(null);
              }
            }}
          >
            <Controls className="bg-zinc-800 border border-zinc-700 shadow-lg rounded-md" />
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.type === 'noteNode') return '#10B981'; // emerald-500
                if (n.type === 'taskNode') return '#10B981'; // emerald-500
                if (n.type === 'mediaNode') return '#10B981'; // emerald-500
                if (n.type === 'chartNode') return '#10B981'; // emerald-500
                return '#27272A'; // zinc-800
              }}
              nodeColor={(n) => {
                if (n.type === 'noteNode') return '#18181B'; // zinc-900
                if (n.type === 'taskNode') return '#18181B'; // zinc-900
                if (n.type === 'mediaNode') return '#18181B'; // zinc-900
                if (n.type === 'chartNode') return '#18181B'; // zinc-900
                return '#18181B'; // zinc-900
              }}
              nodeBorderRadius={4}
              className="bg-zinc-800 border border-zinc-700 shadow-lg rounded-md"
            />
            <Background color="#3F3F46" gap={16} /> {/* zinc-700 */}
            
            {/* Info Panel */}
            {isDragging && (
              <Panel position="top-center" className="bg-zinc-800 p-2 rounded-md shadow-lg border border-zinc-700">
                <span className="text-zinc-300 text-sm">Drop node on canvas</span>
              </Panel>
            )}
            
            {/* Resize Panel - Only visible when resize is enabled */}
            {isResizing && selectedNode && (
              <Panel position="top-center" className="bg-zinc-800 p-2 rounded-md shadow-lg border border-zinc-700">
                <span className="text-zinc-300 text-sm">Drag handles to resize the selected node</span>
              </Panel>
            )}
            
            {/* Delete Button - Only visible when a node is selected */}
            {selectedNode && !showDeleteConfirm && (
              <Panel position="top-right" className="mr-20 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Delete Node</span>
                </button>
              </Panel>
            )}
            
            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
              <Panel position="top-center" className="bg-zinc-800 p-4 rounded-md shadow-lg border border-zinc-700 w-80 z-50">
                <h3 className="text-zinc-200 text-lg font-semibold mb-2">Confirm Deletion</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Are you sure you want to delete this {selectedNode?.type.replace('Node', '')} node? This action can be undone with Ctrl+Z.
                </p>
                <div className="flex space-x-2 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1 bg-zinc-600 hover:bg-zinc-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDeleteNode();
                      setShowDeleteConfirm(false);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </Panel>
            )}
            
            {/* Notification Toast */}
            {notification && (
              <Panel position="bottom-center" className="mb-4 z-50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`px-4 py-2 rounded-md shadow-lg flex items-center justify-between ${
                    notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {notification.type === 'success' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>{notification.message}</span>
                  </div>
                  {notification.action && (
                    <button
                      onClick={undoDelete}
                      className="ml-4 px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-sm font-medium"
                    >
                      {notification.action}
                    </button>
                  )}
                </motion.div>
              </Panel>
            )}
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </motion.div>
  );
};

export default Canvas;
