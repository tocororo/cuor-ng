import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiTopicsProfileComponent } from './wiki-topics-profile.component';

describe('WikiTopicsProfileComponent', () => {
  let component: WikiTopicsProfileComponent;
  let fixture: ComponentFixture<WikiTopicsProfileComponent>;

  beforeEach(async(() => {
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
