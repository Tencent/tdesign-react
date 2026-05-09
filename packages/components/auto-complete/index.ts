import _AutoComplete from './AutoComplete';
import _HighlightOption from './HighlightOption';

import type { TdHighlightOptionProps } from './HighlightOption';

import './style/index.js';

export * from './type';

export type { AutoCompleteProps } from './AutoComplete';

export type HighlightOptionProps = TdHighlightOptionProps;

export const AutoComplete = _AutoComplete;

export const HighlightOption = _HighlightOption;

export default AutoComplete;
