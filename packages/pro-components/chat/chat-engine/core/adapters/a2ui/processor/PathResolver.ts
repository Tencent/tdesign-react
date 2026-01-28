/**
 * A2UI PathResolver
 * 处理相对路径和绝对路径的解析
 * 参考 @a2ui/core PathResolver 实现
 */

/**
 * 路径解析器
 * 处理 A2UI 中的相对路径和绝对路径
 */
export class PathResolver {
  /**
   * 解析路径
   * @param path 要解析的路径（可以是相对或绝对）
   * @param contextPath 当前数据上下文路径
   * @returns 解析后的绝对路径
   */
  resolve(path: string, contextPath: string = ''): string {
    // 绝对路径直接返回
    if (path.startsWith('/')) {
      return this.normalize(path);
    }

    // 相对路径需要结合 contextPath
    if (!contextPath || contextPath === '/') {
      return this.normalize(`/${path}`);
    }

    // 拼接并规范化
    const combined = `${contextPath}/${path}`;
    return this.normalize(combined);
  }

  /**
   * 规范化路径
   * - 处理多余的斜杠
   * - 处理 . 和 ..
   */
  normalize(path: string): string {
    // 确保以 / 开头
    let normalized = path.startsWith('/') ? path : `/${path}`;

    // 处理多余的斜杠
    normalized = normalized.replace(/\/+/g, '/');

    // 处理 . 和 ..
    const segments = normalized.split('/').filter(Boolean);
    const result: string[] = [];

    for (const segment of segments) {
      if (segment === '.') {
        continue;
      }
      if (segment === '..') {
        result.pop();
      } else {
        result.push(segment);
      }
    }

    return `/${result.join('/')}`;
  }

  /**
   * 获取父路径
   * @example "/user/profile/name" -> "/user/profile"
   */
  getParent(path: string): string {
    const normalized = this.normalize(path);
    const lastSlash = normalized.lastIndexOf('/');
    
    if (lastSlash <= 0) {
      return '/';
    }

    return normalized.slice(0, lastSlash);
  }

  /**
   * 获取路径的最后一段
   * @example "/user/profile/name" -> "name"
   */
  getBasename(path: string): string {
    const normalized = this.normalize(path);
    const lastSlash = normalized.lastIndexOf('/');
    
    return normalized.slice(lastSlash + 1);
  }

  /**
   * 连接路径
   */
  join(...paths: string[]): string {
    if (paths.length === 0) return '/';
    
    return this.normalize(paths.join('/'));
  }

  /**
   * 检查路径是否为另一个路径的子路径
   */
  isChildOf(childPath: string, parentPath: string): boolean {
    const normalizedChild = this.normalize(childPath);
    const normalizedParent = this.normalize(parentPath);

    if (normalizedParent === '/') {
      return true;
    }

    return normalizedChild.startsWith(normalizedParent + '/');
  }
}

/**
 * 默认路径解析器实例
 */
export const pathResolver = new PathResolver();

export default PathResolver;
