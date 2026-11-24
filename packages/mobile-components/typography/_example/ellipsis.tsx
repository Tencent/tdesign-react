import React from 'react';
import { ChevronDownIcon } from 'tdesign-icons-react';
import { TypographyParagraph } from 'tdesign-mobile-react';
import type { TypographyEllipsis } from 'tdesign-mobile-react';

const content =
  'TDesign 秉承开放的设计理念从创立之初就采用开源协作的方式进行设计和开发。协作方案讨论、组件设计以及 API 设计，包括源代码在内均在公司内部完全开放，赢得了内部开发者和设计师的广泛关注。TDesign 遵循平等、开放、严格的原则，不论参与者的角色如何。';

const ellipsisExpandable: TypographyEllipsis = {
  row: 2,
  expandable: true,
  collapsible: true,
  onExpand: (expanded: boolean) => {
    console.log(`触发 expand 事件，当前状态：${expanded ? '展开' : '收起'}`);
  },
};

const ellipsisCustomSuffix: TypographyEllipsis = {
  row: 1,
  suffix: () => <ChevronDownIcon />,
  expandable: true,
  collapsible: false,
  onExpand: () => {
    console.log('触发 expand 事件');
  },
};

export default function EllipsisDemo() {
  return (
    <div>
      <div className="tdesign-mobile-typography-demo tdesign-mobile-typography-demo--border">
        <TypographyParagraph ellipsis>{content}</TypographyParagraph>
      </div>
      <div className="tdesign-mobile-typography-demo tdesign-mobile-typography-demo--border">
        <TypographyParagraph ellipsis={ellipsisExpandable}>{content}</TypographyParagraph>
      </div>
      <div className="tdesign-mobile-typography-demo">
        <TypographyParagraph ellipsis={ellipsisCustomSuffix}>{content}</TypographyParagraph>
      </div>
    </div>
  );
}
