import React from 'react';
import { SelectInput } from 'tdesign-react';
import './index.less';

const SelectInputWidth = () => {
  const selectValue = 'TDesign';
  return (
    <div className="tdesign-demo-select-input-width">
      <div>
        <span>下拉框默认宽度：</span>
        <SelectInput
          value={selectValue}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty">下拉框宽度和触发元素宽度保持一致（默认）</div>}
        ></SelectInput>
      </div>
      <br />

      <div>
        <span>下拉框最大宽度：</span>
        <SelectInput
          value={selectValue}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={(
            <div className="tdesign-demo__select-empty">
              下拉框宽度和触发元素宽度保持一致，但是当下拉框内容宽度超出时，自动撑开下拉框宽度，最大不超过 1000px（默认）
            </div>
          )}
        ></SelectInput>
      </div>
      <br />

      <div>
        <span>与内容宽度一致：</span>
        <SelectInput
          value={selectValue}
          popupProps={{
            overlayStyle: { width: 'auto' },
          }}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty">宽度随内容宽度自适应</div>}
        ></SelectInput>
      </div>
      <br />

      <div>
        <span>下拉框固定宽度：</span>
        <SelectInput
          value={selectValue}
          popupProps={{
            overlayStyle: { width: '360px' },
          }}
          placeholder="Please Select"
          className="t-demo-normal"
          panel={<div className="tdesign-demo__select-empty">固定宽度 360px</div>}
        ></SelectInput>
      </div>
      <br />
    </div>
  )
}

SelectInputWidth.displayName = 'SelectInputWidth';

export default SelectInputWidth;

// .tdesign-demo-select-input-width .t-select-input {
//   width: 380px;
// }
