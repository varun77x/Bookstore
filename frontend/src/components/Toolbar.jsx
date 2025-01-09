import React from 'react';

const Toolbar = ({ activeTool, onToolChange }) => {
  return (
    <div className="fixed top-5 left-5 z-10 flex gap-2 p-3 bg-white/90 rounded-lg shadow-md">
      <button
        className={`px-4 py-2 rounded transition-colors ${
          activeTool === 'pen'
            ? 'bg-gray-800 text-white'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('pen')}
      >
        Pen
      </button>
      <button
        className={`px-4 py-2 rounded transition-colors ${
          activeTool === 'eraser'
            ? 'bg-gray-800 text-white'
            : 'bg-white text-gray-800 hover:bg-gray-100'
        }`}
        onClick={() => onToolChange('eraser')}
      >
        Eraser
      </button>
    </div>
  );
};

export default Toolbar;