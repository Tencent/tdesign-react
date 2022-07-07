import React from 'react';
import pick from 'lodash/pick';
import classNames from 'classnames';
import Panel from './components/Panel';

import { TdCascaderProps } from './interface';
import { useCascaderContext } from './hooks';
import { cascaderDefaultProps } from './defaultProps';
import { StyledProps } from '../common';

export interface CascaderProps extends TdCascaderProps, StyledProps {}

const CascaderPanel = (props: CascaderProps) => {
  const { cascaderContext } = useCascaderContext(props);
  return (
    <Panel
      className={classNames(props.className)}
      style={props.style}
      cascaderContext={cascaderContext}
      {...pick(props, ['trigger', 'onChange', 'empty'])}
    ></Panel>
  );
};

CascaderPanel.displayName = 'CascaderPanel';
CascaderPanel.defaultProps = cascaderDefaultProps;

export default CascaderPanel;
