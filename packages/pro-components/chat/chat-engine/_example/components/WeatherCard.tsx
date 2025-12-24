import React from 'react';
import { Card } from 'tdesign-react';
import { CloudIcon } from 'tdesign-icons-react';

interface WeatherCardProps {
  weather: any[];
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => (
  <Card className="weather-card" size="small">
    <div className="weather-header">
      <CloudIcon size="medium" />
      <span className="weather-title">未来5天天气预报</span>
    </div>
    <div className="weather-list">
      {weather.map((day, index) => (
        <div key={index} className="weather-item">
          <span className="day">第{day.day}天</span>
          <span className="condition">{day.condition}</span>
          <span className="temp">
            {day.high}°/{day.low}°
          </span>
        </div>
      ))}
    </div>
  </Card>
);
