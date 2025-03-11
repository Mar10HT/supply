import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { EntryMutations } from '../../services';
import { ICreateEntry, IEntryData } from '../../containers';

export interface IProductEntryWithIds {
  entryId: number;
  productId: number;
  quantity: number;
  price: number;
  currentQuantity: number;
}

export interface IBatchWithIds {
  productId: number;
  entryId: number;
  due: Date;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-confirm-input',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, PrimaryButtonComponent
  ],
  templateUrl: './confirm-input.component.html',
  styleUrl: './confirm-input.component.scss'
})
export class ConfirmInputComponent {
  public loading = false;
  public entries: IProductEntryWithIds[] = [];
  public batches: IBatchWithIds[] = [];

  constructor(
    private dialogRef: MatDialogRef<ConfirmInputComponent>,
    private entryMutation: EntryMutations,
    @Inject(MAT_DIALOG_DATA) public data: { entry: ICreateEntry, entryData: IEntryData[] }
  ){}

  public async onConfirm(): Promise<void> {
    this.loading = true;
    this.formatData();
    const mutationResponse = await this.entryMutation.createEntries(this.data.entry, this.entries, this.batches);

    if (mutationResponse) {
      this.onCancel(true);
    }
    this.loading = false;
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  private formatData(): void {
    this.data.entryData.forEach((entryData) => {
      this.entries.push({
        entryId: 0,
        productId: entryData.product.id,
        quantity: entryData.quantity,
        price: entryData.price,
        currentQuantity: entryData.product.batches.reduce((acc, batch) => acc + batch.quantity, 0) + entryData.quantity
      });

      this.batches.push({
        productId: entryData.product.id,
        entryId: 0,
        due: entryData.dueDate,
        quantity: entryData.quantity,
        price: entryData.price
      });
    });
  }
}
