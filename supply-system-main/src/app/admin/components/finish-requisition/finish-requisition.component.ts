import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { IRequisition } from '../../interfaces';
import { RequisitionMutations } from '../../services';

@Component({
  selector: 'app-finish-requisition',
  standalone: true,
  imports: [
    LoadingComponent, PrimaryButtonComponent, CommonModule
  ],
  templateUrl: './finish-requisition.component.html',
  styleUrl: './finish-requisition.component.scss'
})
export class FinishRequisitionComponent {
  public loading = false;

  constructor(
    private dialogRef: MatDialogRef<FinishRequisitionComponent>,
    private requisitionMutation: RequisitionMutations,
    @Inject(MAT_DIALOG_DATA) public data: IRequisition
  ) {}

  public async onSubmit(): Promise<void> {
    this.loading = true;
    const mutationResponse = await this.requisitionMutation.finishRequisiton(this.data.id);

    this.onCancel(mutationResponse);
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }
}
