import React from 'react';
import type { AIMessageContent, ChatMessagesData } from '@tdesign-react/aigc';
import { WeatherCard, ItineraryCard, HotelCard, HumanInputResult } from '../components';

interface MessageRendererProps {
  item: AIMessageContent;
  index: number;
  message: ChatMessagesData;
}

export const renderMessageContent = ({ item, index, message }: MessageRendererProps): React.ReactNode => {
  if (item.type === 'toolcall') {
    const { data, type } = item;

    // Human-in-the-Loop 输入请求
    if (data.toolCallName === 'get_travel_preferences') {
      // 区分历史消息和实时交互
      const isHistoricalMessage = message.status === 'complete';

      if (isHistoricalMessage && data.result) {
        // 历史消息：静态展示用户已输入的数据
        try {
          const userInput = JSON.parse(data.result);
          return (
            <div slot={`${type}-${index}`} key={`human-input-result-${index}`} className="content-card">
              <HumanInputResult userInput={userInput} />
            </div>
          );
        } catch (e) {
          console.error('解析用户输入数据失败:', e);
        }
      }
    }

    // 天气卡片
    if (data.toolCallName === 'get_weather_forecast' && data?.result) {
      return (
        <div slot={`${type}-${index}`} key={`weather-${index}`} className="content-card">
          <WeatherCard weather={JSON.parse(data.result)} />
        </div>
      );
    }

    // 行程规划卡片
    if (data.toolCallName === 'plan_itinerary' && data.result) {
      return (
        <div slot={`${type}-${index}`} key={`itinerary-${index}`} className="content-card">
          <ItineraryCard plan={JSON.parse(data.result)} />
        </div>
      );
    }

    // 酒店推荐卡片
    if (data.toolCallName === 'get_hotel_details' && data.result) {
      return (
        <div slot={`${type}-${index}`} key={`hotel-${index}`} className="content-card">
          <HotelCard hotels={JSON.parse(data.result)} />
        </div>
      );
    }
  }

  // 规划状态面板 - 不在消息中显示，只用于更新右侧面板
  if (item.type === 'planningState') {
    return null;
  }

  return null;
};
