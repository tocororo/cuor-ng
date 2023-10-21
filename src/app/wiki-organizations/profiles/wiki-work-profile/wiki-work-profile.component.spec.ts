import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiWorkProfileComponent } from './wiki-work-profile.component';

describe('WikiWorkProfileComponent', () => {
  let component: WikiWorkProfileComponent;
  let fixture: ComponentFixture<WikiWorkProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiWorkProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiWorkProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
