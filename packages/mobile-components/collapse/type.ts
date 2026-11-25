/* eslint-disable */

/**
 * 该文件为脚本自动生成文件，请勿随意修改。如需修改请联系 PMC
 * */

import type { TNode, TElement } from '../common';
import type { MouseEvent } from 'react';

export interface TdCollapseProps {
  /**
   * 折叠面板列表内容
   */
  children?: TNode;
  /**
   * 默认是否展开全部
   * @default false
   */
  defaultExpandAll?: boolean;
  /**
   * 是否禁用面板展开/收起操作
   */
  disabled?: boolean;
  /**
   * 展开图标。值为 undefined 或 false 则不显示展开图标；值为 true 显示默认图标；值类型为函数，则表示完全自定义展开图标
   * @default true
   */
  expandIcon?: TNode;
  /**
   * 每个面板互斥展开，每次只展开一个面板
   * @default false
   */
  expandMutex?: boolean;
  /**
   * 折叠面板风格
   * @default default
   */
  theme?: 'default' | 'card';
  /**
   * 展开的面板集合
   * @default []
   */
  value?: CollapseValue;
  /**
   * 展开的面板集合，非受控属性
   * @default []
   */
  defaultValue?: CollapseValue;
  /**
   * 切换面板时触发，返回变化的值
   */
  onChange?: (value: CollapseValue, context: { e: MouseEvent<HTMLDivElement> }) => void;
}

export interface TdCollapsePanelProps {
  /**
   * 折叠面板内容，同 content
   */
  children?: TNode;
  /**
   * 折叠面板内容
   */
  content?: TNode;
  /**
   * 当前面板处理折叠状态时，是否销毁面板内容
   * @default false
   */
  destroyOnCollapse?: boolean;
  /**
   * 禁止当前面板展开，优先级大于 Collapse 的同名属性
   */
  disabled?: boolean;
  /**
   * 当前折叠面板展开图标，优先级大于 Collapse 的同名属性
   */
  expandIcon?: TNode;
  /**
   * 面板头内容
   */
  header?: TNode;
  /**
   * 面板头左侧图标
   */
  headerLeftIcon?: TElement;
  /**
   * 面板头的右侧区域，一般用于呈现面板操作
   */
  headerRightContent?: TNode;
  /**
   * 选项卡内容的位置
   * @default bottom
   */
  placement?: 'bottom' | 'top';
  /**
   * 当前面板唯一标识，如果值为空则取当前面下标兜底作为唯一标识
   */
  value?: string | number;
}

export type CollapseValue = Array<string | number>;
