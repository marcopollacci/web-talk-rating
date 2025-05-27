import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRatingComponent } from './image-rating.component';

describe('ImageRatingComponent', () => {
  let component: ImageRatingComponent;
  let fixture: ComponentFixture<ImageRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageRatingComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageRatingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formValueRating', 5);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
