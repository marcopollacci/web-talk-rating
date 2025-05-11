import { Component, effect, inject, input, signal } from '@angular/core';
import { GetSingleEventResponse } from '@serverModels/rating.model';
import { catchError, filter, of, tap } from 'rxjs';
import { VoteFormInterface } from '../models/vote.model';
import { EventService } from '../services/event.service';
import { FormVoteComponent } from './components/form-vote/form-vote.component';

@Component({
  selector: 'app-add-rating',
  imports: [FormVoteComponent],
  templateUrl: './add-rating.component.html',
  styleUrl: './add-rating.component.scss',
})
export class AddRatingComponent {
  #eventSrv = inject(EventService);
  eventId = input.required<string>();
  canVote = signal<boolean>(false);
  noEventFound = signal<boolean>(false);
  eventData: GetSingleEventResponse | null = null;

  constructor() {
    effect(() => {
      this.searchEvent(this.eventId());
    });
  }

  searchEvent(eventId: string) {
    this.#eventSrv
      .getEventForRating(eventId)
      .pipe(
        catchError(() => {
          this.noEventFound.set(true);
          return of(null);
        }),
        tap((data) => {
          if (!data) {
            this.noEventFound.set(true);
          }
        }),
        filter((data) => !!data)
      )
      .subscribe((data) => {
        this.eventData = data;
        this.canVote.set(data.vote_enabled);
      });
  }

  onSubmitForm(event: VoteFormInterface) {
    this.#eventSrv.insertRating(this.eventId(), event).subscribe();
  }
}
