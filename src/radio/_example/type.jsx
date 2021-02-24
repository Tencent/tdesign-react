import React from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioControlledExample() {
  return (
    <>
      <div>
        <h5>普通单选按钮</h5>
        <Radio.Group size="large" defaultValue="gz">
          <Radio name="bj">选项一</Radio>
          <Radio name="sh">选项二</Radio>
          <Radio name="gz">选项三</Radio>
          <Radio name="sz">选项四</Radio>
        </Radio.Group>
      </div>
      <div style={{ margin: '16px 0' }}>
        <h5>边框型单选按钮</h5>
        <Radio.Group size="large" defaultValue="1">
          <Radio.Button name="1">选项一</Radio.Button>
          <Radio.Button name="2">选项二</Radio.Button>
          <Radio.Button name="3">选项三</Radio.Button>
        </Radio.Group>
        <Radio.Group size="large" defaultValue="1">
          <Radio.Button name="1" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button name="2" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <h5>填充型单选按钮</h5>
        <Radio.Group size="large" buttonStyle="solid" defaultValue="gz">
          <Radio.Button name="bj">选项一</Radio.Button>
          <Radio.Button name="gz">选项二</Radio.Button>
          <Radio.Button name="sz">选项三</Radio.Button>
        </Radio.Group>
        <Radio.Group size="large" buttonStyle="solid" defaultValue="bj">
          <Radio.Button name="bj" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button name="gz" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>
      </div>
    </>
  );
}
