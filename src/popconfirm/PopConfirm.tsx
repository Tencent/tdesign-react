import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Popup from '../popup/Popup';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { TdPopconfirmProps, PopconfirmVisibleChangeContext } from './type';
import PopContent from './PopContent';

export type PopConfirmProps = TdPopconfirmProps;

const PopConfirm = forwardRef<HTMLDivElement, PopConfirmProps>(({ ...props }, ref) => {
  const { classPrefix } = useConfig();
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
        <PopContent {...props} onClose={(context: PopconfirmVisibleChangeContext) => setVisible(false, context)} />
      }
      {...props.popupProps}
    />
  );
});

PopConfirm.displayName = 'PopConfirm';

PopConfirm.defaultProps = {
  showArrow: true,
  cancelBtn: '取消',
  confirmBtn: '确定',
  onCancel: noop,
  onConfirm: noop,
  theme: 'default',
};
export default PopConfirm;
