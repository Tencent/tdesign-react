import { useEffect } from 'react';

import type { MutableRefObject } from 'react';

// Scope the existing injectCSS API to this React component's DOM subtree.
// Callers use normal selectors; :scope addresses the component root.
export const useInjectedCSS = (root: MutableRefObject<HTMLElement | null>, css?: string) => {
  useEffect(() => {
    const element = root.current;
    if (!element || !css) return undefined;
    const key = `td-chat-css-${Math.random().toString(36).slice(2)}`;
    element.classList.add(key);
    const parser = document.createElement('style');
    parser.media = 'not all';
    parser.textContent = css;
    document.head.appendChild(parser);
    const scope = `.${key}`;
    const rules = (list: CSSRuleList): string =>
      Array.from(list)
        .map((rule) => {
          if (rule instanceof CSSStyleRule) {
            const selectors = rule.selectorText.includes(':scope')
              ? rule.selectorText.replace(/:scope/g, scope)
              : `${scope} :is(${rule.selectorText})`;
            return `${selectors}{${rule.style.cssText}}`;
          }
          if (rule instanceof CSSMediaRule) return `@media ${rule.conditionText}{${rules(rule.cssRules)}}`;
          if (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule)
            return `@supports ${rule.conditionText}{${rules(rule.cssRules)}}`;
          return '';
        })
        .join('\n');
    const style = document.createElement('style');
    style.textContent = parser.sheet ? rules(parser.sheet.cssRules) : '';
    parser.remove();
    document.head.appendChild(style);
    return () => {
      style.remove();
      element.classList.remove(key);
    };
  }, [root, css]);
};
