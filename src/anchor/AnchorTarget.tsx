import React, { FunctionComponent } from 'react';
import classNames from 'classnames';
import { FileCopyIcon as TdFileCopyIcon } from 'tdesign-icons-react';
import Popup from '../popup';
import { MessagePlugin } from '../message';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import copyText from '../_util/copyText';

import { TdAnchorTargetProps } from './type';
import { StyledProps } from '../common';
import { anchorTargetDefaultProps } from './defaultProps';

export interface AnchorTargetProps extends TdAnchorTargetProps, StyledProps {
  children?: React.ReactNode;
}

const AnchorTarget: FunctionComponent<AnchorTargetProps> = (props) => {
  const { classPrefix } = useConfig();
  const { FileCopyIcon } = useGlobalIcon({ FileCopyIcon: TdFileCopyIcon });

  const { id, tag, children, className, style } = props;

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
