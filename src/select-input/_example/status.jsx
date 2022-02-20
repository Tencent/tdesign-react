import React from 'react';
import { SelectInput } from 'tdesign-react';

const SelectInputStatus = () => {
  const selectValue = 'TDesign';
  return (
    <div className="tdesign-demo-select-input-status">
      <div>
        <span>禁用状态：</span>
        <SelectInput
          value={selectValue}
          disabled
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
        ></SelectInput>
      </div>
      <br />

      <div>
        <span>只读状态：</span>
        <SelectInput
          value={selectValue}
          readonly
          placeholder="Please Select"
          tips="这是普通状态的文本提示"
          panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
        ></SelectInput>
      </div>
      <br /><br />

      <div>
        <span>成功状态：</span>
        <SelectInput
          value={selectValue}
          status="success"
          tips="校验通过文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
        ></SelectInput>
      </div>
      <br />

      <div>
        <span>警告状态：</span>
        <SelectInput
          value={selectValue}
          status="warning"
          tips="校验不通过文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
        ></SelectInput>
      </div>
      <br />

      <div>
        <span>错误状态：</span>
        <SelectInput
          value={selectValue}
          status="error"
          tips="校验存在严重问题文本提示"
          placeholder="Please Select"
          panel={<div className="tdesign-demo__select-empty">暂无数据</div>}
        ></SelectInput>
      </div>
      <br />
    </div>
  )
}

SelectInputStatus.displayName = 'SelectInputStatus';

export default SelectInputStatus


// 外部样式
// .tdesign-demo__select-empty {
//   text-align: center;
//   color: var(--td-text-color-disabled);
//   line-height: 32px;
// }

// .tdesign-demo-select-input-status .t-select-input {
//   width: 300px;
// }
// .tdesign-demo-select-input-status .t-select-input:not(.t-demo-normal) {
//   vertical-align: -26px;
// }
