import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguationComponent } from './disambiguation.component';

describe('DisambiguationComponent', () => {
  let component: DisambiguationComponent;
  let fixture: ComponentFixture<DisambiguationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
