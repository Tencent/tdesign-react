import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import Popup from '../popup/';
import { Icon } from '../icon';
import Message from '../message';
import useConfig from '../_util/useConfig';

import { TdAnchorTargetProps } from '../_type/components/anchor-target';
import { StyledProps } from '../_type';
import { copyText } from './_util/clipboard';

export interface AnchorTargetProps extends TdAnchorTargetProps, StyledProps {}

const AnchorTarget: FunctionComponent<AnchorTargetProps> = (props) => {
  const { id, tag = 'div', children, className, style } = props;

  const { classPrefix } = useConfig();

  const tagClassName = classNames(`${classPrefix}-anchor-target`, className);
  const iconClassName = `${classPrefix}-copy`;

  const handleCopyText = () => {
    const a = document.createElement('a');
    a.href = `#${id}`;
    copyText(a.href);
    Message.success('链接复制成功', 1000);
  };

  const Content = () => (
    <>
      {children}
      <Popup content="复制链接" placement="top" showArrow>
        <Icon name="file-copy" className={iconClassName} onClick={handleCopyText}></Icon>
      </Popup>
    </>
  );

  return React.createElement(tag, { id, className: tagClassName, style }, React.createElement(Content));
};

export default AnchorTarget;
