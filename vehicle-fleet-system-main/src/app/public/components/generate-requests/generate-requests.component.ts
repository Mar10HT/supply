import { Component, OnInit } from '@angular/core';
import { map, Observable, startWith } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchService } from 'src/app/core/services';
import { FileNameHelper, NameHelper } from 'src/app/admin/helpers';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileDropComponent, LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { MatSelectModule } from '@angular/material/select';
import { cookieHelper, EMPTY_CITY, EMPTY_REQUEST, EMPTY_USER } from 'src/app/core/helpers';
import { City, Model, Upload } from 'src/app/core/enums';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { UploaderService } from 'src/app/admin/services';
import { environment } from 'src/environments/environments';
import { ICity, IRequest, IRequestType, IUser } from '../../interfaces';
import { PublicMutations, PublicQueries } from '../../services';


const FILE_BASE_URL = environment.filesUrl;
@Component({
  selector: 'app-generate-requests',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, MatAutocompleteModule,
    FormsModule, MatCheckboxModule, CommonModule, ReactiveFormsModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, AsyncPipe,
    NgxMaterialTimepickerModule, LoadingComponent, FileDropComponent
  ],
  providers: [
    NameHelper, cookieHelper, provideNativeDateAdapter(),
    FileNameHelper
  ],
  templateUrl: './generate-requests.component.html',
  styleUrl: './generate-requests.component.scss'
})
export class GenerateRequestsComponent implements OnInit {
  public loading = true;
  public cities: ICity[] = [];
  public requestTypes: IRequestType[] = [];
  public employees: IUser[] = [];
  public employee: IUser = EMPTY_USER;
  private readonly fileUrl = FILE_BASE_URL;
  public filteredEmployees!: Observable<IUser[]>;
  public requestForm!: FormGroup;
  public id = 0;
  public error = false;
  public noUser = false;
  public selectedEmployees: IUser[] = [];
  public filteredCities!: Observable<ICity[]>;
  public request: IRequest = EMPTY_REQUEST;
  public selectedCity: ICity = EMPTY_CITY;
  public requestCreated = false;
  public noFile = false;
  public filesControl = new FileUploadControl(undefined, FileUploadValidators.filesLimit(1));
  public selectedFile!: File;

  constructor(
    private formBuilder: FormBuilder,
    private searchEngine: SearchService,
    private publicQuery: PublicQueries,
    private cookieHelper: cookieHelper,
    private publicMutation: PublicMutations,
    private uploaderService: UploaderService,
    private nameHelper: NameHelper,
    private fileNameHelper: FileNameHelper
  ){}

  ngOnInit(): void {
    this.fetchData();
    this.requestForm = this.formBuilder.group({
      city: ['', Validators.required],
      type: ['', Validators.required],
      employees: [''],
      reason: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', Validators.required],
      memo: ['', Validators.required],
      departureTime: ['', Validators.required],
      returnTime: ['', Validators.required]
    });
    this.filteredEmployees = this.requestForm.controls.employees.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.employees, value.toString(), Model.user)),
    );
    this.filteredCities = this.requestForm.controls.city.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.cities, value.toString(), Model.city)),
    );
  }

  public isPassengerSelected(user: IUser): boolean {
    return this.selectedEmployees.includes(user);
  }

  public getFiles(files: File[]): void {
    this.selectedFile = files[0];
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

  public async onSubmit(): Promise<void> {
    this.error = false;
    this.noFile = false;
    this.noUser = false;
    const incompleteForm = this.checkControlsEmpty();

    if(!this.selectedFile) {
      this.noFile = true;
      return;
    }

    if (incompleteForm) {
      this.error = true;
      return;
    }
    this.loading = true;
    let file = '';
    let fileUploaded = true;

    if (this.selectedFile) {
      const fileName = this.fileNameHelper.getFileName(Upload.request, this.cookieHelper.getUsername() + '_' + moment().format('DD-MM-YYYY'), this.selectedFile);
      const realFileName = this.fileNameHelper.getRealFileName(fileName);
      fileUploaded = await this.uploaderService.uploadFile(this.selectedFile, fileName);
      file = this.fileUrl + 'requests/' + realFileName;
    }

    const data = {
      ID_Solicitud: 0,
      ID_Empleado: this.id,
      Destino: this.requestForm.controls.destination.value,
      Motivo: this.requestForm.controls.reason.value,
      Fecha: moment.utc(this.requestForm.controls.date.value).toISOString(),
      Hora_Salida: moment.utc(this.requestForm.controls.departureTime.value, 'h:mm A').toISOString(),
      Hora_Regreso: moment.utc(this.requestForm.controls.returnTime.value, 'h:mm A').toISOString(),
      Ciudad: this.selectedCity,
      Documento_URL: file,
      Numero_Memorando: this.requestForm.controls.memo.value,
      Tipo_Solicitud: this.getRequestType(),
      Pasajeros: this.selectedEmployees.map((passenger) => passenger.ID_Empleado).join(',')
    };

    let mutationResponse = false;
    if (fileUploaded){
      mutationResponse = await this.publicMutation.createRequest(data);
    }


    if (mutationResponse) {
      this.requestCreated = true;
      this.loading = false;
    }
  }

  public getId(): void {
    this.error = false;
    this.noUser = false;

    this.publicQuery.getUserId(this.cookieHelper.getUsername()).subscribe((id) => {
      this.id = id;
      this.employee = this.employees.find(employee => employee.ID_Empleado === this.id) || EMPTY_USER;
      this.selectedEmployees.push(this.employee);
      this.loading = false;
    });
  }

  public selectCity(city: ICity): void {
    this.selectedCity = city;

    const typeControl = this.requestForm.controls.type;
    this.selectedCity.Nombre === City.TGU ? typeControl.setValue('Interna') : typeControl.setValue('Externa');
  }

  private getRequestType(): IRequestType {
    const type = this.requestForm.controls.type.value;
    return this.requestTypes.find(requestType => requestType.Tipo_Solicitud === type) || this.requestTypes[0];
  }

  private checkControlsEmpty(): boolean {
    return Object.keys(this.requestForm.controls).some(controlName => {
      const control = this.requestForm.controls[controlName];
      return control.errors && control.errors.required && control.value === '';
    });
  }

  private fetchData(): void {
    this.publicQuery.getCities().subscribe(({ data }) => {
      this.cities = data;
    });
    this.publicQuery.getRequestTypes().subscribe(({ data }) => {
      this.requestTypes = data;
    });
    this.publicQuery.getAllUsers().subscribe(({ data }) => {
      this.employees = data;
      this.getId();
    });
  }
}
