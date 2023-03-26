import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiProfileComponent } from './wiki-org-employes-profile.component';

describe('WikiProfileComponent', () => {
  let component: WikiProfileComponent;
  let fixture: ComponentFixture<WikiProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
