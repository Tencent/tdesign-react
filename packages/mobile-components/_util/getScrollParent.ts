type ScrollElement = HTMLElement | Window;

const overflowScrollReg = /scroll|auto|overlay/i;

export default function getScrollParent(
  el: Element | null | undefined,
  root: ScrollElement | null | undefined = window,
): Window | Element | null | undefined {
  let node = el;

  while (node && node !== root && node.nodeType === 1) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode as Element;
  }

  return root;
}
