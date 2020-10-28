import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisambiguateSearchComponent } from './disambiguate-search.component';

describe('DisambiguateSearchComponent', () => {
  let component: DisambiguateSearchComponent;
  let fixture: ComponentFixture<DisambiguateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
