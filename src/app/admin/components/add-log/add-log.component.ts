import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import moment from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PrimaryButtonComponent } from 'src/app/shared';

@Component({
  selector: 'app-add-log',
  standalone: true,
  imports: [
    PrimaryButtonComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, CommonModule, MatInputModule,
    MatAutocompleteModule, AsyncPipe, MatSelectModule,
    MatDatepickerModule, NgxMaterialTimepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-log.component.html',
  styleUrl: './add-log.component.scss'
})
export class AddLogComponent implements OnInit {
  public logDataForm!: FormGroup;
  public maxDate: Date = new Date();
  public error = false;
  public isLater = false;
  public badKms = false;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddLogComponent>,
    @Inject(MAT_DIALOG_DATA) public lastData: { lastKms: number, lastTime: string }
  ) { }

  ngOnInit(): void {
    this.logDataForm = this._formBuilder.group({
      Kilometraje_Entrada: [this.lastData.lastKms, [Validators.required]],
      Kilometraje_Salida: [this.lastData.lastKms, [Validators.required]],
      Hora_Salida: [this.lastData.lastTime, [Validators.required]],
      Hora_Entrada: ['', [Validators.required]],
      Fecha: ['', [Validators.required]],
      Destino: ['', [Validators.required]],
      Observaciones: ['']
    });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if(!this.validateErrors()) {
      return;
    }

    const data = {
      ID_Bitacora: 0,
      Fecha: this.logDataForm.controls.Fecha.value,
      Destino: this.logDataForm.controls.Destino.value,
      Kilometraje_Entrada: this.logDataForm.controls.Kilometraje_Entrada.value,
      Kilometraje_Salida: this.logDataForm.controls.Kilometraje_Salida.value,
      Hora_Salida: moment.utc(this.logDataForm.controls.Hora_Salida.value, 'h:mm A').format('HH:mm:ss'),
      Hora_Entrada: moment.utc(this.logDataForm.controls.Hora_Entrada.value, 'h:mm A').format('HH:mm:ss'),
      Observaciones: this.logDataForm.controls.Observaciones.value
    };

    this.dialogRef.close(data);
  }

  private validateErrors(): boolean {
    this.error = false;
    this.isLater = false;
    this.badKms = false;
    let valid = true;

    if (this.logDataForm.invalid) {
      this.error = true;
      valid = false;
    }

    if (this.logDataForm.controls.Kilometraje_Entrada.value < this.logDataForm.controls.Kilometraje_Salida.value) {
      this.badKms = true;
      valid = false;
    }

    const timeFormat = 'h:mm A';
    const exitTime = this.logDataForm.controls.Hora_Salida.value;
    const entryTime = this.logDataForm.controls.Hora_Entrada.value;
    if (moment(entryTime, timeFormat).isBefore(moment(exitTime, timeFormat))) {
      this.isLater = true;
      valid = false;
    }

    return valid;
  }
}
