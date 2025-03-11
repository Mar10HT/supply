import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { cookieHelper, EMPTY_DRIVER, EMPTY_REQUEST, EMPTY_USER, EMPTY_VEHICLE } from 'src/app/core/helpers';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Model, RequestStatus } from 'src/app/core/enums';
import { SearchService } from 'src/app/core/services';
import { RequestMutations, RequestQueries } from '../../services';
import { NameHelper, vehicleInfoHelper } from '../../helpers';
import { IDriver, IRequest, IRequestStatus, IUser, IVehicle } from '../../interfaces';

@Component({
  selector: 'app-update-request',
  standalone: true,
  imports: [
    PrimaryButtonComponent, FormsModule,
    ReactiveFormsModule, MatAutocompleteModule,
    CommonModule, MatInputModule, MatCheckboxModule,
    LoadingComponent
  ],
  providers: [vehicleInfoHelper, NameHelper, cookieHelper],
  templateUrl: './update-request.component.html',
  styleUrl: './update-request.component.scss'
})
export class UpdateRequestComponent implements OnInit {
  public requestForm!: FormGroup;
  public loading = true;
  public statuses: IRequestStatus[] = [];
  public drivers: IDriver[] = [];
  public employees: IUser[] = [];
  public employee: IUser = EMPTY_USER;
  public vehicles: IVehicle[] = [];
  public passengerIds: number[] = [];
  public filteredDrivers!: Observable<IDriver[]>;
  public filteredEmployees!: Observable<IUser[]>;
  public filteredVehicles!: Observable<IVehicle[]>;
  public selectedVehicle: IVehicle = EMPTY_VEHICLE;
  public selectedDriver: IDriver = EMPTY_DRIVER;
  public selectedEmployees: IUser[] = [];
  public error = false;
  public nextMaintenance = 0;
  public emptyPassengers = false;
  public showKms = false;

  constructor(
    public vehicleInfoHelper: vehicleInfoHelper,
    private _formBuilder: FormBuilder,
    private requestQuery: RequestQueries,
    private requestMutations: RequestMutations,
    private nameHelper: NameHelper,
    private dialogRef: MatDialogRef<UpdateRequestComponent>,
    private searchEngine: SearchService,
    @Inject(MAT_DIALOG_DATA) public request: IRequest = EMPTY_REQUEST
  ){}

  ngOnInit(): void {
    this.selectedVehicle = this.request.Vehiculo || EMPTY_VEHICLE;
    this.selectedDriver = this.request.Conductor || EMPTY_DRIVER;
    this.passengerIds = this.request.Pasajeros !== '' ? this.request.Pasajeros.split(',').map(Number) : [];
    this.requestForm = this._formBuilder.group({
      vehicle: [[''], [Validators.required]],
      driver: [[''], [Validators.required]],
      employees: []
    });

    this.fetchData();
    this.fillForm();
    this.startFiltering();
  }

  public startFiltering(): void {
    this.filteredEmployees = this.requestForm.controls.employees.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.employees, value.toString(), Model.user)),
    );
    this.filteredVehicles = this.requestForm.controls.vehicle.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.vehicles, value, Model.vehicle)),
    );
    this.filteredDrivers = this.requestForm.controls.driver.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.drivers, value, Model.driver)),
    );
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public selectDriver(driver: IDriver): void {
    this.selectedDriver = driver;
  }

  public selectVehicle(vehicle: IVehicle): void {
    this.selectedVehicle = vehicle;
    this.setMaintenance();
  }

  public async onSubmit(): Promise<void> {
    this.error = false;
    this.emptyPassengers = false;

    if (this.requestForm.invalid) {
      this.error = true;
      return;
    }

    if (this.selectedEmployees.length === 0) {
      this.emptyPassengers = true;
      return;
    }

    this.loading = true;
    const data: any = {
      ID_Solicitud: this.request.ID_Solicitud,
      pastVehicle: this.request.Vehiculo?.ID_Vehiculo || null,
      ID_Vehiculo: this.selectedVehicle.ID_Vehiculo,
      ID_Conductor: this.selectedDriver.ID_Conductor,
      Pasajeros: this.selectedEmployees.map((passenger) => passenger.ID_Empleado).join(',')
    };

    if(this.selectedDriver.ID_Conductor !== 0 && this.selectedVehicle.ID_Vehiculo !== 0) {
      data.ID_Estado_Solicitud = this.statuses.find((status) => status.Estado === RequestStatus.active)?.ID_Estado_Solicitud;
    }

    const mutationResponse = await this.requestMutations.updateRequest(data);

    if (mutationResponse) {
      this.onCancel(mutationResponse);
    }
  }

  public isPassengerSelected(user: IUser): boolean {
    return this.selectedEmployees.includes(user);
  }

  public toggleSelection(user: IUser): void {
    if (this.selectedEmployees.includes(user)) {
      const index = this.selectedEmployees.indexOf(user);
      this.selectedEmployees.splice(index, 1);
    } else {
      this.selectedEmployees.push(user);
    }
  }

  public display(): string {
    const names = this.selectedEmployees.map((passenger) => {
      return this.nameHelper.getShortName(passenger.Nombres + " " + passenger.Apellidos);
    });
    return names.join(', ');
  }

  private fillForm(): void {
    this.requestForm.patchValue({
      vehicle: this.vehicleInfoHelper.getModel(this.request.Vehiculo),
      driver: this.request.Conductor?.Nombre || ''
    });
  }

  private fetchData(): void {
    this.requestQuery.availableForRequest(this.request.ID_Solicitud).subscribe((data) => {
      if(data) {
        this.drivers = data.drivers;
        this.vehicles = data.vehicles;
        this.employees = data.employees;
        this.selectedEmployees = this.employees.filter((employee) => this.passengerIds.includes(employee.ID_Empleado));
        this.loading = false;
      }
    });
    this.requestQuery.getRequestStatuses().subscribe(({ data }) => {
      if(data) {
        this.statuses = data;
      }
    });
  }

  private setMaintenance(): void {
    this.showKms = true;
    if(this.selectedVehicle.Mantenimientos.length === 0) this.nextMaintenance = 0;
    const lastMaintenance = this.selectedVehicle.Mantenimientos.filter(m => m.Tipo_Mantenimiento === 'Preventivo')[0];
    const lastMaintenanceKms = lastMaintenance.Kilometraje;
    const nextMaintenance = lastMaintenanceKms + 5000;
    this.nextMaintenance = nextMaintenance - this.selectedVehicle.Kilometraje;
  }
}
