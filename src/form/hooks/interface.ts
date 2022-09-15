import type { NamePath, FormInstanceFunctions } from '../type';

export type Store = Record<string, any>;

export type WatchCallBack = (values: Store, namePathList: NamePath) => void;

export interface InternalHooks {
  notifyWatch: (name: NamePath) => void;
  registerWatch: (callback: WatchCallBack) => () => void;
}

export interface InternalFormInstance extends FormInstanceFunctions {
  _init?: boolean;

  getInternalHooks?: (secret: Symbol) => InternalHooks | null;
}
