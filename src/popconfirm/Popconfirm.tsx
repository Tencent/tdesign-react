import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Popup, { PopupRef } from '../popup';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdPopconfirmProps, PopconfirmVisibleChangeContext } from './type';
import Popcontent from './Popcontent';
import { popconfirmDefaultProps } from './defaultProps';

export type PopconfirmProps = TdPopconfirmProps;

const Popconfirm = forwardRef((props: PopconfirmProps, ref: React.RefObject<PopupRef>) => {
  const { classPrefix } = useConfig();
  const [local, t] = useLocaleReceiver('popconfirm');

  const cancelContent = typeof local.cancel === 'string' ? local.cancel : local.cancel.content;
  const confirmContent = typeof local.confirm === 'string' ? local.confirm : local.confirm.content;
  const { cancelBtn = t(cancelContent), confirmBtn = t(confirmContent) } = props;
  const [visible, setVisible] = useControlled(props, 'visible', props.onVisibleChange);

  return (
    <Popup
      ref={ref}
      {...props}
      visible={visible}
      trigger="click"
      onVisibleChange={(visible) => setVisible(visible)}
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
Popconfirm.defaultProps = popconfirmDefaultProps;

export default Popconfirm;
