import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOneRelationshipComponent } from './show-one-relationship.component';

describe('ShowOneRelationshipComponent', () => {
  let component: ShowOneRelationshipComponent;
  let fixture: ComponentFixture<ShowOneRelationshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowOneRelationshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowOneRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
