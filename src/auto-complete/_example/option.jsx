import React, { useEffect, useState } from 'react';
import { AutoComplete, HighlightOption } from 'tdesign-react';

const classStyles = `
<style>
.t-demo-autocomplete-option-list .t-select-option {
  height: 50px;
}

.t-demo-autocomplete-option-list .custom-option {
  display: flex;
  align-items: center;
}

.t-demo-autocomplete-option-list .custom-option > img {
  max-height: 40px;
  border-radius: 50%;
}

.t-demo-autocomplete-option-list .custom-option__main {
  margin-left: 8px;
}

.t-demo-autocomplete-option-list .custom-option .description {
  color: var(--td-gray-color-9);
}
</style>
`;

const TEXTS = ['第一个默认联想词', '第二个默认联想词', '第三个默认联想词'];

const AutoCompleteOption = () => {
  const [value, setValue] = useState('');

  const options = TEXTS.map(text => ({
    text,
    label: (
      <div className="custom-option">
        <img src="https://tdesign.gtimg.com/site/avatar.jpg" />
        <div className="custom-option__main">
          <HighlightOption content={text} keyword={value} />
          <small className="description">这是关于联想词的描述，使用 label 渲染</small>
        </div>
      </div>
    )
  }));

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <div className="t-demo-autocomplete-option">
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        highlightKeyword
        placeholder="请输入关键词搜索"
        popupProps={{ overlayClassName: 't-demo-autocomplete-option-list' }}
      />
    </div>
  );
};

AutoCompleteOption.displayName = 'AutoCompleteOption';

export default AutoCompleteOption;
