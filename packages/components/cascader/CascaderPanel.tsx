import React from 'react';

import classNames from 'classnames';
import { pick } from 'lodash-es';

import Panel from './components/Panel';
import { cascaderDefaultProps } from './defaultProps';
import { useCascaderContext } from './hooks';
import useDefaultProps from '../hooks/useDefaultProps';

import type { TdCascaderProps } from './interface';
import type { StyledProps } from '../common';

export interface CascaderProps extends TdCascaderProps, StyledProps {}

const CascaderPanel: React.FC<CascaderProps> = (originalProps) => {
  const props = useDefaultProps<CascaderProps>(originalProps, cascaderDefaultProps);
  const { cascaderContext } = useCascaderContext(props);
  return (
    <Panel
      className={classNames(props.className)}
      style={props.style}
      cascaderContext={cascaderContext}
      {...pick(props, ['trigger', 'onChange', 'empty', 'option'])}
    ></Panel>
  );
};

CascaderPanel.displayName = 'CascaderPanel';

export default CascaderPanel;
