import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrgSearchWikiComponent } from './wiki-org-search.component';

describe('OrgSearchWikiComponent', () => {
  let component: OrgSearchWikiComponent;
  let fixture: ComponentFixture<OrgSearchWikiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgSearchWikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgSearchWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
