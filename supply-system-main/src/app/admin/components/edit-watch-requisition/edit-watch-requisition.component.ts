import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { IProduct, IProductRequisition, IRequisition } from '../../interfaces';
import { RequisitionMutations } from '../../services';

export interface IRange {
  id: number;
  startRange: number;
  endRange: number;
}

@Component({
  selector: 'app-edit-watch-requisition',
  standalone: true,
  imports: [
    LoadingComponent, PrimaryButtonComponent, CommonModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    FormsModule
  ],
  templateUrl: './edit-watch-requisition.component.html',
  styleUrl: './edit-watch-requisition.component.scss'
})
export class EditWatchRequisitionComponent implements OnInit {
  public disabled = false;
  public error = false;
  public loading = false;
  public ranges: IRange[] = [];
  public unvalidRanges = false;
  public productsRequisition: IProductRequisition[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditWatchRequisitionComponent>,
    private requisitionMutation: RequisitionMutations,
    @Inject(MAT_DIALOG_DATA) public data: { requisition: IRequisition, type: string }
  ) {}

  ngOnInit(): void {
    this.disabled = this.data.type === 'watch';
    this.productsRequisition = this.data.requisition.productsRequisition;
    this.generateRanges();
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public maxQuantity(product: IProduct): number {
    return product.batches.reduce((acc, batch) => acc + batch.quantity, 0) || 0;
  }

  public async onSubmit(): Promise<void> {
    this.error = false;
    this.unvalidRanges = false;
    if(this.hasErrors()) {
      this.error = true;
      return;
    } else if(this.rangesError()) {
      this.unvalidRanges = true;
      return;
    }
    this.loading = true;

    const mutationResponse = await this.requisitionMutation.updateRequisition(this.productsRequisition, this.ranges);
    this.onCancel(mutationResponse);
  }

  public findRange(id: number): IRange {
    return this.ranges.find(range => range.id === id) || { id: 0, startRange: 0, endRange: 0 };
  }

  private hasErrors(): boolean {
    const error = this.data.requisition.productsRequisition.some(req => {
      return req.quantity > this.maxQuantity(req.product);
    });
    return error;
  }

  private rangesError(): boolean {
    const rangesError = this.ranges.some(range => {
      const batchNumber = this.productsRequisition.find(req => req.id === range.id)?.product.batchedNumber || 0;
      return range.startRange > range.endRange || range.startRange < batchNumber;
    });
    return rangesError;
  }

  private generateRanges(): void {
    this.productsRequisition.forEach(req => {
      const ranges = {
        id: req.id,
        startRange: req.product.batchedNumber,
        endRange: req.product.batchedNumber + 1
      };
      this.ranges = this.ranges.concat(ranges);
    });
  }
}
