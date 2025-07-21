import * as React from 'react';
import * as ReactDOM from 'react-dom';
const { Component, createRef, createElement, forwardRef } = React;
import { createRoot } from 'react-dom/client';

// 检测 React 版本
const isReact18Plus = () => typeof createRoot !== 'undefined';

// 增强版本的缓存管理
const rootCache = new WeakMap<
  HTMLElement,
  {
    root: ReturnType<typeof createRoot>;
    lastElement?: React.ReactElement;
  }
>();

const createRenderer = (container: HTMLElement) => {
  if (isReact18Plus()) {
    let cached = rootCache.get(container);
    if (!cached) {
      cached = { root: createRoot(container) };
      rootCache.set(container, cached);
    }

    return {
      render: (element: React.ReactElement) => {
        // 可选：避免相同元素的重复渲染
        if (cached.lastElement !== element) {
          cached.root.render(element);
          cached.lastElement = element;
        }
      },
      unmount: () => {
        cached.root.unmount();
        rootCache.delete(container);
      },
    };
  }

  // React 17的实现
  return {
    render: (element: React.ReactElement) => {
      ReactDOM.render(element, container);
    },
    unmount: () => {
      ReactDOM.unmountComponentAtNode(container);
    },
  };
};

// 检查是否是React元素
const isReactElement = (obj: any): obj is React.ReactElement =>
  obj && typeof obj === 'object' && obj.$$typeof && obj.$$typeof.toString().includes('react');

// 检查是否是有效的React节点
const isValidReactNode = (node: any): node is React.ReactNode =>
  node !== null &&
  node !== undefined &&
  (typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean' ||
    isReactElement(node) ||
    Array.isArray(node));

type AnyProps = {
  [key: string]: any;
};

const hyphenateRE = /\B([A-Z])/g;

export function hyphenate(str: string): string {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
}

const styleObjectToString = (style: any) => {
  if (!style || typeof style !== 'object') return '';

  const unitlessKeys = new Set([
    'animationIterationCount',
    'boxFlex',
    'boxFlexGroup',
    'boxOrdinalGroup',
    'columnCount',
    'fillOpacity',
    'flex',
    'flexGrow',
    'flexShrink',
    'fontWeight',
    'lineClamp',
    'lineHeight',
    'opacity',
    'order',
    'orphans',
    'tabSize',
    'widows',
    'zIndex',
    'zoom',
  ]);

  return Object.entries(style)
    .filter(([, value]) => value != null && value !== '') // 过滤无效值
    .map(([key, value]) => {
      // 转换驼峰式为连字符格式
      const cssKey = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

      // 处理数值类型值
      let cssValue = value;
      if (typeof value === 'number' && value !== 0 && !unitlessKeys.has(key)) {
        cssValue = `${value}px`;
      }

      return `${cssKey}:${cssValue};`;
    })
    .join(' ');
};

