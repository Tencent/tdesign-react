/* eslint-disable class-methods-use-this */
/* eslint-disable no-await-in-loop, max-classes-per-file */
// 日志接口
export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

// 默认日志实现
export class ConsoleLogger implements Logger {
  private enableDebug: boolean;

  constructor(enableDebug = false) {
    this.enableDebug = enableDebug;
  }

  debug(message: string, ...args: any[]): void {
    if (this.enableDebug) {
      console.debug(`[SSE Debug] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    console.info(`[SSE Info] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[SSE Warn] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[SSE Error] ${message}`, ...args);
  }
}

export class LoggerManager {
  private static instance: Logger;

  private static customLogger: Logger | null = null;

  /**
   * 获取日志实例（单例模式）
   */
  static getLogger(): Logger {
    if (this.customLogger) {
      return this.customLogger;
    }

    if (!this.instance) {
      this.instance = new ConsoleLogger();
    }
    return this.instance;
  }

  /**
   * 设置自定义日志实例
   */
  static setLogger(logger: Logger): void {
    this.customLogger = logger;
  }

  /**
   * 重置为默认日志
   */
  static resetToDefault(): void {
    this.customLogger = null;
  }
}
