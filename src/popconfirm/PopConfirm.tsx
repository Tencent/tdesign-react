import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Popup, { PopupProps } from '../popup/Popup';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import { TdPopconfirmProps } from '../_type/components/popconfirm';
import PopContent from './PopContent';

export interface PopConfirmProps extends TdPopconfirmProps, PopupProps {}

const PopConfirm = forwardRef<HTMLDivElement, PopConfirmProps>(
  ({ overlayClassName, trigger = 'click', ...props }, ref) => {
    const { classPrefix } = useConfig();
    const [visible, setVisible] = useDefault(props.visible, false, props.onVisibleChange);

    return (
      <Popup
        {...props}
        {...props.popupProps}
        ref={ref}
        visible={visible}
        onVisibleChange={setVisible}
        showArrow
        trigger={trigger}
        overlayClassName={classNames(`${classPrefix}-popconfirm`, overlayClassName)}
        content={<PopContent {...props} onClose={() => setVisible(false, {})} />}
      />
    );
  },
);

PopConfirm.displayName = 'PopConfirm';

PopConfirm.defaultProps = {
  cancelBtn: '取消',
  confirmBtn: '确定',
  onCancel: noop,
  onConfirm: noop,
  theme: 'default',
};
export default PopConfirm;
