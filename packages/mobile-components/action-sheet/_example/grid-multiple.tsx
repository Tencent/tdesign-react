import React, { useState } from 'react';
import { Button, ActionSheet } from 'tdesign-mobile-react';
import { ShareIcon, StarIcon, DownloadIcon, Edit1Icon, ImageIcon } from 'tdesign-icons-react';

export default function GridMultipleExample() {
  const [multiPageVisible, setMultiPageVisible] = useState(false);

  return (
    <div className="action-sheet-demo">
      <div className="action-sheet-demo-btns">
        <Button block size="large" variant="outline" theme="primary" onClick={() => setMultiPageVisible(true)}>
          宫格型-多页
        </Button>
      </div>

      <ActionSheet
        visible={multiPageVisible}
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
          {
            label: '文字',
            icon: <ImageIcon size={24} />,
          },
          {
            label: '文字',
            icon: <ImageIcon size={24} />,
          },
        ]}
        onClose={() => {
          setMultiPageVisible(false);
        }}
        onCancel={() => {
          setMultiPageVisible(false);
        }}
        onSelected={(it) => {
          console.log(it);
        }}
      />
    </div>
  );
}
