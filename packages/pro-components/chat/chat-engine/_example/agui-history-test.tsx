import React, { useState, useMemo } from 'react';
import { Card, Space, Button, Divider } from 'tdesign-react';
import { AGUIAdapter } from 'tdesign-web-components/lib/chat-engine';
import type { AGUIHistoryMessage, AGUIActivityMessage } from 'tdesign-web-components/lib/chat-engine';

/**
 * AG-UI 历史消息转换测试
 *
 * 测试 AGUIAdapter.convertHistoryMessages 方法对 Activity 消息的转换逻辑
 * 模拟真实的 AG-UI 后端返回的历史消息格式
 */

interface TestResult {
  original: AGUIHistoryMessage[];
  converted: any[];
  analysis: {
    totalOriginal: number;
    totalConverted: number;
    activityCount: number;
    customCount: number;
    errors: string[];
  };
}

const AGUIHistoryTest: React.FC = () => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  // 模拟真实的 AG-UI 历史消息格式
  const mockAGUIHistory: AGUIHistoryMessage[] = useMemo(
    () =>
      [
        // 用户消息
        {
          id: '4aaa0e1c-0a33-40ec-b2d6-5b7996b39eb2',
          role: 'user',
          content: '环境通是什么？',
          timestamp: new Date('2026-01-19T13:38:51.118Z').getTime(),
        },
        // AI 回复消息
        {
          id: 'chatcmpl-f41cc55d-825b-9788-aa8d-82a1a342a2b4',
          role: 'assistant',
          content: '我来帮您查找环境通的相关信息。',
          timestamp: new Date('2026-01-19T13:38:52.118Z').getTime(),
        },
        // Activity 消息 - STEP_FINISHED
        {
          id: 'activity-step-finished-1',
          role: 'activity',
          activityType: 'STEP_FINISHED',
          content: {
            stepName: 'knowledge-agent',
          },
          timestamp: new Date('2026-01-19T13:38:53.118Z').getTime(),
        } as AGUIActivityMessage,
        // Activity 消息 - STEP_STARTED
        {
          id: 'activity-step-started-1',
          role: 'activity',
          activityType: 'STEP_STARTED',
          content: {
            stepName: '资料检索中...',
          },
          timestamp: new Date('2026-01-19T13:38:54.118Z').getTime(),
        } as AGUIActivityMessage,
        // Activity 消息 - STEP_FINISHED
        {
          id: 'activity-step-finished-2',
          role: 'activity',
          activityType: 'STEP_FINISHED',
          content: {
            stepName: '资料检索中...',
          },
          timestamp: new Date('2026-01-19T13:38:55.118Z').getTime(),
        } as AGUIActivityMessage,
        // Activity 消息 - CUSTOM (存储为 Activity)
        {
          id: 'activity-custom-1',
          role: 'activity',
          activityType: 'CUSTOM',
          content: {
            name: 'searchGuid',
            value: {
              _dedupeKey: 'call_83f0a6f7dc714710a423de_824678640016',
              _eventId: 'searchGuid_call_83f0a6f7dc714710a423de_824678640016',
              _timestamp: 1768829583987,
              documents: [
                {
                  chunk_content: '# 环境通是什么',
                  doc_file_path: '智研用户手册/项目-功能介绍/环境通',
                  link: 'https://iwiki.woa.com/p/4013009239',
                  title: '简介',
                },
                {
                  chunk_content: '环境模板用于描述一套完整的环境信息...',
                  doc_file_path: '智研用户手册/项目-功能介绍/环境通/产品使用文档',
                  link: 'https://iwiki.woa.com/p/4007790186',
                  title: '环境模板',
                },
              ],
              totalCount: 10,
            },
          },
          timestamp: new Date('2026-01-19T13:38:56.118Z').getTime(),
        } as AGUIActivityMessage,
      ] as AGUIHistoryMessage[],
    [],
  );

  const runTest = () => {
    try {
      console.log('原始 AG-UI 历史消息:', mockAGUIHistory);

      // 执行转换
      const converted = AGUIAdapter.convertHistoryMessages(mockAGUIHistory);

      console.log('转换后的消息:', converted);

      // 分析结果
      const analysis = {
        totalOriginal: mockAGUIHistory.length,
        totalConverted: converted.length,
        activityCount: mockAGUIHistory.filter((msg) => msg.role === 'activity').length,
        customCount: mockAGUIHistory.filter((msg) => msg.role === 'activity' && (msg as any).activityType === 'CUSTOM')
          .length,
        errors: [] as string[],
      };

      // 验证转换结果
      converted.forEach((msg, index) => {
        if (msg.role === 'assistant' && Array.isArray(msg.content)) {
          msg.content.forEach((content: any, contentIndex: number) => {
            // 检查 activity 内容是否正确转换
            if (content.type?.startsWith('activity-')) {
              if (!content.data?.activityType || content.data?.content === undefined) {
                analysis.errors.push(`消息 ${index} 内容 ${contentIndex}: Activity 数据结构不完整`);
              }
            }
            // 检查 custom 内容是否正确转换
            if (content.type === 'custom') {
              if (!content.data?.name) {
                analysis.errors.push(`消息 ${index} 内容 ${contentIndex}: Custom 数据结构不完整`);
              }
            }
          });
        }
      });

      // 验证分组逻辑
      let expectedGroups = 0;
      let currentGroup = null;
      mockAGUIHistory.forEach((msg) => {
        if (msg.role === 'user') {
          if (currentGroup !== null) {
            expectedGroups += 1;
          }
          currentGroup = 'user';
        } else if (msg.role === 'assistant' || msg.role === 'activity') {
          if (currentGroup === 'user') {
            currentGroup = 'assistant';
          }
        }
      });
      if (currentGroup !== null) {
        expectedGroups += 1;
      }

      const actualUserMessages = converted.filter((msg) => msg.role === 'user').length;
      const actualAssistantMessages = converted.filter((msg) => msg.role === 'assistant').length;

      console.log('分组验证:', { expectedGroups, actualUserMessages, actualAssistantMessages });

      if (actualUserMessages !== 2) {
        analysis.errors.push(`期望 1 个用户消息，实际得到 ${actualUserMessages} 个`);
      }
      if (actualAssistantMessages !== 2) {
        analysis.errors.push(`期望 1 个助手消息，实际得到 ${actualAssistantMessages} 个`);
      }

      setTestResult({
        original: mockAGUIHistory,
        converted,
        analysis,
      });
    } catch (error) {
      console.error('测试执行失败:', error);
      setTestResult({
        original: mockAGUIHistory,
        converted: [],
        analysis: {
          totalOriginal: mockAGUIHistory.length,
          totalConverted: 0,
          activityCount: 0,
          customCount: 0,
          errors: [`执行错误: ${error instanceof Error ? error.message : '未知错误'}`],
        },
      });
    }
  };

  const renderOriginalMessage = (msg: AGUIHistoryMessage, index: number) => (
    <Card key={index} size="small" style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
        <strong>#{index + 1}</strong> | <strong>ID:</strong> {msg.id} | <strong>Role:</strong> {msg.role}
        {msg.role === 'activity' && (
          <>
            {' '}
            | <strong>ActivityType:</strong> {(msg as any).activityType}
          </>
        )}
      </div>
      <div style={{ fontSize: 14 }}>
        {msg.role === 'user' && (
          <div>
            <strong>Content:</strong> {(msg as any).content}
          </div>
        )}
        {msg.role === 'assistant' && (
          <div>
            <strong>Content:</strong> {(msg as any).content || '(无文本内容)'}
          </div>
        )}
        {msg.role === 'activity' && (
          <div>
            <strong>Content:</strong>
            <pre
              style={{
                fontSize: 11,
                background: 'var(--td-bg-color-secondarycontainer)',
                padding: 8,
                borderRadius: 4,
                marginTop: 4,
                maxHeight: 200,
                overflow: 'auto',
              }}
            >
              {JSON.stringify((msg as any).content, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );

  const renderConvertedMessage = (msg: any, index: number) => (
    <Card key={index} size="small" style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
        <strong>#{index + 1}</strong> | <strong>ID:</strong> {msg.id} | <strong>Role:</strong> {msg.role}
      </div>
      <div style={{ fontSize: 14 }}>
        {Array.isArray(msg.content) ? (
          <div>
            <strong>Content Array ({msg.content.length} items):</strong>
            {msg.content.map((content: any, contentIndex: number) => (
              <div
                key={contentIndex}
                style={{ marginLeft: 16, marginTop: 8, padding: 8, background: '#f9f9f9', borderRadius: 4 }}
              >
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                  <strong>Type:</strong> {content.type} | <strong>Status:</strong> {content.status || 'N/A'}
                </div>
                {content.type === 'text' && (
                  <div>
                    <strong>Data:</strong> {content.data}
                  </div>
                )}
                {content.type === 'markdown' && (
                  <div>
                    <strong>Data:</strong> {content.data}
                  </div>
                )}
                {content.type?.startsWith('activity-') && (
                  <div>
                    <strong>ActivityType:</strong> {content.data?.activityType}
                    <pre
                      style={{
                        fontSize: 10,
                        background: '#fff',
                        padding: 4,
                        borderRadius: 2,
                        marginTop: 4,
                        maxHeight: 150,
                        overflow: 'auto',
                      }}
                    >
                      {JSON.stringify(content.data?.content, null, 2)}
                    </pre>
                  </div>
                )}
                {content.type === 'custom' && (
                  <div>
                    <strong>Name:</strong> {content.data?.name}
                    <pre
                      style={{
                        fontSize: 10,
                        background: '#fff',
                        padding: 4,
                        borderRadius: 2,
                        marginTop: 4,
                        maxHeight: 150,
                        overflow: 'auto',
                      }}
                    >
                      {JSON.stringify(content.data?.value, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <strong>Content:</strong> {JSON.stringify(msg.content)}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <h2>AG-UI 历史消息转换测试</h2>
            <p style={{ color: '#666' }}>
              测试 AGUIAdapter.convertHistoryMessages 方法对 Activity 和 Custom 消息的转换逻辑
            </p>
            <div style={{ fontSize: 14, color: '#999' }}>
              测试场景：包含 STEP_FINISHED、STEP_STARTED、CUSTOM、plan-todo 等多种 Activity 类型
            </div>
          </div>

          <Button theme="primary" onClick={runTest}>
            执行转换测试
          </Button>

          {testResult && (
            <>
              <Divider />

              {/* 测试结果摘要 */}
              <Card title="测试结果摘要">
                <Space direction="vertical">
                  <div>
                    原始消息数量: <strong>{testResult.analysis.totalOriginal}</strong>
                  </div>
                  <div>
                    转换后消息数量: <strong>{testResult.analysis.totalConverted}</strong>
                  </div>
                  <div>
                    Activity 消息数量: <strong>{testResult.analysis.activityCount}</strong>
                  </div>
                  <div>
                    Custom 消息数量: <strong>{testResult.analysis.customCount}</strong>
                  </div>
                  {testResult.analysis.errors.length > 0 && (
                    <div style={{ color: '#ff4d4f' }}>
                      <strong>❌ 发现问题:</strong>
                      <ul style={{ marginTop: 8 }}>
                        {testResult.analysis.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {testResult.analysis.errors.length === 0 && (
                    <div style={{ color: '#52c41a', fontSize: 16 }}>✅ 转换成功，无错误</div>
                  )}
                </Space>
              </Card>

              <div style={{ display: 'flex', gap: 16 }}>
                {/* 原始消息 */}
                <div style={{ flex: 1 }}>
                  <Card
                    title={`原始 AG-UI 消息 (${testResult.original.length} 条)`}
                    style={{ height: 700, overflow: 'auto' }}
                  >
                    {testResult.original.map((msg, index) => renderOriginalMessage(msg, index))}
                  </Card>
                </div>

                {/* 转换后消息 */}
                <div style={{ flex: 1 }}>
                  <Card
                    title={`转换后的 ChatEngine 消息 (${testResult.converted.length} 条)`}
                    style={{ height: 700, overflow: 'auto' }}
                  >
                    {testResult.converted.map((msg, index) => renderConvertedMessage(msg, index))}
                  </Card>
                </div>
              </div>
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default AGUIHistoryTest;
