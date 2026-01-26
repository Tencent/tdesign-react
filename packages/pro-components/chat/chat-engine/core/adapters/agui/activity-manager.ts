import { applyJsonPatch } from '../../utils';

/**
 * Activity 状态管理器
 * 
 * 职责：
 * - 处理 AG-UI Activity 事件的 Snapshot/Delta 增量合并
 * - 提供当前 Activity 数据的快捷访问（用于 event-mapper 生成消息内容）
 * 
 * 注意：
 * - Activity 本身会渲染在消息流中，不需要独立订阅机制
 * - 如需监听 Activity 变化，应使用 eventBus 的 MESSAGE_UPDATE 事件
 */

export interface ActivityData {
  activityType: string;
  content: Record<string, any>;
  messageId?: string;
  /** 增量更新信息 */
  deltaInfo?: {
    fromIndex: number;
    toIndex: number;
  };
}

export interface ActivityManager {
  /**
   * 获取当前活跃的 activityType
   */
  getCurrentActivityType: () => string | null;
  /**
   * 获取当前 Activity 内容（基于当前活跃的 activityType）
   */
  getCurrentActivity: () => ActivityData | null;
  /**
   * 获取指定 activityType 的 Activity 内容
   */
  getActivity: (activityType: string) => ActivityData | null;
  /**
   * 获取所有 activityType
   */
  getAllActivityTypes: () => string[];
  /**
   * 处理 AG-UI Activity 事件
   */
  handleActivityEvent: (event: {
    type: string;
    activityType: string;
    content?: any;
    patch?: any[];
    messageId?: string;
  }) => ActivityData | null;
  /**
   * 清理活动数据
   */
  clear: () => void;
}

export class ActivityManagerImpl implements ActivityManager {
  private activities: Record<string, ActivityData> = {};

  private currentActivityType: string | null = null;

  /**
   * 获取当前活跃的 activityType
   */
  getCurrentActivityType(): string | null {
    return this.currentActivityType;
  }

  /**
   * 获取当前 Activity 内容
   */
  getCurrentActivity(): ActivityData | null {
    if (!this.currentActivityType) return null;
    return this.activities[this.currentActivityType] || null;
  }

  /**
   * 获取指定 activityType 的 Activity 内容
   */
  getActivity(activityType: string): ActivityData | null {
    return this.activities[activityType] || null;
  }

  /**
   * 获取所有 activityType
   */
  getAllActivityTypes(): string[] {
    return Object.keys(this.activities);
  }



  /**
   * 处理 AG-UI Activity 事件
   * 返回更新后的 ActivityData，供 event-mapper 使用
   */
  handleActivityEvent(event: {
    type: string;
    activityType: string;
    content?: any;
    patch?: any[];
    messageId?: string;
  }): ActivityData | null {
    const { activityType, messageId } = event;

    if (event.type === 'ACTIVITY_SNAPSHOT') {
      // SNAPSHOT: 全量更新
      const activityData: ActivityData = {
        activityType,
        content: event.content || {},
        messageId,
      };
      this.setActivity(activityType, activityData);
      return activityData;
    }

    if (event.type === 'ACTIVITY_DELTA') {
      // DELTA: 增量更新
      const isFirstDelta = !this.activities[activityType];
      let currentActivity = this.activities[activityType];

      // 如果没有 snapshot，自动初始化空的 activity（纯增量模式）
      if (isFirstDelta) {
        currentActivity = {
          activityType,
          content: this.inferInitialContent(event.patch),
          messageId,
        };
      }

      // 记录旧的 operations/messages 数量（用于增量标记）
      const oldContent = currentActivity.content;
      const oldOpsCount = this.getOperationsCount(oldContent);

      let newContent = oldContent;

      // 使用 patch 进行 JSON Patch 更新
      if (event.patch && Array.isArray(event.patch)) {
        newContent = applyJsonPatch(oldContent, event.patch);
      }

      // 计算新增的 operations 范围
      const newOpsCount = this.getOperationsCount(newContent);
      const deltaInfo =
        newOpsCount > oldOpsCount ? { fromIndex: oldOpsCount, toIndex: newOpsCount } : undefined;

      const activityData: ActivityData = {
        activityType,
        content: newContent,
        messageId,
        deltaInfo,
      };

      this.setActivity(activityType, activityData);
      return activityData;
    }

    return null;
  }

  /**
   * 清理所有活动数据
   * 用于新一轮对话开始时重置状态
   */
  clear(): void {
    this.activities = {};
    this.currentActivityType = null;
  }

  /**
   * 根据 JSON Patch 路径推断初始内容结构
   */
  private inferInitialContent(patch: any[] | undefined): Record<string, any> {
    if (!patch || !Array.isArray(patch) || patch.length === 0) {
      return {};
    }

    const initialContent: Record<string, any> = {};

    for (const op of patch) {
      if (op.path) {
        const pathParts = op.path.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const rootKey = pathParts[0];
          // 如果路径包含 - 或数字索引，说明是数组
          if (pathParts.length > 1 && (pathParts[1] === '-' || /^\d+$/.test(pathParts[1]))) {
            if (!initialContent[rootKey]) {
              initialContent[rootKey] = [];
            }
          }
        }
      }
    }

    return initialContent;
  }

  /**
   * 获取 content 中的 operations/messages 数量
   */
  private getOperationsCount(content: Record<string, any> | null | undefined): number {
    if (!content) return 0;
    const ops = content.operations || content.messages;
    return Array.isArray(ops) ? ops.length : 0;
  }

  /**
   * 设置 Activity
   */
  private setActivity(activityType: string, activity: ActivityData): void {
    this.activities[activityType] = activity;
    this.currentActivityType = activityType;
  }
}

// 全局单例
export const activityManager = new ActivityManagerImpl();
