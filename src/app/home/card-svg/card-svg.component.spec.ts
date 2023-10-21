import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardSvgComponent } from './card-svg.component';

describe('CardSvgComponent', () => {
  let component: CardSvgComponent;
  let fixture: ComponentFixture<CardSvgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
