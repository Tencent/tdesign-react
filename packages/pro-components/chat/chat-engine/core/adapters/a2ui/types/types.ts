/**
 * A2UI v0.9 协议类型定义
 * 参考 A2UI Specification 0.9 和 @a2ui/core 实现
 * 
 * 核心层：框架无关，可跨 React/Vue 复用
 */

import { z } from 'zod';

// ============= 基础类型 =============

/**
 * 数据绑定路径 - 支持从数据模型读取值
 * @example { path: "/user/name" }
 */
export const PathBindingSchema = z.object({
  path: z.string(),
});
export type PathBinding = z.infer<typeof PathBindingSchema>;

/**
 * 表达式绑定 - 支持简单计算表达式
 * @example { expr: "basePrice + addonTotal", vars: { basePrice: { path: "/config/basePrice" } } }
 */
export const ExprBindingSchema = z.object({
  expr: z.string(),
  vars: z.record(z.union([PathBindingSchema, z.any()])).optional(),
  format: z.string().optional(),
});
export type ExprBinding = z.infer<typeof ExprBindingSchema>;

/**
 * 可绑定值 - 字面值、路径绑定或表达式绑定
 */
export type Bindable<T> = T | PathBinding | ExprBinding;

// ============= 路径绑定辅助 Schema =============

export const stringOrPathSchema = z.union([z.string(), PathBindingSchema]);
export const numberOrPathSchema = z.union([z.number(), PathBindingSchema]);
export const booleanOrPathSchema = z.union([z.boolean(), PathBindingSchema]);
export const stringArrayOrPathSchema = z.union([z.array(z.string()), PathBindingSchema]);

// ============= Action 类型 =============

/**
 * A2UI Action - 服务端定义的用户交互
 * 支持两种格式：
 * 1. A2UI v0.9 规范格式：{ name: string, context?: Record<string, unknown> }
 * 2. 简化格式（向后兼容）：{ type: string, payload?: unknown }
 */
export const A2UIActionSchema = z.object({
  // A2UI v0.9 标准字段
  name: z.string().optional(),
  context: z.record(z.unknown()).optional(),
  // 向后兼容字段
  type: z.string().optional(),
  payload: z.unknown().optional(),
}).refine(
  (data) => data.name || data.type,
  { message: 'Action must have either name or type' }
);

export interface A2UIAction {
  /** A2UI v0.9 标准字段 */
  name?: string;
  context?: Record<string, unknown>;
  /** 向后兼容字段 */
  type?: string;
  payload?: unknown;
}

/**
 * 用户行为消息 - 发送给服务端
 */
export interface UserActionMessage {
  userAction: {
    name: string;
    surfaceId: string;
    sourceComponentId: string;
    timestamp: string;
    context: Record<string, unknown>;
  };
}

/**
 * Action 处理上下文
 */
export interface ActionContext {
  surfaceId: string;
  componentId?: string;
  updateData: (path: string, value: unknown) => void;
  getData: (path?: string) => unknown;
}

/**
 * Action 处理回调
 */
export type ActionHandler = (
  action: A2UIAction,
  context?: ActionContext
) => void | Promise<void>;

// ============= 组件类型定义 (A2UI v0.9) =============

/**
 * 组件通用属性
 */
export const componentCommonSchema = z.object({
  id: z.string(),
  component: z.string(),
});

/**
 * children 属性定义 (A2UI v0.9 规范)
 * 支持两种模式：
 * 1. 直接引用: ["comp1", "comp2"]
 * 2. Template 模式: { componentId: "comp1", path: "/items" }
 */
export const childrenPropertySchema = z.union([
  z.array(z.string()),
  z.object({
    componentId: z.string(),
    path: z.string(),
  }),
]);
export type ChildrenProperty = z.infer<typeof childrenPropertySchema>;

/**
 * A2UI 组件基础结构
 */
export interface A2UIComponentBase {
  id: string;
  component: string;
  [key: string]: unknown;
}

// ============= Display Components =============

/**
 * Text 组件
 */
