import React from 'react';
import { Card, Tag } from 'tdesign-react';
import { HomeIcon } from 'tdesign-icons-react';

interface HotelCardProps {
  hotels: any[];
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotels }) => (
  <Card className="hotel-card" size="small">
    <div className="hotel-header">
      <HomeIcon size="medium" />
      <span className="hotel-title">酒店推荐</span>
    </div>
    <div className="hotel-list">
      {hotels.map((hotel, index) => (
        <div key={index} className="hotel-item">
          <div className="hotel-info">
            <span className="hotel-name">{hotel.name}</span>
            <div className="hotel-details">
              <Tag theme="success" variant="light">
                评分 {hotel.rating}
              </Tag>
              <span className="hotel-price">¥{hotel.price}/晚</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
