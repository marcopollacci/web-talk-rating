import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '@common/services/spinner.service';
import { finalize } from 'rxjs';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.setSpinner(true);
  return next(req).pipe(
    finalize(() => {
      spinnerService.setSpinner(false);
    })
  );
};
