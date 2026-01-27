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

/**
 * 内置组件的详细 Props 文档（用于生成详细 prompt）
 */
const BUILTIN_COMPONENT_DOCS: Record<string, { 
  description: string;
  props: Record<string, string>;
  hasChildren?: boolean;
}> = {
  Button: {
    description: 'Button component with action support',
    props: {
      label: 'string - Button text (alternative to children)',
      children: 'string - Button text',
      variant: '"base" | "outline" | "dashed" | "text" - Button style variant',
      theme: '"default" | "primary" | "success" | "warning" | "danger" - Color theme',
      size: '"small" | "medium" | "large" - Button size',
      disabled: 'boolean - Whether button is disabled',
      loading: 'boolean - Whether to show loading state',
      block: 'boolean - Whether button should be full width',
      action: 'string | { name: string, params?: object } - Action to trigger on click',
    },
  },
  Input: {
    description: 'Input component for text entry',
    props: {
      value: 'string - Input value',
      placeholder: 'string - Placeholder text',
      type: '"text" | "password" | "number" - Input type',
      disabled: 'boolean - Whether input is disabled',
      clearable: 'boolean - Whether to show clear button',
      maxlength: 'number - Maximum input length',
      showLimitNumber: 'boolean - Whether to show character count',
    },
  },
  TextField: {
    description: 'Form text field with label and data binding',
    props: {
      label: 'string (required) - Field label',
      name: 'string - Form field name',
      valuePath: 'string (required) - Data binding path in data model',
      placeholder: 'string - Placeholder text',
      required: 'boolean - Whether field is required',
      type: '"text" | "password" | "email" | "number" | "tel" - Input type',
      disabled: 'boolean - Whether field is disabled',
      disabledPath: 'string - Data path to control disabled state dynamically',
      helperText: 'string - Helper text below the field',
    },
  },
  Text: {
    description: 'Text display component',
    props: {
      content: 'string (required) - Text content to display',
      variant: '"body" | "caption" | "label" - Text style variant',
      color: '"default" | "primary" | "secondary" | "success" | "warning" | "error" - Text color',
      weight: '"normal" | "medium" | "bold" - Font weight',
    },
  },
  Card: {
    description: 'Card container component',
    props: {
      title: 'string - Card title',
      description: 'string - Card description',
      bordered: 'boolean - Whether to show border',
      shadow: 'boolean - Whether to show shadow',
      loading: 'boolean - Whether to show loading state',
    },
    hasChildren: true,
  },
  Row: {
    description: 'Grid row layout (24-column grid system)',
    props: {
      gutter: 'number - Gap between columns in pixels',
      justify: '"start" | "end" | "center" | "space-around" | "space-between" - Horizontal alignment',
      align: '"top" | "middle" | "bottom" - Vertical alignment',
    },
    hasChildren: true,
  },
  Col: {
    description: 'Grid column layout (use inside Row)',
    props: {
      span: 'number (1-24) - Column width, out of 24 total',
      offset: 'number - Column offset from left',
    },
    hasChildren: true,
  },
  Space: {
    description: 'Space layout component for spacing children',
    props: {
      direction: '"horizontal" | "vertical" - Layout direction',
      size: '"small" | "medium" | "large" | number - Gap size',
      align: '"start" | "center" | "end" | "baseline" - Alignment',
    },
    hasChildren: true,
  },
  Column: {
    description: 'Vertical column layout',
    props: {
      gap: 'number - Gap between children in pixels',
      align: '"start" | "center" | "end" | "stretch" - Horizontal alignment',
    },
    hasChildren: true,
  },
  Divider: {
    description: 'Divider line',
    props: {
      layout: '"horizontal" | "vertical" - Divider direction',
      dashed: 'boolean - Whether to use dashed line',
    },
  },
};

/**
 * Prompt 模板模式
 * - 'default': 默认模板，生成标准的 JSON Schema UI
 * - 'a2ui': A2UI 模板，使用 A2UI 特定的消息格式和协议
 * - 'custom': 自定义模板，完全由 customTemplate 参数控制
 */
export type PromptTemplateMode = 'default' | 'a2ui' | 'custom';

