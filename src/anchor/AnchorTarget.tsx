import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import { FileCopyIcon } from 'tdesign-icons-react';
import Popup from '../popup';
import { MessagePlugin } from '../message';
import useConfig from '../_util/useConfig';

import { TdAnchorTargetProps } from './type';
import { StyledProps } from '../common';
import { copyText } from './_util/clipboard';
import { anchorTargetDefaultProps } from './defaultProps';

export interface AnchorTargetProps extends TdAnchorTargetProps, StyledProps {}

const AnchorTarget: FunctionComponent<AnchorTargetProps> = (props) => {
  const { id, tag, children, className, style } = props;

  const { classPrefix } = useConfig();

  const tagClassName = classNames(`${classPrefix}-anchor__target`, className);
  const iconClassName = `${classPrefix}-anchor__copy`;

  const handleCopyText = () => {
    const a = document.createElement('a');
    a.href = `#${id}`;
    copyText(a.href);
    MessagePlugin.success('链接复制成功', 1000);
  };

  const Content = () => (
    <>
      {children}
      <Popup content="复制链接" placement="top" showArrow>
        <FileCopyIcon className={iconClassName} onClick={handleCopyText} />
      </Popup>
    </>
  );

  return React.createElement(tag, { id, className: tagClassName, style }, React.createElement(Content));
};

AnchorTarget.displayName = 'AnchorTarget';
AnchorTarget.defaultProps = anchorTargetDefaultProps;

export default AnchorTarget;
