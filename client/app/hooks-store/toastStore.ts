import { initStore } from "./store";

export enum ToastStoreAction {
  ShowToast = 'SHOW_TOAST',
};

export type ToastStore = {
  toast: ToastOptions;
};

type ToastOptions = {
  message: string;
  type: string;
  visible: boolean;
  timeout?: number;
};

const configureStore = (initialState: ToastStore) => {
  const actions = {
    [ToastStoreAction.ShowToast]: (curState: any, toastOptions: Partial<ToastOptions>) => {
      return { toast: {...curState.toast, visible: true, timeout: toastOptions?.timeout || (toastOptions?.type === 'destructive' ? 5000 : 3000), ...toastOptions} };
    },
  };
  initStore(actions, { ...initialState });
}

export default configureStore;