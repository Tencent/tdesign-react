/**
 * A2UI v0.9 → json-render 适配器
 * 将 A2UI v0.9 协议转换为 json-render Schema
 * 
 * 核心设计：
 * 1. A2UI v0.9 的 createSurface 只是初始化信号，不包含组件数据
 * 2. 组件数据通过 updateComponents 消息逐步发送（数组形式）
 * 3. 数据模型通过 updateDataModel 消息填充
 * 4. 组件字段名是 'component'，不是 'type'
 */

import type { UIElement } from '@json-render/core';
import type { JsonRenderSchema } from './types/core';
import type { A2UIComponent, A2UIMessage, A2UISurfaceState } from './types/a2ui';

/**
 * 组件类型映射表
 * A2UI 类型 → json-render 类型
 */
const TYPE_MAPPING: Record<string, string> = {
  // 基础组件
  Text: 'Text',
  Image: 'Image',
  Icon: 'Icon',
  Video: 'Video',
  AudioPlayer: 'AudioPlayer',
  Button: 'Button',
  TextField: 'TextField', // 映射到 TextField 以支持数据绑定
  CheckBox: 'Checkbox',
  ChoicePicker: 'Select',
  Slider: 'Slider',
  DateTimeInput: 'DatePicker',
  
  // 布局组件
  Card: 'Card',
  Row: 'Row',
  Column: 'Column', // A2UI Column → json-render Column（垂直布局），不是 Col（栅格列）
  Col: 'Col',       // 保留 Col 映射给显式使用栅格的场景
  List: 'List',
  Tabs: 'Tabs',
  Divider: 'Divider',
  Modal: 'Dialog',
};

/**
 * 属性映射函数
 * 将 A2UI v0.9 组件属性转换为 json-render 组件属性
 */
function mapProps(component: A2UIComponent): Record<string, any> {
  // 排除 A2UI 特有字段，保留其他属性
  const { id, component: componentType, weight, child, children, ...restProps } = component;
  
  const mappedProps: Record<string, any> = { ...restProps };

  // 处理 weight（flex-grow）
  if (weight !== undefined) {
    mappedProps.style = {
      ...mappedProps.style,
      flexGrow: weight,
    };
  }

  // 特定类型的属性转换
  switch (componentType) {
    case 'Button':
      // A2UI Button 的 text 属性 → json-render 的 label（或 children）
      if (mappedProps.text && typeof mappedProps.text === 'string') {
        mappedProps.label = mappedProps.text;
        delete mappedProps.text;
      }
      // A2UI action 格式转换：{ name, context } → { name, params }
      // context 中的 { path: "/xxx" } 会在运行时被 Button 组件解析
      if (mappedProps.action && typeof mappedProps.action === 'object') {
        const a2uiAction = mappedProps.action as { name: string; context?: Record<string, unknown> };
        mappedProps.action = {
          name: a2uiAction.name,
          // 将 context 转为 params，保留动态绑定引用供运行时解析
          params: a2uiAction.context || {},
        };
      }
      // 处理 theme 映射（A2UI 的 theme: 'primary' → TDesign 的 theme: 'primary'）
      // 保持不变，TDesign Button 支持 theme 属性
      break;

    case 'TextField':
      // A2UI TextField 的 text 属性（数据绑定）→ json-render 的 value
      if (mappedProps.text && typeof mappedProps.text === 'object' && mappedProps.text.path) {
        mappedProps.valuePath = mappedProps.text.path;
        delete mappedProps.text;
      }
      break;

    case 'CheckBox':
      // A2UI CheckBox 的 checked 属性（数据绑定）
      if (mappedProps.checked && typeof mappedProps.checked === 'object' && mappedProps.checked.path) {
        mappedProps.valuePath = mappedProps.checked.path;
        delete mappedProps.checked;
      }
      break;

    case 'Column':
      // A2UI Column 的 gap 属性 → json-render Column 的 size 属性 + CSS gap 后备
      if (mappedProps.gap !== undefined) {
        mappedProps.size = mappedProps.gap;
        // 同时设置 CSS gap 作为后备方案
        mappedProps.style = {
          ...mappedProps.style,
          display: 'flex',
          flexDirection: 'column',
          gap: `${mappedProps.gap}px`,
        };
        delete mappedProps.gap;
      }
      break;

    case 'Row':
      // A2UI Row 的 gap 属性 → json-render Row 的 gutter 属性 + CSS gap 后备
      if (mappedProps.gap !== undefined) {
        mappedProps.gutter = mappedProps.gap;
        // 同时设置 CSS gap 作为后备方案
        mappedProps.style = {
          ...mappedProps.style,
          display: 'flex',
          flexDirection: 'row',
          gap: `${mappedProps.gap}px`,
        };
        delete mappedProps.gap;
      }
      // A2UI Row 的 distribution 属性 → json-render Row 的 justify 属性
      if (mappedProps.distribution) {
        const distributionMap: Record<string, string> = {
          start: 'start',
          end: 'end',
          center: 'center',
          'space-between': 'space-between',
          'space-around': 'space-around',
        };
        mappedProps.justify = distributionMap[mappedProps.distribution] || mappedProps.distribution;
        // 同时设置 CSS justifyContent
        mappedProps.style = {
          ...mappedProps.style,
          justifyContent: mappedProps.distribution === 'end' ? 'flex-end' : mappedProps.distribution,
        };
        delete mappedProps.distribution;
      }
      break;

    default:
      break;
  }

  // 处理通用的 disabled 数据绑定
  if (mappedProps.disabled && typeof mappedProps.disabled === 'object' && mappedProps.disabled.path) {
    mappedProps.disabledPath = mappedProps.disabled.path;
    delete mappedProps.disabled;
  }

  return mappedProps;
}

