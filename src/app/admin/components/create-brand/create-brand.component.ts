import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PrimaryButtonComponent } from 'src/app/shared';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { VehicleMutations, VehicleQueries } from '../../services';
import { DeleteDriverComponent } from '../delete-driver/delete-driver.component';
import { IBrand } from '../../interfaces';

@Component({
  selector: 'app-create-brand',
  standalone: true,
  imports: [
    PrimaryButtonComponent, FormsModule, MatInputModule,
    MatFormFieldModule, CommonModule
  ],
  templateUrl: './create-brand.component.html',
  styleUrl: './create-brand.component.scss'
})
export class CreateBrandComponent implements OnInit {
  public brandName: string = '';
  public brands: IBrand[] = [];
  public empty = false;
  public error = false;

  constructor(
    private dialogRef: MatDialogRef<DeleteDriverComponent>,
    private vehicleQuery: VehicleQueries,
    private vehicleMutation: VehicleMutations
  ){}

  ngOnInit(): void {
    this.fetchData();
  }

  public fetchData(): void {
    this.vehicleQuery.getBrands().subscribe(({data}) => {
      this.brands = data;
    });
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public async createBrand(): Promise<void> {
    this.validateForm();

    if (this.error || this.empty) {
      return;
    }

    const formattedName = this.formatName(this.brandName);
    const mutationResponse = await this.vehicleMutation.createBrand(formattedName);

    if (mutationResponse) {
      this.onCancel(true);
    }
  }

  private validateForm(): void {
    this.empty = this.brandName === '';
    this.error = this.brands.some(brand => brand.Marca === this.formatName(this.brandName));
  }

  private formatName(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}
