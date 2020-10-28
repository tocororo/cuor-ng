import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisambiguateListComponent } from './disambiguate-list.component';

describe('DisambiguateListComponent', () => {
  let component: DisambiguateListComponent;
  let fixture: ComponentFixture<DisambiguateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
