/* eslint-disable class-methods-use-this */
import type { AIContentChunkUpdate, SSEChunkData } from '../../type';
import { EventType } from './events';
import { AGUIEventMapper } from './agui-event-mapper';

/**
 * TravelPlannerMapper
 * 扩展AGUIEventMapper，专门处理旅游规划场景的AG-UI事件
 * 在基础事件映射基础上，增加旅游规划特定的业务逻辑
 */
export class TravelPlannerMapper extends AGUIEventMapper {
  private planningState: any = null;

  /**
   * 重写mapEvent方法，优先处理旅游规划特定事件
   * 如果没有特定处理，则回退到父类的通用处理
   */
  mapEvent(chunk: SSEChunkData): AIContentChunkUpdate | AIContentChunkUpdate[] | null {
    const event = chunk.data;
    if (!event?.type) return null;

    // 优先处理旅游规划特定事件
    const travelSpecificResult = this.handleTravelPlanningEvents(event);
    if (travelSpecificResult !== null) {
      return travelSpecificResult;
    }

    // 回退到父类的通用处理
    return super.mapEvent(chunk);
  }

  /**
   * 处理旅游规划特定的AG-UI事件
   */
  private handleTravelPlanningEvents(event: any): AIContentChunkUpdate | AIContentChunkUpdate[] | null {
    switch (event.type) {
      case EventType.TOOL_CALL_RESULT:
        return this.handleTravelToolCallResult(event);

      case EventType.STATE_SNAPSHOT:
        return this.handleTravelStateSnapshot(event);

      case EventType.STATE_DELTA:
        return this.handleTravelStateDelta(event);

      case EventType.STEP_STARTED:
        return this.handleStepStarted(event);

      case EventType.STEP_FINISHED:
        return this.handleStepFinished(event);

      case EventType.RUN_STARTED:
        return this.handleRunStarted(event);

      case EventType.RUN_FINISHED:
        return this.handleRunFinished(event);

      default:
        return null; // 让父类处理
    }
  }

  /**
   * 处理旅游规划工具调用结果
   */
  private handleTravelToolCallResult(event: any): AIContentChunkUpdate | null {
    const { toolCallName, content } = event;

    try {
      switch (toolCallName) {
        case 'get_weather_forecast':
          const weatherData = JSON.parse(content);
          return {
            type: 'weather',
            data: { weather: weatherData },
            status: 'complete',
            strategy: 'append',
          };

        case 'plan_itinerary':
          const planData = JSON.parse(content);
          return {
            type: 'itinerary',
            data: { plan: planData },
            status: 'complete',
            strategy: 'append',
          };

        case 'get_hotel_details':
          const hotelData = JSON.parse(content);
          return {
            type: 'hotel',
            data: { hotels: hotelData },
            status: 'complete',
            strategy: 'append',
          };

        default:
          // 通用工具调用处理
          return {
            type: 'tool_call',
            data: {
              toolName: toolCallName,
              result: content,
            },
            status: 'complete',
            strategy: 'append',
          };
      }
    } catch (error) {
      console.error(`解析工具调用结果失败 (${toolCallName}):`, error);
      return {
        type: 'markdown',
        data: `❌ 工具调用结果解析失败: ${toolCallName}`,
        status: 'error',
        strategy: 'append',
      };
    }
  }

  /**
   * 处理旅游规划状态快照
   */
  private handleTravelStateSnapshot(event: any): AIContentChunkUpdate | null {
    const { snapshot } = event;
    this.planningState = snapshot;

    return {
      type: 'planning_state',
      data: { state: snapshot },
      status: 'complete',
      strategy: 'replace', // 状态快照总是替换
    };
  }

  /**
   * 处理旅游规划状态变更
   */
  private handleTravelStateDelta(event: any): AIContentChunkUpdate | null {
    const { delta } = event;

    // 应用状态变更
    if (this.planningState) {
      const newState = { ...this.planningState };
      delta.forEach((change: any) => {
        const { op, path, value } = change;
        if (op === 'replace') {
          if (path === '/status') {
            newState.status = value;
          }
        } else if (op === 'add') {
          if (path.startsWith('/itinerary/')) {
            if (!newState.itinerary) newState.itinerary = {};
            const key = path.split('/').pop();
            newState.itinerary[key] = value;
          }
        }
      });
      this.planningState = newState;
    }

    return {
      type: 'planning_state',
      data: { state: this.planningState },
      status: 'streaming',
      strategy: 'replace',
    };
  }

  /**
   * 处理步骤开始事件
   */
  private handleStepStarted(event: any): AIContentChunkUpdate | null {
    return {
      type: 'markdown',
      data: `🔄 **开始步骤**: ${event.stepName}`,
      status: 'streaming',
      strategy: 'append',
    };
  }

  /**
   * 处理步骤完成事件
   */
  private handleStepFinished(event: any): AIContentChunkUpdate | null {
    return {
      type: 'markdown',
      data: `✅ **完成步骤**: ${event.stepName}`,
      status: 'complete',
      strategy: 'append',
    };
  }

  /**
   * 处理运行开始事件
   */
  private handleRunStarted(event: any): AIContentChunkUpdate | null {
    return {
      type: 'markdown',
      data: `🚀 **开始旅游规划**\n\n**任务ID**: ${event.runId}\n**Agent**: ${event.agentId}\n**用户需求**: ${event.prompt}`,
      status: 'streaming',
      strategy: 'append',
    };
  }

  /**
   * 处理运行完成事件
   */
  private handleRunFinished(event: any): AIContentChunkUpdate | null {
    const { result } = event;
    return {
      type: 'markdown',
      data: `✅ **旅游规划完成！**\n\n📊 **规划统计**\n- 景点数量: ${result?.totalAttractions || 0}个\n- 预估费用: ¥${
        result?.estimatedCost || 0
      }\n- 行程时长: ${result?.duration || '未知'}`,
      status: 'complete',
      strategy: 'append',
    };
  }

  /**
   * 重置状态
   */
  reset() {
    super.reset();
    this.planningState = null;
  }

  /**
   * 获取当前规划状态
   */
  getPlanningState() {
    return this.planningState;
  }
}

export default TravelPlannerMapper;
