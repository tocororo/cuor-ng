import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiAuthorsProfileComponent } from './wiki-authors-profile.component';

describe('WikiAuthorsProfileComponent', () => {
  let component: WikiAuthorsProfileComponent;
  let fixture: ComponentFixture<WikiAuthorsProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiAuthorsProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiAuthorsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
