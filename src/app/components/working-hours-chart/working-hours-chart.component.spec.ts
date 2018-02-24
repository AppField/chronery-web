import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursChartComponent } from './working-hours-chart.component';

describe('WorkingHoursChartComponent', () => {
  let component: WorkingHoursChartComponent;
  let fixture: ComponentFixture<WorkingHoursChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkingHoursChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
