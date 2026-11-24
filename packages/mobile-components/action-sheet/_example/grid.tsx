import React, { useState } from 'react';
import { Button, ActionSheet } from 'tdesign-mobile-react';
import { ShareIcon, StarIcon, DownloadIcon, Edit1Icon } from 'tdesign-icons-react';

export default function GridExample() {
  const [normalVisible, setNormalVisible] = useState(false);
  const [descVisible, setDescVisible] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);

  return (
    <div className="action-sheet-demo">
      <div className="action-sheet-demo-btns">
        <Button block size="large" variant="outline" theme="primary" onClick={() => setNormalVisible(true)}>
          常规宫格型
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => setDescVisible(true)}>
          带描述宫格型
        </Button>
        <Button block size="large" variant="outline" theme="primary" onClick={() => setBadgeVisible(true)}>
          带徽标宫格型
        </Button>
      </div>

      <ActionSheet
        visible={normalVisible}
        theme="grid"
        items={[
          {
            label: '微信',
            icon: 'https://tdesign.gtimg.com/mobile/demos/wechat.png',
          },
          {
            label: '朋友圈',
            icon: 'https://tdesign.gtimg.com/mobile/demos/times.png',
          },
          {
            label: 'QQ',
            icon: 'https://tdesign.gtimg.com/mobile/demos/qq.png',
          },
          {
            label: '企业微信',
            icon: 'https://tdesign.gtimg.com/mobile/demos/wecom.png',
          },
          {
            label: '收藏',
            icon: <ShareIcon size={24} />,
          },
          {
            label: '刷新',
            icon: <StarIcon size={24} />,
          },
          {
            label: '下载',
            icon: <DownloadIcon size={24} />,
          },
          {
            label: '复制',
            icon: <Edit1Icon size={24} />,
          },
        ]}
        onClose={() => {
          setNormalVisible(false);
        }}
        onCancel={() => {
          setNormalVisible(false);
        }}
        onSelected={(it) => {
          console.log(it);
        }}
      />

      <ActionSheet
        visible={descVisible}
        description="动作面板描述文字"
        theme="grid"
        items={[
          {
            label: '微信',
            icon: 'https://tdesign.gtimg.com/mobile/demos/wechat.png',
          },
          {
            label: '朋友圈',
            icon: 'https://tdesign.gtimg.com/mobile/demos/times.png',
          },
          {
            label: 'QQ',
            icon: 'https://tdesign.gtimg.com/mobile/demos/qq.png',
          },
          {
            label: '企业微信',
            icon: 'https://tdesign.gtimg.com/mobile/demos/wecom.png',
          },
          {
            label: '收藏',
            icon: <ShareIcon size={24} />,
          },
          {
            label: '刷新',
            icon: <StarIcon size={24} />,
          },
          {
            label: '下载',
            icon: <DownloadIcon size={24} />,
          },
          {
            label: '复制',
            icon: <Edit1Icon size={24} />,
          },
        ]}
        onClose={() => {
          setDescVisible(false);
        }}
        onCancel={() => {
          setDescVisible(false);
        }}
        onSelected={(it) => {
          console.log(it);
        }}
      />

      <ActionSheet
        visible={badgeVisible}
        description="带徽标宫格型"
        theme="grid"
        items={[
          {
            label: '微信',
            icon: 'https://tdesign.gtimg.com/mobile/demos/wechat.png',
            badge: { dot: true },
          },
          {
            label: '朋友圈',
            icon: 'https://tdesign.gtimg.com/mobile/demos/times.png',
            badge: { dot: true },
          },
          {
            label: 'QQ',
            icon: 'https://tdesign.gtimg.com/mobile/demos/qq.png',
            badge: { dot: true },
          },
          {
            label: '企业微信',
            icon: 'https://tdesign.gtimg.com/mobile/demos/wecom.png',
            badge: { count: 99 },
          },
          {
            label: '收藏',
            icon: <ShareIcon size={24} />,
          },
          {
            label: '刷新',
            icon: <StarIcon size={24} />,
          },
          {
            label: '下载',
            icon: <DownloadIcon size={24} />,
          },
          {
            label: '复制',
            icon: <Edit1Icon size={24} />,
          },
        ]}
        onClose={() => {
          setBadgeVisible(false);
        }}
        onCancel={() => {
          setBadgeVisible(false);
        }}
        onSelected={(it) => {
          console.log(it);
        }}
      />
    </div>
  );
}
