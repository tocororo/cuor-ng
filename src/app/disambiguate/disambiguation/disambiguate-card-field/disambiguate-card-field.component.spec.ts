import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguateCardFieldComponent } from './disambiguate-card-field.component';

describe('DisambiguateCardFieldComponent', () => {
  let component: DisambiguateCardFieldComponent;
  let fixture: ComponentFixture<DisambiguateCardFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateCardFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateCardFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
