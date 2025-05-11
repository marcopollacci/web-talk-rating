import { Component, input } from '@angular/core';
import { ToastType } from '@common/models/toast.model';

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
