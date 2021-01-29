import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiTopicProfileComponent } from './wiki-topic-profile.component';

describe('WikiTopicProfileComponent', () => {
  let component: WikiTopicProfileComponent;
  let fixture: ComponentFixture<WikiTopicProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiTopicProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiTopicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