const reactify = <T extends AnyProps = AnyProps>(
  WC: string,
): React.ForwardRefExoticComponent<Omit<T, 'ref'> & React.RefAttributes<HTMLElement | undefined>> => {
  class Reactify extends Component<AnyProps> {
    eventHandlers: [string, EventListener][];

    slotRenderers: Map<string, () => void>;

    ref: React.RefObject<HTMLElement>;

    constructor(props: AnyProps) {
      super(props);
      this.eventHandlers = [];
      this.slotRenderers = new Map();
      const { innerRef } = props;
      this.ref = innerRef || createRef();
    }

    setEvent(event: string, val: EventListener) {
      this.eventHandlers.push([event, val]);
      this.ref.current?.addEventListener(event, val);
    }

    // 处理slot相关的prop
    handleSlotProp(prop: string, val: any) {
      const webComponent = this.ref.current as any;
      if (!webComponent) return;

      // 检查是否需要更新（避免相同内容的重复渲染）
      const currentRenderer = this.slotRenderers.get(prop);
      if (currentRenderer && this.isSameReactElement(prop, val)) {
        return; // 相同内容，跳过更新
      }

      // 立即清理旧的DOM容器和React渲染器
      if (currentRenderer) {
        // 立即清理DOM容器
        this.clearSlotContainers(prop);
        // 立即清理React渲染器，但包装在try-catch中
        try {
          currentRenderer();
        } catch (error) {
          // 如果在React渲染过程中清理失败，使用异步清理
          Promise.resolve().then(() => {
            try {
              currentRenderer();
            } catch (e) {
              console.warn('Error in async cleanup:', e);
            }
          });
        }
        this.slotRenderers.delete(prop);
      }

      // 如果val是函数，为WebComponent提供一个函数，该函数返回渲染后的DOM
      if (typeof val === 'function') {
        const renderSlot = (params?: any) => {
          const reactNode = val(params);
          return this.renderReactNodeToSlot(reactNode, prop);
        };
        webComponent[prop] = renderSlot;
      }
      // 如果val是ReactNode，直接渲染到slot
      else if (isValidReactNode(val)) {
        // 先设置属性，让组件知道这个prop有值
        webComponent[prop] = true;

        // 立即更新组件并渲染，但在微任务中执行以避免阻塞
        Promise.resolve().then(() => {
          if (webComponent.update) {
            webComponent.update();
          }
          this.renderReactNodeToSlot(val, prop);
        });
      }
    }

    // 立即清理指定slot的所有容器
    private clearSlotContainers(slotName: string) {
      const webComponent = this.ref.current;
      if (!webComponent) return;

      // 查找并移除所有匹配的slot容器
      const containers = webComponent.querySelectorAll(`[slot="${slotName}"]`);
      containers.forEach((container: Element) => {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      });
    }

    // 缓存最后渲染的React元素，用于比较
    private lastRenderedElements = new Map<string, any>();

    // 检查是否是相同的React元素
    private isSameReactElement(prop: string, val: any): boolean {
      const lastElement = this.lastRenderedElements.get(prop);
      if (!lastElement || !isValidReactNode(val)) {
        return false;
      }

      // 简单比较：如果是相同的React元素引用，则认为相同
      if (lastElement === val) {
        return true;
      }

      // 对于React元素，比较type和key
      if (React.isValidElement(lastElement) && React.isValidElement(val)) {
        return lastElement.type === val.type && lastElement.key === val.key;
      }

      return false;
    }

    // 将React节点渲染到slot中
    renderReactNodeToSlot(reactNode: React.ReactNode, slotName: string) {
      const webComponent = this.ref.current;
      if (!webComponent) return;

      // 缓存当前渲染的元素
      this.lastRenderedElements.set(slotName, reactNode);

      // 直接创建容器并添加到Web Component中
      const container = document.createElement('div');
      container.style.display = 'contents'; // 不影响布局
      container.setAttribute('slot', slotName); // 设置slot属性，Web Components会自动处理

      // 将容器添加到Web Component中
      webComponent.appendChild(container);

      // 根据不同类型的reactNode创建不同的清理函数
      let cleanupFn: (() => void) | null = null;

      if (isValidReactNode(reactNode)) {
        if (React.isValidElement(reactNode)) {
          try {
            const renderer = createRenderer(container);
            renderer.render(reactNode);
            cleanupFn = () => {
              try {
                renderer.unmount();
              } catch (error) {
                console.warn('Error unmounting React renderer:', error);
              }
            };
          } catch (error) {
            console.warn('Error creating React renderer:', error);
          }
        } else if (typeof reactNode === 'string' || typeof reactNode === 'number') {
          container.textContent = String(reactNode);
          cleanupFn = () => {
            container.textContent = '';
          };
        } else if (Array.isArray(reactNode)) {
          try {
            const renderer = createRenderer(container);
            const wrapper = React.createElement(
              'div',
              { style: { display: 'contents' } },
              ...reactNode.filter(isValidReactNode),
            );
            renderer.render(wrapper);
            cleanupFn = () => {
              try {
                renderer.unmount();
              } catch (error) {
                console.warn('Error unmounting React renderer:', error);
              }
            };
          } catch (error) {
            console.warn('Error creating React renderer for array:', error);
          }
        }
      }

      // 保存cleanup函数
      this.slotRenderers.set(slotName, () => {
        // 清理缓存
        this.lastRenderedElements.delete(slotName);
        // 异步unmount避免竞态条件
        Promise.resolve().then(() => {
          if (cleanupFn) {
            cleanupFn();
          }
          if (container.parentNode) {
            container.parentNode.removeChild(container);
          }
        });
      });
    }

    update() {
      this.clearEventHandlers();
      if (!this.ref.current) return;

      Object.entries(this.props).forEach(([prop, val]) => {
        if (['innerRef', 'children'].includes(prop)) return;

        // event handler
        if (typeof val === 'function' && prop.match(/^on[A-Za-z]/)) {
          const eventName = prop.slice(2);
          const omiEventName = eventName[0].toLowerCase() + eventName.slice(1);
          this.setEvent(omiEventName, val as EventListener);
          return;
        }

        // render functions or slot props
        if (typeof val === 'function' && prop.match(/^render[A-Za-z]/)) {
          this.handleSlotProp(prop, val);
          return;
        }

        // 检查是否是slot prop（通过组件的slotProps静态属性或Slot后缀）
        if (isReactElement(val) && !prop.match(/^on[A-Za-z]/) && !prop.match(/^render[A-Za-z]/)) {
          const componentClass = this.ref.current?.constructor as any;
          const declaredSlots = componentClass?.slotProps || [];

          if (declaredSlots.includes(prop) || prop.endsWith('Slot')) {
            this.handleSlotProp(prop, val);
            return;
          }
        }

        // Complex object处理
        if (typeof val === 'object' && val !== null) {
          // style特殊处理
          if (prop === 'style') {
            this.ref.current?.setAttribute('style', styleObjectToString(val));
            return;
          }
          // 其他复杂对象直接设置为属性
          (this.ref.current as any)[prop] = val;

          return;
        }

        // 函数类型但不是事件处理器也不是render函数的，直接设置为属性
        if (typeof val === 'function') {
          (this.ref.current as any)[prop] = val;
          return;
        }

        // camel case to kebab-case for attributes
        if (prop.match(hyphenateRE)) {
          this.ref.current?.setAttribute(hyphenate(prop), val);
          this.ref.current?.removeAttribute(prop);
          return;
        }

        // default: set as property
        (this.ref.current as any)[prop] = val;
      });
    }

    componentDidUpdate() {
      this.update();
    }

    componentDidMount() {
      this.update();
    }

    componentWillUnmount() {
      this.clearEventHandlers();
      this.clearSlotRenderers();
    }

    clearEventHandlers() {
      this.eventHandlers.forEach(([event, handler]) => {
        this.ref.current?.removeEventListener(event, handler);
      });
      this.eventHandlers = [];
    }

    clearSlotRenderers() {
      this.slotRenderers.forEach((cleanup) => {
        cleanup();
      });
      this.slotRenderers.clear();
    }

    render() {
      const { children, className, innerRef, ...rest } = this.props;

      return createElement(WC, { class: className, ...rest, ref: this.ref }, children);
    }
  }

  return forwardRef<HTMLElement, AnyProps>((props, ref) =>
    createElement(Reactify, { ...props, innerRef: ref }),
  ) as React.ForwardRefExoticComponent<Omit<T, 'ref'> & React.RefAttributes<HTMLElement | undefined>>;
};

export default reactify;
