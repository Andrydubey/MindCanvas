import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sample project data (in a real app, this would come from a backend)
const initialProjects = [
  {
    id: 'project-1',
    title: 'Marketing Strategy',
    lastModified: '2 days ago',
    nodes: 12,
    connections: 15
  },
  {
    id: 'project-2',
    title: 'Product Roadmap',
    lastModified: '5 days ago',
    nodes: 8,
    connections: 10
  },
  {
    id: 'project-3',
    title: 'Research Notes',
    lastModified: '1 week ago',
    nodes: 15,
    connections: 22
  }
];

const Dashboard = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  const handleCreateNewProject = () => {
    if (newProjectTitle.trim() === '') return;
    
    const newProject = {
      id: `project-${Date.now()}`,
      title: newProjectTitle,
      lastModified: 'Just now',
      nodes: 1,
      connections: 0
    };
    
    setProjects([newProject, ...projects]);
    setNewProjectTitle('');
    setIsCreatingNew(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-zinc-900 text-zinc-100"
    >
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h1 className="text-2xl font-bold text-emerald-400">MindCanvas</h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-800 border-r border-zinc-700 h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-2">
            <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-md bg-emerald-600/20 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Projects</span>
            </Link>
            <Link to="/" className="flex items-center space-x-2 px-4 py-2 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Home</span>
            </Link>
            <div className="border-t border-zinc-700 my-4"></div>
            <button className="w-full flex items-center space-x-2 px-4 py-2 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-4 py-2 rounded-md text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Projects */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Knowledge Maps</h2>
            <button 
              onClick={() => setIsCreatingNew(true)}
              className="btn btn-primary px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>New Map</span>
            </button>
          </div>

          {/* New Project Form */}
          {isCreatingNew && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700"
            >
              <h3 className="text-lg font-medium mb-3">Create New Knowledge Map</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Enter a title for your new map"
                  className="flex-1 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  onClick={handleCreateNewProject}
                  className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Create
                </button>
                <button 
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-white"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                to={`/canvas/${project.id}`} 
                key={project.id}
                className="group bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 hover:border-emerald-500 transition-colors"
              >
                <div className="p-6 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-emerald-400">{project.title}</h3>
                </div>
                <div className="p-4">
                  <div className="border-t border-zinc-700"></div>
                  <div className="flex justify-between items-center mt-2 text-sm text-zinc-400">
                    <span>Modified {project.lastModified}</span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {project.nodes}
                      </span>
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 7H7v6h6V7z" />
                          <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                        </svg>
                        {project.connections}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </motion.div>
  );
};

export default Dashboard;
