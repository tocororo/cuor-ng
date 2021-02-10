import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiOrganizationsComponent } from './wiki-organizations.component';

describe('WikiOrganizationsComponent', () => {
  let component: WikiOrganizationsComponent;
  let fixture: ComponentFixture<WikiOrganizationsComponent>;

  beforeEach(async(() => {
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