/**
 * 转换单个 A2UI 组件为 json-render UIElement
 */
function convertComponent(component: A2UIComponent): UIElement {
  // A2UI v0.9 使用 'component' 字段，不是 'type'
  const a2uiType = component.component;
  const mappedType = TYPE_MAPPING[a2uiType] || a2uiType;
  const props = mapProps(component);

  const element: UIElement = {
    key: component.id, // UIElement 需要 key 属性
    type: mappedType,
    props,
  };

  // 处理子组件
  if (component.children) {
    if (Array.isArray(component.children)) {
      // 静态子组件数组
      element.children = component.children;
    } else if (typeof component.children === 'object' && component.children.path) {
      // 模板子组件（数据绑定列表）
      element.props.childrenPath = component.children.path;
      element.props.childTemplate = component.children.componentId;
    }
  } else if (component.child) {
    // 单子组件
    element.children = [component.child];
  }

  return element;
}

/**
 * 从 A2UI 消息数组构建 Surface 状态
 * 累积处理所有消息类型
 */
function buildSurfaceState(messages: A2UIMessage[]): A2UISurfaceState | null {
  let surfaceState: A2UISurfaceState | null = null;

  for (const msg of messages) {
    // 1. createSurface - 初始化 Surface
    if (msg.createSurface) {
      surfaceState = {
        surfaceId: msg.createSurface.surfaceId,
        catalogId: msg.createSurface.catalogId,
        components: new Map(),
        dataModel: {},
      };
    }

    // 2. updateComponents - 累积组件
    if (msg.updateComponents && surfaceState) {
      const { components } = msg.updateComponents;
      // A2UI v0.9 的 components 是数组
      if (Array.isArray(components)) {
        for (const comp of components) {
          surfaceState.components.set(comp.id, comp);
        }
      }
    }

    // 3. updateDataModel - 累积数据
    if (msg.updateDataModel && surfaceState) {
      const { path, op, value } = msg.updateDataModel;
      const operation = op || 'replace';
      
      if (operation === 'replace' && (path === '/' || !path)) {
        // 替换整个数据模型
        surfaceState.dataModel = value as Record<string, unknown>;
      } else if (operation === 'replace' && path) {
        // 替换指定路径
        setValueByPath(surfaceState.dataModel, path, value);
      } else if (operation === 'add' && path) {
        // 添加到指定路径
        setValueByPath(surfaceState.dataModel, path, value);
      } else if (operation === 'remove' && path) {
        // 删除指定路径
        deleteValueByPath(surfaceState.dataModel, path);
      }
    }

    // 4. deleteSurface - 删除 Surface（返回 null）
    if (msg.deleteSurface && surfaceState?.surfaceId === msg.deleteSurface.surfaceId) {
      surfaceState = null;
    }
  }

  return surfaceState;
}

