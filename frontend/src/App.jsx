import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import Toolbar from './components/Toolbar';
import UsersSidebar from './components/UsersSidebar';
import DrawingCanvas from './components/DrawingCanvas';

const DEBOUNCE_TIME = 1000;

const App = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [tool, setTool] = useState('pen');
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const timeoutRef = useRef(null);
  const isInitialLoad = useRef(true);

  const handleJoin = (username) => {
    socketRef.current = io('http://localhost:5000', {
      query: { username }
    });
    setupSocketListeners();
    setIsJoined(true);
  };

  const setupSocketListeners = () => {
    socketRef.current.on('canvas-state', (state) => {
      if (isInitialLoad.current) {
        loadCanvasState(state);
        isInitialLoad.current = false;
      }
    });

    socketRef.current.on('draw', (data) => {
      drawLine(data);
    });

    socketRef.current.on('users-update', (updatedUsers) => {
      setUsers(updatedUsers);
    });
  };

  const loadCanvasState = (state) => {
    if (!state) return;
    
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();
    img.src = state;
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);
    };
  };

  const debouncedUpdateCanvasState = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const canvas = document.querySelector('canvas');
      const state = canvas.toDataURL('image/png');
      socketRef.current.emit('update-canvas-state', state);
    }, DEBOUNCE_TIME);
  }, []);

  const drawLine = useCallback((data) => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const { x0, y0, x1, y1, tool } = data;
    
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = tool === 'pen' ? '#000000' : '#FFFFFF';
    context.lineWidth = tool === 'pen' ? 2 : 20;
    context.stroke();
  }, []);

  const handleDraw = useCallback((offsetX, offsetY, context) => {
    const lastPoint = [context.lastX || offsetX, context.lastY || offsetY];

    socketRef.current.emit('draw', {
      x0: lastPoint[0],
      y0: lastPoint[1],
      x1: offsetX,
      y1: offsetY,
      tool
    });

    drawLine({
      x0: lastPoint[0],
      y0: lastPoint[1],
      x1: offsetX,
      y1: offsetY,
      tool
    });

    context.lastX = offsetX;
    context.lastY = offsetY;

    debouncedUpdateCanvasState();
  }, [tool, drawLine, debouncedUpdateCanvasState]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  if (!isJoined) {
    return <LoginForm onJoin={handleJoin} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      <Toolbar activeTool={tool} onToolChange={setTool} />
      <UsersSidebar users={users} />
      <DrawingCanvas onDraw={handleDraw} socketRef={socketRef} />
    </div>
  );
};

export default App;