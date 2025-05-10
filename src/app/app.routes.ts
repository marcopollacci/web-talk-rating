import { Routes } from '@angular/router';

const eventsRoutes: Routes = [
  {
    path: 'single-events/:eventId',
    loadComponent: () =>
      import('./pages/events/single-event/single-event.component').then(
        (c) => c.SingleEventComponent
      ),
  },
  {
    path: 'add-rating/:eventId',
    loadComponent: () =>
      import('./pages/events/add-rating/add-rating.component').then(
        (c) => c.AddRatingComponent
      ),
  },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'events',
    children: eventsRoutes,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
