import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisambiguateCardFieldComponent } from './disambiguate-card-field.component';

describe('DisambiguateCardFieldComponent', () => {
  let component: DisambiguateCardFieldComponent;
  let fixture: ComponentFixture<DisambiguateCardFieldComponent>;

  beforeEach(async(() => {
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
