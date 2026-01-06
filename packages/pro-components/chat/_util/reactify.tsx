import React, { Component, createRef, createElement, forwardRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

type AnyProps = {
  [key: string]: any;
};

const hyphenateRE = /\B([A-Z])/g;
const hyphenate = (string: string) => string.replace(hyphenateRE, '-$1').toLowerCase();

const styleObjectToString = (style: any) => {
  if (!style) return '';
  if (typeof style === 'string') return style;
  return Object.keys(style)
    .reduce((acc: string[], key) => {
      const value = style[key];
      const cssKey = key.replace(hyphenateRE, '-$1').toLowerCase();
      return acc.concat(`${cssKey}:${value}`);
    }, [])
    .join(';');
};

const isReactElement = (node: any): boolean => {
  return React.isValidElement(node);
};

const isValidReactNode = (node: any): node is React.ReactNode =>
  node !== null &&
  node !== undefined &&
  (typeof node === 'string' ||
    typeof node === 'number' ||
    typeof node === 'boolean' ||
    isReactElement(node) ||
    Array.isArray(node));

const isReact19Plus = () => {
  const version = React.version.split('.')[0];
  return parseInt(version, 10) >= 19;
};

const reactify = <T extends AnyProps = AnyProps>(
  WC: string,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<HTMLElement>> => {
  class Reactify extends Component<T> {
    eventHandlers: [string, EventListener][];

    // 使用 Map 缓存每个 slot 的 React Root 实例
    slotInstances: Map<
      string,
      {
        root: Root;
        container: HTMLElement;
      }
    >;

    ref: React.RefObject<HTMLElement>;

    constructor(props: T) {
      super(props);
      this.eventHandlers = [];
      this.slotInstances = new Map();
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

      // 如果val是函数，为WebComponent提供一个函数，该函数返回渲染后的DOM
      if (typeof val === 'function') {
        const renderSlot = (params?: any) => {
          const reactNode = val(params);
          // 函数式 slot 每次调用可能产生新内容，这里简化处理，
          // 实际场景中可能需要更复杂的挂载逻辑，或者 WebComponent 内部处理了 DOM 挂载
          // 这里保持原逻辑或根据 WebComponent 行为调整
          return this.renderReactNodeToSlot(reactNode, prop);
        };
        webComponent[prop] = renderSlot;
      }
      // 如果val是ReactNode，直接渲染到slot
      else if (isValidReactNode(val)) {
        // 先设置属性，让组件知道这个prop有值
        webComponent[prop] = true;

        // 使用微任务延迟渲染，确保在当前渲染周期完成后执行
        Promise.resolve().then(() => {
          if (webComponent.update) {
            webComponent.update();
          }
          this.renderReactNodeToSlot(val, prop);
        });
      } else {
        this.cleanupSlotRenderer(prop);
      }
    }

    // 清理slot渲染器的统一方法
    private cleanupSlotRenderer(slotName: string) {
      const instance = this.slotInstances.get(slotName);
      if (instance) {
        // React 18 使用 root.unmount()
        setTimeout(() => {
          instance.root.unmount();
        }, 0);

        if (instance.container.parentNode === this.ref.current) {
          this.ref.current?.removeChild(instance.container);
        }
        this.slotInstances.delete(slotName);
      }
    }

    // 将React节点渲染到slot中
    renderReactNodeToSlot(reactNode: React.ReactNode, slotName: string) {
      const webComponent = this.ref.current;
      if (!webComponent) return;

      let instance = this.slotInstances.get(slotName);

      if (!instance) {
        // 检查是否已经有相同的slot容器存在
        let container = webComponent.querySelector(`[slot="${slotName}"]`) as HTMLElement;
        if (!container) {
          container = document.createElement('div');
          container.style.display = 'contents';
          container.setAttribute('slot', slotName);
          webComponent.appendChild(container);
        }

        // 创建 React Root
        const root = createRoot(container);

        instance = {
          container,
          root,
        };
        this.slotInstances.set(slotName, instance);
      }

      // 复用 root 进行增量更新，React 会自动处理 Diff，避免 DOM 销毁重建
      instance.root.render(reactNode);
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

        // 检查是否是slot prop
        if (isReactElement(val) && !prop.match(/^on[A-Za-z]/)) {
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
        if (!isReact19Plus()) {
          (this.ref.current as any)[prop] = val;
        }
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
      this.clearSlotInstances();
    }

    clearEventHandlers() {
      this.eventHandlers.forEach(([event, handler]) => {
        this.ref.current?.removeEventListener(event, handler);
      });
      this.eventHandlers = [];
    }

    clearSlotInstances() {
      this.slotInstances.forEach((instance) => {
        // 卸载时清理
        setTimeout(() => {
          instance.root.unmount();
        }, 0);
      });
      this.slotInstances.clear();
    }

    render() {
      const { children, className, ...rest } = this.props;
      return createElement(WC, { class: className, ...rest, ref: this.ref }, children);
    }
  }

  return forwardRef<HTMLElement, T>((props, ref) =>
    createElement(Reactify, { ...props, innerRef: ref } as T & { innerRef: React.ForwardedRef<HTMLElement> }),
  );
};

export default reactify;
