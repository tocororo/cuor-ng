import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrgReviewerComponent } from './org-reviewer.component';

describe('OrgReviewerComponent', () => {
  let component: OrgReviewerComponent;
  let fixture: ComponentFixture<OrgReviewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgReviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
