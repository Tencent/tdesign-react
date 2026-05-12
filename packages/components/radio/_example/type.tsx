import React from 'react';
import { Radio, Space } from 'tdesign-react';

export default function RadioControlledExample() {
  return (
    <Space direction="vertical">
      <Space direction="vertical">
        <h5>普通单选按钮</h5>
        <Radio.Group defaultValue="gz">
          <Radio value="bj">选项一</Radio>
          <Radio value="sh">选项二</Radio>
          <Radio value="gz">选项三</Radio>
          <Radio value="sz">选项四</Radio>
        </Radio.Group>
      </Space>
      <Space direction="vertical">
        <h5>边框型单选按钮</h5>
        <Radio.Group defaultValue="1">
          <Radio.Button value="1">选项一</Radio.Button>
          <Radio.Button value="2">选项二</Radio.Button>
          <Radio.Button value="3">选项三</Radio.Button>
          <Radio.Button value="1" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button value="2" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>
      </Space>
      <Space direction="vertical">
        <h5>填充型单选按钮</h5>

        <Radio.Group variant="default-filled" defaultValue="gz">
          <Radio.Button value="bj">选项一</Radio.Button>
          <Radio.Button value="gz">选项二</Radio.Button>
          <Radio.Button value="sz">选项三</Radio.Button>
          <Radio.Button value="fj">选项四</Radio.Button>
          <Radio.Button value="cd">选项五</Radio.Button>
        </Radio.Group>

        <Radio.Group variant="primary-filled" defaultValue="gz">
          <Radio.Button value="bj">选项一</Radio.Button>
          <Radio.Button value="gz">选项二</Radio.Button>
          <Radio.Button value="sz">选项三</Radio.Button>
          <Radio.Button value="fj">选项四</Radio.Button>
          <Radio.Button value="cd">选项五</Radio.Button>
        </Radio.Group>

        <Radio.Group variant="default-filled" defaultValue="bj">
          <Radio.Button value="fj" disabled>
            选项一
          </Radio.Button>
          <Radio.Button value="cd" disabled>
            选项二
          </Radio.Button>
          <Radio.Button value="sz" disabled>
            选项三
          </Radio.Button>
          <Radio.Button value="bj" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button value="gz" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>

        <Radio.Group variant="primary-filled" defaultValue="bj">
          <Radio.Button value="fj" disabled>
            选项一
          </Radio.Button>
          <Radio.Button value="cd" disabled>
            选项二
          </Radio.Button>
          <Radio.Button value="sz" disabled>
            选项三
          </Radio.Button>
          <Radio.Button value="bj" disabled>
            选中禁用态
          </Radio.Button>
          <Radio.Button value="gz" disabled>
            未选中禁用态
          </Radio.Button>
        </Radio.Group>
      </Space>
    </Space>
  );
}
