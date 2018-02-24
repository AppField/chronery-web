import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavDaypickerComponent } from './sidenav-daypicker.component';

describe('SidenavDaypickerComponent', () => {
  let component: SidenavDaypickerComponent;
  let fixture: ComponentFixture<SidenavDaypickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavDaypickerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavDaypickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
