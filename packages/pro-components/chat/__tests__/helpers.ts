/**
 * chat 迁移回归守卫的测试工具层
 *
 * 设计目标：让同一份断言在「webc 实现」与「纯 React 实现」下都成立，
 * 从而避免测试与当前实现细节（shadow DOM、事件形态）强绑定。
 *
 * 三条约定：
 * 1. 查询一律走 deepQuery*：webc 把内容放在 shadowRoot，纯 React 放在 light DOM，
 *    穿透式查询对两者等价。
 * 2. 渲染一律走 renderChat：webc 首帧是异步的，纯 React 是同步的，
 *    统一等待一拍对后者无害。
 * 3. 事件取值一律走 eventDetail：webc 派发 CustomEvent（数据在 detail），
 *    纯 React 可能直接传值，解包后断言的是「数据」而非「传输形态」。
 */

import { render } from '@test/utils';

import type { ReactElement } from 'react';
import type { RenderResult } from '@testing-library/react';

/** 递归遍历 light DOM 与 shadow DOM */
const walk = (node: any, visit: (el: Element) => void) => {
  if (!node) return;
  if (node.nodeType === 1) {
    visit(node as Element);
    if (node.shadowRoot) walk(node.shadowRoot, visit);
  }
  Array.from(node.childNodes ?? []).forEach((child) => walk(child, visit));
};

/** 穿透 shadow DOM 查询首个匹配元素 */
export const deepQuery = (root: Element | null | undefined, selector: string): Element | null => {
  let found: Element | null = null;
  walk(root, (el) => {
    if (!found && el.matches?.(selector)) found = el;
  });
  return found;
};

/** 穿透 shadow DOM 查询全部匹配元素 */
export const deepQueryAll = (root: Element | null | undefined, selector: string): Element[] => {
  const found: Element[] = [];
  walk(root, (el) => {
    if (el.matches?.(selector)) found.push(el);
  });
  return found;
};

/** 穿透 shadow DOM 读取全部可见文本 */
export const deepText = (root: Element | null | undefined): string => {
  const parts: string[] = [];
  walk(root, (el) => {
    const tag = el.tagName?.toLowerCase();
    if (tag === 'style' || tag === 'script') return;
    Array.from(el.childNodes ?? []).forEach((child) => {
      if (child.nodeType === 3) parts.push(child.textContent ?? '');
    });
  });
  return parts.join('');
};

/** 判断某个类名是否存在于（含 shadow DOM 的）渲染结果中 */
export const hasClassDeep = (root: Element | null | undefined, className: string): boolean => {
  let hit = false;
  walk(root, (el) => {
    if (!hit && el.classList?.contains(className)) hit = true;
  });
  return hit;
};

/** webc 首帧异步渲染的等待时间 */
const RENDER_FLUSH_MS = 300;

/** 等待异步渲染完成（对同步渲染的实现是空转，无害） */
export const flushRender = (ms = RENDER_FLUSH_MS) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * 渲染 chat 组件并等待首帧稳定。
 * 返回 testing-library 的 RenderResult，可继续使用 getByRole 等 API。
 */
export const renderChat = async (ui: ReactElement, ms = RENDER_FLUSH_MS): Promise<RenderResult> => {
  const result = render(ui);
  await flushRender(ms);
  return result;
};

/**
 * 解包事件回调参数。
 * webc 派发 CustomEvent，数据挂在 detail；纯 React 可能直接传值。
 * 断言数据本身，而不是事件的传输形态。
 */
export const eventDetail = (arg: any) =>
  arg && typeof arg === 'object' && 'detail' in arg ? (arg as any).detail : arg;

/** 取回调第 index 次调用的第一个参数（已解包） */
export const callArg = (fn: { mock: { calls: any[][] } }, index = 0, argIndex = 0) =>
  eventDetail(fn.mock.calls[index]?.[argIndex]);
