import React from 'react';
import { Collapse, Tag } from 'tdesign-react';

const { Panel } = Collapse;

// 状态渲染函数
const renderStatusTag = (status: 'pending' | 'streaming' | 'complete') => {
  const statusConfig = {
    pending: { color: 'warning', text: '处理中' },
    streaming: { color: 'processing', text: '执行中' },
    complete: { color: 'success', text: '已完成' },
  };

  const config = statusConfig[status] || statusConfig.complete;

  return (
    <Tag theme={config.color} size="small">
      {config.text}
    </Tag>
  );
};

export default function CustomToolCallRenderer({
  toolCall,
  status = 'complete',
}: {
  toolCall: any;
  status: 'pending' | 'streaming' | 'complete';
}) {
  const { toolCallName, args, result } = toolCall;

  if (toolCallName === 'search') {
    // 搜索工具的特殊处理
    let searchResult: any = null;
    try {
      searchResult = typeof result === 'string' ? JSON.parse(result) : result;
    } catch (e) {
      searchResult = { title: '解析错误', references: [] };
    }

    return (
      <Collapse style={{ margin: '8px 0' }}>
        <Panel header="🔍 搜索工具调用" headerRightContent={renderStatusTag(status)}>
          {searchResult && (
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>{searchResult.title}</div>
              {searchResult.references && searchResult.references.length > 0 && (
                <div>
                  {searchResult.references.map((ref: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '12px', marginBottom: '2px', paddingLeft: '8px' }}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                      >
                        📄 {ref.title}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Panel>
      </Collapse>
    );
  }

  // 默认工具调用渲染
  return (
    <Collapse style={{ margin: '8px 0' }}>
      <Panel header={`🔧 ${toolCallName || '工具调用'}`} headerRightContent={renderStatusTag(status)}>
        {args && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            参数: {typeof args === 'string' ? args : JSON.stringify(args)}
          </div>
        )}
        {result && (
          <div style={{ fontSize: '12px', color: '#333' }}>
            结果: {typeof result === 'string' ? result : JSON.stringify(result)}
          </div>
        )}
      </Panel>
    </Collapse>
  );
}
