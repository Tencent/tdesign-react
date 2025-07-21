// strategy-registry.ts
export type MergeStrategy<T extends AIMessageContent> = (chunk: T, existing?: T) => T;

export class StrategyRegistry {
  private strategies = new Map<string, MergeStrategy<any>>();

  register<T extends AIMessageContent>(type: T['type'], strategy: MergeStrategy<T>) {
    this.strategies.set(type, strategy);
  }

  get<T extends AIMessageContent>(type: T['type']): MergeStrategy<T> | null {
    return this.strategies.get(type) || null;
  }

  has(type: string): boolean {
    return this.strategies.has(type);
  }
}

// 单例实例
export const strategyRegistry = new StrategyRegistry();

// 文本类内容合并策略（text/markdown）
const textMergeStrategy: MergeStrategy<TextContent | MarkdownContent> = (chunk, existing) => ({
  ...(existing || chunk),
  data: (existing?.data || '') + (chunk.data || ''),
  status: chunk.status || 'streaming',
});

// 搜索类内容合并策略
const searchMergeStrategy: MergeStrategy<SearchContent> = (chunk, existing) => ({
  ...(existing || {}),
  ...chunk,
  data: {
    ...(existing?.data || {}),
    ...chunk.data,
    references: [...(existing?.data?.references || []), ...(chunk.data?.references || [])],
  },
});

// 注册默认策略
strategyRegistry.register('text', textMergeStrategy);
strategyRegistry.register('markdown', textMergeStrategy);
strategyRegistry.register('search', searchMergeStrategy);
strategyRegistry.register('thinking', textMergeStrategy);
