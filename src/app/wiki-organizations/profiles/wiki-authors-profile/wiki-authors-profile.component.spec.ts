import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiAuthorsProfileComponent } from './wiki-authors-profile.component';

describe('WikiAuthorsProfileComponent', () => {
  let component: WikiAuthorsProfileComponent;
  let fixture: ComponentFixture<WikiAuthorsProfileComponent>;

  beforeEach(async(() => {
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
