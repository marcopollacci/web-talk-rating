import { JsonPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoteFormInterface } from '@pages/events/models/vote.model';
import { ToastComponent } from '../../../../../common/components/toast/toast.component';

@Component({
  selector: 'app-form-vote',
  imports: [ReactiveFormsModule, JsonPipe, ToastComponent],
  templateUrl: './form-vote.component.html',
  styleUrl: './form-vote.component.scss',
})
export class FormVoteComponent {
  readonly #fb = inject(FormBuilder);
  emitForm = output<VoteFormInterface>();

  formRating = this.#fb.group({
    rating: [0, [Validators.required, Validators.min(0.5), Validators.max(5)]],
    comment: [''],
  });

  onSubmit() {
    console.log('mamma');
    this.emitForm.emit(this.formRating.value as VoteFormInterface);
  }
}
