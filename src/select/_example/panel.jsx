import React, { useState } from 'react';
import { Select, Divider, Button, Input, Space } from 'tdesign-react';

const OPTIONS = [
  { label: '架构云', value: '1' },
  { label: '大数据', value: '2' },
  { label: '区块链', value: '3' },
  { label: '物联网', value: '4', disabled: true },
  { label: '人工智能', value: '5' },
];

export default function PanelExample() {
  const [topOptions, setTopOptions] = useState(OPTIONS);
  const [bottomOptions, setBottomOptions] = useState(OPTIONS);
  const [editOrCreate, toggleEditOrCreate] = useState('edit');

  const [inputVal, changeInputVal] = useState('');

  const handleOnSearch = (v) => {
    const filteredValue = OPTIONS.filter((item) => item.label.indexOf(v) !== -1);
    setTopOptions(filteredValue);
  };

  const handleClickConfirm = () => {
    const id = Math.round(Math.random() * 100);
    const newBottomOptions = bottomOptions.concat({ label: inputVal, value: id });
    setBottomOptions(newBottomOptions);
    changeInputVal('');
    toggleEditOrCreate('edit');
  };
  return (
    <Space>
      <Select
        clearable
        placeholder="请选择云解决方案"
        style={{ width: '300px', marginRight: '20px' }}
        options={topOptions}
        panelTopContent={
          <div
            style={{
              position: 'sticky',
              backgroundColor: 'var(--td-bg-color-container)',
              top: 0,
              zIndex: 10,
              paddingTop: 8,
            }}
          >
            <Input
              placeholder="请输入关键词搜索"
              onChange={handleOnSearch}
              style={{ width: 'calc(100% - 4px)', margin: '0 auto' }}
            />
            <Divider style={{ margin: '8px 0 0' }} />
          </div>
        }
      />
      <Select
        placeholder="请选择云产品"
        style={{ width: '300px' }}
        options={bottomOptions}
        clearable
        panelBottomContent={
          <div className="select-panel-footer">
            {editOrCreate === 'edit' ? (
              <div
                style={{
                  padding: '8px 6px',
                  borderTop: '1px solid var(--td-border-level-2-color)',
                }}
              >
                <Button theme="primary" size="small" variant="text" onClick={() => toggleEditOrCreate('create')}>
                  新增选项
                </Button>
              </div>
            ) : (
              <div style={{ padding: 8, borderTop: '1px solid var(--td-border-level-2-color)' }}>
                <Input size="small" autofocus value={inputVal} onChange={(v) => changeInputVal(v)}></Input>
                <Button size="small" style={{ marginTop: '12px' }} onClick={handleClickConfirm}>
                  确认
                </Button>
                <Button
                  theme="default"
                  size="small"
                  style={{ marginTop: '12px', marginLeft: '8px' }}
                  onClick={() => toggleEditOrCreate('edit')}
                >
                  取消
                </Button>
              </div>
            )}
          </div>
        }
      />
    </Space>
  );
}
