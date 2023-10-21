import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableLayoutComponent } from './table-layout.component';

describe('TableLayoutComponent', () => {
  let component: TableLayoutComponent;
  let fixture: ComponentFixture<TableLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
