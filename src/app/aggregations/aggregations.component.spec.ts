import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AggregationsComponent } from './aggregations.component';

describe('AggregationsComponent', () => {
  let component: AggregationsComponent;
  let fixture: ComponentFixture<AggregationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
