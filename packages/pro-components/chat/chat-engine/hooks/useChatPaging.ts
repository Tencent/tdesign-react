import { useCallback, useRef, useState } from 'react';
import type { ChatMessagesData } from 'tdesign-web-components/lib/chat-engine';

export interface UseChatPagingConfig {
  /**
   * 消息分页数量
   * 传入后 useChat 内部管理分页逻辑，输出的messages将为分页后的消息
   */
  pageSize?: number;
}

export interface ChatListPagingProps {
  /** 是否还有更多历史消息 */
  hasMore: boolean;
  /** 加载更多历史消息回调 */
  onLoadMore: () => void;
  /** 滚动事件回调（滚动到底部时重置分页窗口） */
  onScroll: (e: Event) => void;
}

export interface UseChatPagingReturn {
  /** 当前可见的消息列表（分页模式下为切片，非分页模式下为全量） */
  messages: ChatMessagesData[];
  /**
   * 同步全量消息到可见消息（分页模式下自动切片）
   * useChat 在 chatEngine 消息变化时调用此方法即可
   */
  syncMessages: (allMessages: ChatMessagesData[]) => void;
  /**
   * 初始化分页状态并同步消息
   * @returns 初始可见消息切片（供 useChat 获取初始 status 等）
   */
  initPaging: (msgs: ChatMessagesData[]) => ChatMessagesData[];
  /**
   * 传入 ChatList 的分页相关 props，直接展开即可：{...chatListProps}
   * 非分页模式下为 undefined
   */
  chatListProps?: ChatListPagingProps;
}

/**
 * 消息分页逻辑 Hook
 *
 * 核心职责：
 * - 管理分页索引（loadedStartIndex）和可见窗口大小（visibleCount）
 * - 管理可见消息列表（messages state）
 * - 返回 chatListProps 供外部传入 ChatList，由 reactify 自动处理 props 和事件映射
 * - 滚动到底部时自动重置分页窗口，释放多余 DOM 节点
 */
