import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Model } from 'src/app/core/enums';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { ProductMutations, SupplierMutations } from '../../services';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [
    LoadingComponent, PrimaryButtonComponent, CommonModule
  ],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss'
})
export class DeleteComponent implements OnInit {
  public title = '';
  public loading = true;

  constructor(
    private dialogRef: MatDialogRef<DeleteComponent>,
    private productMutation: ProductMutations,
    private supplierMutation: SupplierMutations,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, type: string }
  ) {}

  ngOnInit(): void {
    switch (this.data.type) {
      case Model.Product:
        this.title = 'Producto';
        break;
      case Model.Supplier:
        this.title = 'Proveedor';
        break;
    }
    this.loading = false;
  }

  public async onSubmit(): Promise<void> {
    this.loading = true;
    let mutationResponse = false;

    switch (this.data.type) {
      case Model.Product:
        mutationResponse = await this.productMutation.deleteProduct(this.data.id);
        break;
      case Model.Supplier:
        mutationResponse = await this.supplierMutation.deleteSupplier(this.data.id);
        break;
    }

    this.onCancel(mutationResponse);
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }
}
