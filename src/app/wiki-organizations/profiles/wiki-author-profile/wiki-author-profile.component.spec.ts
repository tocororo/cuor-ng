import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiAuthorProfileComponent } from './wiki-author-profile.component';

describe('WikiAuthorProfileComponent', () => {
  let component: WikiAuthorProfileComponent;
  let fixture: ComponentFixture<WikiAuthorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiAuthorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiAuthorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
