import './setup';

import React, { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { ChatSender } from '../chat-sender';
import { get, mountedRef, queryAll, text } from './helpers';

import type { TdChatSenderApi } from '../chat-sender';

describe('ChatSender public props', () => {
  it('renders placeholder without supplying a value', async () => {
    const { container } = render(<ChatSender placeholder="自定义提示" />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveAttribute('placeholder', '自定义提示'));
  });

  it('initializes an editable defaultValue', async () => {
    const { container } = render(<ChatSender defaultValue="初始问题" />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('初始问题'));
    fireEvent.input(get(container, 'textarea'), { target: { value: '编辑后' } });
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('编辑后'));
  });

  it('lets value override defaultValue and accepts controlled updates', async () => {
    const view = render(<ChatSender value="受控内容" defaultValue="默认内容" />);
    await waitFor(() => expect(get(view.container, 'textarea')).toHaveValue('受控内容'));
    view.rerender(<ChatSender value="父级更新" defaultValue="默认内容" />);
    await waitFor(() => expect(get(view.container, 'textarea')).toHaveValue('父级更新'));
  });

  it('composes value and onChange in a controlled consumer', async () => {
    const Consumer = () => {
      const [value, setValue] = useState('');
      return <ChatSender value={value} onChange={(event) => setValue(event.detail.toUpperCase())} />;
    };
    const { container } = render(<Consumer />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue(''));
    fireEvent.input(get(container, 'textarea'), { target: { value: 'react' } });
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('REACT'));
  });

  it('disables input and sending even when a value is present', async () => {
    const send = vi.fn();
    const { container } = render(<ChatSender disabled value="已有内容" onSend={send} />);
    await waitFor(() => expect(get(container, 'textarea')).toBeDisabled());
    expect(get(container, 'button')).toBeDisabled();
    fireEvent.click(get(container, 'button'));
    fireEvent.keyDown(get(container, 'textarea'), { key: 'Enter' });
    expect(send).not.toHaveBeenCalled();
  });

  it('uses loading + value to stop instead of sending', async () => {
    const stop = vi.fn();
    const send = vi.fn();
    const { container } = render(<ChatSender loading value="生成中" onStop={stop} onSend={send} />);
    await waitFor(() => expect(get(container, 'button')).not.toBeDisabled());
    fireEvent.click(get(container, 'button'));
    await waitFor(() => expect(stop).toHaveBeenCalledOnce());
    expect(stop.mock.calls[0][0].detail).toBe('生成中');
    expect(send).not.toHaveBeenCalled();
  });

  it('renders placeholder and sends the entered value in event.detail', async () => {
    const change = vi.fn();
    const send = vi.fn();
    const { container } = render(<ChatSender placeholder="请输入问题" onChange={change} onSend={send} />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveAttribute('placeholder', '请输入问题'));
    expect(get(container, 'button')).toBeDisabled();
    fireEvent.input(get(container, 'textarea'), { target: { value: '新问题' } });
    await waitFor(() => expect(change).toHaveBeenCalledOnce());
    expect(change.mock.calls[0][0].detail).toBe('新问题');
    await waitFor(() => expect(get(container, 'button')).not.toBeDisabled());
    fireEvent.click(get(container, 'button'));
    await waitFor(() => expect(send).toHaveBeenCalledOnce());
    expect(send.mock.calls[0][0].detail).toEqual({ value: '新问题', attachments: [] });
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue(''));
  });

  it('sends with Enter but keeps Shift+Enter and IME composition for editing', async () => {
    const send = vi.fn();
    const { container } = render(<ChatSender defaultValue="键盘输入" onSend={send} />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('键盘输入'));
    const input = get(container, 'textarea');
    fireEvent.keyDown(input, { key: 'Shift' });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    fireEvent.keyUp(input, { key: 'Shift' });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    expect(send).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    await waitFor(() => expect(send).toHaveBeenCalledOnce());
    expect(send.mock.calls[0][0].detail).toEqual({ value: '键盘输入', attachments: [] });
  });

  it('disables sending with sendBtnDisabled=true', async () => {
    const { container } = render(<ChatSender value="内容" sendBtnDisabled />);
    await waitFor(() => expect(get(container, 'button')).toBeDisabled());
  });

  it('forwards textareaProps without replacing the sender value', async () => {
    const { container } = render(<ChatSender value="只读内容" textareaProps={{ readonly: true, maxlength: 20 }} />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('只读内容'));
    expect(get(container, 'textarea')).toHaveAttribute('readonly');
    expect(get(container, 'textarea')).toHaveAttribute('maxlength', '20');
  });

  it('supports actions=false while preserving the input', async () => {
    const { container } = render(<ChatSender actions={false} defaultValue="继续编辑" />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('继续编辑'));
    expect(queryAll(container, 'button')).toHaveLength(0);
  });

  it('forwards attachment items to send and reports the remaining files on removal', async () => {
    const first = { name: '说明.pdf', url: '/guide.pdf' };
    const second = { name: '备注.txt', url: '/note.txt' };
    const send = vi.fn();
    const remove = vi.fn();
    const { container } = render(
      <ChatSender
        value="带附件的问题"
        attachmentsProps={{ items: [first, second], removable: true }}
        onSend={send}
        onFileRemove={remove}
      />,
    );
    await waitFor(() => expect(text(container)).toContain('说明.pdf'));
    fireEvent.click(get(container, 'button'));
    await waitFor(() => expect(send).toHaveBeenCalledOnce());
    expect(send.mock.calls[0][0].detail).toEqual({ value: '带附件的问题', attachments: [first, second] });
    const removeButtons = queryAll(container, '.t-filecard-remove');
    expect(removeButtons).toHaveLength(2);
    fireEvent.click(removeButtons[0]);
    await waitFor(() => expect(remove).toHaveBeenCalledOnce());
    expect(remove.mock.calls[0][0].detail).toEqual([second]);
  });

  it('combines upload action configuration, file selection and its public event', async () => {
    const select = vi.fn();
    const { container } = render(
      <ChatSender
        actions={[{ name: 'uploadAttachment', uploadProps: { accept: '.txt', multiple: true } }, 'send']}
        onFileSelect={select}
      />,
    );
    await waitFor(() => expect(get(container, 'input[accept=".txt"]')).toHaveAttribute('multiple'));
    const file = new File(['内容'], '说明.txt', { type: 'text/plain' });
    fireEvent.change(get(container, 'input[accept=".txt"]'), { target: { files: [file] } });
    await waitFor(() => expect(select).toHaveBeenCalledOnce());
    expect(select.mock.calls[0][0].detail).toEqual([file]);
  });

  it('exposes focus with the current value in its public event', async () => {
    const ref = createRef<HTMLElement & TdChatSenderApi>();
    const focus = vi.fn();
    const { container } = render(<ChatSender ref={ref} value="当前值" onFocus={focus} />);
    await waitFor(() => expect(get(container, 'textarea')).toHaveValue('当前值'));
    act(() => mountedRef(ref).focus());
    await waitFor(() => expect(focus).toHaveBeenCalledWith(expect.objectContaining({ detail: '当前值' })));
    const input = get(container, 'textarea');
    expect((input.getRootNode() as Document | ShadowRoot).activeElement).toBe(input);
  });

  it('replaces event callbacks on rerender without duplicate notifications', async () => {
    const oldChange = vi.fn();
    const newChange = vi.fn();
    const view = render(<ChatSender onChange={oldChange} />);
    await waitFor(() => expect(get(view.container, 'textarea')).toBeEnabled());
    view.rerender(<ChatSender onChange={newChange} />);
    fireEvent.input(get(view.container, 'textarea'), { target: { value: '更新监听器' } });
    await waitFor(() => expect(newChange).toHaveBeenCalledOnce());
    expect(newChange.mock.calls[0][0].detail).toBe('更新监听器');
    expect(oldChange).not.toHaveBeenCalled();
  });
});
