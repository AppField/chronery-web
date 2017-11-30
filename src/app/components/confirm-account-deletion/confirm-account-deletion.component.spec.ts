import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountDeletionComponent } from './confirm-account-deletion.component';

describe('ConfirmAccountDeletionComponent', () => {
  let component: ConfirmAccountDeletionComponent;
  let fixture: ComponentFixture<ConfirmAccountDeletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmAccountDeletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmAccountDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
