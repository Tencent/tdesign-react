import React, { useState, useEffect, useRef } from 'react';
import { Space } from 'tdesign-react';
import { ChatMarkdown, findTargetElement } from '@tdesign-react/chat';

const doc = `
# This is TDesign

## This is TDesign

### This is TDesign

#### This is TDesign

The point of reference-style links is not that they’re easier to write. The point is that with reference-style links, your document source is vastly more readable. Compare the above examples: using reference-style links, the paragraph itself is only 81 characters long; with inline-style links, it’s 176 characters; and as raw \`HTML\`, it’s 234 characters. In the raw \`HTML\`, there’s more markup than there is text.

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet.

an example | *an example* | **an example**

1. Bird
1. McHale
1. Parish
    1. Bird
    1. McHale
        1. Parish

- Red
- Green
- Blue
    - Red
    - Green
        - Blue

This is [an example](http://example.com/ "Title") inline link.

<http://example.com/>
# TDesign（腾讯设计体系）核心特性与技术架构

以下是关于 TDesign（腾讯设计体系）的核心特性与技术架构的表格化总结：

| 分类 | 核心内容 | 关键技术/特性 |
|------|----------|---------------|
| **设计理念** | • 设计价值观：用户为本、科技向善、突破创新... | • 设计原子单元 |
| **核心组件库** | • 基础组件：Button/Input/Table/Modal... | • 组件覆盖率  |
| **技术特性** | • 多框架支持：Vue/React/Angular... | • 按需加载 |
\`\`\`bash
$ npm i tdesign-vue-next
\`\`\`

---

\`\`\`javascript
import { createApp } from 'vue';
import App from './app.vue';

const app = createApp(App);
app.use(TDesignChat);
\`\`\`
\`\`\`mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;

\`\`\`
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

  return (
    <Space direction="vertical">
      <ChatMarkdown content={displayText} />
    </Space>
  );
}
