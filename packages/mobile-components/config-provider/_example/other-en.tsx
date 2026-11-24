import React, { useMemo, useState } from 'react';
import { ConfigProvider, Rate, Calendar, Cell, Comment, CommentFold } from 'tdesign-mobile-react';
import { merge } from 'lodash-es';
import enConfig from 'tdesign-mobile-react/es/locale/en_US';

const REPLY_COUNT = 6;

export default function OtherEn() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {});

  const [rateValue, setRateValue] = useState(3);
  const [dataNote, setDataNote] = useState('');
  const [visible, setVisible] = useState(false);

  // 不传 folds.content，折叠/展开文案走全局国际化配置
  const [commentFold, setCommentFold] = useState<CommentFold>({
    state: 'collapsed',
    total: REPLY_COUNT,
    step: 3,
  });

  const replyInfo = useMemo(
    () =>
      new Array(REPLY_COUNT).fill({}).map((_, index) => ({
        author: `Name${index + 1}`,
        avatar: 'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
        content: 'This is a reply content.',
        datetime: 'Today 16:38',
      })),
    [],
  );

  const visibleReplies = useMemo(() => {
    if (commentFold.state === 'collapsed') {
      return replyInfo.slice(0, 1);
    }
    if (commentFold.state === 'partial') {
      return replyInfo.slice(0, 3);
    }
    return replyInfo;
  }, [commentFold.state, replyInfo]);

  const format = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleConfirm = (val: Date) => {
    console.log(val);
    setDataNote(format(val));
    setVisible(false);
  };

  const handleSelect = (val: Date) => {
    console.log(val);
  };

  const onClose = (trigger: string) => {
    setVisible(false);
    console.log('closed by', trigger);
  };

  const handleUpdateFold = (context: { e: Event; fold: CommentFold }) => {
    setCommentFold(context.fold);
  };

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <div className="rate-demo-cell rate-demo-cell--space">
        <div className="rate-demo-cell__label">Rating</div>
        <Rate
          value={rateValue}
          showText={true}
          onChange={(value) => {
            setRateValue(value);
          }}
        />
      </div>
      <Calendar visible={visible} onConfirm={handleConfirm} onSelect={handleSelect} onClose={onClose}></Calendar>
      <Cell title="Single select date" arrow note={dataNote} onClick={() => setVisible(true)}></Cell>
      <div className="comment-demo">
        <Comment
          avatar={{ shape: 'circle', size: '32px', image: 'https://tdesign.gtimg.com/mobile/demos/avatar1.png' }}
          author="Name1"
          content="This is a comment content."
          datetime="Today 16:38"
          folds={commentFold}
          onFolds={handleUpdateFold}
          reply={visibleReplies.map((item, index) => (
            <Comment
              key={`${item.author}-${index}`}
              avatar={{ shape: 'circle', size: '20px', image: item.avatar }}
              author={item.author}
              content={item.content}
              datetime={item.datetime}
            />
          ))}
        />
      </div>
    </ConfigProvider>
  );
}
