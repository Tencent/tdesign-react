import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import ImageAvatar from './image-avatar';
import CharacterAvatar from './character-avatar';
import IconAvatar from './icon-avatar';
import BadgeAvatar from './badge-avatar';
import ExhibitionAvatar from './exhibition';
import ActionAvatar from './action';
import SizeAvatar from './size';
import './style/index.less';

export default function () {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="Avatar 头像" summary="用于展示用户头像信息，除了纯展示也可点击进入个人详情等操作。" />
      <TDemoBlock title="01 组件类型" summary="图片头像">
        <ImageAvatar />
      </TDemoBlock>
      <TDemoBlock summary="字符头像">
        <CharacterAvatar />
      </TDemoBlock>
      <TDemoBlock summary="图标头像">
        <IconAvatar />
      </TDemoBlock>
      <TDemoBlock summary="带徽标头像">
        <BadgeAvatar />
      </TDemoBlock>
      <TDemoBlock title="02 特殊类型" summary="纯展示的头像组">
        <ExhibitionAvatar />
      </TDemoBlock>
      <TDemoBlock summary="带操作的头像组">
        <ActionAvatar />
      </TDemoBlock>
      <TDemoBlock title="03 组件尺寸" summary="组件尺寸">
        <SizeAvatar />
      </TDemoBlock>
    </div>
  );
}
