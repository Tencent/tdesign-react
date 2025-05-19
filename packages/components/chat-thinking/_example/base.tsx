import { type MessageStatus } from '@tencent/tdesign-chatbot';
import React, { useState, useEffect, useRef } from 'react';
import { ChatThinking } from 'tdesign-react';

const fullText =
  '嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。也就是说，保持原来的运动状态。那问题来了，这个定律是否适用于所有参考系呢？记得以前学过的参考系分惯性系和非惯性系。惯性系里，牛顿定律成立；非惯性系里，可能需要引入惯性力之类的修正。所以牛顿第一定律应该只在惯性参考系中成立，而在非惯性系中不适用，比如加速的电梯或者旋转的参考系，这时候物体会有看似无外力下的加速度，所以必须引入假想的力来解释。';

export default function ThinkContentDemo() {
  const [displayText, setDisplayText] = useState('');
  const [status, setStatus] = useState<MessageStatus>('pending');
  const [title, setTitle] = useState('正在思考中...');
  const [collapsed, setCollapsed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const currentIndex = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // 模拟打字效果
    const typeEffect = () => {
      if (currentIndex.current < fullText.length) {
        const char = fullText[currentIndex.current];
        currentIndex.current += 1;
        setDisplayText((prev) => prev + char);
        timerRef.current = setTimeout(typeEffect, 50);
        setStatus('streaming');
      } else {
        // 计算耗时并更新状态
        const costTime = parseInt(((Date.now() - startTimeRef.current) / 1000).toString(), 10);
        setTitle(`已完成思考（耗时${costTime}秒）`);
        setStatus('complete');
      }
    };

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(typeEffect, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      setCollapsed(true); // 内容结束输出后收起面板
    }
  }, [status]);

  return (
    <ChatThinking
      content={{
        title,
        text: displayText,
      }}
      status={status}
      maxHeight={100}
      collapsed={collapsed}
    />
  );
}
