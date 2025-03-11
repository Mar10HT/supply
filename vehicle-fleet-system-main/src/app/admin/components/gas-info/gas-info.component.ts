import { Component, Inject, OnInit } from '@angular/core';
import { PrimaryButtonComponent } from 'src/app/shared/buttons';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY_GAS_REFILL } from 'src/app/core/helpers';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import 'moment/min/locales';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LogsQueries } from '../../services';
import { IGasRefill, IGasUnit, ILog } from '../../interfaces';

@Component({
  selector: 'app-gas-info',
  standalone: true,
  imports: [
    PrimaryButtonComponent, CommonModule, ReactiveFormsModule,
    MatInputModule, MatDatepickerModule, MatSelectModule,
    MatFormFieldModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './gas-info.component.html',
  styleUrl: './gas-info.component.scss'
})
export class GasInfoComponent implements OnInit {
  public gasForm!: FormGroup;
  public gasRefill: IGasRefill = EMPTY_GAS_REFILL;
  public date = '';
  public quantity = '';
  public isCreate = false;
  public maxDate = new Date();
  public units: IGasUnit[] = [];
  public error = false;

  constructor(
    private dialogRef: MatDialogRef<GasInfoComponent>,
    private _formBuilder: FormBuilder,
    private logQuery: LogsQueries,
    @Inject(MAT_DIALOG_DATA) public data: { log: ILog, modalType: string }
  ){}

  ngOnInit(): void {
    this.maxDate = moment.utc(this.data.log.Fecha).toDate();
    this.isCreate = this.data.modalType === 'create';
    this.fetchData();
    moment.locale('es');
    this.gasForm = this._formBuilder.group({
      date: [this.maxDate, [Validators.required]],
      kms: [this.data.log.Kilometraje_Salida, [Validators.required]],
      station: ['', [Validators.required]],
      quantity: [0, [Validators.required]],
      unit: ['', [Validators.required]],
      bill: [0, [Validators.required]],
      order: [0, [Validators.required]],
      price: ['', [Validators.required]]
    });
    this.setData();
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onSubmit(): void {
    if (this.gasForm.invalid) {
      this.error = true;
      return;
    }
    const formControls = this.gasForm.controls;
    const gasUnit: IGasUnit = {
      ID_Unidad_Combustible: formControls.unit.value.ID_Unidad_Combustible,
      Unidad: formControls.unit.value.Unidad
    };
    const gasInfo: IGasRefill = {
      ID_Llenado_Combustible: 0,
      Cantidad: formControls.quantity.value,
      Estacion_Combustible: formControls.station.value,
      Kilometraje_Recarga: formControls.kms.value,
      Fecha: formControls.date.value,
      Precio: formControls.price.value,
      Numero_Factura: formControls.bill.value,
      Numero_Orden: formControls.order.value,
      Unidad_Combustible: gasUnit,
      Bitacora: this.data.log
    };
    this.dialogRef.close(gasInfo);
  }

  private setData(): void {
    if (this.isCreate) {
      return;
    }

    this.gasRefill = this.data.log.Llenados_Combustible[0];
    this.date = moment(this.gasRefill.Fecha).format('dddd LL');
    const unit = this.gasRefill.Unidad_Combustible.Unidad;
    const unitPlural = unit === 'Litro' ? 's' : 'es';
    this.quantity = this.gasRefill.Cantidad + ' ' + unit + unitPlural;
  }

  private fetchData(): void {
    if(!this.isCreate) return;
    this.logQuery.getGasUnits().subscribe(({data}) => {
      this.units = data;
    });
  }
}
