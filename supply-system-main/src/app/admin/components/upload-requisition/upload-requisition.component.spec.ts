import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRequisitionComponent } from './upload-requisition.component';

describe('UploadRequisitionComponent', () => {
  let component: UploadRequisitionComponent;
  let fixture: ComponentFixture<UploadRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadRequisitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
