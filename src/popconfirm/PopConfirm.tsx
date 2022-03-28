import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Popup from '../popup';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdPopconfirmProps, PopconfirmVisibleChangeContext } from './type';
import PopContent from './PopContent';

export type PopConfirmProps = TdPopconfirmProps;

const PopConfirm = forwardRef<HTMLDivElement, PopConfirmProps>((props, ref) => {
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
        <PopContent
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

PopConfirm.displayName = 'PopConfirm';

PopConfirm.defaultProps = {
  destroyOnClose: true,
  showArrow: true,
  onCancel: noop,
  onConfirm: noop,
  theme: 'default',
};
export default PopConfirm;