/**
 * 组件文档定义类型
 * props 支持两种格式：
 * 1. Record<string, string> - 人可读的 props 描述，如 { label: 'string - Button text' }
 * 2. ZodObject - Zod schema 对象，会自动转换为描述
 */
export interface ComponentDoc {
  description: string;
  /** Props 定义：可以是字符串描述映射，也可以是 Zod schema */
  props: Record<string, string> | z.ZodObject<any>;
  hasChildren?: boolean;
}

/**
 * 内部使用的标准化组件文档类型（props 已转为字符串）
 */
export interface NormalizedComponentDoc {
  description: string;
  props: Record<string, string>;
  hasChildren?: boolean;
}

/**
 * 将 Zod schema 转换为 props 描述字符串
 */
function zodSchemaToPropsDoc(schema: z.ZodObject<any>): Record<string, string> {
  const result: Record<string, string> = {};
  const shape = schema.shape;
  
  for (const [key, value] of Object.entries(shape)) {
    result[key] = zodTypeToString(value as z.ZodTypeAny);
  }
  
  return result;
}

/**
 * 将 Zod 类型转换为可读字符串
 */
function zodTypeToString(type: z.ZodTypeAny): string {
  // 处理 nullable
  if (type instanceof z.ZodNullable) {
    return `${zodTypeToString(type.unwrap())} (nullable)`;
  }
  
  // 处理 optional
  if (type instanceof z.ZodOptional) {
    return `${zodTypeToString(type.unwrap())} (optional)`;
  }
  
  // 处理 enum
  if (type instanceof z.ZodEnum) {
    const values = type.options as string[];
    return values.map(v => `"${v}"`).join(' | ');
  }
  
  // 处理 union
  if (type instanceof z.ZodUnion) {
    const options = (type as any)._def.options as z.ZodTypeAny[];
    return options.map(o => zodTypeToString(o)).join(' | ');
  }
  
  // 处理基础类型
  if (type instanceof z.ZodString) return 'string';
  if (type instanceof z.ZodNumber) return 'number';
  if (type instanceof z.ZodBoolean) return 'boolean';
  if (type instanceof z.ZodObject) return 'object';
  if (type instanceof z.ZodArray) return 'array';
  
  return 'any';
}

/**
 * 标准化组件文档（将 Zod schema 转换为字符串描述）
 */
function normalizeComponentDoc(doc: ComponentDoc): NormalizedComponentDoc {
  let props: Record<string, string>;
  
  if (doc.props instanceof z.ZodObject) {
    props = zodSchemaToPropsDoc(doc.props);
  } else {
    props = doc.props;
  }
  
  return {
    description: doc.description,
    props,
    hasChildren: doc.hasChildren,
  };
}

/**
 * 自定义模板生成器函数类型
 * 接收标准化后的组件文档（props 已转为字符串描述）
 */
export type CustomTemplateGenerator = (context: {
  name: string;
  components: Record<string, NormalizedComponentDoc>;
  actions: Record<string, { description: string }>;
}) => string;

/**
 * 生成增强版 Catalog Prompt（包含完整 Props 文档和 Schema 示例）
 * 
 * @param options - 配置选项
 * @returns 详细的 AI Prompt 字符串
 */
