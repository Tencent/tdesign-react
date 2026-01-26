/**
 * TDesign Catalog 定义（约束层）
 * 用于定义组件 props schema 和 actions 白名单
 * 
 * 概念区分：
 * - Catalog（本文件）：约束层，定义组件 props 的 Zod schemas 和 actions 白名单（给 AI/服务端用）
 * - ComponentRegistry（catalog/index.ts）：渲染层，映射组件名到 React 组件（给 Renderer 用）
 */

import { createCatalog } from '@json-render/core';
import { z } from 'zod';

/**
 * TDesign 内置组件 Catalog
 * 定义所有内置组件的 props schema 和可用 actions
 * 
 * 这个 Catalog 用于：
 * 1. 告诉 AI/LLM 可以生成哪些组件
 * 2. 约束每个组件的 props 类型
 * 3. 定义可触发的 actions 白名单
 */
export const tdesignCatalog = createCatalog({
  name: 'tdesign',
  components: {
    // ==================== 基础组件 ====================
    
    Button: {
      props: z.object({
        // 支持 label 或 children 两种方式传递按钮文本
        label: z.string().optional(),
        children: z.string().optional(),
        variant: z.enum(['base', 'outline', 'dashed', 'text']).nullable(),
        theme: z.enum(['default', 'primary', 'success', 'warning', 'danger']).nullable(),
        size: z.enum(['small', 'medium', 'large']).nullable(),
        disabled: z.boolean().nullable(),
        loading: z.boolean().nullable(),
        block: z.boolean().nullable(),
        // action 支持字符串（action 名称）或 Action 对象 { name, params }
        action: z.union([
          z.string(),
          z.object({
            name: z.string(),
            params: z.record(z.any()).optional(),
          }),
        ]).nullable(),
      }),
      description: 'TDesign Button component with action support',
    },

    Input: {
      props: z.object({
        value: z.string().nullable(),
        placeholder: z.string().nullable(),
        type: z.enum(['text', 'password', 'number']).nullable(),
        disabled: z.boolean().nullable(),
        clearable: z.boolean().nullable(),
        maxlength: z.number().nullable(),
        showLimitNumber: z.boolean().nullable(),
      }),
      description: 'TDesign Input component',
    },

    TextField: {
      props: z.object({
        label: z.string(),
        name: z.string().optional(), // 表单字段名称（可选）
        valuePath: z.string(), // 数据绑定路径（必需）
        placeholder: z.string().nullable(),
        required: z.boolean().nullable(),
        type: z.enum(['text', 'password', 'email', 'number', 'tel']).nullable(),
        disabled: z.boolean().nullable(),
        helperText: z.string().nullable(),
      }),
      description: 'Form text field with label and data binding (combines Input + label)',
    },

    Text: {
      props: z.object({
        content: z.string(),
        variant: z.enum(['body', 'caption', 'label']).nullable(),
        color: z.enum(['default', 'primary', 'secondary', 'success', 'warning', 'error']).nullable(),
        weight: z.enum(['normal', 'medium', 'bold']).nullable(),
      }),
      description: 'Text display component',
    },

    Card: {
      props: z.object({
        title: z.string().nullable(),
        description: z.string().nullable(),
        bordered: z.boolean().nullable(),
        shadow: z.boolean().nullable(),
        loading: z.boolean().nullable(),
      }),
      hasChildren: true,
      description: 'TDesign Card container',
    },

    // ==================== 布局组件 ====================

    Row: {
      props: z.object({
        gutter: z.number().nullable(),
        justify: z.enum(['start', 'end', 'center', 'space-around', 'space-between']).nullable(),
        align: z.enum(['top', 'middle', 'bottom']).nullable(),
      }),
      hasChildren: true,
      description: 'Grid row layout',
    },

    Col: {
      props: z.object({
        span: z.number().min(1).max(24).nullable(),
        offset: z.number().nullable(),
      }),
      hasChildren: true,
      description: 'Grid column layout',
    },

    Space: {
      props: z.object({
        direction: z.enum(['horizontal', 'vertical']).nullable(),
        // size 支持字符串枚举或数字
        size: z.union([
          z.enum(['small', 'medium', 'large']),
          z.number(),
          z.string(),
        ]).nullable(),
        align: z.enum(['start', 'center', 'end', 'baseline']).nullable(),
      }),
      hasChildren: true,
      description: 'Space layout component',
    },

    Column: {
      props: z.object({
        gap: z.number().nullable(),
        align: z.enum(['start', 'center', 'end', 'stretch']).nullable(),
      }),
      hasChildren: true,
      description: 'Vertical column layout',
    },

    Divider: {
      props: z.object({
        layout: z.enum(['horizontal', 'vertical']).nullable(),
        dashed: z.boolean().nullable(),
      }),
      description: 'Divider line',
    },
  },
  
  actions: {
    submit: { 
      description: 'Submit form data to server' 
    },
    reset: { 
      description: 'Reset form to initial state (handled by Button component automatically)' 
    },
    cancel: { 
      description: 'Cancel current operation' 
    },
  },
  
  validation: 'strict',
});

/**
 * 创建自定义 Catalog（扩展 TDesign 内置 Catalog）
 * 
 * @param customConfig - 自定义 Catalog 配置
 * @returns 合并后的 Catalog
 * 
 * @example
 * ```typescript
 * import { createCustomCatalog } from '@tdesign-react/chat';
 * import { z } from 'zod';
 * 
 * const customCatalog = createCustomCatalog({
 *   name: 'my-dashboard',
 *   components: {
 *     StatusCard: {
 *       props: z.object({
 *         title: z.string(),
 *         status: z.enum(['success', 'warning', 'error', 'info']),
 *         description: z.string().nullable(),
 *       }),
 *       description: 'Custom status card component',
 *     },
 *     ProgressBar: {
 *       props: z.object({
 *         label: z.string().nullable(),
 *         percentage: z.number().min(0).max(100),
 *         showInfo: z.boolean().nullable(),
 *       }),
 *       description: 'Custom progress bar component',
 *     },
 *   },
 *   actions: {
 *     refresh: { description: 'Refresh data' },
 *     export: { description: 'Export to file' },
 *   },
 * });
 * 
 * // 使用自定义 Catalog
 * // 1. 在服务端：告诉 AI 可以生成哪些组件
 * // 2. 在前端：配合 createCustomRegistry 提供渲染能力
 * ```
 */
export function createCustomCatalog(customConfig: {
  name: string;
  components?: Record<string, any>;
  actions?: Record<string, { description: string }>;
  validation?: 'strict' | 'warn';
}) {
  // 获取 TDesign 内置配置
  const tdesignComponents = tdesignCatalog.components;
  const tdesignActions = tdesignCatalog.actions;

  // 合并配置
  return createCatalog({
    name: customConfig.name,
    components: {
      ...tdesignComponents,
      ...(customConfig.components || {}),
    },
    actions: {
      ...tdesignActions,
      ...(customConfig.actions || {}),
    },
    validation: customConfig.validation || 'strict',
  });
}

/**
 * 导出 TDesign Catalog 的组件列表（给 AI prompt 用）
 */
export const tdesignComponentList = tdesignCatalog.componentNames as string[];

/**
 * 导出 TDesign Catalog 的 actions 列表（给 AI prompt 用）
 */
export const tdesignActionList = tdesignCatalog.actionNames as string[];
