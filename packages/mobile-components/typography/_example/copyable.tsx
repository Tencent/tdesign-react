import React from 'react';
import { SmileIcon } from 'tdesign-icons-react';
import { TypographyText } from 'tdesign-mobile-react';

export default function CopyableDemo() {
  return (
    <div>
      <div className="tdesign-mobile-typography-demo tdesign-mobile-typography-demo--border">
        <TypographyText copyable>这是一段可复制的文本</TypographyText>
      </div>
      <div className="tdesign-mobile-typography-demo">
        <TypographyText
          copyable={{
            suffix: () => <SmileIcon style={{ color: '#0052D9' }} />,
            onCopy: () => {
              console.log('触发 copy 事件，已复制文本');
            },
          }}
        >
          这是一段带自定义图标的可复制的文本
        </TypographyText>
      </div>
    </div>
  );
}
