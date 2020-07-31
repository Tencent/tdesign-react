import React, { FunctionComponent, ReactNode, MouseEvent, forwardRef, Ref } from 'react';
import PropTypes from 'prop-types';
import Popup, { PopupProps } from '../popup/Popup';
import noop from '../_util/noop';
import PopContent from './PopContent';

export type PopConfirmRef = HTMLDivElement;

export interface PopConfirmProps extends PopupProps {
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

  /**
   * 指向浮窗最外层div元素的ref
   */
  ref?: Ref<HTMLDivElement>;
}

const PopConfirm: FunctionComponent<PopConfirmProps> = forwardRef<HTMLDivElement, PopConfirmProps>(
  (props: PopConfirmProps & { children: HTMLElement }, ref: Ref<PopConfirmRef>) => (
    <Popup {...props} content={<PopContent {...props} ref={ref} />}>
      {props.children}
    </Popup>
  ),
);

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
