import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerService } from '@common/services/spinner.service';
import { HeaderComponent } from './common/components/header/header.component';
import { SpinnerComponent } from './common/components/spinner/spinner.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #spinnerService = inject(SpinnerService);
  canShowSpinner$ = this.#spinnerService.spinner$;
}
