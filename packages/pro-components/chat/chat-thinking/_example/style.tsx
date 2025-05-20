import React, { useState, useEffect, useRef } from 'react';
import { Radio, Space } from 'tdesign-react';
import { ChatThinking } from '@tdesign-react/aigc';

import type { TdChatThinkContentProps, MessageStatus } from '@tencent/tdesign-chatbot';

const fullText =
  '嗯，用户问牛顿第一定律是不是适用于所有参考系。首先，我得先回忆一下牛顿第一定律的内容。牛顿第一定律，也就是惯性定律，说物体在没有外力作用时会保持静止或匀速直线运动。也就是说，保持原来的运动状态。那问题来了，这个定律是否适用于所有参考系呢？记得以前学过的参考系分惯性系和非惯性系。惯性系里，牛顿定律成立；非惯性系里，可能需要引入惯性力之类的修正。所以牛顿第一定律应该只在惯性参考系中成立，而在非惯性系中不适用，比如加速的电梯或者旋转的参考系，这时候物体会有看似无外力下的加速度，所以必须引入假想的力来解释。';

export default function ThinkContentDemo() {
  const [displayText, setDisplayText] = useState('');
  const [status, setStatus] = useState<MessageStatus>('pending');
  const [title, setTitle] = useState('正在思考中...');
  const [layout, setLayout] = useState<TdChatThinkContentProps['layout']>('block');
  const [animation, setAnimation] = useState<TdChatThinkContentProps['animation']>('circle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const currentIndex = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    // 每次layout变化时重置状态
    resetTypingEffect();
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
  }, [layout, animation]);

  // 重置打字效果相关状态
  const resetTypingEffect = () => {
    setDisplayText('');
    setStatus('pending');
    setTitle('正在思考中...');
    currentIndex.current = 0;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <Space direction="vertical">
      <Space>
        <Space direction="vertical">
          <h5>layout：</h5>
          <Radio.Group value={layout} onChange={(val: TdChatThinkContentProps['layout']) => setLayout(val)}>
            <Radio value="border">border</Radio>
            <Radio value="block">block</Radio>
          </Radio.Group>
        </Space>
        <Space direction="vertical">
          <h5>animation：</h5>
          <Radio.Group value={animation} onChange={(val: TdChatThinkContentProps['animation']) => setAnimation(val)}>
            {/* <Radio value="skeleton">skeleton</Radio> */}
            <Radio value="moving">moving</Radio>
            <Radio value="gradient">gradient</Radio>
            <Radio value="circle">circle</Radio>
          </Radio.Group>
        </Space>
      </Space>
      <ChatThinking
        content={{
          title,
          text: displayText,
        }}
        status={status}
        layout={layout}
        animation={animation}
      />
    </Space>
  );
}
