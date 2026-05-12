import React from 'react';

import classNames from 'classnames';
import { FileCopyIcon as TdFileCopyIcon } from 'tdesign-icons-react';

import { anchorTargetDefaultProps } from './defaultProps';
import copyText from '../_util/copyText';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { MessagePlugin } from '../message';
import Popup from '../popup';

import type { TdAnchorTargetProps } from './type';
import type { StyledProps } from '../common';
import type { FunctionComponent } from 'react';

export interface AnchorTargetProps extends TdAnchorTargetProps, StyledProps {
  children?: React.ReactNode;
}

const AnchorTarget: FunctionComponent<AnchorTargetProps> = (props) => {
  const { classPrefix } = useConfig();
  const { FileCopyIcon } = useGlobalIcon({ FileCopyIcon: TdFileCopyIcon });

  const { id, tag, children, className, style } = useDefaultProps(props, anchorTargetDefaultProps);

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

export default AnchorTarget;
