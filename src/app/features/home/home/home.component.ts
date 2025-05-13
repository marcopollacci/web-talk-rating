import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly http = inject(HttpClient);
  constructor() {
    this.http.get('/api/get-all-events-rating').subscribe((data) => {
      console.log(data);
    });
  }
}
