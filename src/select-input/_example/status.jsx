import React, { useEffect } from 'react';
import { SelectInput, Space } from 'tdesign-react';

const classStyles = `
<style>
.tdesign-demo__select-empty-status {
  text-align: center;
  color: var(--td-text-color-disabled);
  line-height: 32px;
}
</style>
`;

const SelectInputStatus = () => {
  const selectValue = 'TDesign';

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <Space direction="vertical" size={32}>
      <Space>
        <span>禁用状态：</span>
        <SelectInput
          value={selectValue}
          disabled
          placeholder="Please Select"
          tips="这是禁用状态的文本"
          panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
        />
      </Space>

      <Space>
        <span>只读状态：</span>
        <SelectInput
          value={selectValue}
          readonly
          placeholder="Please Select"
          tips="这是只读状态的文本提示"
          panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
        />
      </Space>

      <Space>
        <span>成功状态：</span>
        <SelectInput
          value={selectValue}
          status="success"
          tips="校验通过文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
        />
      </Space>

      <Space>
        <span>警告状态：</span>
        <SelectInput
          value={selectValue}
          status="warning"
          tips="校验不通过文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
        />
      </Space>

      <Space>
        <span>错误状态：</span>
        <SelectInput
          value={selectValue}
          status="error"
          tips="校验存在严重问题文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty-status">暂无数据</div>}
        />
      </Space>

      <Space>
        <span>加载状态：</span>
        <SelectInput
          loading={true}
          tips="处于加载状态的文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty-status">加载中...</div>}
        />
      </Space>
    </Space>
  );
};

SelectInputStatus.displayName = 'SelectInputStatus';

export default SelectInputStatus;
