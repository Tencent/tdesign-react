/* eslint-disable max-classes-per-file, @typescript-eslint/no-empty-function --
 * 本文件是 jsdom 能力 shim：多个桩类并存，且桩方法按设计为空实现 */
/**
 * chat 迁移测试环境补齐（仅补齐 jsdom 缺失的浏览器能力，不改动被测组件行为）
 *
 * 背景：chat 组件当前由 `reactify` 包装 Web Components（omi）实现，omi 依赖
 * Constructable Stylesheets / adoptedStyleSheets，而 jsdom 20 未提供。
 * 迁移到纯 React 后这些 shim 不再被需要，可整体删除本文件。
 *
 * 这里只做「能力补齐」，全部为幂等写入：宿主环境已支持时不覆盖。
 */

type CssRule = { cssText: string };

class ConstructableStyleSheet {
  cssRules: CssRule[] = [];

  media = { mediaText: '' };

  replaceSync(cssText: string) {
    this.cssRules = [{ cssText }];
  }

  replace(cssText: string) {
    this.cssRules = [{ cssText }];
    return Promise.resolve(this);
  }

  insertRule(rule: string) {
    this.cssRules.push({ cssText: rule });
    return this.cssRules.length - 1;
  }

  deleteRule() {}
}

const g = globalThis as any;

// jsdom 的 CSSStyleSheet 不可构造，且 replaceSync 依赖 ownerNode，omi 会拿到 null
if (typeof g.CSSStyleSheet === 'undefined' || typeof g.CSSStyleSheet.prototype?.replaceSync !== 'function') {
  g.CSSStyleSheet = ConstructableStyleSheet;
}

[g.Document?.prototype, g.ShadowRoot?.prototype, g.Element?.prototype].forEach((proto) => {
  if (!proto) return;
  if (!Object.getOwnPropertyDescriptor(proto, 'adoptedStyleSheets')) {
    Object.defineProperty(proto, 'adoptedStyleSheets', {
      value: [],
      writable: true,
      configurable: true,
    });
  }
});

class NoopObserver {
  observe() {}

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

if (typeof g.ResizeObserver === 'undefined') {
  g.ResizeObserver = NoopObserver;
}

if (typeof g.IntersectionObserver === 'undefined') {
  g.IntersectionObserver = NoopObserver;
}

// jsdom 未实现滚动 API，聊天列表滚动会抛错并中断消息发送链路
[g.Element?.prototype, g.HTMLElement?.prototype].forEach((proto) => {
  if (!proto) return;
  if (typeof proto.scrollTo !== 'function') {
    proto.scrollTo = function scrollTo() {};
  }
  if (typeof proto.scrollIntoView !== 'function') {
    proto.scrollIntoView = function scrollIntoView() {};
  }
});
