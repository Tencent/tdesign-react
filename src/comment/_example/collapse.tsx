import React, { useState } from 'react';
import { ActionSheet, Button, Comment, CommentFold, Tag } from 'tdesign-mobile-react';
import { HeartIcon, Uncomfortable1Icon } from 'tdesign-icons-react';

const REPLY_COUNT = 6; // 回复评论总数
const MAIN_COMMENT_AUTHOR = 'Name1 名称';

interface ReplyItem {
  author: string;
  avatar: string;
  content: string;
  datetime: string;
  likeNum: number;
}

// 点赞数量格式化：过万（>= 10000）统一使用 k 单位，如 15800 -> 15.8k
const formatLikeCount = (count: number) => {
  if (count >= 10000) {
    const value = count / 1000;
    return `${Number.isInteger(value) ? value : value.toFixed(1)}k`;
  }
  return String(count);
};

const likeCounts = [6, 68, 688, 6888, 15800, 158000];

const replyInfo: ReplyItem[] = new Array(REPLY_COUNT).fill({}).map((_, index) => ({
  author: `Name${index + 1} 名称`,
  avatar: 'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
  content: '这是一段很长很长很长很长很长很长的评论内容。',
  datetime: '今天16:38·广东',
  likeNum: likeCounts[index],
}));

const actionSheetItems = ['复制', '回复', '举报', '删除'];

export default function () {
  const [commentFold, setCommentFold] = useState<CommentFold>({
    state: 'collapsed',
    total: REPLY_COUNT,
    step: 3,
    content: {
      collapsed: `展开${REPLY_COUNT - 1}条回复`,
      partial: ['展开更多回复', '收起'],
      expanded: '收起',
    },
  });
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState('');

  const getVisibleItems = () => {
    if (commentFold.state === 'collapsed') {
      return replyInfo.slice(0, 1);
    }
    if (commentFold.state === 'partial') {
      return replyInfo.slice(0, 3);
    }
    return replyInfo;
  };

  const handleReply = (authorName: string) => {
    console.log('回复:', authorName);
  };

  const handleUpdateFold = (context: { e: Event; fold: CommentFold }) => {
    setCommentFold(context.fold);
  };

  const handleLongPress = (authorName: string) => {
    setCurrentAuthor(authorName);
    setActionSheetVisible(true);
  };

  const handleSelected = (selected: string | { label: string }) => {
    const label = typeof selected === 'string' ? selected : selected.label;
    console.log('长按评论：', currentAuthor, '操作：', label);
  };

  const getMainActions = () => [
    {
      key: 'reply',
      placement: 'start' as const,
      content: (
        <div className="mobile-comment__reply-button" onClick={() => handleReply(MAIN_COMMENT_AUTHOR)}>
          回复
        </div>
      ),
    },
    {
      key: 'like',
      placement: 'end' as const,
      content: (
        <Button className="mobile-comment__actions-button" icon={<HeartIcon size="16px" />} variant="text">
          6
        </Button>
      ),
    },
    {
      key: 'unlike',
      placement: 'end' as const,
      content: (
        <Button className="mobile-comment__actions-button" icon={<Uncomfortable1Icon size="16px" />} variant="text" />
      ),
    },
  ];

  const getReplyActions = (item: ReplyItem) => [
    {
      key: 'reply',
      placement: 'start' as const,
      content: (
        <div className="mobile-comment__reply-button" onClick={() => handleReply(item.author)}>
          回复
        </div>
      ),
    },
    {
      key: 'like',
      placement: 'end' as const,
      content: (
        <Button className="mobile-comment__actions-button" icon={<HeartIcon size="16px" />} variant="text">
          {formatLikeCount(item.likeNum)}
        </Button>
      ),
    },
    {
      key: 'unlike',
      placement: 'end' as const,
      content: (
        <Button className="mobile-comment__actions-button" icon={<Uncomfortable1Icon size="16px" />} variant="text" />
      ),
    },
  ];

  const renderReply = () =>
    getVisibleItems().map((item, index) => (
      <Comment
        key={`${item.author}-${index}`}
        avatar={{ shape: 'circle', size: '20px', image: item.avatar }}
        author={
          <div className="mobile-comment__author">
            <div>{item.author}</div>
          </div>
        }
        actions={getReplyActions(item)}
        content={item.content}
        datetime={item.datetime}
        onLongPress={() => handleLongPress(item.author)}
      />
    ));

  return (
    <div className="mobile-comment">
      <Comment
        avatar={{ shape: 'circle', size: '32px', image: 'https://tdesign.gtimg.com/mobile/demos/avatar1.png' }}
        author={
          <div className="mobile-comment__author">
            <div>{MAIN_COMMENT_AUTHOR}</div>
            <Tag className="mobile-comment__author-tag" variant="light" theme="primary" shape="round">
              作者
            </Tag>
          </div>
        }
        actions={getMainActions()}
        content="这是一段很长很长很长很长很长很长的评论内容。"
        datetime="今天16:38·广东"
        folds={commentFold}
        reply={renderReply()}
        onFolds={handleUpdateFold}
        onLongPress={() => handleLongPress(MAIN_COMMENT_AUTHOR)}
      />
      <ActionSheet
        visible={actionSheetVisible}
        cancelText="取消"
        items={actionSheetItems}
        onSelected={(selected) => {
          handleSelected(selected);
          setActionSheetVisible(false);
        }}
        onClose={() => setActionSheetVisible(false)}
        onCancel={() => setActionSheetVisible(false)}
      />
    </div>
  );
}
