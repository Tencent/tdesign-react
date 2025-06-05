import React, { useCallback, useEffect, useRef, useState } from 'react';
import noop from 'lodash-es/noop';
import { ChatSender } from '@tdesign-react/aigc';
import { AIChatEditor, createAIChatEditor } from '@tencent/exeditor3-ai-chat-editor';
import { BasicTheme } from '@tencent/exeditor3-theme-basic';

const classStyles = `
<style>
.richText {
  width: 100%;
  max-height: var(--td-chat-input-textarea-max-height);
  overflow-y: auto;
}
.richText .ExEditor-basic {
  --exeditor-selected-outline: none;

  width: 100%;
  padding: 0;
  background: transparent;
  font-size: var(--td-chat-input-font-size);
}
.richText .ExEditor-basic p {
  margin-top: 4px;
  margin-bottom: 4px
}
</style>
`;

const ChatSenderExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<boolean>(false);
  const editorRootRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<AIChatEditor>();

  // 添加示例代码所需样式
  useEffect(() => {
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const clearInputValue = () => {
    setInputValue('');
    editorRef.current?.setHTML('');
  };

  const updateLoading = (v: boolean) => {
    loadingRef.current = v;
    setLoading(v);
  };

  const handleChange = () => {
    const doc = editorRef.current?.getState().doc;
    let text = '';
    doc?.descendants((node, _pos, parent) => {
      if (node.isText) {
        text += node.text;
      } else if (node.isBlock && parent) {
        // 块级元素后添加换行
        text += '\n';
      }
    });
    text = text.trim();
    console.log('onChange', text);
    setInputValue(text || '');
  };

  // 发送处理
  const handleSend = useCallback(() => {
    console.log('提交', editorRef.current?.getHTML());
    clearInputValue();
    updateLoading(true);
  }, []);

  // 停止处理
  const handleStop = useCallback(() => {
    console.log('停止');
    updateLoading(false);
  }, []);

  const handleEnter = useCallback(() => {
    loadingRef.current ? handleStop() : handleSend();
  }, [handleSend, handleStop]);

  useEffect(() => {
    if (editorRootRef.current) {
      const editor = createAIChatEditor({
        root: editorRootRef.current,
        initialContent: `
            <p>（这个示例展示了一个 AI 对话场景的 ExEditor 输入框，基于 https://git.woa.com/RMFactory/community-plugins/ai-chat-editor ）</p>
            <p>我是一名<span data-ai-input-type="slot" data-placeholder="身份">创作号博主</span>，请帮我以<span data-ai-input-type="slot" data-placeholder="主题"></span>为主题，写一篇视频脚本
            <p>请你仔细思考，高质量地完成该任务</p>
            `.trim(),
        theme: new BasicTheme(),
        plugins: [],
        placeholder: '请输入内容',
        enter: {
          onEnter: handleEnter,
          modKey: 'shift',
        },
        select: {
          renderOptions: noop,
        },
      });
      editor.on('idlechange', handleChange);

      editorRef.current = editor;
    }
  }, [handleEnter]);

  return (
    <ChatSender value={inputValue} loading={loading} onSend={handleSend} onStop={handleStop}>
      <div slot="textarea" ref={editorRootRef} className="richText"></div>
    </ChatSender>
  );
};

export default ChatSenderExample;
