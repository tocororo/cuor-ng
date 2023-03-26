import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguateAccordChipsFieldComponent } from './disambiguate-accord-chips-field.component';

describe('DisambiguateAccordChipsFieldComponent', () => {
  let component: DisambiguateAccordChipsFieldComponent;
  let fixture: ComponentFixture<DisambiguateAccordChipsFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateAccordChipsFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateAccordChipsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
