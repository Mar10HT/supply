import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishRequisitionComponent } from './finish-requisition.component';

describe('FinishRequisitionComponent', () => {
  let component: FinishRequisitionComponent;
  let fixture: ComponentFixture<FinishRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishRequisitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
