import { Component, effect, inject, input, signal } from '@angular/core';
import { ToastComponent } from '@common/components/toast/toast.component';
import { ToastInterface } from '@common/models/toast.model';
import { GetSingleEventResponse } from '@serverModels/rating.model';
import { catchError, filter, of, switchMap, tap, timer } from 'rxjs';
import { VoteFormInterface } from '../models/vote.model';
import { EventService } from '../services/event.service';
import { FormVoteComponent } from './components/form-vote/form-vote.component';

@Component({
  selector: 'app-add-rating',
  imports: [FormVoteComponent, ToastComponent],
  templateUrl: './add-rating.component.html',
  styleUrl: './add-rating.component.scss',
})
export class AddRatingComponent {
  #eventSrv = inject(EventService);
  eventId = input.required<string>();
  canVote = signal<boolean>(false);
  noEventFound = signal<boolean>(false);
  eventData: GetSingleEventResponse | null = null;
  stateSave = signal<ToastInterface | null>(null);

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
    this.#eventSrv
      .insertRating(this.eventId(), event)
      .pipe(
        catchError(() => {
          this.stateSave.set({
            type: 'error',
            message: 'Error saving your vote',
          });
          return of(null);
        }),
        switchMap(() => {
          this.stateSave.set({
            type: 'success',
            message: 'Vote saved',
          });
          return timer(3000);
        })
      )
      .subscribe(() => {
        this.stateSave.set(null);
      });
  }
}
