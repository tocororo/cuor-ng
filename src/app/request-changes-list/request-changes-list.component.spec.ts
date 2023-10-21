import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RequestChangesListComponent } from './request-changes-list.component';

describe('RequestChangesListComponent', () => {
  let component: RequestChangesListComponent;
  let fixture: ComponentFixture<RequestChangesListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestChangesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChangesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
