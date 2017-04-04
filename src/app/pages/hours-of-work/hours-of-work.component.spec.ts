import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursOfWorkComponent } from './hours-of-work.component';

describe('HoursOfWorkComponent', () => {
  let component: HoursOfWorkComponent;
  let fixture: ComponentFixture<HoursOfWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoursOfWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoursOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