/**
 * 根据 JSON Pointer 路径设置值
 * 支持数组索引路径（如 /list/0/name）
 */
function setValueByPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('/').filter(Boolean);
  let current: any = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    if (!(key in current)) {
      // 如果下一个 key 是数字，创建数组；否则创建对象
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = current[key];
  }
  
  if (parts.length > 0) {
    current[parts[parts.length - 1]] = value;
  }
}

/**
 * 根据 JSON Pointer 路径删除值
 * 支持数组索引路径
 */
function deleteValueByPath(obj: Record<string, unknown>, path: string): void {
  const parts = path.split('/').filter(Boolean);
  let current: any = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (!(key in current)) return;
    current = current[key];
  }
  
  if (parts.length > 0) {
    const lastKey = parts[parts.length - 1];
    if (Array.isArray(current) && /^\d+$/.test(lastKey)) {
      // 数组元素删除
      current.splice(parseInt(lastKey, 10), 1);
    } else {
      delete current[lastKey];
    }
  }
}

/**
 * 将 Surface 状态转换为 json-render Schema
 */
function surfaceStateToSchema(state: A2UISurfaceState): JsonRenderSchema {
  const elements: Record<string, UIElement> = {};

  // 遍历所有组件，转换为 json-render elements
  state.components.forEach((component, id) => {
    elements[id] = convertComponent(component);
  });

  return {
    root: 'root', // A2UI v0.9 规定必须有 id 为 'root' 的组件
    elements,
    data: state.dataModel,
  };
}

/**
 * 转换 A2UI v0.9 消息数组为 json-render Schema
 * 
 * 处理流程：
 * 1. 查找 createSurface 消息初始化 Surface
 * 2. 累积所有 updateComponents 消息构建组件树
 * 3. 累积所有 updateDataModel 消息填充数据
 * 4. 转换为 json-render Schema
 * 
 * @param messages A2UI 消息数组
 * @returns json-render Schema 或 null
 */
export function convertA2UIMessagesToJsonRender(
  messages: A2UIMessage[],
): JsonRenderSchema | null {
  if (!messages || messages.length === 0) {
    return null;
  }

  // 构建 Surface 状态
  const surfaceState = buildSurfaceState(messages);
  
  if (!surfaceState) {
    return null;
  }

  // 检查是否有 root 组件
  if (!surfaceState.components.has('root')) {
    return null;
  }

  // 转换为 json-render Schema
  return surfaceStateToSchema(surfaceState);
}

/**
 * 应用增量更新到现有 Schema
 * 
 * @param schema 当前 json-render Schema
 * @param components A2UI updateComponents 的组件数组
 * @returns 更新后的 Schema
 */
export function applyA2UIUpdates(
  schema: JsonRenderSchema,
  components: A2UIComponent[],
): JsonRenderSchema {
  if (!Array.isArray(components)) {
    return schema;
  }

  const newElements = { ...schema.elements };

  for (const component of components) {
    // 转换组件并添加/更新
    newElements[component.id] = convertComponent(component);
  }

  return {
    ...schema,
    elements: newElements,
  };
}

/**
 * 应用数据模型更新到现有 Schema
 * 
 * @param schema 当前 json-render Schema
 * @param path JSON Pointer 路径
 * @param op 操作类型
 * @param value 值
 * @returns 更新后的 Schema
 */
export function applyA2UIDataUpdate(
  schema: JsonRenderSchema,
  path: string | undefined,
  op: 'add' | 'replace' | 'remove' = 'replace',
  value?: unknown,
): JsonRenderSchema {
  const newData = { ...schema.data };

  if (op === 'replace' && (path === '/' || !path)) {
    return {
      ...schema,
      data: value as Record<string, unknown>,
    };
  }

  if (path) {
    if (op === 'remove') {
      deleteValueByPath(newData, path);
    } else {
      setValueByPath(newData, path, value);
    }
  }

  return {
    ...schema,
    data: newData,
  };
}

export default {
  convertA2UIMessagesToJsonRender,
  applyA2UIUpdates,
  applyA2UIDataUpdate,
};