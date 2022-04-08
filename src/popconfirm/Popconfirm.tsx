import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Popup from '../popup';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdPopconfirmProps, PopconfirmVisibleChangeContext } from './type';
import Popcontent from './Popcontent';

export type PopconfirmProps = TdPopconfirmProps;

const Popconfirm = forwardRef<HTMLDivElement, PopconfirmProps>((props, ref) => {
  const { classPrefix } = useConfig();
  const [local, t] = useLocaleReceiver('popconfirm');

  const { cancelBtn = t(local.cancel.content), confirmBtn = t(local.confirm.content) } = props;
  const [visible, setVisible] = useDefault(props.visible, props.defaultVisible, props.onVisibleChange);

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

Popconfirm.defaultProps = {
  destroyOnClose: true,
  showArrow: true,
  onCancel: noop,
  onConfirm: noop,
  theme: 'default',
};
export default Popconfirm;
