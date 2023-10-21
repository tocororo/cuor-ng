import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DisambiguateRelationshipsComponent } from './disambiguate-relationships.component';

describe('DisambiguateRelationshipsComponent', () => {
  let component: DisambiguateRelationshipsComponent;
  let fixture: ComponentFixture<DisambiguateRelationshipsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisambiguateRelationshipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisambiguateRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
