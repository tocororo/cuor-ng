import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatepickerYearComponent } from './datepicker-year.component';

describe('DatepickerYearComponent', () => {
  let component: DatepickerYearComponent;
  let fixture: ComponentFixture<DatepickerYearComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatepickerYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
