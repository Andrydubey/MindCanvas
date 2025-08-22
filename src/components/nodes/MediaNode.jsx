import { useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

// 🎥 Media Node: Embed images/videos
const MediaNode = ({ data, isConnectable, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(data.url || '');
  const [mediaType, setMediaType] = useState(data.type || 'image');
  const [mediaTitle, setMediaTitle] = useState(data.title || 'Media');

  const handleSave = () => {
    if (data.onChange) {
      data.onChange({
        url: mediaUrl,
        type: mediaType,
        title: mediaTitle
      });
    }
    setIsEditing(false);
  };

  const renderMedia = () => {
    if (!mediaUrl) {
      return (
        <div className="bg-zinc-900 h-32 flex items-center justify-center text-zinc-500 rounded-md">
          No media source
        </div>
      );
    }

    if (mediaType === 'image') {
      return (
        <img 
          src={mediaUrl} 
          alt={mediaTitle} 
          className="w-full h-auto max-h-48 object-contain rounded-md"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite error loop
            e.target.src = '/mindcanvas-icon.svg'; // Using local file from public directory
          }}
        />
      );
    }

    if (mediaType === 'video') {
      // Extract YouTube video ID
      const getYouTubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
      };

      const youtubeID = getYouTubeID(mediaUrl);
      
      if (youtubeID) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeID}`}
            title={mediaTitle}
            className="w-full h-48 rounded-md"
            allowFullScreen
          />
        );
      } else {
        return (
          <video 
            src={mediaUrl} 
            controls 
            className="w-full h-auto max-h-48 rounded-md"
          >
            Your browser does not support the video tag.
          </video>
        );
      }
    }

    return (
      <div className="bg-zinc-900 h-32 flex items-center justify-center text-zinc-500 rounded-md">
        Unsupported media type
      </div>
    );
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
          <span className="text-lg mr-2">🎥</span>
          <span className="font-medium text-emerald-400">{mediaTitle}</span>
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
          <div className="mb-2">
            <label className="block text-xs text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="Enter media title"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-xs text-zinc-400 mb-1">Media Type</label>
            <select
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-zinc-400 mb-1">URL</label>
            <input
              type="text"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder={mediaType === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=...'}
            />
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          {renderMedia()}
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

export default MediaNode;
