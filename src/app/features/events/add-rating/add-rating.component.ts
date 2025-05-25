import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ToastInterface } from '@common/models/toast.model';
import { GetSingleEventResponse } from '@serverModels/rating.model';
import { catchError, filter, of, switchMap } from 'rxjs';
import { ToastComponent } from '../../../common/components/toast/toast.component';
import { VoteFormInterface } from '../models/vote.model';
import { EventService } from '../services/event.service';
import { FormVoteComponent } from './components/form-vote/form-vote.component';

@Component({
  selector: 'app-add-rating',
  imports: [FormVoteComponent, NgOptimizedImage, ToastComponent],
  templateUrl: './add-rating.component.html',
  styleUrl: './add-rating.component.scss',
})
export class AddRatingComponent {
  #eventSrv = inject(EventService);
  eventId = input.required<string>();
  canVote = signal<boolean>(false);
  noEventFound = signal<boolean>(false);
  eventData = signal<GetSingleEventResponse | null>(null);
  stateSave = signal<ToastInterface | null>(null);
  resetForm = false;
  dialog = viewChild<ElementRef>('dialog');

  constructor() {
    effect(() => {
      this.searchEvent(this.eventId());
    });
  }

  searchEvent(eventId: string) {
    this.noEventFound.set(false);
    this.#eventSrv
      .getEventForRating(eventId)
      .pipe(
        catchError((error: unknown) => {
          console.log('🚀 ~ AddRatingComponent ~ catchError ~ error:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (!data) {
          this.noEventFound.set(true);
          return;
        }
        this.eventData.set(data);
        this.canVote.set(data.vote_enabled);
      });
  }

  onSubmitForm(event: VoteFormInterface) {
    const dialog = this.dialog()!.nativeElement as HTMLDialogElement;
    this.stateSave.set(null);
    this.#eventSrv
      .insertRating(this.eventId(), event)
      .pipe(
        switchMap(() => {
          if (event.image) {
            return this.#eventSrv.uploadFile(event.image);
          }
          return of('done');
        }),
        catchError(() => {
          this.stateSave.set({
            type: 'error',
            message: 'Error saving your vote',
          });
          dialog.showModal();
          return of(null);
        }),
        filter((data) => !!data)
      )
      .subscribe(() => {
        this.stateSave.set({
          type: 'success',
          message: 'Your feedback has been submitted.',
        });
        this.resetForm = true;
        dialog.showModal();
      });
  }
}
