import React from 'react';
import { Card } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

interface HumanInputResultProps {
  userInput: any;
}

export const HumanInputResult: React.FC<HumanInputResultProps> = ({ userInput }) => (
  <Card className="human-input-result" size="small">
    <div className="form-header">
      <UserIcon size="medium" />
      <span className="form-title">出行偏好信息</span>
    </div>
    <div className="form-description">您已提供的出行信息：</div>
    <div className="user-input-summary">
      {userInput.travelers_count && (
        <div className="summary-item">
          <span className="label">出行人数：</span>
          <span className="value">{userInput.travelers_count}人</span>
        </div>
      )}
      {userInput.budget_range && (
        <div className="summary-item">
          <span className="label">预算范围：</span>
          <span className="value">{userInput.budget_range}</span>
        </div>
      )}
      {userInput.preferred_activities && userInput.preferred_activities.length > 0 && (
        <div className="summary-item">
          <span className="label">偏好活动：</span>
          <span className="value">{userInput.preferred_activities.join('、')}</span>
        </div>
      )}
    </div>
  </Card>
);
