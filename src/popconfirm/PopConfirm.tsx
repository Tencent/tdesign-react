import React, { ReactNode, MouseEvent, forwardRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popup, { PopupProps } from '../popup/Popup';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import PopContent from './PopContent';

export interface PopConfirmProps extends Omit<PopupProps, 'showArrow' | 'trigger'> {
  /**
   * 取消按钮文字
   * @default '取消'
   */
  cancelText?: string;

  /**
   * 确认按钮文字
   * @default '确认'
   */
  confirmText?: string;

  /**
   * 内容描述
   * @default null
   */
  content?: ReactNode | string;

  /**
   * 自定义弹出气泡 Icon
   */
  icon?: ReactNode | string;

  /**
   * 自定义 Icon 风格
   * @default 'default'
   */
  theme?: 'default' | 'info' | 'warning' | 'error';

  /**
   * 确认 按钮点击回调
   * @default
   */
  onConfirm?: (event: MouseEvent) => void;

  /**
   * 取消 按钮点击回调
   * @default
   */
  onCancel?: (event: MouseEvent) => void;
}

const PopConfirm = forwardRef<HTMLDivElement, PopConfirmProps>(({ overlayClassName, ...props }, ref) => {
  const { classPrefix } = useConfig();
  const [visible, setVisible] = useDefault(props.visible, false, props.onVisibleChange);
  return (
    <Popup
      {...props}
      ref={ref}
      visible={visible}
      onVisibleChange={setVisible}
      showArrow
      trigger="click"
      overlayClassName={classNames(`${classPrefix}-popconfirm`, overlayClassName)}
      content={<PopContent {...props} onClose={() => setVisible(false)} />}
    />
  );
});

PopConfirm.displayName = 'PopConfirm';
PopConfirm.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'info', 'warning', 'error']),
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.element]),
};

PopConfirm.defaultProps = {
  cancelText: '取消',
  confirmText: '确定',
  onCancel: noop,
  onConfirm: noop,
  theme: 'default',
};
export default PopConfirm;
