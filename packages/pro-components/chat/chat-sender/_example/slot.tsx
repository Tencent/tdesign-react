import React, { useState } from 'react';
import { SystemSumIcon } from 'tdesign-icons-react';
import { Button, Dropdown, Select, Tag, Tooltip } from 'tdesign-react';
import { ChatSender } from '@tdesign-react/chat';

const options = [
  {
    content: '帮我写作',
    value: 1,
    placeholder: '输入你要撰写的主题',
  },
  {
    content: '图像生成',
    value: 2,
    placeholder: '说说你的创作灵感',
  },
  {
    content: '网页摘要',
    value: 3,
    placeholder: '输入你要解读的网页地址',
  },
];

const selectOptions = [
  {
    label: '默认模型',
    value: 'default',
  },
  {
    label: 'Deepseek',
    value: 'deepseek-r1',
  },
  {
    label: '混元',
    value: 'hunyuan',
  },
];

const SlotExample = () => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [scene, setScene] = useState(1);
  const [selectValue, setSelectValue] = useState('default');
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    console.log('onChange', e.detail);
    setInputValue(e.detail);
  };

  // 模拟消息发送
  const handleSend = () => {
    if (loading) return;
    if (!inputValue) return;
    setInputValue('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  const switchScene = (data) => {
    setScene(data.value);
  };

  const checkClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <ChatSender
      value={inputValue}
      placeholder={options.filter((item) => item.value === scene)[0].placeholder}
      loading={loading}
      onChange={handleChange}
      onSend={handleSend}
      // 自定义输入框左侧区域，可用来触发工具场景切换
      inputPrefix={
        <Dropdown options={options} trigger="click" style={{ padding: 0 }} onClick={switchScene}>
          <Tag shape="round" variant="light" color="#0052D9" style={{ marginRight: 4, cursor: 'pointer' }}>
            {options.filter((item) => item.value === scene)[0].content}
          </Tag>
        </Dropdown>
      }
      // 自定义输入框底部区域，可以增加模型选项
      footerPrefix={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip content="切换模型">
            <Select
              value={selectValue}
              options={selectOptions}
              style={{
                width: 112,
                height: 'var(--td-comp-size-m)',
                marginRight: 8,
              }}
              onChange={(value) => setSelectValue(String(value))}
            />
          </Tooltip>
          <Button
            variant="outline"
            style={{
              width: 112,
              height: 'var(--td-comp-size-m)',
              borderRadius: 32,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(isChecked
                ? {
                    borderColor: 'var(--td-brand-color-focus)',
                    background: 'var(--td-brand-color-light)',
                    color: 'var(--td-text-color-brand)',
                  }
                : {}),
            }}
            onClick={checkClick}
          >
            <SystemSumIcon />
            <span style={{ marginLeft: 4 }}>深度思考</span>
          </Button>
        </div>
      }
    />
  );
};

export default SlotExample;
