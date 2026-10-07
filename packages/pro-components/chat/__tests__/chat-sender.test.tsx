import './setup';

import React, { createRef } from 'react';
import { ConfigProvider } from 'tdesign-react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { createChatRequestParams } from '../_util/attachment';
import { ChatSender } from '../chat-sender';
import { mountedRef } from './helpers';

import type { TdChatSenderApi } from '../_util/native-types';

describe('chat-sender public contracts', () => {
  it('keeps CustomEvent detail and clears an uncontrolled sender after send', () => {
    const onSend = vi.fn();
    const onChange = vi.fn();
    render(<ChatSender defaultValue="初始" onSend={onSend} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '提交' },
    });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    expect(onChange.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
    expect(onChange.mock.calls[0][0].detail).toBe('提交');
    expect(onSend.mock.calls[0][0].detail).toEqual({
      value: '提交',
      attachments: [],
    });
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
  it('keeps controlled sender value owned by its parent and uses the latest value', () => {
    const onSend = vi.fn();
    const view = render(<ChatSender value="甲" onSend={onSend} />);
    view.rerender(<ChatSender value="乙" onSend={onSend} />);
    fireEvent.click(screen.getByRole('button', { name: '发送' }));
    expect(onSend.mock.calls[0][0].detail.value).toBe('乙');
    expect(screen.getByRole('textbox')).toHaveValue('乙');
  });
  it('does not send on Shift+Enter, IME or loading, and stops through the explicit button', () => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    const view = render(<ChatSender defaultValue="消息" onSend={onSend} onStop={onStop} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    fireEvent.compositionEnd(input);
    expect(onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSend).toHaveBeenCalledTimes(1);
    view.rerender(<ChatSender value="停止前" loading onSend={onSend} onStop={onStop} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSend).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: '停止' }));
    expect(onStop.mock.calls[0][0].detail).toBe('停止前');
  });
  it('guards disabled and sendBtnDisabled paths including keyboard', () => {
    const onSend = vi.fn();
    const view = render(<ChatSender value="x" disabled actions={['uploadAttachment', 'send']} onSend={onSend} />);
    expect(screen.getByRole('button', { name: '上传附件' })).toBeDisabled();
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
    view.rerender(<ChatSender value="x" sendBtnDisabled={() => true} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
  });
  it('exposes real DOM refs plus sender focus/blur/file API and same-file reselection', () => {
    const ref = createRef<HTMLElement & TdChatSenderApi>();
    const selected = vi.fn();
    const { container } = render(
      <ChatSender
        ref={ref}
        actions={['uploadAttachment', { name: 'uploadImage', uploadProps: { accept: '.png', multiple: true } }, 'send']}
        onFileSelect={selected}
      />,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    act(() => mountedRef(ref).focus());
    expect(screen.getByRole('textbox')).toHaveFocus();
    act(() => mountedRef(ref).blur());
    expect(screen.getByRole('textbox')).not.toHaveFocus();
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    if (!input) throw new Error('Expected the public file selector');
    const imageInput = container.querySelector<HTMLInputElement>('input[accept=".png"]');
    expect(imageInput).toHaveAttribute('multiple');
    const click = vi.spyOn(input, 'click');
    act(() => mountedRef(ref).selectFile());
    expect(click).toHaveBeenCalledOnce();
    const file = new File(['x'], 'a.txt');
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.change(input, { target: { files: [file] } });
    expect(selected).toHaveBeenCalledTimes(2);
    expect(selected.mock.calls[0][0].detail[0]).toBe(file);
  });
  it('reports remaining attachments without mutating controlled items', () => {
    const item = { name: 'file.txt', key: 'f' };
    const remove = vi.fn();
    const items = [item];
    render(<ChatSender attachmentsProps={{ items }} onFileRemove={remove} />);
    fireEvent.click(screen.getByRole('button', { name: '移除 file.txt' }));
    expect(remove.mock.calls[0][0].detail).toEqual([]);
    expect(items).toEqual([item]);
  });
  it('preserves configured class prefix and React context across named children', () => {
    const Context = React.createContext('lost');
    const Child = () => <span>{React.useContext(Context)}</span>;
    const { container } = render(
      <ConfigProvider globalConfig={{ classPrefix: 'custom' }}>
        <Context.Provider value="上下文">
          <ChatSender>
            <div slot="header">
              <Child />
            </div>
          </ChatSender>
        </Context.Provider>
      </ConfigProvider>,
    );
    expect(screen.getByText('上下文')).toBeVisible();
    expect(container.querySelector('.custom-chat-sender')).not.toBeNull();
  });
  it('copies attachment protocol data without freezing caller-owned files or metadata', () => {
    const file = new File(['x'], 'a.pdf');
    const metadata = { nested: { name: 'original' } };
    const request = createChatRequestParams({
      prompt: '文件',
      attachments: [{ name: 'a.pdf', raw: file, response: { upload: true }, metadata }],
    });
    expect(request.attachments?.[0]).not.toHaveProperty('raw');
    expect(request.attachments?.[0]).not.toHaveProperty('response');
    expect(request.attachments?.[0].fileType).toBe('pdf');
    metadata.nested.name = 'changed';
    expect(request.attachments?.[0].metadata).toEqual({
      nested: { name: 'original' },
    });
    expect(Object.isFrozen(file)).toBe(false);
  });
});
