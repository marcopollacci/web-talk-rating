import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-image-rating',
  imports: [],
  templateUrl: './image-rating.component.html',
  styleUrl: './image-rating.component.scss',
})
export class ImageRatingComponent {
  formValueRating = input.required<number>();
  ratingSelected = output<number>();

  filterValue(ratingToCompare: number) {
    if (this.formValueRating() >= ratingToCompare) {
      return 'none';
    }

    return 'url(#desaturate)';
  }

  getValue(value: number) {
    console.log('🚀 ~ ImageRatingComponent ~ getValue ~ number:', value);
  }
}
