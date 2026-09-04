/**
 * 自定义业务组件：NestedPanel
 * 支持嵌套子组件的面板容器
 * 
 * 用于验证 json-render 多重嵌套层级下更新深层子组件 props 的能力
 */
import React from 'react';
import type { ComponentRenderProps } from '@tdesign-react/chat';

export const NestedPanel: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const { 
    title, 
    level = 1, 
    collapsed = false,
    borderColor = '#e0e0e0',
    backgroundColor = '#fafafa'
  } = element.props as {
    title: string;
    level?: number;
    collapsed?: boolean;
    borderColor?: string;
    backgroundColor?: string;
  };

  // 根据层级计算左边距
  const paddingLeft = (level - 1) * 16;
  
  // 根据层级调整样式
  const levelColors = [
    { border: '#1890ff', bg: '#e6f7ff' },
    { border: '#52c41a', bg: '#f6ffed' },
    { border: '#faad14', bg: '#fffbe6' },
    { border: '#f5222d', bg: '#fff2f0' },
  ];
  
  const colorScheme = levelColors[(level - 1) % levelColors.length];

  console.log(`====NestedPanel render: ${title}, level: ${level}, collapsed: ${collapsed}`);

  return (
    <div
      style={{
        marginLeft: paddingLeft,
        marginTop: '8px',
        marginBottom: '8px',
        border: `2px solid ${borderColor || colorScheme.border}`,
        borderRadius: '8px',
        backgroundColor: backgroundColor || colorScheme.bg,
        overflow: 'hidden',
      }}
    >
      {/* 标题区域 */}
      <div
        style={{
          padding: '8px 12px',
          backgroundColor: borderColor || colorScheme.border,
          color: '#fff',
          fontWeight: 600,
          fontSize: `${Math.max(16 - level * 2, 12)}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ opacity: 0.8 }}>L{level}</span>
        <span>{title}</span>
        {collapsed && <span style={{ fontSize: '12px', opacity: 0.7 }}>(已折叠)</span>}
      </div>
      
      {/* 内容区域 */}
      {!collapsed && (
        <div style={{ padding: '12px' }}>
          {children}
        </div>
      )}
    </div>
  );
};
