import { NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoteFormInterface } from '../../../models/vote.model';
import { ImageRatingComponent } from '../image-rating/image-rating.component';

@Component({
  selector: 'app-form-vote',
  imports: [ReactiveFormsModule, ImageRatingComponent, NgOptimizedImage],
  templateUrl: './form-vote.component.html',
  styleUrl: './form-vote.component.scss',
})
export class FormVoteComponent {
  readonly #fb = inject(FormBuilder);
  canVote = input.required<boolean>();
  emitForm = output<VoteFormInterface>();
  resetForm = model<boolean>(false);

  formRating = this.#fb.group({
    rating: [0, [Validators.required, Validators.min(0.5), Validators.max(5)]],
    comment: [''],
  });

  constructor() {
    effect(() => {
      if (this.resetForm()) {
        this.formRating.reset();
        this.resetForm.set(false);
      }
    });
  }

  onSubmit() {
    this.emitForm.emit(this.formRating.value as VoteFormInterface);
  }
}
