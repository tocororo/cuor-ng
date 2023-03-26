import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SceibaMenuAppsComponent } from './menu-apps.component';


describe('FooterComponent', () => {
  let component: SceibaMenuAppsComponent;
  let fixture: ComponentFixture<SceibaMenuAppsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SceibaMenuAppsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceibaMenuAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
