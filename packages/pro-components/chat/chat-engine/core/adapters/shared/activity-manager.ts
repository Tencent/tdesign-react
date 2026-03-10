/**
 * 共享 Activity 管理器
 *
 * 从 AG-UI ActivityManager 中 re-export 全局单例，
 * 供 AG-UI 和 OpenClaw 等多个适配器共同使用。
 *
 * ActivityManager 处理 Activity 事件的 Snapshot/Delta 增量合并，
 * 是协议无关的纯状态管理器。
 */
export { ActivityManagerImpl, activityManager } from '../agui/ActivityManager';
export type { ActivityManager } from '../agui/ActivityManager';
