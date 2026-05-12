import React from 'react';
import { Card, Timeline, Tag } from 'tdesign-react';
import { CalendarIcon, CheckCircleFilledIcon } from 'tdesign-icons-react';

interface ItineraryCardProps {
  plan: any[];
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ plan }) => (
  <Card className="itinerary-card" size="small">
    <div className="itinerary-header">
      <CalendarIcon size="medium" />
      <span className="itinerary-title">行程安排</span>
    </div>
    <Timeline mode="same" theme="dot">
      {plan.map((dayPlan, index) => (
        <Timeline.Item
          key={index}
          label={`第${dayPlan.day}天`}
          dot={<CheckCircleFilledIcon size="small" color="#0052d9" />}
        >
          <div className="day-activities">
            {dayPlan.activities.map((activity: string, actIndex: number) => (
              <Tag key={actIndex} variant="light" className="activity-tag">
                {activity}
              </Tag>
            ))}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  </Card>
);
