import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WikiOrganizationsComponent } from './wiki-organizations.component';

describe('WikiOrganizationsComponent', () => {
  let component: WikiOrganizationsComponent;
  let fixture: ComponentFixture<WikiOrganizationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiOrganizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
