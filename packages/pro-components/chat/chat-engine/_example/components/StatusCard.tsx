/**
 * 自定义业务组件：StatusCard
 * 展示状态信息卡片
 * 
 * 注意：无需手动添加 React.memo 比较函数
 * createCustomRegistry 会自动使用 withStableProps 包装，
 * 基于 react-fast-compare 进行高效深比较
 */
import React from 'react';
import type { ComponentRenderProps } from '@json-render/react';

export const StatusCard: React.FC<ComponentRenderProps> = ({ element }) => {
  const { title, status, description, icon } = element.props as {
    title: string;
    status: 'success' | 'warning' | 'error' | 'info';
    description?: string;
    icon?: string;
  };

  const statusColors = {
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#1890ff',
  };

  const statusIcons = {
    success: '✓',
    warning: '⚠',
    error: '✗',
    info: 'ℹ',
  };

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        border: `2px solid ${statusColors[status]}`,
        backgroundColor: `${statusColors[status]}10`,
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          color: statusColors[status],
        }}
      >
        {icon || statusIcons[status]}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: statusColors[status],
            marginBottom: description ? '4px' : 0,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: '14px',
              color: 'var(--td-text-color-secondary)',
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
