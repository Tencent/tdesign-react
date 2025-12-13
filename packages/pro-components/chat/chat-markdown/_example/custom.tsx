/* eslint-disable no-useless-escape */
import React, { useEffect } from 'react';
import { ChatMarkdown, MarkdownEngine } from '@tdesign-react/chat';

const classStyles = `
<style>
  .markdown::part(md-color-text) {
    color: red;
  }
</style>
`;

/**
 * markdown自定义插件，请参考cherry-markdown定义插件的方法，事件触发需考虑shadowDOM隔离情况
 * https://github.com/Tencent/cherry-markdown/wiki/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%AD%E6%B3%95
 */
const colorText = MarkdownEngine.createSyntaxHook('important', MarkdownEngine.constants.HOOKS_TYPE_LIST.SEN, {
  makeHtml(str) {
    return str.replace(
      this.RULE.reg,
      (_whole, _m1, m2) =>
        `<span part="md-color-text" onclick="this.dispatchEvent(new CustomEvent('color-text-click', { bubbles: true, composed: true, detail: { content: '${m2}' }}))">${m2}</span>`,
    );
  },
  rule() {
    // 匹配 !!...!! 语法
    return { reg: /(\!\!)([^\!]+)\1/g };
  },
});

const clickTextHandler = (e) => {
  console.log('点击:', e.detail.content);
};

const MarkdownExample = () => {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  useEffect(() => {
    document.addEventListener('color-text-click', clickTextHandler);

    return () => {
      document.removeEventListener('color-text-click', clickTextHandler);
    };
  }, []);

  return (
    <ChatMarkdown
      className="markdown"
      content="我是普通内容 !!我是自定义markdown结构!!"
      options={{
        engine: {
          global: {
            htmlAttrWhiteList: 'part|onclick',
          },
          customSyntax: {
            colorTextHook: {
              syntaxClass: colorText,
              force: false,
            },
          },
        },
      }}
    />
  );
};

export default MarkdownExample;
