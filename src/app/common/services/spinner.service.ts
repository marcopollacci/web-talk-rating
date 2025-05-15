import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  #spinner = signal<boolean>(false);
  spinner$ = this.#spinner.asReadonly();

  setSpinner(value: boolean) {
    this.#spinner.set(value);
  }
}
