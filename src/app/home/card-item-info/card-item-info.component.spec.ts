import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItemInfoComponent } from './card-item-info.component';

describe('CardItemInfoComponent', () => {
  let component: CardItemInfoComponent;
  let fixture: ComponentFixture<CardItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
