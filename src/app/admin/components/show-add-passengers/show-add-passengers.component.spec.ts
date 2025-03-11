import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAddPassengersComponent } from './show-add-passengers.component';

describe('AddPassengersComponent', () => {
  let component: ShowAddPassengersComponent;
  let fixture: ComponentFixture<ShowAddPassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAddPassengersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAddPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
