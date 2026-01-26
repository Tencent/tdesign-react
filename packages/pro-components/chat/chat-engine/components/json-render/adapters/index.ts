/**
 * json-render 适配器模块
 * 支持多种协议转换为 json-render Schema
 */

export type {
  A2UIComponentType,
  A2UIComponent,
  A2UIMessage,
  A2UICreateSurface,
  A2UIUpdateComponents,
  A2UIUpdateDataModel,
  A2UIDeleteSurface,
  A2UISurfaceState,
} from './a2ui-types';

export {
  convertA2UIMessagesToJsonRender,
  applyA2UIUpdates,
  applyA2UIDataUpdate,
} from './a2ui-to-jsonrender';

export { default as A2UIAdapter } from './a2ui-to-jsonrender';
