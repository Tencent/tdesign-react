import React, { useState } from 'react';
import { Checkbox, Space } from 'tdesign-react';

export default function CheckboxButtonExample() {
  const [outlineValue, setOutlineValue] = useState<string[]>(['bj', 'gz']);
  const [filledDefaultValue, setFilledDefaultValue] = useState<string[]>(['bj', 'sh']);
  const [filledPrimaryValue, setFilledPrimaryValue] = useState<string[]>(['gz']);
  const [verticalValue, setVerticalValue] = useState<string[]>(['bj', 'sz']);

  return (
    <Space direction="vertical" size="large">
      {/* 场景 1：边框型多选按钮 */}
      <div>
        <h4 style={{ marginBottom: '8px' }}>边框型多选按钮</h4>
        <Checkbox.Group<string[]> theme="button" variant="outline" value={outlineValue} onChange={setOutlineValue}>
          <Checkbox.Button value="bj">北京</Checkbox.Button>
          <Checkbox.Button value="sh">上海</Checkbox.Button>
          <Checkbox.Button value="gz">广州</Checkbox.Button>
          <Checkbox.Button value="sz">深圳</Checkbox.Button>
        </Checkbox.Group>
        <div style={{ marginTop: '8px', color: '#86909C' }}>已选: {outlineValue.join('、') || '无'}</div>
      </div>

      {/* 场景 2：填充型 - 默认/白色高亮 */}
      <div>
        <h4 style={{ marginBottom: '8px' }}>填充型多选按钮 - 默认高亮（白色卡片）</h4>
        <Checkbox.Group<string[]>
          theme="button"
          variant="default-filled"
          value={filledDefaultValue}
          onChange={setFilledDefaultValue}
        >
          <Checkbox.Button value="bj">北京</Checkbox.Button>
          <Checkbox.Button value="sh">上海</Checkbox.Button>
          <Checkbox.Button value="gz">广州</Checkbox.Button>
          <Checkbox.Button value="sz">深圳</Checkbox.Button>
        </Checkbox.Group>
        <div style={{ marginTop: '8px', color: '#86909C' }}>已选: {filledDefaultValue.join('、') || '无'}</div>
      </div>

      {/* 场景 3：填充型 - 主题色高亮 */}
      <div>
        <h4 style={{ marginBottom: '8px' }}>填充型多选按钮 - 主题色高亮（蓝色）</h4>
        <Checkbox.Group<string[]>
          theme="button"
          variant="primary-filled"
          value={filledPrimaryValue}
          onChange={setFilledPrimaryValue}
        >
          <Checkbox.Button value="bj">北京</Checkbox.Button>
          <Checkbox.Button value="sh">上海</Checkbox.Button>
          <Checkbox.Button value="gz">广州</Checkbox.Button>
          <Checkbox.Button value="sz">深圳</Checkbox.Button>
        </Checkbox.Group>
        <div style={{ marginTop: '8px', color: '#86909C' }}>已选: {filledPrimaryValue.join('、') || '无'}</div>
      </div>

      {/* 场景 4：纵向排列 */}
      <div>
        <h4 style={{ marginBottom: '8px' }}>纵向排列（卡片式）</h4>
        <Checkbox.Group<string[]>
          theme="button"
          variant="primary-filled"
          direction="vertical"
          value={verticalValue}
          onChange={setVerticalValue}
        >
          <Checkbox.Button value="bj">北京</Checkbox.Button>
          <Checkbox.Button value="sh">上海</Checkbox.Button>
          <Checkbox.Button value="gz">广州</Checkbox.Button>
          <Checkbox.Button value="sz">深圳</Checkbox.Button>
        </Checkbox.Group>
        <div style={{ marginTop: '8px', color: '#86909C' }}>已选: {verticalValue.join('、') || '无'}</div>
      </div>

      {/* 附加：禁用状态展示 */}
      <div>
        <h4 style={{ marginBottom: '8px' }}>禁用状态</h4>
        <Space>
          <Checkbox.Group<string[]> theme="button" variant="outline" defaultValue={['bj']}>
            <Checkbox.Button value="bj" disabled>
              选中禁用
            </Checkbox.Button>
            <Checkbox.Button value="sh">上海</Checkbox.Button>
          </Checkbox.Group>
          <Checkbox.Group<string[]> theme="button" variant="default-filled" defaultValue={['gz']}>
            <Checkbox.Button value="gz" disabled>
              选中禁用
            </Checkbox.Button>
            <Checkbox.Button value="sz">深圳</Checkbox.Button>
          </Checkbox.Group>
          <Checkbox.Group<string[]> theme="button" variant="primary-filled" defaultValue={['sh']}>
            <Checkbox.Button value="sh" disabled>
              选中禁用
            </Checkbox.Button>
            <Checkbox.Button value="bj">北京</Checkbox.Button>
          </Checkbox.Group>
        </Space>
      </div>
    </Space>
  );
}
