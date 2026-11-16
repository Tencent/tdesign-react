import React, { forwardRef } from 'react';
import classNames from 'classnames';

import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Popup from '../popup';
import { popconfirmDefaultProps } from './defaultProps';
import Popcontent from './Popcontent';

import type { PopupRef } from '../popup';
import type { PopconfirmVisibleChangeContext, TdPopconfirmProps } from './type';

export type PopconfirmProps = TdPopconfirmProps;

const Popconfirm = forwardRef<PopupRef, TdPopconfirmProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();
  const [local, t] = useLocaleReceiver('popconfirm');

  const cancelContent = typeof local.cancel === 'string' ? local.cancel : local.cancel.content;
  const confirmContent = typeof local.confirm === 'string' ? local.confirm : local.confirm.content;

  const props = useDefaultProps<TdPopconfirmProps>(originalProps, popconfirmDefaultProps);

  const { cancelBtn = t(cancelContent), confirmBtn = t(confirmContent) } = props;
  const [visible, setVisible] = useControlled(props, 'visible', props.onVisibleChange);

  return (
    <Popup
      ref={ref}
      {...props}
      visible={visible}
      trigger="click"
      onVisibleChange={(visible, context) => setVisible(visible, context as PopconfirmVisibleChangeContext)}
      overlayClassName={classNames(`${classPrefix}-popconfirm`)}
      content={
        <Popcontent
          cancelBtn={cancelBtn}
          confirmBtn={confirmBtn}
          {...props}
          onClose={(context: PopconfirmVisibleChangeContext) => setVisible(false, context)}
        />
      }
      {...props.popupProps}
    />
  );
});

Popconfirm.displayName = 'Popconfirm';

export default Popconfirm;
