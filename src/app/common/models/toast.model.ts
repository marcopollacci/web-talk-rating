const TYPE_TOAST = ['success', 'error'] as const;

export type ToastType = (typeof TYPE_TOAST)[number];

export interface ToastInterface {
  message: string;
  type: ToastType;
}
