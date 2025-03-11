import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasInfoComponent } from './gas-info.component';

describe('GasInfoComponent', () => {
  let component: GasInfoComponent;
  let fixture: ComponentFixture<GasInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GasInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