export function generateCatalogPrompt(options: {
  name?: string;
  components?: Record<string, ComponentDoc>;
  actions?: Record<string, { description: string }>;
  /** 是否包含 Schema 示例 */
  includeExample?: boolean;
  /** 
   * Prompt 模板模式
   * - 'default': 标准 JSON Schema UI 模板
   * - 'a2ui': A2UI 协议模板（需服务端配合）
   * - 'custom': 使用自定义模板生成器
   */
  templateMode?: PromptTemplateMode;
  /**
   * 自定义模板生成器（仅当 templateMode='custom' 时使用）
   * 接收组件和 actions 上下文，返回完整的 prompt 字符串
   */
  customTemplate?: CustomTemplateGenerator;
} = {}): string {
  const {
    name = 'tdesign',
    components = {},
    actions = {},
    includeExample = true,
    templateMode = 'default',
    customTemplate,
  } = options;

  // 合并内置组件和自定义组件，并标准化（将 Zod schema 转为字符串描述）
  const mergedComponents = { ...BUILTIN_COMPONENT_DOCS, ...components };
  const allComponents: Record<string, NormalizedComponentDoc> = {};
  for (const [key, doc] of Object.entries(mergedComponents)) {
    allComponents[key] = normalizeComponentDoc(doc);
  }
  
  // 合并内置 actions 和自定义 actions
  const builtinActions = {
    submit: { description: 'Submit form data to server' },
    reset: { description: 'Reset form to initial state' },
    cancel: { description: 'Cancel current operation' },
  };
  const allActions = { ...builtinActions, ...actions };

  // 自定义模板模式
  if (templateMode === 'custom' && customTemplate) {
    return customTemplate({ name, components: allComponents, actions: allActions });
  }

  // A2UI 模板模式 - 预留给服务端实现具体模板
  if (templateMode === 'a2ui') {
    return generateA2UIPrompt({ name, components: allComponents, actions: allActions, includeExample });
  }

  // 默认模板
  const lines: string[] = [
    `# ${name} UI Component Catalog`,
    '',
    'You can generate dynamic UI using the following components and JSON schema format.',
    '',
    '## Output Format',
    '',
    'Generate a JSON object with this structure:',
    '```json',
    '{',
    '  "root": "element_id",  // ID of the root element',
    '  "elements": {',
    '    "element_id": {',
    '      "key": "element_id",  // Same as the key in elements object',
    '      "type": "ComponentName",  // One of the available components',
    '      "props": { ... },  // Component-specific props',
    '      "children": ["child_id_1", "child_id_2"]  // Optional: IDs of child elements',
    '    }',
    '  },',
    '  "data": {  // Optional: Initial data model for data binding',
    '    "fieldName": "value"',
    '  }',
    '}',
    '```',
    '',
    '## Available Components',
    '',
  ];

  // 组件文档
  for (const [name, doc] of Object.entries(allComponents)) {
    lines.push(`### ${name}`);
    lines.push(doc.description);
    if (doc.hasChildren) {
      lines.push('*This component can have children.*');
    }
    lines.push('');
    lines.push('**Props:**');
    for (const [propName, propDesc] of Object.entries(doc.props)) {
      lines.push(`- \`${propName}\`: ${propDesc}`);
    }
    lines.push('');
  }

  // Actions
  lines.push('## Available Actions');
  lines.push('');
  lines.push('Actions can be triggered by Button components. Use the `action` prop:');
  lines.push('- Simple: `"action": "actionName"`');
  lines.push('- With params: `"action": { "name": "actionName", "params": { ... } }`');
  lines.push('');
  for (const [name, def] of Object.entries(allActions)) {
    lines.push(`- \`${name}\`: ${def.description}`);
  }
  lines.push('');

  // Data Binding
  lines.push('## Data Binding');
  lines.push('');
  lines.push('Use `valuePath` to bind form fields to the data model:');
  lines.push('- `"valuePath": "user.name"` binds to `data.user.name`');
  lines.push('- `"disabledPath": "formDisabled"` controls disabled state from `data.formDisabled`');
  lines.push('');

  // 示例
  if (includeExample) {
    lines.push('## Example');
    lines.push('');
    lines.push('A simple form with two text fields and a submit button:');
    lines.push('```json');
    lines.push(JSON.stringify({
      root: 'card1',
      elements: {
        card1: {
          key: 'card1',
          type: 'Card',
          props: { title: 'User Information' },
          children: ['form_column'],
        },
        form_column: {
          key: 'form_column',
          type: 'Column',
          props: { gap: 16 },
          children: ['name_field', 'email_field', 'button_row'],
        },
        name_field: {
          key: 'name_field',
          type: 'TextField',
          props: {
            label: 'Name',
            valuePath: 'user.name',
            placeholder: 'Enter your name',
            required: true,
          },
        },
        email_field: {
          key: 'email_field',
          type: 'TextField',
          props: {
            label: 'Email',
            valuePath: 'user.email',
            placeholder: 'Enter your email',
            type: 'email',
          },
        },
        button_row: {
          key: 'button_row',
          type: 'Space',
          props: { direction: 'horizontal', size: 'medium' },
          children: ['submit_btn', 'cancel_btn'],
        },
        submit_btn: {
          key: 'submit_btn',
          type: 'Button',
          props: {
            children: 'Submit',
            theme: 'primary',
            action: { name: 'submit', params: { source: 'form' } },
          },
        },
        cancel_btn: {
          key: 'cancel_btn',
          type: 'Button',
          props: {
            children: 'Cancel',
            variant: 'outline',
            action: 'cancel',
          },
        },
      },
      data: {
        user: { name: '', email: '' },
      },
    }, null, 2));
    lines.push('```');
  }

  return lines.join('\n');
}

