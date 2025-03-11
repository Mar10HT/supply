import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWatchRequisitionComponent } from './edit-watch-requisition.component';

describe('EditWatchRequisitionComponent', () => {
  let component: EditWatchRequisitionComponent;
  let fixture: ComponentFixture<EditWatchRequisitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWatchRequisitionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditWatchRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
