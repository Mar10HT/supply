import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRequisitionComponent } from './cancel-requisition.component';

describe('CancelRequisitionComponent', () => {
  let component: CancelRequisitionComponent;
  let fixture: ComponentFixture<CancelRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelRequisitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
