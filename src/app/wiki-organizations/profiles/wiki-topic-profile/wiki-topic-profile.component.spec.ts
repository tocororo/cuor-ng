import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiTopicProfileComponent } from './wiki-topic-profile.component';

describe('WikiTopicProfileComponent', () => {
  let component: WikiTopicProfileComponent;
  let fixture: ComponentFixture<WikiTopicProfileComponent>;

  beforeEach(waitForAsync(() => {
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
