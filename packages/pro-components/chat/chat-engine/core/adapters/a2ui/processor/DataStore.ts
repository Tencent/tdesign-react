/**
 * A2UI DataStore
 * 管理 Surface 的数据模型，支持 JSON Pointer 路径访问
 * 参考 @a2ui/core DataStore 实现
 */

/**
 * 解析 JSON Pointer 路径为段数组
 * @example "/user/name" -> ["user", "name"]
 */
function parsePath(path: string): string[] {
  if (!path || path === '/') return [];
  // 移除开头的 /，然后按 / 分割
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return normalized.split('/').filter(Boolean);
}

/**
 * A2UI 数据存储
 * 支持 JSON Pointer 风格的路径访问
 */
export class DataStore {
  private data: Record<string, unknown> = {};

  /**
   * 获取指定路径的值
   * @param path JSON Pointer 路径 (如 "/user/name")
   */
  get(path: string): unknown {
    const segments = parsePath(path);
    
    if (segments.length === 0) {
      return this.data;
    }

    let current: unknown = this.data;
    for (const segment of segments) {
      if (current === null || current === undefined) {
        return undefined;
      }
      if (typeof current !== 'object') {
        return undefined;
      }
      current = (current as Record<string, unknown>)[segment];
    }

    return current;
  }

  /**
   * 设置指定路径的值
   * @param path JSON Pointer 路径
   * @param value 要设置的值
   */
  set(path: string, value: unknown): void {
    const segments = parsePath(path);

    if (segments.length === 0) {
      // 设置整个数据对象
      if (typeof value === 'object' && value !== null) {
        this.data = { ...value as Record<string, unknown> };
      }
      return;
    }

    // 创建新的数据对象（不可变更新）
    this.data = this.setDeep(this.data, segments, value);
  }

  /**
   * 深度设置值（不可变方式）
   */
  private setDeep(
    obj: Record<string, unknown>,
    segments: string[],
    value: unknown
  ): Record<string, unknown> {
    if (segments.length === 0) {
      return obj;
    }

    const [head, ...tail] = segments;
    const newObj = { ...obj };

    if (tail.length === 0) {
      // 最后一段，直接设置
      newObj[head] = value;
    } else {
      // 递归设置
      const existing = obj[head];
      const nested = typeof existing === 'object' && existing !== null
        ? { ...existing as Record<string, unknown> }
        : {};
      newObj[head] = this.setDeep(nested, tail, value);
    }

    return newObj;
  }

  /**
   * 删除指定路径的值
   * @param path JSON Pointer 路径
   */
  remove(path: string): void {
    const segments = parsePath(path);

    if (segments.length === 0) {
      this.data = {};
      return;
    }

    this.data = this.removeDeep(this.data, segments);
  }

  /**
   * 深度删除值（不可变方式）
   */
  private removeDeep(
    obj: Record<string, unknown>,
    segments: string[]
  ): Record<string, unknown> {
    if (segments.length === 0) {
      return obj;
    }

    const [head, ...tail] = segments;
    const newObj = { ...obj };

    if (tail.length === 0) {
      // 最后一段，删除该键
      delete newObj[head];
    } else {
      // 递归删除
      const existing = obj[head];
      if (typeof existing === 'object' && existing !== null) {
        newObj[head] = this.removeDeep(existing as Record<string, unknown>, tail);
      }
    }

    return newObj;
  }

  /**
   * 合并数据（增量更新，保留用户已修改的字段）
   * @param path 路径
   * @param value 要合并的值
   */
  merge(path: string, value: unknown): void {
    const existing = this.get(path);
    
    if (
      typeof existing === 'object' && existing !== null &&
      typeof value === 'object' && value !== null &&
      !Array.isArray(existing) && !Array.isArray(value)
    ) {
      // 两者都是对象，进行深度合并
      const merged = this.deepMerge(
        existing as Record<string, unknown>,
        value as Record<string, unknown>
      );
      this.set(path, merged);
    } else if (existing === undefined) {
      // 不存在则直接设置
      this.set(path, value);
    }
    // 如果已存在且不是对象，保留原值
  }

  /**
   * 深度合并对象
   */
  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>
  ): Record<string, unknown> {
    const result = { ...target };

    for (const [key, value] of Object.entries(source)) {
      const existing = target[key];

      if (existing === undefined) {
        // 新字段，直接设置
        result[key] = value;
      } else if (
        typeof existing === 'object' && existing !== null &&
        typeof value === 'object' && value !== null &&
        !Array.isArray(existing) && !Array.isArray(value)
      ) {
        // 递归合并对象
        result[key] = this.deepMerge(
          existing as Record<string, unknown>,
          value as Record<string, unknown>
        );
      }
      // 已存在且不是对象，保留原值
    }

    return result;
  }

  /**
   * 获取完整数据快照
   */
  getSnapshot(): Record<string, unknown> {
    return this.data;
  }

  /**
   * 清空数据
   */
  clear(): void {
    this.data = {};
  }

  /**
   * 检查路径是否存在
   */
  has(path: string): boolean {
    return this.get(path) !== undefined;
  }
}

/**
 * 创建 DataStore 实例
 */
export function createDataStore(initialData?: Record<string, unknown>): DataStore {
  const store = new DataStore();
  if (initialData) {
    store.set('/', initialData);
  }
  return store;
}

export default DataStore;
