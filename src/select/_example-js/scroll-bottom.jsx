import React, { useState } from 'react';
import { Select } from 'tdesign-react';

const options = [];
for (let i = 0; i < 15; i++) {
  options.push({ label: `选项${i + 1}`, value: String(i) });
}

export default function ScrollBottom() {
  const [dynamicOptions, changeDynamicOptions] = useState(options);

  // 通过滚动事件自行判断
  // const handleScroll = ({ e }) => {
  //   const { scrollTop, clientHeight, scrollHeight } = e.target;
  //   if (clientHeight + Math.floor(scrollTop) === scrollHeight) {
  //     console.log('到底部了');
  //     changeDynamicOptions((dynamicOptions) =>
  //       dynamicOptions.concat({
  //         label: `滚动新增选项${dynamicOptions.length}`,
  //         value: dynamicOptions.length,
  //       }),
  //     );
  //   }
  // };

  // 直接使用滚动触底事件
  const handleScrollToBottom = () => {
    changeDynamicOptions((dynamicOptions) =>
      dynamicOptions.concat({
        label: `滚动新增选项${dynamicOptions.length}`,
        value: dynamicOptions.length,
      }),
    );
  };
  return (
    <Select
      style={{ width: '40%' }}
      clearable
      options={dynamicOptions}
      popupProps={{
        // onScroll: handleScroll,
        onScrollToBottom: handleScrollToBottom,
      }}
    />
  );
}
