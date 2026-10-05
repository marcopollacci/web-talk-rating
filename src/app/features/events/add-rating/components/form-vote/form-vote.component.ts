import { Component, inject, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { form, FormField, FormRoot, max, min, required, validate } from '@angular/forms/signals';
import { ToastInterface } from '@common/models/toast.model';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { VoteFormInterface } from '../../../models/vote.model';
import { EventService } from '../../../services/event.service';
import { ImageRatingComponent } from '../image-rating/image-rating.component';

const RANGE_MESSAGE = 'Rating must be a whole number from 1 to 5.';

@Component({
  selector: 'app-form-vote',
  imports: [FormField, FormRoot, ImageRatingComponent],
  templateUrl: './form-vote.component.html',
  styleUrl: './form-vote.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  host: {
    role: 'region',
    'aria-label': 'Feedback form',
  },
})
export class FormVoteComponent {
  readonly #eventSrv = inject(EventService);
  eventId = input.required<string>();
  isTelegramEnabled = input.required<boolean>();
  saved = output<ToastInterface>();

  // `image` lives outside the form model: WebMCP schema inference can't handle null values
  // and an AI agent can't provide a File anyway.
  readonly image = signal<File | null>(null);
  readonly #ratingModel = signal({ rating: 0, comment: '' });

  readonly formRating = form(
    this.#ratingModel,
    (path) => {
      required(path.rating, { message: RANGE_MESSAGE });
      min(path.rating, 1, { message: RANGE_MESSAGE });
      max(path.rating, 5, { message: RANGE_MESSAGE });
      validate(path.rating, ({ value }) =>
        Number.isInteger(value()) ? null : { kind: 'integer', message: RANGE_MESSAGE }
      );
    },
    {
      experimentalWebMcpTool: {
        name: 'submitTalkRating',
        description:
          'Submits anonymous feedback for the talk shown on this page. ' +
          '`rating` is a whole number from 1 (poor) to 5 (excellent). ' +
          '`comment` is optional free-text feedback for the speaker (use an empty string if none). ' +
          'Call `getTalkDetails` first to confirm with the user which talk they are rating.',
      },
      submission: {
        action: (field) => this.#save(field().value()),
      },
    }
  );

  async #save({ rating, comment }: { rating: number; comment: string }) {
    const vote: VoteFormInterface = {
      rating,
      // an agent may omit optional fields
      comment: comment ?? '',
      image: this.image(),
    };

    try {
      await firstValueFrom(
        this.#eventSrv
          .insertRating(this.eventId(), vote)
          .pipe(
            switchMap(() =>
              vote.image ? this.#eventSrv.uploadFile(vote.image) : of('done')
            )
          )
      );
    } catch {
      this.saved.emit({ type: 'error', message: 'Error saving your vote' });
      return { kind: 'server', message: 'Error saving your vote' };
    }

    this.#ratingModel.set({ rating: 0, comment: '' });
    this.image.set(null);
    this.formRating().reset();
    this.saved.emit({
      type: 'success',
      message: 'Your feedback has been submitted.',
    });
    return undefined;
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      const [file] = target.files;
      this.image.set(file);
    }
  }
}
