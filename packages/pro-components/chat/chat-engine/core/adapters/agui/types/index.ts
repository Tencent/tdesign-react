// 这里的类型定义在官方Message Schema基础上扩展而来
// https://github.com/ag-ui-protocol/ag-ui/blob/main/sdks/typescript/packages/core/src/types.ts

import { z } from 'zod';
import type { UserMessageContent } from '../../../type';

export const FunctionCallSchema = z.object({
  name: z.string(),
  arguments: z.string(),
});

export const ToolCallSchema = z.object({
  id: z.string(),
  type: z.literal('function'),
  function: FunctionCallSchema,
});

const BaseMessageSchema = z.object({
  id: z.string(),
  role: z.string(),
  content: z.string().optional(),
  name: z.string().optional(),
  timestamp: z.number().optional(), // 添加时间戳字段，用于历史消息
});

const DeveloperMessageSchema = BaseMessageSchema.extend({
  role: z.literal('developer'),
  content: z.string(),
});

const SystemMessageSchema = BaseMessageSchema.extend({
  role: z.literal('system'),
  content: z.string(),
});

const AssistantMessageSchema = BaseMessageSchema.extend({
  role: z.literal('assistant'),
  content: z.string().optional(),
  reasoningContent: z.string().optional(),
  toolCalls: z.array(ToolCallSchema).optional(),
});


/**
 * 用户消息 Schema
 * content 支持两种格式：
 * 1. 字符串（标准 AG-UI 格式）
 * 2. 数组（已转换为 ChatEngine 的 UserMessageContent[] 格式）
 */
const UserMessageSchema = BaseMessageSchema.extend({
  role: z.literal('user'),
  content: z.union([z.string(), z.array(z.any())]),
});

// 扩展类型定义，支持两种 content 格式
export type AGUIUserMessageContent = string | UserMessageContent[];

const ToolMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.literal('tool'),
  toolCallId: z.string(),
});

const ActivityMessageSchema = z.object({
  id: z.string(),
  role: z.literal("activity"),
  activityType: z.string(),
  content: z.record(z.any()),
});

export const AGUIMessageSchema = z.discriminatedUnion('role', [
  DeveloperMessageSchema,
  SystemMessageSchema,
  AssistantMessageSchema,
  UserMessageSchema,
  ToolMessageSchema,
  ActivityMessageSchema,
]);

/**
 * 历史消息相关的类型定义
 *
 */
export const HistoryMessageSchema = z.discriminatedUnion('role', [
  UserMessageSchema,
  AssistantMessageSchema,
  ToolMessageSchema,
  ActivityMessageSchema,
]);

export const RoleSchema = z.union([
  z.literal('developer'),
  z.literal('system'),
  z.literal('assistant'),
  z.literal('user'),
  z.literal('tool'),
  z.literal("activity"),
]);

export const ContextSchema = z.object({
  description: z.string(),
  value: z.string(),
});

export const ToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.any(), // JSON Schema for the tool parameters
});

export const RunAgentInputSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
  state: z.any(),
  messages: z.array(AGUIMessageSchema),
  tools: z.array(ToolSchema),
  context: z.array(ContextSchema),
  forwardedProps: z.any(),
});

export const StateSchema = z.any();

export type AGUIToolCall = z.infer<typeof ToolCallSchema>;
export type AGUIFunctionCall = z.infer<typeof FunctionCallSchema>;
export type AGUIDeveloperMessage = z.infer<typeof DeveloperMessageSchema>;
export type AGUISystemMessage = z.infer<typeof SystemMessageSchema>;
export type AGUIAssistantMessage = z.infer<typeof AssistantMessageSchema>;
export type AGUIUserMessage = z.infer<typeof UserMessageSchema>;
export type AGUIToolMessage = z.infer<typeof ToolMessageSchema>;
export type AGUIActivityMessage = z.infer<typeof ActivityMessageSchema>;
export type AGUIMessage = z.infer<typeof AGUIMessageSchema>;
export type AGUIContext = z.infer<typeof ContextSchema>;
export type AGUITool = z.infer<typeof ToolSchema>;
export type RunAgentInput = z.infer<typeof RunAgentInputSchema>;
export type AGUIState = z.infer<typeof StateSchema>;
export type AGUIRole = z.infer<typeof RoleSchema>;

// 历史消息类型别名，复用已有的类型
export type AGUIHistoryMessage = AGUIMessage;
export type AGUIUserHistoryMessage = AGUIUserMessage;
export type AGUIAssistantHistoryMessage = AGUIAssistantMessage;
export type AGUIToolHistoryMessage = AGUIToolMessage;

export class AGUIError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export * from './events';
