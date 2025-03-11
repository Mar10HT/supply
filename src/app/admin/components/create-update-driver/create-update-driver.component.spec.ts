import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateDriverComponent } from './create-update-driver.component';

describe('CreateUpdateDriverComponent', () => {
  let component: CreateUpdateDriverComponent;
  let fixture: ComponentFixture<CreateUpdateDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
