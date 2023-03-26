import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguateCardChipsFieldComponent } from './disambiguate-card-chips-field.component';

describe('DisambiguateCardChipsFieldComponent', () => {
  let component: DisambiguateCardChipsFieldComponent;
  let fixture: ComponentFixture<DisambiguateCardChipsFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateCardChipsFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateCardChipsFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
