import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisambiguateCardChipsFieldComponent } from './disambiguate-card-chips-field.component';

describe('DisambiguateCardChipsFieldComponent', () => {
  let component: DisambiguateCardChipsFieldComponent;
  let fixture: ComponentFixture<DisambiguateCardChipsFieldComponent>;

  beforeEach(async(() => {
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
