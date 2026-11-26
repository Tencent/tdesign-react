import type { ChatMessagesData } from '../chat-engine';

// Follow the composed tree: assigned slot content replaces fallback content, and unassigned
// light DOM is not rendered. The same queries also work without any shadow roots.
function children(root: Node): Node[] {
  if (root instanceof HTMLSlotElement) {
    const assigned = root.assignedNodes({ flatten: true });
    if (assigned.length) return assigned;
  }
  if (root instanceof Element && root.shadowRoot) return Array.from(root.shadowRoot.childNodes);
  return Array.from(root.childNodes);
}

export function queryAll<T extends Element = HTMLElement>(root: ParentNode, selector: string): T[] {
  const matches: T[] = [];
  children(root).forEach((node) => {
    if (!(node instanceof Element)) return;
    if (node.matches(selector)) matches.push(node as T);
    matches.push(...queryAll<T>(node, selector));
  });
  return matches;
}

export function get<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const matches = queryAll<T>(root, selector);
  if (matches.length !== 1) throw new Error(`Expected one ${selector}, found ${matches.length}`);
  return matches[0];
}

export function text(root: Node): string {
  if (root.nodeType === Node.TEXT_NODE) return root.textContent || '';
  if (root instanceof Element && root.matches('style, script')) return '';
  return children(root).map(text).join('');
}

export function mountedRef<T>(ref: { current: T | null | undefined }): T {
  if (!ref.current) throw new Error('Expected a mounted component ref');
  return ref.current;
}

export const history: ChatMessagesData[] = [
  { id: 'user-1', role: 'user', status: 'complete', content: [{ type: 'text', data: '用户问题' }] },
  { id: 'assistant-1', role: 'assistant', status: 'complete', content: [{ type: 'text', data: '助手回答' }] },
];