/**
 * A2UI 协议专用 Prompt 生成器
 * 生成符合 A2UI 消息格式的系统提示词
 * 
 * @internal 内部函数，由 generateDetailedCatalogPrompt 调用
 */
function generateA2UIPrompt(context: {
  name: string;
  components: Record<string, NormalizedComponentDoc>;
  actions: Record<string, { description: string }>;
  includeExample?: boolean;
}): string {
  const { name, components, actions, includeExample = true } = context;

  const lines: string[] = [
    `# ${name} A2UI Component Catalog`,
    '',
    'You can generate dynamic UI using A2UI protocol messages.',
    '',
    '## A2UI Message Types',
    '',
    '### createSurface',
    'Create a new UI surface with initial elements:',
    '```json',
    '{',
    '  "type": "createSurface",',
    '  "surfaceId": "unique_surface_id",',
    '  "ui": {',
    '    "root": "element_id",',
    '    "elements": { ... }',
    '  },',
    '  "data": { ... }',
    '}',
    '```',
    '',
    '### updateComponents',
    'Update existing UI elements:',
    '```json',
    '{',
    '  "type": "updateComponents",',
    '  "surfaceId": "existing_surface_id",',
    '  "elements": { ... }',
    '}',
    '```',
    '',
    '### updateDataModel',
    'Update data model without changing UI:',
    '```json',
    '{',
    '  "type": "updateDataModel",',
    '  "surfaceId": "existing_surface_id",',
    '  "data": { ... }',
    '}',
    '```',
    '',
    '### deleteSurface',
    'Remove a UI surface:',
    '```json',
    '{',
    '  "type": "deleteSurface",',
    '  "surfaceId": "surface_to_delete"',
    '}',
    '```',
    '',
    '## Available Components',
    '',
  ];

  // 组件文档
  for (const [compName, doc] of Object.entries(components)) {
    lines.push(`### ${compName}`);
    lines.push(doc.description);
    if (doc.hasChildren) {
      lines.push('*This component can have children.*');
    }
    lines.push('');
    lines.push('**Props:**');
    for (const [propName, propDesc] of Object.entries(doc.props)) {
      lines.push(`- \`${propName}\`: ${propDesc}`);
    }
    lines.push('');
  }

  // Actions
  lines.push('## Available Actions');
  lines.push('');
  for (const [actionName, def] of Object.entries(actions)) {
    lines.push(`- \`${actionName}\`: ${def.description}`);
  }
  lines.push('');

  // 示例
  if (includeExample) {
    lines.push('## Example');
    lines.push('');
    lines.push('Create a form surface:');
    lines.push('```json');
    lines.push(JSON.stringify({
      type: 'createSurface',
      surfaceId: 'user_form_1',
      ui: {
        root: 'form_card',
        elements: {
          form_card: {
            key: 'form_card',
            type: 'Card',
            props: { title: 'User Form' },
            children: ['name_field', 'submit_btn'],
          },
          name_field: {
            key: 'name_field',
            type: 'TextField',
            props: { label: 'Name', valuePath: 'user.name' },
          },
          submit_btn: {
            key: 'submit_btn',
            type: 'Button',
            props: { children: 'Submit', theme: 'primary', action: 'submit' },
          },
        },
      },
      data: { user: { name: '' } },
    }, null, 2));
    lines.push('```');
  }

  return lines.join('\n');
}
