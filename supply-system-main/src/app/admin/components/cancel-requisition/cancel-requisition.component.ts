import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { RequisitionMutations } from '../../services';
import { DeleteComponent } from '../delete/delete.component';
import { IRequisition } from '../../interfaces';

@Component({
  selector: 'app-cancel-requisition',
  standalone: true,
  imports: [
    LoadingComponent, PrimaryButtonComponent, CommonModule
  ],
  templateUrl: './cancel-requisition.component.html',
  styleUrl: './cancel-requisition.component.scss'
})
export class CancelRequisitionComponent {
  public loading = false;

  constructor(
    private dialogRef: MatDialogRef<DeleteComponent>,
    private requisitionMutation: RequisitionMutations,
    @Inject(MAT_DIALOG_DATA) public data: IRequisition
  ) {}

  public async onSubmit(): Promise<void> {
    this.loading = true;
    const mutationResponse = await this.requisitionMutation.cancelRequisiton(this.data.id);

    this.onCancel(mutationResponse);
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }
}
