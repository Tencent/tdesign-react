import React, { useMemo, useState, MouseEvent, useEffect } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import log from '../_common/js/log';
import { CommonClassNameType } from '../hooks/useCommonClassName';
import { AutoCompleteOptionObj, TdAutoCompleteProps } from './type';
import HighlightOption from './HighlightOption';

export interface OptionsListProps {
  sizeClassNames: CommonClassNameType['sizeClassNames'];
  value: string;
  size: TdAutoCompleteProps['size'];
  options: TdAutoCompleteProps['options'];
  popupVisible: boolean;
  highlightKeyword: boolean;
  filterable: boolean;
  filter: TdAutoCompleteProps['filter'];
  onSelect?: (keyword: string, context: { e: MouseEvent<HTMLLIElement> | KeyboardEvent | any }) => void;
}

const OptionsList = (props: OptionsListProps) => {
  const { value, onSelect, popupVisible } = props;
  const [active, setActive] = useState('');
  const { classPrefix } = useConfig();

  const classes = `${classPrefix}-select__list`;
  const optionClasses = [
    `${classPrefix}-select-option`,
    {
      [props.sizeClassNames[props.size]]: props.size,
    },
  ];

  const tOptions = useMemo(() => {
    let options = props.options.map((item) => {
      let option: AutoCompleteOptionObj = {};
      if (typeof item === 'string') {
        option = { text: item, label: item };
      } else {
        if (item.text && typeof item.text !== 'string') {
          log.warn('AutoComplete', '`text` must be a string.');
        }
        if (!item.text) {
          if (typeof item.label === 'string') {
            option = { ...item, text: item.label };
          } else {
            log.warn('AutoComplete', 'one of `label` and `text` must be a existed string.');
          }
        } else {
          option = item;
        }
      }
      return option;
    });
    // 自定义过滤规则
    if (props.filter) {
      options = options.filter((option) => props.filter(value, option));
    } else if (props.filterable) {
      // 默认过滤规则
      const regExp = new RegExp(value, 'i');
      options = options.filter((item) => regExp.test(item.text));
    }

    return options;
    // eslint-disable-next-line
  }, [props.options, value, props.filterable]);

  const onOptionClick = (e: MouseEvent<HTMLLIElement>) => {
    let liNode = e.target as HTMLElement;
    while (liNode && liNode.tagName !== 'LI') {
      liNode = liNode.parentNode as HTMLElement;
    }
    const keyword = liNode.getAttribute('title');
    setActive(keyword);
    onSelect?.(keyword, { e });
  };

  // 键盘事件，上下选择
  const onKeyInnerPress = (e: KeyboardEvent) => {
    if (e.code === 'ArrowUp' || e.key === 'ArrowUp') {
      const index = tOptions.findIndex((item) => item.text === active);
      const newIndex = index - 1 < 0 ? tOptions.length - 1 : index - 1;
      setActive(tOptions[newIndex].text);
    } else if (e.code === 'ArrowDown' || e.key === 'ArrowDown') {
      const index = tOptions.findIndex((item) => item.text === active);
      const newIndex = index + 1 >= tOptions.length ? 0 : index + 1;
      setActive(tOptions[newIndex].text);
    } else if (e.code === 'Enter' || e.key === 'Enter') {
      onSelect?.(active, { e });
    }
  };

  useEffect(() => {
    if (popupVisible) {
      document.addEventListener('keydown', onKeyInnerPress);
    } else {
      document.removeEventListener('keydown', onKeyInnerPress);
    }
    return () => {
      document.removeEventListener('keydown', onKeyInnerPress);
    };
    // eslint-disable-next-line
  }, [popupVisible]);

  useEffect(() => {
    if (!value) {
      setActive('');
    }
  }, [value]);

  if (!tOptions.length) return null;
  return (
    <ul className={classes}>
      {tOptions.map((item) => {
        const cls = [...optionClasses];
        if (item.text === active) {
          cls.push(`${classPrefix}-select-option--hover`);
        }
        const content = item.label || item.text;
        return (
          <li key={item.text} className={classNames(cls)} title={item.text} onClick={onOptionClick}>
            {typeof content === 'string' && props.highlightKeyword ? (
              <HighlightOption content={content} keyword={value} />
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
};

OptionsList.displayName = 'OptionsList';

export default OptionsList;
