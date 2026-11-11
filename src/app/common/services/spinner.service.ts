import { signal, Service } from '@angular/core';

@Service()
export class SpinnerService {
  #spinner = signal<boolean>(false);
  spinner$ = this.#spinner.asReadonly();

  setSpinner(value: boolean) {
    this.#spinner.set(value);
  }
}
