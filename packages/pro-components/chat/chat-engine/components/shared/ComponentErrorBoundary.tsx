import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** 组件标识，用于错误日志 */
  componentName: string;
  /** 日志前缀，如 'ActivityRenderer' 或 'ToolCallRenderer' */
  logPrefix?: string;
  /** 自定义错误渲染，默认返回 null */
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 通用错误边界组件
 * 捕获子组件渲染错误，防止整个对话列表崩溃
 */
export class ComponentErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentName, logPrefix = 'ComponentRenderer' } = this.props;
    console.error(`[${logPrefix}] Error in "${componentName}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
