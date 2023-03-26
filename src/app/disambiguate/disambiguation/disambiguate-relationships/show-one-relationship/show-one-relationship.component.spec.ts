import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowOneRelationshipComponent } from './show-one-relationship.component';

describe('ShowOneRelationshipComponent', () => {
  let component: ShowOneRelationshipComponent;
  let fixture: ComponentFixture<ShowOneRelationshipComponent>;

  beforeEach(waitForAsync(() => {
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
