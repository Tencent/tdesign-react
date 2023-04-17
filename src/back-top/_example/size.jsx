// @ts-nocheck
import React from 'react';
import { BackTop, Space } from 'tdesign-react';

export default function BasicBackTop() {
  const style = {
    position: 'relative',
    insetInlineEnd: 0,
    insetBlockEnd: 0,
  };

  return (
    <Space direction="vertical" size={32}>
      <Space size={24}>
        <BackTop style={style} visibleHeight={0} size="small" offset={['24px', '300px']} container={() => document} />
        <BackTop style={style} visibleHeight={0} size="medium" offset={['124px', '300px']} container={() => document} />
      </Space>
      <Space size={24}>
        <BackTop
          style={style}
          visibleHeight={0}
          size="small"
          theme="primary"
          offset={['24px', '300px']}
          container={() => document}
        />
        <BackTop
          style={style}
          visibleHeight={0}
          size="medium"
          theme="primary"
          offset={['124px', '300px']}
          container={() => document}
        />
      </Space>
      <Space size={24}>
        <BackTop
          style={style}
          visibleHeight={0}
          size="small"
          theme="dark"
          offset={['24px', '300px']}
          container={() => document}
        />
        <BackTop
          style={style}
          visibleHeight={0}
          size="medium"
          theme="dark"
          offset={['124px', '300px']}
          container={() => document}
        />
      </Space>
    </Space>
  );
}
