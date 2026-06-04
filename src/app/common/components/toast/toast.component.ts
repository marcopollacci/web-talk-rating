import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ToastType } from '@common/models/toast.model';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    '[attr.toast-type]': 'type()',
  },
})
export class ToastComponent {
  message = input.required<string | undefined>();
  type = input.required<ToastType | undefined>();
}
