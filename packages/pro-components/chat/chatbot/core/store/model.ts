import type { ModelServiceState } from '../type';
import ReactiveState from './reactiveState';

// 专注模型状态和运行时管理
export class ModelStore extends ReactiveState<ModelServiceState> {
  initialize(initialState?: ModelServiceState) {
    super.initialize({
      useSearch: false,
      useThink: false,
      model: '',
      ...initialState,
    });
  }

  setCurrentModel(modelName: string) {
    this.setState((draft) => {
      draft.model = modelName;
    });
  }

  setUseThink(use: boolean) {
    this.setState((draft) => {
      draft.useThink = use;
    });
  }

  setUseSearch(use: boolean) {
    this.setState((draft) => {
      draft.useSearch = use;
    });
  }
}
