import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Toolbar from './components/Toolbar';
import UsersSidebar from './components/UsersSidebar';
import DrawingCanvas from './components/DrawingCanvas';


const DEBOUNCE_TIME = 1000;

const App = () => {

  const [tool, setTool] = useState('pen');
  const[users,setUsers] = useState(["varun","arun","run"])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      <Toolbar activeTool={tool} onToolChange={setTool} />
      <UsersSidebar users={users} />
      <DrawingCanvas />
    </div>
  );
};

export default App;