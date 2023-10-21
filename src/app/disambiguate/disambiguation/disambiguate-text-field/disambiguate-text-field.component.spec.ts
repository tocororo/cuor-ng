import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguateTextFieldComponent } from './disambiguate-text-field.component';

describe('DisambiguateTextFieldComponent', () => {
  let component: DisambiguateTextFieldComponent;
  let fixture: ComponentFixture<DisambiguateTextFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
