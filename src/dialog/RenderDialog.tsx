import React, { useRef, CSSProperties, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import Portal from '../common/Portal';
import noop from '../_util/noop';
import useLayoutEffect from '../_util/useLayoutEffect';
import { DialogProps } from './Dialog';
import useDialogEsc from '../_util/useDialogEsc';
import { dialogDefaultProps } from './defaultProps';
import { useLocaleReceiver } from '../locale/LocalReceiver';

enum KeyCode {
  ESC = 27,
}

function GetCSSValue(v: string | number) {
  return Number.isNaN(Number(v)) ? v : `${Number(v)}px`;
}
export interface RenderDialogProps extends DialogProps {
  prefixCls?: string;
  classPrefix: string;
}

const transitionTime = 300;
let mousePosition: { x: number; y: number } | null;
const getClickPosition = (e: MouseEvent) => {
  mousePosition = {
    x: e.clientX,
    y: e.clientY,
  };
  setTimeout(() => {
    mousePosition = null;
  }, 100);
};
if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
  document.documentElement.addEventListener('click', getClickPosition, true);
}
const RenderDialog = forwardRef((props: RenderDialogProps, ref: React.Ref<HTMLDivElement>) => {
  const [local] = useLocaleReceiver('dialog');
  const {
    prefixCls,
    attach,
    visible,
    mode,
    zIndex,
    showOverlay,
    onEscKeydown = noop,
    onClosed = noop,
    onClose = noop,
    onCloseBtnClick = noop,
    onOverlayClick = noop,
    preventScrollThrough,
    closeBtn,
    closeOnEscKeydown,
    closeOnOverlayClick,
    destroyOnClose,
    showInAttachedElement,
  } = props;

  const wrap = useRef<HTMLDivElement>();
  const dialog = useRef<HTMLDivElement>();
  const dialogPosition = useRef<HTMLDivElement>();
  const maskRef = useRef<HTMLDivElement>();
  const portalRef = useRef<HTMLDivElement>();
  const bodyOverflow = useRef<string>();
  const bodyCssTextRef = useRef<string>();
  const isModal = mode === 'modal';
  const isNormal = mode === 'normal';
  const canDraggable = props.draggable && mode === 'modeless';
  const dialogOpenClass = `${prefixCls}__${mode}`;
  useDialogEsc(visible, wrap);
  useImperativeHandle(ref, () => wrap.current);
  useLayoutEffect(() => {
    bodyOverflow.current = document.body.style.overflow;
    bodyCssTextRef.current = document.body.style.cssText;
  }, []);

  useLayoutEffect(() => {
    if (visible) {
      if (isModal && bodyOverflow.current !== 'hidden' && preventScrollThrough && !showInAttachedElement) {
        const scrollWidth = window.innerWidth - document.body.offsetWidth;
        // 减少回流
        if (bodyCssTextRef.current === '') {
          let bodyCssText = 'overflow: hidden;';
          if (scrollWidth > 0) {
            bodyCssText += `position: relative;width: calc(100% - ${scrollWidth}px);`;
          }
          document.body.style.cssText = bodyCssText;
        } else {
          if (scrollWidth > 0) {
            document.body.style.width = `calc(100% - ${scrollWidth}px)`;
            document.body.style.position = 'relative';
          }
          document.body.style.overflow = 'hidden';
        }
      }
      if (wrap.current) {
        wrap.current.focus();
      }
    } else if (isModal) {
      const openDialogDom = document.querySelectorAll(`${prefixCls}__mode`);
      if (openDialogDom.length < 1) {
        document.body.style.cssText = bodyCssTextRef.current;
      }
    }

    // 组件销毁后重置 body 样式
    return () => {
      if (isModal) {
        // 此处只能查询 mode 模式的 dialog 个数 因为 modeless 会点击透传 normal 是正常文档流
        const openDialogDom = document.querySelectorAll(`${prefixCls}__mode`);
        if (openDialogDom.length < 1) {
          document.body.style.cssText = bodyCssTextRef.current;
          document.body.style.overflow = bodyOverflow.current;
        }
      } else {
        document.body.style.cssText = bodyCssTextRef.current;
        document.body.style.overflow = bodyOverflow.current;
      }
    };
  }, [preventScrollThrough, attach, visible, mode, isModal, showInAttachedElement, prefixCls]);

  useEffect(() => {
    // 动画渲染初始位置
    if (visible) {
      if (mousePosition && dialog.current) {
        dialog.current.style.transformOrigin = `${mousePosition.x - dialog.current.offsetLeft}px ${
          mousePosition.y - dialog.current.offsetTop
        }px`;
      }
    }
  }, [visible]);

  const onAnimateLeave = () => {
    if (wrap.current) {
      wrap.current.style.display = 'none';
    }
    if (isModal && preventScrollThrough) {
      // 还原 body 的滚动条
      const openDialogDom = document.querySelectorAll(`${prefixCls}__mode`);
      if (isModal && openDialogDom.length < 1) {
        document.body.style.overflow = bodyOverflow.current;
      }
    }
    if (!isModal) {
      // 关闭弹窗 清空拖拽设置的相关 css
      const { style } = dialog.current;
      style.position = 'relative';
      style.left = 'unset';
      style.top = 'unset';
    }
    onClosed && onClosed();
  };

  const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showOverlay && (closeOnOverlayClick ?? local.closeOnOverlayClick)) {
      if (e.target === dialogPosition.current) {
        onOverlayClick({ e });
        onClose({ e, trigger: 'overlay' });
      }
    }
  };

  const handleCloseBtnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onCloseBtnClick({ e });
    onClose({ e, trigger: 'close-btn' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    if (+e.code === KeyCode.ESC || e.keyCode === KeyCode.ESC) {
      e.stopPropagation();
      onEscKeydown({ e });
      if (closeOnEscKeydown ?? local.closeOnEscKeydown) {
        onClose({ e, trigger: 'esc' });
      }
    }
  };

  const renderDialog = () => {
    const dest: any = {};
    if (props.width !== undefined) {
      dest.width = GetCSSValue(props.width);
    }
    // normal 场景下，需要设置 zindex 为auto 避免出现多个 dialog，normal 出现在最上层
    if (props.mode === 'normal') {
      dest.zIndex = 'auto';
    }
    const footer = props.footer ? <div className={`${prefixCls}__footer`}>{props.footer}</div> : null;

    const { header } = props;

    const body = <div className={`${prefixCls}__body`}>{props.body || props.children}</div>;

    const closer = closeBtn && (
      <span onClick={handleCloseBtnClick} className={`${prefixCls}__close`}>
        {closeBtn}
      </span>
    );
    const validWindow = typeof window === 'object';

    const screenHeight = validWindow ? window.innerHeight || document.documentElement.clientHeight : undefined;
    const screenWidth = validWindow ? window.innerWidth || document.documentElement.clientWidth : undefined;

    const style = { ...dest, ...props.style };
    let dialogOffset = { x: 0, y: 0 };
    // 拖拽代码实现部分
    const onDialogMove = (e: MouseEvent) => {
      const { style, offsetWidth, offsetHeight } = dialog.current;

      let diffX = e.clientX - dialogOffset.x;
      let diffY = e.clientY - dialogOffset.y;
      // 拖拽上左边界限制
      if (diffX < 0) diffX = 0;
      if (diffY < 0) diffY = 0;
      if (screenWidth - offsetWidth - diffX < 0) diffX = screenWidth - offsetWidth;
      if (screenHeight - offsetHeight - diffY < 0) diffY = screenHeight - offsetHeight;
      style.position = 'absolute';
      style.left = `${diffX}px`;
      style.top = `${diffY}px`;
    };

    const onDialogMoveEnd = () => {
      dialog.current.style.cursor = 'default';
      document.removeEventListener('mousemove', onDialogMove);
      document.removeEventListener('mouseup', onDialogMoveEnd);
    };

    const onDialogMoveStart = (e: React.MouseEvent<HTMLDivElement>) => {
      if (canDraggable) {
        const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = dialog.current;
        // 如果弹出框超出屏幕范围 不能进行拖拽
        if (offsetWidth > screenWidth || offsetHeight > screenHeight) return;
        dialog.current.style.cursor = 'move';
        // 计算鼠标
        const diffX = e.clientX - offsetLeft;
        const diffY = e.clientY - offsetTop;
        dialogOffset = {
          x: diffX,
          y: diffY,
        };

        document.addEventListener('mousemove', onDialogMove);
        document.addEventListener('mouseup', onDialogMoveEnd);
      }
    };
    // 顶部定位实现
    const positionStyle: any = {};
    if (props.top) {
      const topValue = GetCSSValue(props.top);
      positionStyle.paddingTop = topValue;
    }
    // 此处获取定位方式 top 优先级较高 存在时 默认使用 top 定位
    const positionClass = classnames(
      `${prefixCls}__position`,
      { [`${prefixCls}--top`]: !!props.top },
      `${props.placement && !props.top ? `${prefixCls}--${props.placement}` : ''}`,
    );
    const dialogElement = (
      <div className={isNormal ? '' : `${prefixCls}__wrap`}>
        <div className={isNormal ? '' : positionClass} style={positionStyle} onClick={onMaskClick} ref={dialogPosition}>
          <div
            ref={dialog}
            style={style}
            className={classnames(`${prefixCls}`, `${prefixCls}--default`)}
            onMouseDown={onDialogMoveStart}
          >
            {closer}
            {header}
            {body}
            {footer}
          </div>
        </div>
      </div>
    );

    return (
      <CSSTransition
        in={props.visible}
        appear
        mountOnEnter
        unmountOnExit={destroyOnClose}
        timeout={transitionTime}
        classNames={`${prefixCls}-zoom`}
        onEntered={props.onOpened}
        onExited={onAnimateLeave}
        nodeRef={dialog}
      >
        {dialogElement}
      </CSSTransition>
    );
  };

  const renderMask = () => {
    let maskElement;
    if (showOverlay) {
      maskElement = (
        <CSSTransition
          in={visible}
          appear
          timeout={transitionTime}
          classNames={`${prefixCls}-fade`}
          mountOnEnter
          unmountOnExit
          nodeRef={maskRef}
        >
          <div ref={maskRef} className={`${prefixCls}__mask`} />
        </CSSTransition>
      );
    }
    return maskElement;
  };

  const render = () => {
    const style: CSSProperties = {};
    if (visible) {
      style.display = 'block';
    }
    const wrapStyle = {
      ...style,
      zIndex,
    };

    const dialogBody = renderDialog();
    const wrapClass = classnames(
      props.className,
      `${prefixCls}__ctx`,
      !isNormal ? `${prefixCls}__ctx--fixed` : '',
      visible ? dialogOpenClass : '',
      isModal && showInAttachedElement ? `${prefixCls}__ctx--absolute` : '',
      props.mode === 'modeless' ? `${prefixCls}__ctx--modeless` : '',
    );
    // 如果不是 modal 模式 默认没有 mask 也就没有相关点击 mask 事件
    const dialog = (
      <div ref={wrap} className={wrapClass} style={wrapStyle} onKeyDown={handleKeyDown} tabIndex={0}>
        {mode === 'modal' && renderMask()}
        {dialogBody}
      </div>
    );

    let dom = null;
    if (visible || wrap.current) {
      // normal 模式 attach 无效
      if (attach === '' || isNormal) {
        dom = dialog;
      } else {
        dom = (
          <CSSTransition
            in={visible}
            appear
            timeout={transitionTime}
            mountOnEnter
            unmountOnExit={destroyOnClose}
            nodeRef={portalRef}
          >
            <Portal attach={attach} ref={portalRef}>
              {dialog}
            </Portal>
          </CSSTransition>
        );
      }
    }
    return dom;
  };

  return render();
});

RenderDialog.defaultProps = dialogDefaultProps;

export default RenderDialog;
