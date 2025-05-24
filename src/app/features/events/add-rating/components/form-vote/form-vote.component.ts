import { JsonPipe, NgOptimizedImage } from '@angular/common';
import { Component, effect, inject, input, model, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoteFormInterface } from '../../../models/vote.model';
import { ImageRatingComponent } from '../image-rating/image-rating.component';

@Component({
  selector: 'app-form-vote',
  imports: [
    ReactiveFormsModule,
    ImageRatingComponent,
    NgOptimizedImage,
    JsonPipe,
  ],
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
    image: [null as string | ArrayBuffer | null],
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

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.formRating.patchValue({
        image: file,
      });
    }
  }
}
