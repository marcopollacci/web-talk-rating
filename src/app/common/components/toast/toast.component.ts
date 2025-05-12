import { Component, input } from '@angular/core';
import { ToastType } from '@common/models/toast.model';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  host: {
    '[attr.toast-type]': 'type()',
    '[attr.aria-hidden]': 'visible()',
  },
})
export class ToastComponent {
  visible = input.required<boolean>();
  message = input.required<string | undefined>();
  type = input.required<ToastType | undefined>();
}
