import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateVehicleComponent } from './create-update-vehicle.component';

describe('CreateUpdateVehicleComponent', () => {
  let component: CreateUpdateVehicleComponent;
  let fixture: ComponentFixture<CreateUpdateVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
