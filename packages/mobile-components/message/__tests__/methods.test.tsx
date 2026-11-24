import React from 'react';
import { beforeEach, afterAll, describe, expect, it, vi } from 'vitest';
import methods from '../methods';
import * as reactRender from '../../_util/react-render';

describe('message methods', () => {
  const originalError = console.error;

  beforeEach(() => {
    vi.restoreAllMocks();
    console.error = vi.fn();
    document.body.innerHTML = '';
  });

  it('calls render with Message element and appends to body for info', () => {
    const renderSpy = vi.spyOn(reactRender, 'render').mockImplementation(() => {});

    methods.info({ content: 'hello' } as any);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    // container created and appended
    const container = (renderSpy.mock.calls[0] as any)[1] as Element;
    expect(document.body.contains(container)).toBe(true);

    const element = (renderSpy.mock.calls[0] as any)[0] as React.ReactElement;
    expect((element.props as any).theme).toBe('info');
    expect((element.props as any).visible).toBe(true);
    expect((element.props as any).container).toBe(container);
  });

  it('supports theme: success/warning/error', () => {
    const renderSpy = vi.spyOn(reactRender, 'render').mockImplementation(() => {});
    methods.success({ content: 'ok' } as any);
    methods.warning({ content: 'warn' } as any);
    methods.error({ content: 'err' } as any);

    expect(renderSpy).toHaveBeenCalledTimes(3);
    const themes = renderSpy.mock.calls.map((c) => (c[0] as any).props.theme);
    expect(themes).toEqual(['success', 'warning', 'error']);
  });

  it('closeAll removes all appended instances', () => {
    const renderSpy = vi.spyOn(reactRender, 'render').mockImplementation(() => {});
    methods.info({ content: 'a' } as any);
    methods.success({ content: 'b' } as any);

    // two containers appended
    const containers = renderSpy.mock.calls.map((c) => c[1] as Element);
    containers.forEach((el) => expect(document.body.contains(el)).toBe(true));

    methods.closeAll();
    containers.forEach((el) => expect(document.body.contains(el)).toBe(false));
  });

  it('logs error when no valid context', () => {
    const renderSpy = vi.spyOn(reactRender, 'render').mockImplementation(() => {});
    methods.info({ content: 'x', context: null } as any);
    expect(renderSpy).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  afterAll(() => {
    console.error = originalError;
  });
});
