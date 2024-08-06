import type { Snippet } from "svelte";
import { randomId } from "$lib/utils/randomId";

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  content?: Snippet;
}


function createToastStore(initState: Toast[] = []) {
  let toasts = $state<Toast[]>(initState);

  function addToast(toast: Toast) {
    const id = randomId(16);
    const newToast = { ...toast, id };
    toasts = [...toasts, newToast];

    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id);
    }, 5000);
  }

  function removeToast(id: string) {
    toasts = toasts.filter(t => t.id !== id);
  }

  return {
    get toasts() {
      return toasts;
    },
    addToast,
    removeToast
  }
}

const toastStore = createToastStore();

export default toastStore;
