import React, { useRef, useState } from 'react';
import { Button, Dialog, Form, Input, Radio, Space, Switch } from 'tdesign-react';

import type { DialogFocusable, InputRef } from 'tdesign-react';

const { FormItem } = Form;

const focusOptions = [
  {
    value: 'dialog',
    label: '对话框容器',
    description: '默认行为，打开后聚焦对话框容器，可直接按 Esc 关闭。',
  },
  {
    value: 'confirm-button',
    label: '确认按钮',
    description: '打开后聚焦确认按钮，按 Enter 可直接触发确认操作。',
  },
  {
    value: 'cancel-button',
    label: '取消按钮',
    description: '打开后聚焦取消按钮，按 Enter 可直接触发取消操作。',
  },
  {
    value: 'input',
    label: '输入框',
    description: '打开后聚焦输入框，可直接开始输入内容。',
  },
  {
    value: 'none',
    label: '不主动聚焦',
    description: '打开后不移动焦点，焦点仍停留在触发按钮上，直接按 Esc 无法关闭对话框。',
  },
] as const;

type DefaultFocus = (typeof focusOptions)[number]['value'];

const getFocusStyle = (focused: boolean): React.CSSProperties => ({
  outline: focused ? '2px solid var(--td-brand-color)' : '2px solid transparent',
  outlineOffset: 2,
});

export default function DialogFocusableExample() {
  const inputRef = useRef<InputRef>(null);

  const [visible, setVisible] = useState(false);
  const [defaultFocus, setDefaultFocus] = useState<DefaultFocus>('dialog');
  const [focusTrap, setFocusTrap] = useState(false);
  const [focusTriggerAfterClose, setFocusTriggerAfterClose] = useState(false);
  const [triggerFocused, setTriggerFocused] = useState(false);
  const [focusedTarget, setFocusedTarget] = useState<DefaultFocus | null>(null);

  const currentFocusOption = focusOptions.find((item) => item.value === defaultFocus) ?? focusOptions[0];

  const getDefaultFocus = (): DialogFocusable['defaultFocus'] => {
    if (defaultFocus === 'dialog') return undefined;
    if (defaultFocus === 'none') return null;
    if (defaultFocus === 'input') return () => inputRef.current?.inputElement ?? null;
    return defaultFocus;
  };

  return (
    <>
      <Form colon labelAlign="left" labelWidth={160}>
        <Space direction="vertical" size={24}>
          <FormItem label="打开后的焦点" name="defaultFocus" initialData="dialog">
            <Radio.Group
              size="small"
              variant="default-filled"
              value={defaultFocus}
              onChange={(value: DefaultFocus) => setDefaultFocus(value)}
            >
              {focusOptions.map((item) => (
                <Radio.Button key={item.value} value={item.value}>
                  {item.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </FormItem>
          <FormItem label="限制焦点在对话框内" name="focusTrap" initialData={false}>
            <Switch<boolean> value={focusTrap} onChange={setFocusTrap} />
          </FormItem>
          <FormItem label="关闭后聚焦触发元素" name="focusTriggerAfterClose" initialData={false}>
            <Switch<boolean> value={focusTriggerAfterClose} onChange={setFocusTriggerAfterClose} />
          </FormItem>

          <Button
            theme="primary"
            style={getFocusStyle(triggerFocused)}
            onFocus={() => setTriggerFocused(true)}
            onBlur={() => setTriggerFocused(false)}
            onClick={() => {
              setFocusedTarget(defaultFocus === 'none' ? null : defaultFocus);
              setVisible(true);
            }}
          >
            打开对话框
          </Button>
        </Space>
      </Form>

      <Dialog
        visible={visible}
        closeOnEscKeydown
        style={getFocusStyle(focusedTarget === 'dialog')}
        confirmBtn={{
          content: '确认',
          style: getFocusStyle(focusedTarget === 'confirm-button'),
          onFocus: () => setFocusedTarget('confirm-button'),
          onBlur: () => setFocusedTarget(null),
        }}
        cancelBtn={{
          content: '取消',
          style: getFocusStyle(focusedTarget === 'cancel-button'),
          onFocus: () => setFocusedTarget('cancel-button'),
          onBlur: () => setFocusedTarget(null),
        }}
        focusable={{
          defaultFocus: getDefaultFocus(),
          focusTrap,
          focusTriggerAfterClose,
        }}
        onConfirm={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        <strong style={{ display: 'block', marginBottom: 24 }}>{currentFocusOption.description}</strong>
        <Input ref={inputRef} onFocus={() => setFocusedTarget('input')} onBlur={() => setFocusedTarget(null)} />
      </Dialog>
    </>
  );
}
