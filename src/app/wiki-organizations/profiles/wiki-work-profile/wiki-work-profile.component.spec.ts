import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiWorkProfileComponent } from './wiki-work-profile.component';

describe('WikiWorkProfileComponent', () => {
  let component: WikiWorkProfileComponent;
  let fixture: ComponentFixture<WikiWorkProfileComponent>;

  beforeEach(async(() => {
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
