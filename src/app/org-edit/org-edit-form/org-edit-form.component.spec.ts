import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrgEditFormComponent } from './org-edit-form.component';

describe('OrgEditFormComponent', () => {
  let component: OrgEditFormComponent;
  let fixture: ComponentFixture<OrgEditFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
