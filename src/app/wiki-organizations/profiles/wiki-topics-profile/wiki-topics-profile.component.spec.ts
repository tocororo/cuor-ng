import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiTopicsProfileComponent } from './wiki-topics-profile.component';

describe('WikiTopicsProfileComponent', () => {
  let component: WikiTopicsProfileComponent;
  let fixture: ComponentFixture<WikiTopicsProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiTopicsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiTopicsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
