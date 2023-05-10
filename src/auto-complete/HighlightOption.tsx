import React, { useMemo } from 'react';
import useConfig from '../hooks/useConfig';

export interface TdHighlightOptionProps {
  /** 联想词 */
  content: string;
  /** 搜索词 */
  keyword: string;
}

const HighlightOption: React.FC<TdHighlightOptionProps> = (props) => {
  const { classPrefix } = useConfig();
  const { content, keyword } = props;

  const words = useMemo<{ list: string[]; keyword?: string }>(() => {
    if (!content) return { list: [] };
    if (typeof content !== 'string' || !keyword) return { list: [content] };
    const regExp = new RegExp(keyword, 'i');
    const splitKeyword = content.match(regExp)?.[0];
    return {
      list: content.split(splitKeyword),
      keyword: splitKeyword,
    };
  }, [content, keyword]);

  return (
    <div className={`${classPrefix}-select-option__highlight-item`}>
      {words.list.map((item, index) => {
        if (!index) return item;
        return [
          <b className={`${classPrefix}-is-highlight`} key={item + words.keyword}>
            {words.keyword}
          </b>,
          item,
        ];
      })}
    </div>
  );
};

HighlightOption.displayName = 'HighlightOption';

export default HighlightOption;
