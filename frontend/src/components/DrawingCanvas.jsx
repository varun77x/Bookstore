import React, { useEffect, useRef } from 'react';

const DrawingCanvas = ({ onDraw, socketRef }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    contextRef.current = context;

    const handleResize = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempContext = tempCanvas.getContext('2d');
      tempContext.drawImage(canvas, 0, 0);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      contextRef.current = canvas.getContext('2d');
      contextRef.current.lineCap = 'round';
      contextRef.current.drawImage(tempCanvas, 0, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCoordinates = (e) => {
    if (e.touches) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return {
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY
    };
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = getCoordinates(e);
    onDraw(offsetX, offsetY, contextRef.current);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    contextRef.current.lastX = undefined;
    contextRef.current.lastY = undefined;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className="absolute top-0 left-0 touch-none"
    />
  );
};

export default DrawingCanvas;