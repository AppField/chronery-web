import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPdfDialogComponent } from './report-pdf-dialog.component';

describe('ReportPdfDialogComponent', () => {
  let component: ReportPdfDialogComponent;
  let fixture: ComponentFixture<ReportPdfDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPdfDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
