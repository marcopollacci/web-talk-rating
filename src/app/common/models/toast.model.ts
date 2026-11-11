export type ToastType = 'success' | 'error';

export interface ToastInterface {
  message: string;
  type: ToastType;
}
