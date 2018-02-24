import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthYearDialogComponent } from './month-year-dialog.component';

describe('MonthYearDialogComponent', () => {
  let component: MonthYearDialogComponent;
  let fixture: ComponentFixture<MonthYearDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthYearDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthYearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
