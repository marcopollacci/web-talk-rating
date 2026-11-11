import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRatingComponent } from './image-rating.component';

describe('ImageRatingComponent', () => {
  let component: ImageRatingComponent;
  let fixture: ComponentFixture<ImageRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageRatingComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageRatingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', 5);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the value and emit touch on click', () => {
    let touched = false;
    component.touch.subscribe(() => (touched = true));
    const star = fixture.nativeElement.querySelector('[data-rating="3"]') as SVGElement;
    star.dispatchEvent(new MouseEvent('click'));
    expect(component.value()).toBe(3);
    expect(touched).toBeTrue();
  });

  it('should select the rating with Enter', () => {
    const star = fixture.nativeElement.querySelector('[data-rating="2"]') as SVGElement;
    star.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(component.value()).toBe(2);
  });
});
