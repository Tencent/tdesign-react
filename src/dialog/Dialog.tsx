import React, { SyntheticEvent } from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import { ConfigContext } from '../config-provider';
import { ConfigConsumerProps } from '../config-provider/ConfigContext';
import LazyRender from './LazyRender';
import { ModalProps } from './Modal';
import PortalWrapper from './PortalWrapper';

function contains(root, n) {
  let node = n;

  while (node) {
    if (node === root) {
      return true;
    }

    node = node.parentNode;
  }

  return false;
}

enum KEY_CODE {
  ESC = 27,
}

const indexId = 0;

/* eslint react/no-is-mounted:0 */

function getScroll(w: any, top?: boolean) {
  let ret = w[`page${top ? 'Y' : 'X'}Offset`];
  const method = `scroll${top ? 'Top' : 'Left'}`;
  if (typeof ret !== 'number') {
    const d = w.document;
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      ret = d.body[method];
    }
  }
  return ret;
}

function setTransformOrigin(node: any, value: string) {
  const { style } = node;
  ['Webkit', 'Moz', 'Ms', 'ms'].forEach((prefix: string) => {
    style[`${prefix}TransformOrigin`] = value;
  });
  style.transformOrigin = value;
}

function offset(el: any) {
  const rect = el.getBoundingClientRect();
  const pos = {
    left: rect.left,
    top: rect.top,
  };
  const doc = el.ownerDocument;
  const w = doc.defaultView || doc.parentWindow;
  pos.left += getScroll(w);
  pos.top += getScroll(w, true);
  return pos;
}
export type IStringOrHtmlElement = string | HTMLElement;
export interface DialogChildProps extends ModalProps {
  height?: number;
  mousePosition?: {
    x: number;
    y: number;
  };
  transitionName?: string;
  maskTransitionName?: string;
  animation?: boolean;
  maskAnimation?: any;
  prefixCls?: string;
  onClose: (e: SyntheticEvent<HTMLElement>) => any;
  getContainer?: IStringOrHtmlElement | (() => IStringOrHtmlElement) | false;
}

const transitionTime = 200;
export default class Dialog extends React.Component<DialogChildProps, any> {
  static contextType = ConfigContext;
  static defaultProps = {
    mask: true,
    visible: false,
    destroyOnClose: false,
    prefixCls: 't-dialog',
    transitionName: 't-dialog-zoom',
    maskTransitionName: 't-dialog-fade',
  };

  context: ConfigConsumerProps;
  // 记录打开对话框后原来active的dom
  private lastOutSideFocusNode: HTMLElement | null;
  private titleId: string;
  private wrap: HTMLElement;
  private dialog: any;

  constructor(props: DialogChildProps) {
    super(props);
    this.titleId = `dialogTitle-${indexId + 1}`;
  }

  componentDidMount() {
    this.componentDidUpdate({});
    if (!!this.props.getContainer === false && !this.props.visible && this.wrap) {
      this.wrap.style.display = 'none';
    }
  }

  componentDidUpdate(prevProps: ModalProps) {
    const { visible, showOverlay } = this.props;
    const { mousePosition } = this.props;
    if (visible) {
      if (!prevProps.visible) {
        this.tryFocusDialog();
        // eslint-disable-next-line react/no-find-dom-node
        const dialogNode = ReactDOM.findDOMNode(this.dialog);
        if (mousePosition) {
          const elOffset = offset(dialogNode);
          setTransformOrigin(
            dialogNode,
            `${mousePosition.x - elOffset.left}px ${mousePosition.y - elOffset.top}px`,
          );
        } else {
          setTransformOrigin(dialogNode, '');
        }
      }
    } else if (prevProps.visible) {
      if (showOverlay && this.lastOutSideFocusNode) {
        try {
          this.lastOutSideFocusNode.focus();
        } catch (e) {
          this.lastOutSideFocusNode = null;
        }
        this.lastOutSideFocusNode = null;
      }
    }
  }

  tryFocusDialog() {
    if (!contains(this.wrap, document.activeElement)) {
      this.lastOutSideFocusNode = document.activeElement as HTMLElement;
      this.wrap.focus();
    }
  }

  onAnimateLeave = () => {
    if (this.wrap) {
      this.wrap.style.display = 'none';
    }
    this.close(null);
  };

  onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      const { onClickOverlay } = this.props;
      onClickOverlay && onClickOverlay();
      this.close(e);
    }
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { props } = this;
    if (e.keyCode === KEY_CODE.ESC) {
      e.stopPropagation();
      if (props.onKeydownEsc) {
        props.onKeydownEsc(e);
      }
      this.close(e);
      return;
    }
  };

  getDialogElement = () => {
    const { props } = this;
    const { prefixCls } = props;
    const dest: any = {};
    if (props.width !== undefined) {
      dest.width = props.width;
    }
    if (props.height !== undefined) {
      dest.height = props.height;
    }
    if (props.offset) {
      dest.marginTop = props.offset.top || 0;
      dest.marginLeft = props.offset.left || 0;
    }

    const footer = props.footer ? (
      <div className={`${prefixCls}__footer`} ref={this.saveRef('footer')}>
        {props.footer}
      </div>
    ) : null;

    const header = props.header ? (
      <div className={`${prefixCls}__header`} ref={this.saveRef('header')}>
        {props.header}
      </div>
    ) : null;

    const body = (
      <div className={`${prefixCls}__body`} ref={this.saveRef('body')}>
        {props.body || props.children}
      </div>
    );

    const closer = (
      <span onClick={this.close} className={`${this.context.classPrefix}-icon-close`}>
        {props.closeBtn}
      </span>
    );

    const style = { ...dest, ...props.style };
    const transitionName = this.getTransitionName();
    const dialogElement = (
      <LazyRender
        key="dialog-elem"
        role="document"
        ref={this.saveRef('dialog')}
        style={style}
        className={`${prefixCls}${` ${prefixCls}--default`}`}
        visible={props.visible}
      >
        {closer}
        {header}
        {body}
        {footer}
      </LazyRender>
    );

    return (
      <CSSTransition
        key="dialog"
        in={props.visible}
        appear
        mountOnEnter
        unmountOnExit={props.destroyOnClose}
        timeout={transitionTime}
        classNames={transitionName}
        onEntered={props.onOpened}
        onExited={this.onAnimateLeave}
      >
        {dialogElement}
      </CSSTransition>
    );
  };

  getZIndexStyle = () => {
    const style: any = {};
    const { props } = this;
    if (props.zIndex !== undefined) {
      style.zIndex = props.zIndex;
    }
    return style;
  };

  getMaskElement = () => {
    const { props } = this;
    let maskElement;
    if (props.showOverlay) {
      const maskTransition = this.getMaskTransitionName();
      maskElement = (
        <LazyRender
          style={this.getZIndexStyle()}
          key="mask"
          className={`${props.prefixCls}-mask`}
          visible={props.visible}
        />
      );
      if (maskTransition) {
        maskElement = (
          <CSSTransition
            in={props.visible}
            appear
            timeout={transitionTime}
            classNames={maskTransition}
            mountOnEnter
            unmountOnExit
            key="mask"
          >
            {maskElement}
          </CSSTransition>
        );
      }
    }
    return maskElement;
  };

  getMaskTransitionName = () => {
    const { props } = this;
    let transitionName = props.maskTransitionName;
    const animation = props.maskAnimation;
    if (!transitionName && animation) {
      transitionName = `${props.prefixCls}-${animation}`;
    }

    return transitionName;
  };

  getTransitionName = () => {
    const { props } = this;
    let { transitionName } = props;
    const { animation } = props;
    if (!transitionName && animation) {
      transitionName = `${props.prefixCls}-${animation}`;
    }
    return transitionName;
  };

  close = (e: any) => {
    const { onClosed, onClose } = this.props;
    if (onClosed) {
      onClosed(e);
    }
    onClose(e);
  };

  saveRef = (name: string) => (node: any) => {
    (this as any)[name] = node;
  };

  render() {
    const { props } = this;
    const { prefixCls, mode } = props;
    const style = this.getZIndexStyle();
    if (props.visible) {
      style.display = 'block';
    }

    const wrapStyle = {
      position: mode === 'modal' ? 'fixed' : 'relative',
      zIndex: props.zIndex,
      ...style,
    };

    const dialog = (
      <div className={`${prefixCls}-ctx`}>
        {mode === 'modal' && this.getMaskElement()}
        <div
          tabIndex={-1}
          onKeyDown={this.onKeyDown}
          ref={this.saveRef('wrap')}
          onClick={mode === 'modal' ? this.onMaskClick : null}
          role="dialog"
          aria-labelledby={props.header ? this.titleId : null}
          className={`${prefixCls}-wrap ${props.offset ? '' : ` ${prefixCls}--${props.placement}`}`}
          style={{ ...style, ...wrapStyle }}
        >
          {this.getDialogElement()}
        </div>
      </div>
    );

    let dom = null;

    if (props.visible || this.wrap) {
      // 渲染到当前的dom里，否则就渲染到指定的dom
      if (props.getContainer === false || mode === 'not-modal') {
        dom = dialog;
      } else {
        dom = <PortalWrapper node={props.getContainer}>{dialog}</PortalWrapper>;
      }
    }

    return dom;
  }
}
