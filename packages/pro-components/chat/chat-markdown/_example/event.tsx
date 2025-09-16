import React, { useState, useEffect, useRef } from 'react';
import { Button, Space } from 'tdesign-react';
import { ChatMarkdown, findTargetElement } from '@tdesign-react/aigc';

const doc = `
这是一个markdown[链接地址](http://example.com), 点击后**不会**自动跳转.
`;

export default function ThinkContentDemo() {
  const [displayText, setDisplayText] = useState(doc);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const currentIndex = useRef(doc.length);
  const startTimeRef = useRef(Date.now());

  // 自定义链接的点击
  useEffect(() => {
    // 处理链接点击
    const handleResourceClick = (event: MouseEvent) => {
      event.preventDefault();
      // 查找符合条件的目标元素
      const targetResource = findTargetElement(event, ['a[part=md_a]']);
      if (targetResource) {
        // 获取链接地址并触发回调
        const href = targetResource.getAttribute('href');
        if (href) {
          console.log('跳转链接href', href);
        }
      }
    };
    // 注册全局点击事件监听
    document.addEventListener('click', handleResourceClick);

    // 清理函数
    return () => {
      document.removeEventListener('click', handleResourceClick);
    };
  }, []);

  useEffect(() => {
    // 模拟打字效果
    const typeEffect = () => {
      if (!isTyping) return;

      if (currentIndex.current < doc.length) {
        const char = doc[currentIndex.current];
        currentIndex.current += 1;
        setDisplayText((prev) => prev + char);
        timerRef.current = setTimeout(typeEffect, 10);
      } else {
        // 输入完成时自动停止
        setIsTyping(false);
      }
    };

    if (isTyping) {
      // 如果已经完成输入，点击开始则重置
      if (currentIndex.current >= doc.length) {
        currentIndex.current = 0;
        setDisplayText('');
      }
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(typeEffect, 500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTyping]);

  const toggleTyping = () => {
    if (currentIndex.current >= doc.length) {
      currentIndex.current = 0;
      setDisplayText('');
    }
    setIsTyping(!isTyping);
  };

  return <ChatMarkdown content={displayText} />;
}
