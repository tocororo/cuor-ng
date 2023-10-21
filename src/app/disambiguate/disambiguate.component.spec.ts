import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguateComponent } from './disambiguate.component';

describe('DisambiguateComponent', () => {
  let component: DisambiguateComponent;
  let fixture: ComponentFixture<DisambiguateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
