import { Routes } from '@angular/router';

const eventsRoutes: Routes = [
  {
    path: 'add-rating/:eventId',
    loadComponent: () =>
      import('./features/events/add-rating/add-rating.component').then(
        (c) => c.AddRatingComponent
      ),
  },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home/home.component').then(
        (c) => c.HomeComponent
      ),
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
