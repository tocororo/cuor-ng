import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiVenueProfileComponent } from './wiki-venue-profile.component';

describe('WikiVenueProfileComponent', () => {
  let component: WikiVenueProfileComponent;
  let fixture: ComponentFixture<WikiVenueProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiVenueProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiVenueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
