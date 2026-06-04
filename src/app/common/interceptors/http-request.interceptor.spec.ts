import { HttpInterceptorFn, provideHttpClient, withXhr } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { httpRequestInterceptor } from './http-request.interceptor';

describe('httpRequestInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => httpRequestInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(withXhr())],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