export interface A2UITextComponent extends A2UIComponentBase {
  component: 'Text';
  text: Bindable<string>;
  usageHint?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'caption' | 'body';
}

/**
 * Image 组件
 */
export interface A2UIImageComponent extends A2UIComponentBase {
  component: 'Image';
  url: Bindable<string>;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  usageHint?: 'icon' | 'avatar' | 'smallFeature' | 'mediumFeature' | 'largeFeature' | 'header';
}

/**
 * Icon 组件
 */
export interface A2UIIconComponent extends A2UIComponentBase {
  component: 'Icon';
  name: string | PathBinding;
}

// ============= Layout Components =============

/**
 * Row 布局组件
 */
export interface A2UIRowComponent extends A2UIComponentBase {
  component: 'Row';
  children?: ChildrenProperty;
  distribution?: 'center' | 'end' | 'spaceAround' | 'spaceBetween' | 'spaceEvenly' | 'start' | 'stretch';
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Column 布局组件
 */
export interface A2UIColumnComponent extends A2UIComponentBase {
  component: 'Column';
  children?: ChildrenProperty;
  distribution?: 'start' | 'center' | 'end' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' | 'stretch';
  alignment?: 'center' | 'end' | 'start' | 'stretch';
}

/**
 * List 组件
 */
export interface A2UIListComponent extends A2UIComponentBase {
  component: 'List';
  children?: ChildrenProperty;
  direction?: 'vertical' | 'horizontal';
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Card 组件 (A2UI v0.9 规范: child 是单个组件 ID)
 */
export interface A2UICardComponent extends A2UIComponentBase {
  component: 'Card';
  child: string;
  // TDesign 扩展属性
  title?: Bindable<string>;
  bordered?: boolean;
  shadow?: boolean;
}

/**
 * Tabs 组件
 */
export interface A2UITabItem {
  title: Bindable<string>;
  child: string;
}

export interface A2UITabsComponent extends A2UIComponentBase {
  component: 'Tabs';
  tabItems: A2UITabItem[];
}

/**
 * Divider 组件
 */
export interface A2UIDividerComponent extends A2UIComponentBase {
  component: 'Divider';
  axis?: 'horizontal' | 'vertical';
}

// ============= Interactive Components =============

/**
 * Button 组件 (A2UI v0.9: child 是内容组件 ID)
 */
export interface A2UIButtonComponent extends A2UIComponentBase {
  component: 'Button';
  child?: string;
  text?: Bindable<string>;
  primary?: boolean;
  action?: A2UIAction;
  disabled?: Bindable<boolean>;
  loading?: Bindable<boolean>;
  // TDesign 扩展属性
  theme?: 'default' | 'primary' | 'danger' | 'warning' | 'success';
  variant?: 'base' | 'outline' | 'dashed' | 'text';
  size?: 'small' | 'medium' | 'large';
}

/**
 * CheckBox 组件
 */
export interface A2UICheckBoxComponent extends A2UIComponentBase {
  component: 'CheckBox';
  label: Bindable<string>;
  value: Bindable<boolean>;
}

/**
 * TextField 组件 (A2UI v0.9 规范)
 */
export interface A2UITextFieldComponent extends A2UIComponentBase {
  component: 'TextField';
  label: Bindable<string>;
  text?: Bindable<string>;
  usageHint?: 'longText' | 'number' | 'shortText' | 'obscured';
  validationRegexp?: string;
  placeholder?: string;
  disabled?: Bindable<boolean>;
}

/**
 * DateTimeInput 组件
 */
export interface A2UIDateTimeInputComponent extends A2UIComponentBase {
  component: 'DateTimeInput';
  value: Bindable<string>;
  enableDate?: boolean;
  enableTime?: boolean;
  outputFormat?: string;
  label?: Bindable<string>;
}

/**
 * ChoicePicker 选项
 */
export interface A2UIChoiceOption {
  label: Bindable<string>;
  value: string;
}

/**
 * ChoicePicker 组件 (单选/多选)
 */
export interface A2UIChoicePickerComponent extends A2UIComponentBase {
  component: 'ChoicePicker';
  label: Bindable<string>;
  usageHint: 'multipleSelection' | 'mutuallyExclusive';
  options: A2UIChoiceOption[];
  value: Bindable<string[]>;
}

/**
 * Slider 组件
 */
export interface A2UISliderComponent extends A2UIComponentBase {
  component: 'Slider';
  label?: Bindable<string>;
  min?: number;
  max?: number;
  value: Bindable<number>;
}

// ============= 兼容模式组件 (TDesign 扩展) =============

/**
 * Input 组件 (TDesign 扩展，简化版 TextField)
 */
export interface A2UIInputComponent extends A2UIComponentBase {
  component: 'Input';
  value?: Bindable<string>;
  placeholder?: string;
  disabled?: Bindable<boolean>;
  label?: string;
  type?: 'text' | 'password' | 'number';
  clearable?: boolean;
  status?: 'default' | 'success' | 'warning' | 'error';
  tips?: string;
  size?: 'small' | 'medium' | 'large';
  maxlength?: number;
}

/**
 * RadioGroup 组件 (TDesign 扩展)
 */
export interface A2UIRadioOption {
  label: Bindable<string>;
  value: string | number | boolean;
  disabled?: boolean;
}

export interface A2UIRadioGroupComponent extends A2UIComponentBase {
  component: 'RadioGroup';
  value?: Bindable<string | number | boolean>;
  options: A2UIRadioOption[];
  disabled?: Bindable<boolean>;
  theme?: 'radio' | 'button';
  variant?: 'outline' | 'primary-filled' | 'default-filled';
  size?: 'small' | 'medium' | 'large';
  allowUncheck?: boolean;
}

/**
 * CheckboxGroup 组件 (TDesign 扩展)
 */
export interface A2UICheckboxGroupComponent extends A2UIComponentBase {
  component: 'CheckboxGroup';
  value?: Bindable<(string | number)[]>;
  options: A2UIRadioOption[];
  disabled?: Bindable<boolean>;
}

// ============= 所有组件联合类型 =============

export type A2UIComponent =
  // Display
  | A2UITextComponent
  | A2UIImageComponent
  | A2UIIconComponent
  // Layout
  | A2UIRowComponent
  | A2UIColumnComponent
  | A2UIListComponent
  | A2UICardComponent
  | A2UITabsComponent
  | A2UIDividerComponent
  // Interactive
  | A2UIButtonComponent
  | A2UICheckBoxComponent
  | A2UITextFieldComponent
  | A2UIDateTimeInputComponent
  | A2UIChoicePickerComponent
  | A2UISliderComponent
  // TDesign 扩展
  | A2UIInputComponent
  | A2UIRadioGroupComponent
  | A2UICheckboxGroupComponent;

/**
 * 组件类型枚举
 */
export const A2UIComponentType = {
  // Display
  Text: 'Text',
  Image: 'Image',
  Icon: 'Icon',
  // Layout
  Row: 'Row',
  Column: 'Column',
  List: 'List',
  Card: 'Card',
  Tabs: 'Tabs',
  Divider: 'Divider',
  // Interactive
  Button: 'Button',
  CheckBox: 'CheckBox',
  TextField: 'TextField',
  DateTimeInput: 'DateTimeInput',
  ChoicePicker: 'ChoicePicker',
  Slider: 'Slider',
  // TDesign 扩展
  Input: 'Input',
  RadioGroup: 'RadioGroup',
  CheckboxGroup: 'CheckboxGroup',
} as const;

// ============= A2UI v0.9 消息类型 =============

/**
 * createSurface 消息
 */
export interface CreateSurfaceMessage {
  createSurface: {
    surfaceId: string;
    catalogId: string;
  };
}

/**
 * updateComponents 消息
 */
export interface UpdateComponentsMessage {
  updateComponents: {
    surfaceId: string;
    components: A2UIComponentBase[];
  };
}

/**
 * updateDataModel 消息
 */
export interface UpdateDataModelMessage {
  updateDataModel: {
    surfaceId: string;
    path?: string;
    op?: 'add' | 'replace' | 'remove';
    value?: unknown;
  };
}

/**
 * deleteSurface 消息
 */
export interface DeleteSurfaceMessage {
  deleteSurface: {
    surfaceId: string;
  };
}

/**
 * 服务端消息联合类型
 */
export type A2UIServerMessage =
  | CreateSurfaceMessage
  | UpdateComponentsMessage
  | UpdateDataModelMessage
  | DeleteSurfaceMessage;

// ============= Surface 类型 =============

/**
 * Surface 状态
 */
export type SurfaceState = 'active' | 'closed' | 'pending';

/**
 * Skeleton 布局提示
 */
export type SkeletonLayoutHint = 'form' | 'card' | 'list' | 'simple' | 'wizard';

/**
 * Skeleton 配置
 */
export interface SkeletonHint {
  layout?: SkeletonLayoutHint;
  rowCount?: number;
  animation?: 'gradient' | 'flashed' | 'none';
}

/**
 * 解析后的组件节点（带 children 引用）
 */
export interface ResolvedComponent extends A2UIComponentBase {
  resolvedChildren?: ResolvedComponent[];
  dataContextPath?: string;
}

/**
 * A2UI Surface - UI 表面抽象
 */
export interface A2UISurface {
  id: string;
  catalogId?: string;
  state: SurfaceState;
  /** 组件平铺注册表 */
  components: Map<string, A2UIComponentBase>;
  /** 解析后的组件树根节点 */
  root: ResolvedComponent | null;
  /** 数据模型 */
  data: Record<string, unknown>;
  /** 骨架屏提示 */
  skeletonHint?: SkeletonHint;
  updatedAt?: number;
}

// ============= 兼容旧版 Operation 类型 =============

export type A2UIOperationType = 'create' | 'update' | 'patch' | 'delete' | 'action';

export interface A2UIOperation {
  type: A2UIOperationType;
  surfaceId: string;
  componentId?: string;
  payload?: A2UIComponent | Partial<A2UIComponent> | A2UIAction | Record<string, unknown>;
}

export interface A2UIMessage {
  surfaceId: string;
  operations: A2UIOperation[];
  data?: Record<string, unknown>;
}

// ============= Zod Schema (运行时验证) =============

export const A2UIComponentBaseSchema = z.object({
  id: z.string(),
  component: z.string(),
}).passthrough();

export const createSurfaceMessageSchema = z.object({
  createSurface: z.object({
    surfaceId: z.string(),
    catalogId: z.string(),
  }),
});

export const updateComponentsMessageSchema = z.object({
  updateComponents: z.object({
    surfaceId: z.string(),
    components: z.array(A2UIComponentBaseSchema).min(1),
  }),
});

export const updateDataModelMessageSchema = z.object({
  updateDataModel: z.object({
    surfaceId: z.string(),
    path: z.string().optional(),
    op: z.enum(['add', 'replace', 'remove']).optional(),
    value: z.any().optional(),
  }),
});

export const deleteSurfaceMessageSchema = z.object({
  deleteSurface: z.object({
    surfaceId: z.string(),
  }),
});

export const serverMessageSchema = z.union([
  createSurfaceMessageSchema,
  updateComponentsMessageSchema,
  updateDataModelMessageSchema,
  deleteSurfaceMessageSchema,
]);

export const A2UISurfaceSchema = z.object({
  id: z.string(),
  catalogId: z.string().optional(),
  state: z.enum(['active', 'closed', 'pending']),
  root: z.any().nullable(),
  data: z.record(z.unknown()).optional(),
  skeletonHint: z.object({
    layout: z.enum(['form', 'card', 'list', 'simple', 'wizard']).optional(),
    rowCount: z.number().optional(),
    animation: z.enum(['gradient', 'flashed', 'none']).optional(),
  }).optional(),
  updatedAt: z.number().optional(),
});
