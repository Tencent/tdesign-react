/* eslint-disable no-script-url */
/**
 * json-render sanitizeProps 单元测试
 *
 * 覆盖 Vue 版 `fix(chat): harden json-render prop sanitization` 修复对齐后
 * 的三大攻击面：
 *   1. 大小写变体绕过（INNERHTML / HREF / ONCLICK 等）
 *   2. 原型污染字段（__proto__ / prototype / constructor）
 *   3. 字符串型 onXxx 处理器
 *
 * 同时覆盖 JsonRenderButton / withA2UIBinding 对非函数 handler 的防御。
 */

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';

import { JsonRenderButton } from '../catalog/atomic/button';
import { DataProvider } from '../contexts/data';
import { withA2UIBinding } from '../registry/a2ui-binding';
import { sanitizeProps } from '../utils/sanitize-props';

import type { ComponentRenderProps } from '../types';

/* ------------------------------------------------------------------ */
/* sanitizeProps                                                       */
/* ------------------------------------------------------------------ */
describe('sanitizeProps', () => {
  it('blocks dangerous prop and URL keys regardless of casing', () => {
    const result = sanitizeProps({
      srcDoc: '<script>alert(1)</script>',
      INNERHTML: '<img src=x onerror=alert(1)>',
      HREF: 'javascript:alert(1)',
      title: 'safe',
    });

    expect(result).toEqual({ title: 'safe' });
  });

  it('blocks prototype-related keys without changing the result prototype', () => {
    const props = JSON.parse(
      '{"__proto__":{"polluted":true},"prototype":{"polluted":true},"constructor":{"polluted":true},"title":"safe"}',
    );
    const result = sanitizeProps(props);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect((result as Record<string, unknown>).polluted).toBeUndefined();
    expect(result).toEqual({ title: 'safe' });
  });

  it('drops non-function event props and preserves function handlers regardless of casing', () => {
    const onInput = vi.fn();
    const result = sanitizeProps({
      onClick: 'submit',
      ONCHANGE: 'change',
      OnInput: onInput,
    });

    expect(result).toEqual({ OnInput: onInput });
  });

  it('drops URL props using dangerous protocols with mixed casing', () => {
    const result = sanitizeProps({
      HREF: 'JavaScript:alert(1)',
      Src: 'data:text/html,<script>alert(1)</script>',
      formAction: 'vbscript:msgbox(1)',
      poster: 'https://safe.example.com/a.png',
    });

    expect(result).toEqual({ poster: 'https://safe.example.com/a.png' });
  });
});

/* ------------------------------------------------------------------ */
/* JsonRenderButton onClick 类型防御                                     */
/* ------------------------------------------------------------------ */
describe('json-render Button handler safety', () => {
  const renderButton = (props: Record<string, unknown>) =>
    render(
      <DataProvider>
        <JsonRenderButton element={{ id: 'btn', type: 'Button', props } as any} onAction={vi.fn()} />
      </DataProvider>,
    );

  it('does not throw when onClick is a non-function string', () => {
    const { getByRole } = renderButton({ label: 'Submit', onClick: 'submit' });
    // 触发 click，不应抛错（typeof === 'function' 二次校验）
    expect(() => fireEvent.click(getByRole('button'))).not.toThrow();
  });

  it('invokes a valid function onClick', () => {
    const onClick = vi.fn();
    const { getByRole } = renderButton({ label: 'Submit', onClick });
    fireEvent.click(getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/* withA2UIBinding：非函数触发事件的 handler 类型防御                     */
/* ------------------------------------------------------------------ */
describe('withA2UIBinding handler safety', () => {
  it('does not invoke a non-function custom action trigger', () => {
    // 定义一个内部通过 props.trigger 触发的原始组件
    const Wrapped: React.FC<{ trigger?: unknown }> = ({ trigger }) => (
      <button
        type="button"
        onClick={() => {
          // 如果 trigger 不是函数，withA2UIBinding 内部应已丢弃，此处直接调用应该不会抛错
          if (typeof trigger === 'function') (trigger as () => void)();
        }}
      >
        Trigger
      </button>
    );

    const Bound = withA2UIBinding<{ trigger?: unknown }>(Wrapped as any, {
      supportsAction: true,
      actionTrigger: 'trigger',
    });

    const onAction = vi.fn();
    const { getByRole } = render(
      <DataProvider>
        <Bound
          {...({
            element: {
              id: 'x',
              type: 'Custom',
              props: {
                trigger: 'not-a-function',
                action: { action: 'submit' },
              },
            },
            onAction,
          } as unknown as ComponentRenderProps)}
        />
      </DataProvider>,
    );

    expect(() => fireEvent.click(getByRole('button'))).not.toThrow();
    // action 仍然应触发（因为 supportsAction=true）
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction.mock.calls[0][0]).toMatchObject({ action: 'submit' });
  });
});
