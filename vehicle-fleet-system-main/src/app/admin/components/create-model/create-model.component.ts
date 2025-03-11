import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { VehicleMutations, VehicleQueries } from '../../services';
import { IBrand, IModel, IVehicleType } from '../../interfaces';
import { DeleteDriverComponent } from '../delete-driver/delete-driver.component';
@Component({
  selector: 'app-create-model',
  standalone: true,
  imports: [
    PrimaryButtonComponent, FormsModule, MatInputModule,
    MatFormFieldModule, CommonModule, ReactiveFormsModule,
    MatOptionModule, MatSelectModule
  ],
  templateUrl: './create-model.component.html',
  styleUrl: './create-model.component.scss'
})
export class CreateModelComponent implements OnInit {
  public models: IModel[] = [];
  public empty = false;
  public error = false;
  public vehicleTypes: IVehicleType[] = [];
  public brands: IBrand[] = [];
  public modelForm!: FormGroup;
  public brand = '';

  constructor(
    private dialogRef: MatDialogRef<DeleteDriverComponent>,
    private vehicleQuery: VehicleQueries,
    private _formBuilder: FormBuilder,
    private vehicleMutation: VehicleMutations
  ){}

  ngOnInit(): void {
    this.fetchData();
    this.modelForm = this._formBuilder.group({
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  public fetchData(): void {
    this.vehicleQuery.getModels().subscribe(({data}) => {
      this.models = data;
    });
    this.vehicleQuery.getTypes().subscribe(({data}) => {
      this.vehicleTypes = data;
    });
    this.vehicleQuery.getBrands().subscribe(({data}) => {
      this.brands = data;
    });
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public async createModel(): Promise<void> {
    this.validateForm();

    if (this.error || this.empty) {
      return;
    }
    const data = {
      ID_Modelo: 0,
      Modelo: this.modelForm.controls.model.value,
      ID_Marca_Vehiculo: this.modelForm.controls.brand.value.ID_Marca_Vehiculo,
      ID_Tipo_Vehiculo: this.modelForm.controls.type.value.ID_Tipo_Vehiculo
    };

    const mutationResponse = await this.vehicleMutation.createModel(data);

    if (mutationResponse) {
      this.onCancel(true);
    }
  }

  private validateForm(): void {
    this.empty = this.modelForm.invalid;
    const modelName = this.modelForm.controls.model.value;
    this.error = this.models.some(model => model.Modelo.toLowerCase() === modelName.toLowerCase());
    if (this.error) {
      this.brand = this.models.find(model => model.Modelo.toLowerCase() === modelName.toLowerCase())?.Marca_Vehiculo.Marca || '';
    }
  }
}
