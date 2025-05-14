import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRatingComponent } from './image-rating.component';

describe('ImageRatingComponent', () => {
  let component: ImageRatingComponent;
  let fixture: ComponentFixture<ImageRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
