import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsSliderComponent } from './cards-slider.component';

describe('CardsSliderComponent', () => {
  let component: CardsSliderComponent;
  let fixture: ComponentFixture<CardsSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
