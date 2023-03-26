import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpansionPanelLayoutComponent } from './expansion-panel-layout.component';

describe('ExpansionPanelLayoutComponent', () => {
  let component: ExpansionPanelLayoutComponent;
  let fixture: ComponentFixture<ExpansionPanelLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpansionPanelLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpansionPanelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
