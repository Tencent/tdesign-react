import React from 'react';
import { CellGroup, Cell, Badge, Switch, Avatar } from 'tdesign-mobile-react';
import { ChevronRightIcon, AppIcon } from 'tdesign-icons-react';

export default function Multiple() {
  const chevronRightIcon = <ChevronRightIcon />;
  const avatarUrl = 'https://tdesign.gtimg.com/mobile/demos/avatar1.png';
  const imgUrl = 'https://tdesign.gtimg.com/mobile/demos/example4.png';

  return (
    <CellGroup>
      <Cell title="单行标题" description="一段很长很长的内容文字" arrow />
      <Cell title="单行标题" description="一段很长很长的内容文字" arrow required />
      <Cell title="单行标题" description="一段很长很长的内容文字" arrow note={<Badge count={16} />} />
      <Cell title="单行标题" description="一段很长很长的内容文字" note={<Switch defaultValue={true} />} />
      <Cell title="单行标题" description="一段很长很长的内容文字" note="辅助信息" arrow />
      <Cell title="单行标题" description="一段很长很长的内容文字" arrow leftIcon={<AppIcon />} />
      <Cell title="单行标题" description="一段很长很长的内容文字，长文本自动换行，该选项的描述是一段很长的内容" />
      <Cell
        title="多行高度不定，长文本自动换行，该选项的描述是一段很长的内容"
        description="一段很长很长的内容文字，长文本自动换行，该选项的描述是一段很长的内容"
      />
      <Cell
        title="单行标题"
        description="一段很长很长的内容文字"
        leftIcon={<Avatar shape="circle" image={avatarUrl} />}
        rightIcon={chevronRightIcon}
      />
      <Cell title="单行标题" description="一段很长很长的内容文字" image={imgUrl} />
    </CellGroup>
  );
}
