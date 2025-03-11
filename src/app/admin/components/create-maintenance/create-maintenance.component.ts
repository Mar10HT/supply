import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent } from 'src/app/shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchService } from 'src/app/core/services';
import { map, Observable, startWith } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EMPTY_VEHICLE } from 'src/app/core/helpers';
import { Model } from 'src/app/core/enums';
import { vehicleInfoHelper } from '../../helpers';
import { MaintenanceMutations, VehicleQueries } from '../../services';
import { IVehicle } from '../../interfaces';

@Component({
  selector: 'app-create-maintenance',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, CommonModule, MatInputModule,
    MatAutocompleteModule, AsyncPipe, MatSelectModule,
    MatDatepickerModule
  ],
  providers: [vehicleInfoHelper, MaintenanceMutations, provideNativeDateAdapter()],
  templateUrl: './create-maintenance.component.html',
  styleUrl: './create-maintenance.component.scss'
})
export class CreateMaintenanceComponent implements OnInit {
  public maintenanceForm!: FormGroup;
  public maintenanceType: string[] = ['Preventivo', 'Correctivo'];
  public vehicles: IVehicle[] = [];
  public filteredVehicles!: Observable<IVehicle[]>;
  public maxDate: Date = new Date();
  public selectedVehicle: IVehicle = EMPTY_VEHICLE;
  public error = false;
  public incompleteForm = false;
  public validKms = true;

  constructor(
    public vehicleInfoHelper: vehicleInfoHelper,
    private _formBuilder: FormBuilder,
    private searchEngine: SearchService,
    private dialogRef: MatDialogRef<CreateMaintenanceComponent>,
    private vehicleQuery: VehicleQueries,
    private maintenanceMutation: MaintenanceMutations
  ){}

  ngOnInit(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({ data }) => {
      if(data){
        this.vehicles = data;
      }
    });
    this.maintenanceForm = this._formBuilder.group({
      vehicle: ['', [Validators.required]],
      kms: ['', [Validators.required]],
      type: ['Preventivo', [Validators.required]],
      date: [new Date(), [Validators.required]],
    });
    this.filteredVehicles = this.maintenanceForm.controls.vehicle.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.vehicles, value, Model.vehicle)),
    );
  }

  public async onSubmit(): Promise<void> {
    this.validKms = this.checkKms();
    this.incompleteForm = this.checkControlsEmpty();

    if (!this.validKms || this.incompleteForm) {
      this.error = true;
      return;
    }

    const data = {
      ID_Vehiculo: this.selectedVehicle.ID_Vehiculo,
      Kilometraje: this.maintenanceForm.controls.kms.value,
      Tipo_Mantenimiento: this.maintenanceForm.controls.type.value,
      Fecha: this.maintenanceForm.controls.date.value
    };

    const mutationResponse = await this.maintenanceMutation.createMaintenance(data);

    if (mutationResponse) {
      this.onCancel(mutationResponse);
    }
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public selectVehicle(vehicle: IVehicle): void {
    this.selectedVehicle = vehicle;
    this.maintenanceForm.controls.kms.setValue(vehicle.Kilometraje);
  }

  private checkControlsEmpty(): boolean {
    return Object.keys(this.maintenanceForm.controls).some(controlName => {
      const control = this.maintenanceForm.controls[controlName];
      return control.errors && control.errors.required && control.value === '';
    });
  }

  private checkKms(): boolean {
    const maintenanceKms =this.maintenanceForm.controls.kms.value;
    if(maintenanceKms === '' || maintenanceKms === 0 || this.selectedVehicle === EMPTY_VEHICLE) {
      return true;
    }

    return maintenanceKms <= this.selectedVehicle.Kilometraje;
  }
}
