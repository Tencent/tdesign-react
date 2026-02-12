import React, { useMemo } from 'react';
import isEqual from 'react-fast-compare';
import type { ActivityComponentProps } from './types';
import { activityRegistry, ACTIVITY_REGISTERED_EVENT, ACTIVITY_EVENT_DETAIL_KEY } from './registry';
import { ComponentErrorBoundary, useRegistrationListener } from '../shared';
import { type ActivityData } from 'tdesign-web-components/lib/chat-engine';

interface ActivityRendererProps {
  activity: ActivityData;
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
    // 使用公共 Hook 监听动态注册
    const { MemoizedComponent } = useRegistrationListener<ActivityComponentProps>({
      componentKey: activity.activityType,
      eventName: ACTIVITY_REGISTERED_EVENT,
      eventDetailKey: ACTIVITY_EVENT_DETAIL_KEY,
      getRenderFunction: activityRegistry.getRenderFunction,
    });

    // 缓存组件 props
    const componentProps = useMemo<ActivityComponentProps>(
      () => ({
        activityType: activity.activityType,
        content: activity.content,
        messageId: activity.messageId || '',
      }),
      [activity.activityType, activity.content, activity.messageId],
    );

    // 如果没有注册对应的组件，使用默认渲染器
    if (!MemoizedComponent) {
      return <DefaultActivityRenderer activity={activity} />;
    }

    return (
      <ComponentErrorBoundary componentName={activity.activityType} logPrefix="ActivityRenderer">
        <MemoizedComponent {...componentProps} />
      </ComponentErrorBoundary>
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