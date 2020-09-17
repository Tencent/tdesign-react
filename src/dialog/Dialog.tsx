import * as React from 'react';
import { SyntheticEvent } from 'react';
import { Icon } from '../icon';
import { ConfigContext } from '../config-provider';
import { Button } from '../index';
import RenderDialog from './RenderDialog';

export interface DialogProps {
  /**
   * 对话框是否可见
   * @default false
   */
  visible?: boolean;
  /**
   * 对话框模式
   * @default 'modal'
   */
  mode?: 'modal' | 'not-modal';
  /**
   * 对话框模式
   * @default 'top'
   */
  placement?: 'top' | 'center';
  /**
   * 主体样式
   * @default -
   */
  style?: React.CSSProperties;
  /**
   * 主体class
   * @default -
   */
  class?: string;
  /**
   * 位置
   * @default -
   */
  offset?: {
    top?: string | number;
    left?: string | number;
  };
  /**
   * 宽度
   * @default 520
   */
  width?: string | number;
  /**
   * 标题
   * @default -
   */
  header?: React.ReactNode | string;
  /**
   * 底部内容
   * @default -
   */
  footer?: React.ReactNode;
  /**
   * 取消按钮的展示内容
   * @default -
   */
  cancelContent?: boolean | React.ReactNode;
  /**
   * 确认按钮的展示内容
   * @default -
   */
  confirmContent?: React.ReactNode;
  /**
   * 确定按钮 loading
   * @default false
   */
  loading?: boolean;
  /**
   * 弹出框body
   * @default -
   */
  body?: React.ReactNode;
  /**
   * 关闭按钮
   * @default <Icon name="close" />
   */
  closeBtn?: React.ReactNode;
  /**
   * 是否显示蒙层
   * @default true
   */
  showOverlay?: boolean;
  /**
   * 挂载点
   * @default body
   */
  attach?: string | HTMLElement | getContainerFunc | false | null;
  /**
   * 层级
   * @default 2500
   */
  zIndex?: number;
  /**
   * 按下Esc
   * @default () => void
   */
  onKeydownEsc?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  /**
   * 点击关闭按钮
   * @default () => void
   */
  onClickCloseBtn?: (e: React.MouseEvent<HTMLElement>) => void;
  /**
   * 点击关闭按钮
   * @default (e: React.MouseEvent<HTMLButtonElement>) => void
   */
  onClickCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * 点击关闭按钮
   * @default (e: React.MouseEvent<HTMLButtonElement>) => void
   */
  onClickConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * 关闭触发事件
   * @default () => void
   */
  onClosed?: (e?: SyntheticEvent<HTMLElement>) => void;
  /**
   * 打开触发事件
   * @default () => void
   */
  onOpened?: () => void;
  /**
   * 点击蒙层事件
   * @default () => void
   */
  onClickOverlay?: () => void;
  /**
   * 关闭销毁dialog
   * @default false
   */
  destroyOnClose?: boolean;
}

type getContainerFunc = () => HTMLElement;
const Dialog: React.FC<DialogProps> = (props) => {
  const { classPrefix } = React.useContext(ConfigContext);
  const {
    attach: getContainer = 'body',
    closeBtn,
    onClickCloseBtn,
    footer,
    loading,
    onClickCancel,
    onClickConfirm,
    cancelContent = '取消',
    confirmContent = '确定',
    ...restProps
  } = props;

  const prefixCls = `${classPrefix}-dialog`;
  const closeIcon = closeBtn || <Icon name="close" style={{ verticalAlign: 'unset' }} />;

  let { header } = props;
  if (typeof header === 'string') {
    header = <h5 className={`${prefixCls ? `${prefixCls}-` : ''}title`}>{props.header}</h5>;
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClickCancel) {
      onClickCancel(e);
    }
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClickConfirm) {
      onClickConfirm(e);
    }
  };

  const defaultFooter = () => {
    let cancelBtn = (
      <Button theme="line" onClick={handleCancel}>
        {cancelContent}
      </Button>
    );

    let confirmBtn = (
      <Button theme="primary" onClick={handleConfirm} loading={loading}>
        {confirmContent}
      </Button>
    );

    if (typeof cancelContent === 'boolean') {
      cancelBtn = cancelContent && cancelBtn;
    }

    if (typeof confirmContent === 'boolean') {
      confirmBtn = confirmContent && confirmBtn;
    }

    if (typeof cancelContent === 'function') {
      cancelBtn = cancelContent();
    }

    if (typeof confirmContent === 'function') {
      confirmBtn = confirmContent();
    }

    if (!cancelBtn && !confirmBtn) {
      return false;
    }

    return (
      <>
        {cancelBtn}
        {confirmBtn}
      </>
    );
  };

  return (
    <RenderDialog
      {...restProps}
      getContainer={getContainer}
      prefixCls={prefixCls}
      closeBtn={closeIcon}
      header={header}
      classPrefix={classPrefix}
      onClose={onClickCloseBtn || handleCancel}
      footer={footer === undefined ? defaultFooter() : footer}
    />
  );
};

Dialog.defaultProps = {
  width: 520,
  visible: false,
  zIndex: 2500,
  placement: 'center',
  mode: 'modal',
  showOverlay: true,
  destroyOnClose: false,
};

export default Dialog;
