import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrgsMapComponent } from './orgs-map.component';

describe('OrgsMapComponent', () => {
  let component: OrgsMapComponent;
  let fixture: ComponentFixture<OrgsMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
