/**
 * 自定义业务组件：ProgressBar
 * 展示进度条
 * 
 * 注意：无需手动添加 React.memo 比较函数
 * createCustomRegistry 会自动使用 withStableProps 包装，
 * 基于 react-fast-compare 进行高效深比较
 */
import React from 'react';
import type { ComponentRenderProps } from '@json-render/react';

export const ProgressBar: React.FC<ComponentRenderProps> = ({ element }) => {
  const { label, percentage, showInfo = true } = element.props as {
    label?: string;
    percentage: number;
    showInfo?: boolean;
  };

  // 根据进度百分比决定颜色
  let color: string;
  if (percentage < 30) {
    color = '#f5222d'; // 红色
  } else if (percentage < 70) {
    color = '#faad14'; // 橙色
  } else {
    color = '#52c41a'; // 绿色
  }

  console.log("====ProgressBar render")
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            flex: 1,
            height: '20px',
            borderRadius: '10px',
            backgroundColor: 'var(--td-bg-color-component)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: color,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        {showInfo && (
          <span style={{ fontSize: '14px', fontWeight: 600, color, minWidth: '45px' }}>
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
};
