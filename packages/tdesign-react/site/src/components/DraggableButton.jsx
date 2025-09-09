import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@tdesign/components';

const DraggableButton = ({ children, onClick }) => {
  const buttonRef = useRef(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight - 100,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    setDragOffset({
      x: e.clientX - buttonCenterX,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback((e) => {
      if (!isDragging) return;
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };

      const buttonWidth = buttonRef.current?.offsetWidth || 0;
      const buttonHeight = buttonRef.current?.offsetHeight || 0;

      const minX = buttonWidth / 2;
      const maxX = window.innerWidth - buttonWidth / 2;
      const minY = 0;
      const maxY = window.innerHeight - buttonHeight;

      setPosition({
        x: Math.max(minX, Math.min(newPosition.x, maxX)),
        y: Math.max(minY, Math.min(newPosition.y, maxY)),
      });
    },
    [isDragging, dragOffset],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  const handleResize = useCallback(() => {
    if (isDragging) return;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const xRatio = position.x / windowSize.width;
    const yRatio = position.y / windowSize.height;

    // 根据新窗口尺寸和比例计算新位置
    const buttonWidth = buttonRef.current?.offsetWidth || 0;
    const buttonHeight = buttonRef.current?.offsetHeight || 0;

    const newX = xRatio * windowWidth;
    const newY = yRatio * windowHeight;

    const minX = buttonWidth / 2;
    const maxX = windowWidth - buttonWidth / 2;
    const minY = 0;
    const maxY = windowHeight - buttonHeight;

    setPosition({
      x: Math.max(minX, Math.min(newX, maxX)),
      y: Math.max(minY, Math.min(newY, maxY)),
    });

    setWindowSize({
      width: windowWidth,
      height: windowHeight,
    });
  }, [isDragging, position, windowSize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if(!isDragging) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, handleMouseMove]);

  return (
    <Button
      ref={buttonRef}
      size="large"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 10000,
        userSelect: 'none',
        transition: isDragging ? 'none' : 'opacity 0.2s ease',
        transform: 'translateX(-50%)',
      }}
    >
      {children}
    </Button>
  );
};

export default DraggableButton;
