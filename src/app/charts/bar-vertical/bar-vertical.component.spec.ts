import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarVerticalComponent } from './bar-vertical.component';

describe('BarVerticalComponent', () => {
  let component: BarVerticalComponent;
  let fixture: ComponentFixture<BarVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
