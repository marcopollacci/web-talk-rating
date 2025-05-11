import { Component, input } from '@angular/core';

const TYPE_TOAST = ['success', 'error'] as const;

type ToastType = (typeof TYPE_TOAST)[number];

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  host: {
    '[attr.toast-type]': 'type()',
  },
})
export class ToastComponent {
  message = input.required<string>();
  type = input.required<ToastType>();
}
