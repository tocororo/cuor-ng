import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PdfExcelComponent } from './pdf-excel.component';

describe('PdfExcelComponent', () => {
  let component: PdfExcelComponent;
  let fixture: ComponentFixture<PdfExcelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfExcelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
