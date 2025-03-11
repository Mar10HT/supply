import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProductRequisition } from 'src/app/admin/interfaces';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { IProductRequisitionWithIds } from '../../interfaces/public.interfaces';
import { PublicMutations } from '../..';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, PrimaryButtonComponent
  ],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
  public loading = false;
  public productRequisitions: IProductRequisition[] = [];

  constructor(
    private dialogRef: MatDialogRef<ConfirmComponent>,
    private publicMutation: PublicMutations,
    @Inject(MAT_DIALOG_DATA) public data: IProductRequisition[]
  ){}

  public async onConfirm(): Promise<void> {
    this.loading = true;
    const requisitions: IProductRequisitionWithIds[] = this.data.map(requisition => {
      return {
        productId: requisition.product.id,
        requisitionId: 0,
        quantity: requisition.quantity
      };
    });

    const mutationResponse = await this.publicMutation.createRequisition(requisitions);

    if (mutationResponse) {
      this.onCancel(true);
    }
    this.loading = false;
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }
}
