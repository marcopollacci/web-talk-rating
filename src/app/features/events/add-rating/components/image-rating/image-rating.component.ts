import { Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-image-rating',
  imports: [],
  templateUrl: './image-rating.component.html',
  styleUrl: './image-rating.component.scss',
})
export class ImageRatingComponent {
  formValueRating = input.required<number>();
  ratingSelected = output<number>();

  svgElement = viewChild.required<ElementRef>('svgElement');

  filterValue(ratingToCompare: number) {
    if (this.formValueRating() === ratingToCompare) {
      return 'none';
    }

    return 'url(#desaturate)';
  }

  getTabindex(rating: number[] | number): number {
    if (typeof rating === 'number') {
      rating = [rating];
    }
    if (rating.includes(this.formValueRating())) {
      return 0;
    }

    return -1;
  }

  onKeyDown(event: KeyboardEvent, rating: number) {
    // Handle Space and Enter keys
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.ratingSelected.emit(rating);
      return;
    }

    if (
      ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'].includes(event.key)
    ) {
      event.preventDefault();
      let newRating: number;
      if (['ArrowRight', 'ArrowUp'].includes(event.key)) {
        newRating = Math.min(5, rating + 1);
      } else {
        newRating = Math.max(1, rating - 1);
      }
      this.#focusRating(newRating);
      return;
    }
  }

  #focusRating(rating: number) {
    const svgEl = this.svgElement().nativeElement;
    const element = svgEl.querySelector(
      `[data-rating="${rating}"]`
    ) as SVGElement;
    element.focus();
  }
}
