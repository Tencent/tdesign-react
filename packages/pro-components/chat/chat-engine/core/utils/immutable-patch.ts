/**
 * Immutable JSON Patch with Structural Sharing
 * 
 * 核心特性：
 * - 只重建被修改路径上的节点
 * - 未修改的节点保持原引用（实现结构共享）
 * - 支持标准 JSON Patch 操作：add, remove, replace, move, copy
 * - 支持扩展操作：append（字符串追加）
 * 
 * 性能优势：
 * - 配合 React.memo / useSyncExternalStore 使用时，未变化的组件不会重渲染
 * - 避免深拷贝带来的性能开销
 */

export type Operation = 
  | { op: 'add'; path: string; value: any }
  | { op: 'remove'; path: string }
  | { op: 'replace'; path: string; value: any }
  | { op: 'move'; path: string; from: string }
  | { op: 'copy'; path: string; from: string }
  | { op: 'append'; path: string; value: string };

/**
 * 解析 JSON Pointer 路径
 * "/elements/deep-progress/props/percentage" => ["elements", "deep-progress", "props", "percentage"]
 */
function parsePath(path: string): string[] {
  if (path === '' || path === '/') return [];
  return path.split('/').slice(1).map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'));
}

/**
 * 获取嵌套值
 */
function getByPath(obj: any, path: string[]): any {
  let current = obj;
  for (const key of path) {
    if (current == null) return undefined;
    current = current[key];
  }
  return current;
}

/**
 * 不可变地设置嵌套值（结构共享）
 * 只重建路径上的节点，其他节点保持原引用
 */
function setByPath<T>(obj: T, path: string[], value: any): T {
  if (path.length === 0) {
    return value;
  }
  
  const [head, ...tail] = path;
  const current = obj as any;
  
  // 判断当前层是数组还是对象
  const isArray = Array.isArray(current);
  const index = isArray ? (head === '-' ? current.length : parseInt(head, 10)) : head;
  
  if (tail.length === 0) {
    // 到达目标位置，设置值
    if (isArray) {
      const newArr = [...current];
      newArr[index as number] = value;
      return newArr as unknown as T;
    } else {
      return { ...current, [head]: value };
    }
  }
  
  // 递归处理子路径
  const child = current[head];
  const newChild = setByPath(child, tail, value);
  
  if (isArray) {
    const newArr = [...current];
    newArr[index as number] = newChild;
    return newArr as unknown as T;
  } else {
    return { ...current, [head]: newChild };
  }
}

/**
 * 不可变地删除嵌套值（结构共享）
 */
function removeByPath<T>(obj: T, path: string[]): T {
  if (path.length === 0) {
    return undefined as unknown as T;
  }
  
  const [head, ...tail] = path;
  const current = obj as any;
  const isArray = Array.isArray(current);
  
  if (tail.length === 0) {
    // 到达目标位置，删除值
    if (isArray) {
      const index = parseInt(head, 10);
      const newArr = [...current];
      newArr.splice(index, 1);
      return newArr as unknown as T;
    } else {
      const { [head]: _, ...rest } = current;
      return rest as T;
    }
  }
  
  // 递归处理子路径
  const child = current[head];
  const newChild = removeByPath(child, tail);
  
  if (isArray) {
    const index = parseInt(head, 10);
    const newArr = [...current];
    newArr[index] = newChild;
    return newArr as unknown as T;
  } else {
    return { ...current, [head]: newChild };
  }
}

/**
 * 应用单个操作（结构共享）
 */
function applyOperationImmutable<T>(document: T, operation: Operation): T {
  const path = parsePath(operation.path);
  
  switch (operation.op) {
    case 'add':
    case 'replace':
      return setByPath(document, path, operation.value);
      
    case 'remove':
      return removeByPath(document, path);
      
    case 'append': {
      const existing = getByPath(document, path);
      const newValue = existing == null ? operation.value : String(existing) + operation.value;
      return setByPath(document, path, newValue);
    }
    
    case 'move': {
      const fromPath = parsePath(operation.from);
      const value = getByPath(document, fromPath);
      const afterRemove = removeByPath(document, fromPath);
      return setByPath(afterRemove, path, value);
    }
    
    case 'copy': {
      const fromPath = parsePath(operation.from);
      const value = getByPath(document, fromPath);
      // 深拷贝 copy 的值，避免共享引用
      return setByPath(document, path, JSON.parse(JSON.stringify(value)));
    }
    
    default:
      return document;
  }
}

/**
 * 应用 JSON Patch 数组（结构共享版本）
 * 
 * @param document 原始文档
 * @param patch 操作数组
 * @returns 新文档（未修改的节点保持原引用）
 * 
 * @example
 * const tree = { elements: { a: { props: { x: 1 } }, b: { props: { y: 2 } } } };
 * const newTree = applyPatchImmutable(tree, [
 *   { op: 'replace', path: '/elements/a/props/x', value: 10 }
 * ]);
 * 
 * // 结构共享验证：
 * tree.elements.b === newTree.elements.b  // true - b 节点未变，保持原引用
 * tree.elements.a === newTree.elements.a  // false - a 节点被修改，是新引用
 */
export function applyPatchImmutable<T>(document: T, patch: Operation[]): T {
  return patch.reduce((doc, op) => applyOperationImmutable(doc, op), document);
}

/**
 * 兼容原有 applyPatch 的返回格式
 */
export function applyPatch<T>(document: T, patch: Operation[]): { newDocument: T } {
  return {
    newDocument: applyPatchImmutable(document, patch)
  };
}
