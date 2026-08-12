import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@tdesign/components';

const DraggableButton = ({ children, onClick }) => {
  const buttonRef = useRef(null);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight - 100,
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  const constrainPosition = useCallback((x, y, windowWidth, windowHeight) => {
    const buttonWidth = buttonRef.current?.offsetWidth || 0;
    const buttonHeight = buttonRef.current?.offsetHeight || 0;

    const minX = buttonWidth / 2;
    const maxX = windowWidth - buttonWidth / 2;
    const minY = 0;
    const maxY = windowHeight - buttonHeight;

    return {
      x: Math.max(minX, Math.min(x, maxX)),
      y: Math.max(minY, Math.min(y, maxY)),
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartPosition({ x: e.clientX, y: e.clientY });
    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    setDragOffset({
      x: e.clientX - buttonCenterX,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      // 如果拖拽距离超过 5 像素，认为是拖拽操作
      const dragDistance = Math.sqrt((e.clientX - startPosition.x) ** 2 + (e.clientY - startPosition.y) ** 2);
      if (dragDistance > 5) setHasDragged(true);

      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };

      setPosition(constrainPosition(newPosition.x, newPosition.y, window.innerWidth, window.innerHeight));
    },
    [isDragging, dragOffset, startPosition, constrainPosition],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    // 延迟重置状态，确保 click 能正确判断
    setTimeout(() => {
      setHasDragged(false);
      setIsDragging(false);
    }, 10);
  };

  const handleClick = (e) => {
    if (hasDragged) {
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
    const newX = xRatio * windowWidth;
    const newY = yRatio * windowHeight;

    setPosition(constrainPosition(newX, newY, windowWidth, windowHeight));
    setWindowSize({
      width: windowWidth,
      height: windowHeight,
    });
  }, [isDragging, position, windowSize, constrainPosition]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (!isDragging) return;
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