export const useChatPaging = (
  chatEngineRef: React.MutableRefObject<{ messages: ChatMessagesData[] }>,
  { pageSize }: UseChatPagingConfig,
): UseChatPagingReturn => {
  const [messages, setMessages] = useState<ChatMessagesData[]>([]);
  const [hasMore, setHasMore] = useState(false);

  /**
   * 分页相关 ref（使用 ref 避免闭包陷阱和不必要的重渲染）
   * - loadedStartIndexRef: 当前可见消息在全量消息中的起始索引
   * - pagingInitializedRef: 分页是否已初始化
   * - visibleCountRef: 用户当前可见的消息窗口大小（初始为 pageSize，loadMore 时增长）
   */
  const loadedStartIndexRef = useRef<number>(0);
  const pagingInitializedRef = useRef<boolean>(false);
  const visibleCountRef = useRef<number>(pageSize || 0);
  /** 防止重置后 scroll 事件再次触发重置，导致闪烁循环 */
  const isResettingRef = useRef(false);

  /**
   * 公共分页切片逻辑：初始化分页索引并返回可见消息切片
   * 供 initPaging 和 syncMessages 共用，避免重复代码
   */
  const applyPagingSlice = useCallback(
    (msgs: ChatMessagesData[]): ChatMessagesData[] => {
      const totalCount = msgs.length;
      if (pageSize && totalCount > pageSize) {
        pagingInitializedRef.current = true;
        visibleCountRef.current = pageSize;
        const startIndex = totalCount - pageSize;
        loadedStartIndexRef.current = startIndex;
        setHasMore(true);
        const visible = msgs.slice(startIndex);
        setMessages(visible);
        return visible;
      }

      pagingInitializedRef.current = false;
      visibleCountRef.current = pageSize || 0;
      loadedStartIndexRef.current = 0;
      setHasMore(false);
      setMessages(msgs);
      return msgs;
    },
    [pageSize],
  );

  /**
   * 对全量消息做分页切片并更新 messages state
   * - 非分页模式：直接展示全量
   * - 分页模式（未初始化）：检测从无到有，自动初始化分页索引
   * - 分页模式（已初始化）：动态推进 loadedStartIndex，保持可见窗口大小
   */
  const syncMessages = useCallback(
    (allMessages: ChatMessagesData[]) => {
      if (!pageSize) {
        setMessages(allMessages);
        return;
      }

      const totalCount = allMessages.length;

      // 检测从无到有的变化，自动初始化分页
      if (!pagingInitializedRef.current && totalCount > pageSize) {
        applyPagingSlice(allMessages);
        return;
      }

      // 分页已初始化：动态调整 loadedStartIndex
      if (pagingInitializedRef.current) {
        // 消息数量不足一页时（如切换会话），重置分页状态
        if (totalCount <= pageSize) {
          applyPagingSlice(allMessages);
          return;
        }

        const idealStartIndex = totalCount - visibleCountRef.current;
        const newStartIndex = Math.max(idealStartIndex, 0);

        if (newStartIndex > loadedStartIndexRef.current) {
          loadedStartIndexRef.current = newStartIndex;
        }

        setHasMore(loadedStartIndexRef.current > 0);
        setMessages(allMessages.slice(loadedStartIndexRef.current));
        return;
      }

      // 消息不足一页，直接展示全量
      setMessages(allMessages);
    },
    [pageSize, applyPagingSlice],
  );

  /**
   * 初始化分页状态并同步消息
   * @returns 初始可见消息切片
   */
  const initPaging = useCallback(
    (msgs: ChatMessagesData[]): ChatMessagesData[] => applyPagingSlice(msgs),
    [applyPagingSlice],
  );

  // ---- 以下为 chatListProps 构建逻辑 ----

  /** 加载更多历史消息（由 ChatList 的 onLoadMore 事件触发） */
  const handleLoadMore = useCallback(() => {
    if (!pageSize || loadedStartIndexRef.current <= 0) return;

    const currentStartIndex = loadedStartIndexRef.current;
    const loadCount = Math.min(pageSize, currentStartIndex);
    const newStartIndex = currentStartIndex - loadCount;

    loadedStartIndexRef.current = newStartIndex;
    visibleCountRef.current += loadCount;
    setHasMore(newStartIndex > 0);
    setMessages(chatEngineRef.current.messages.slice(newStartIndex));
  }, [pageSize, chatEngineRef]);

  /** 滚动事件处理：滚动到底部时重置分页窗口，释放多余 DOM 节点 */
  const handleScroll = useCallback(
    (e: Event) => {
      if (!pageSize || !pagingInitializedRef.current) return;
      if (visibleCountRef.current <= pageSize) return;
      if (isResettingRef.current) return;

      // 从 shadowRoot 内部滚动容器获取滚动信息
      const host = e.target as HTMLElement;
      const scrollContainer = host?.shadowRoot?.querySelector('.t-chat__list') as HTMLElement;
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight === 0) return;

      const isAtBottom = scrollHeight - (scrollTop + clientHeight) <= 50;

      if (isAtBottom) {
        const allMessages = chatEngineRef.current.messages;
        const totalCount = allMessages.length;
        const newStartIndex = Math.max(totalCount - pageSize, 0);

        // 防止重置引起的 scroll 事件再次触发重置
        isResettingRef.current = true;
        visibleCountRef.current = pageSize;
        loadedStartIndexRef.current = newStartIndex;
        setHasMore(newStartIndex > 0);
        setMessages(allMessages.slice(newStartIndex));

        // 下一帧解除锁定，允许后续正常的 scroll 判断
        requestAnimationFrame(() => {
          isResettingRef.current = false;
        });
      }
    },
    [pageSize, chatEngineRef],
  );

  // 构建 chatListProps（仅分页模式下返回）
  const chatListProps: ChatListPagingProps | undefined = pageSize
    ? {
        hasMore,
        onLoadMore: handleLoadMore,
        onScroll: handleScroll,
      }
    : undefined;

  return {
    messages,
    syncMessages,
    initPaging,
    chatListProps,
  };
};
