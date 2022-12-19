import type { NamePath, FormInstanceFunctions } from '../type';

export type Store = Record<string, any>;

export type WatchCallBack = (values: Store, namePathList: NamePath) => void;

export interface InternalHooks {
  notifyWatch: (name: NamePath) => void;
  registerWatch: (callback: WatchCallBack) => () => void;
  getPrevStore: () => Store;
  setPrevStore: (store: Store) => void;
  flashQueue: () => void;
  setForm: (form) => void;
}

export interface InternalFormInstance extends FormInstanceFunctions {
  _init?: boolean;

  getInternalHooks?: (secret: string) => InternalHooks | null;
}
