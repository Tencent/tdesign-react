const IGNORE_TAGS = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT']);
const MEANINGFUL_TAGS = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IMG', 'SVG', 'VIDEO', 'CANVAS', 'IFRAME']);

function isHidden(el: HTMLElement) {
  if (el.hidden || el.style.display === 'none') return true;
  return typeof getComputedStyle === 'function' && getComputedStyle(el).display === 'none';
}

function isLayoutMeasurable(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.width > 0 || rect.height > 0;
}

function isNestedFormItem(item: HTMLElement, formElement: HTMLElement, formItemSelector: string) {
  const parentFormItem = item.parentElement?.closest<HTMLElement>(formItemSelector);
  return Boolean(parentFormItem && formElement.contains(parentFormItem));
}

function sortByDocumentOrder(items: HTMLElement[]) {
  return items.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
}

function isMeaningfulNode(node: Node, registeredItems: Set<HTMLElement>, formItemClassName: string): boolean {
  if (node.nodeType === Node.COMMENT_NODE) return false;
  if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
  if (node.nodeType !== Node.ELEMENT_NODE) return false;

  const el = node as HTMLElement;
  if (IGNORE_TAGS.has(el.tagName) || isHidden(el)) return false;

  // 卸载过程中节点可能尚未移出 DOM，仅已注册项计入后续内容
  if (el.classList.contains(formItemClassName)) return registeredItems.has(el);
  if (MEANINGFUL_TAGS.has(el.tagName)) return true;

  if (Array.from(el.childNodes).some((child) => isMeaningfulNode(child, registeredItems, formItemClassName))) {
    return true;
  }

  // 无子内容但具备盒尺寸的占位节点计入后续内容
  return isLayoutMeasurable(el) && !el.querySelector(`.${formItemClassName}`);
}

function hasMeaningfulContentAfter(
  formElement: HTMLElement,
  item: HTMLElement,
  registeredItems: Set<HTMLElement>,
  formItemClassName: string,
) {
  let node: Node | null = item;
  while (node && node !== formElement) {
    let sibling = node.nextSibling;
    while (sibling) {
      if (isMeaningfulNode(sibling, registeredItems, formItemClassName)) return true;
      sibling = sibling.nextSibling;
    }
    node = node.parentNode;
  }
  return false;
}

function getLastRowItems(items: HTMLElement[]) {
  if (!items.length) return [];
  const last = items[items.length - 1];
  // jsdom 无法提供有效 top 时，仅保留文档序最后一项
  if (!isLayoutMeasurable(last)) return [last];

  const lastTop = last.getBoundingClientRect().top;
  return items.filter((item) => Math.abs(item.getBoundingClientRect().top - lastTop) <= 1);
}

function getInnerGroupLastItems(formElement: HTMLElement, formItems: HTMLElement[]) {
  const groupedByParent = new Map<HTMLElement, HTMLElement[]>();
  formItems.forEach((item) => {
    const parent = item.parentElement;
    if (!parent || parent === formElement) return;
    const siblings = groupedByParent.get(parent);
    if (siblings) siblings.push(item);
    else groupedByParent.set(parent, [item]);
  });

  const lastItems: HTMLElement[] = [];
  groupedByParent.forEach((siblings) => {
    // 单项包裹不构成分组
    if (siblings.length < 2) return;
    lastItems.push(siblings[siblings.length - 1]);
  });
  return lastItems;
}

/**
 * 返回当前表单中应当去掉底部间距的末位 FormItem
 */
export function resolveLastFormItems(
  formElement: HTMLElement,
  registeredItems: Iterable<HTMLElement>,
  formItemClassName: string,
) {
  const formItemSelector = `.${formItemClassName}`;
  const registeredSet = registeredItems instanceof Set ? registeredItems : new Set(registeredItems);
  // 只收集表单内可见、且不嵌套在其他 FormItem 中的项
  const formItems = sortByDocumentOrder(
    [...registeredSet].filter((item) => {
      if (!formElement.contains(item) || isHidden(item)) return false;
      return !isNestedFormItem(item, formElement, formItemSelector);
    }),
  );

  if (!formItems.length) return [];

  // Card 等非 Form 容器内有多项时，清除该组最后一项的底部间距，避免与容器内边距叠加
  const lastItems = new Set(getInnerGroupLastItems(formElement, formItems));
  const lastFormItem = formItems[formItems.length - 1];
  // 后方无按钮等有效内容时，再标记表单末行
  if (!hasMeaningfulContentAfter(formElement, lastFormItem, registeredSet, formItemClassName)) {
    getLastRowItems(formItems).forEach((item) => lastItems.add(item));
  }
  return [...lastItems];
}
