import React, { useState, useEffect, useMemo, Component, ErrorInfo } from 'react';
import isEqual from 'react-fast-compare';
import type { ActivityComponentProps } from './types';
import { activityRegistry } from './registry';
import { type ActivityData } from '../../core';

interface ActivityRendererProps {
  activity: ActivityData;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Activity 错误边界组件
 * 捕获子组件渲染错误，防止整个对话列表崩溃
 * TODO: 后续支持配置化的错误 UI
 */
class ActivityErrorBoundary extends Component<
  { children: React.ReactNode; activityType: string },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; activityType: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[ActivityRenderer] Error in activity "${this.props.activityType}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

/**
 * 默认的 Activity 渲染器
 * 当没有注册对应类型的组件时使用
 * TODO: 后续支持配置化的默认 UI
 */
const DefaultActivityRenderer: React.FC<ActivityRendererProps> = ({ activity }) => {
  // 空白兜底，仅在控制台输出警告
  console.warn(`[ActivityRenderer] Unknown activity type: ${activity.activityType}`, activity.content);
  return null;
};

/**
 * Activity 渲染器组件
 * 根据 activityType 精确匹配查找注册的组件进行渲染
 * 
 * 性能优化：
 * - 使用 react-fast-compare 替代 JSON.stringify 进行深比较
 * - 短路比较，发现差异立即停止，对大型 JSON 树性能提升显著
 */
export const ActivityRenderer = React.memo<ActivityRendererProps>(
  ({ activity }) => {
    // 添加注册状态监听
    const [isRegistered, setIsRegistered] = useState(
      () => !!activityRegistry.getRenderFunction(activity.activityType),
    );

    // 缓存组件 props
    const componentProps = useMemo<ActivityComponentProps>(
      () => ({
        activityType: activity.activityType,
        content: activity.content,
        messageId: activity.messageId || '',
      }),
      [activity.activityType, activity.content, activity.messageId],
    );

    // 监听组件注册事件，支持动态注册
    useEffect(() => {
      if (!isRegistered) {
        const handleRegistered = (event: CustomEvent) => {
          // 精确匹配
          if (event.detail?.activityType === activity.activityType) {
            setIsRegistered(true);
          }
        };

        // 添加事件监听
        window.addEventListener('activity-registered', handleRegistered as EventListener);

        return () => {
          window.removeEventListener('activity-registered', handleRegistered as EventListener);
        };
      }
    }, [activity.activityType, isRegistered]);

    // 使用 registry 的缓存渲染函数
    const MemoizedComponent = useMemo(
      () => activityRegistry.getRenderFunction(activity.activityType),
      [activity.activityType, isRegistered],
    );

    // 如果没有注册对应的组件，使用默认渲染器
    if (!MemoizedComponent) {
      return <DefaultActivityRenderer activity={activity} />;
    }

    console.count('ActivityRenderer');
    return (
      <ActivityErrorBoundary activityType={activity.activityType}>
        <MemoizedComponent {...componentProps} />
      </ActivityErrorBoundary>
    );
  },
  (prevProps, nextProps) => {
    // 1. activityType 变化必须重渲染
    if (prevProps.activity.activityType !== nextProps.activity.activityType) {
      return false;
    }
    
    // 2. messageId 变化必须重渲染
    if (prevProps.activity.messageId !== nextProps.activity.messageId) {
      return false;
    }
    
    // 3. content 引用相同，跳过渲染
    if (prevProps.activity.content === nextProps.activity.content) {
      return true;
    }
    
    // 4. 使用 react-fast-compare 进行高效深比较
    // 比 JSON.stringify 快 3-5 倍，且能正确处理循环引用
    return isEqual(prevProps.activity.content, nextProps.activity.content);
  },
);

ActivityRenderer.displayName = 'ActivityRenderer';