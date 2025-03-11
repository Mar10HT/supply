import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { EMPTY_BATCH } from 'src/app/core/helpers';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OutputMutations } from '../../services';
import { IBatch, IProduct } from '../../interfaces';

@Component({
  selector: 'app-remove-products',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, PrimaryButtonComponent,
    MatRadioModule, MatInputModule, FormsModule,
    ReactiveFormsModule, MatSelectModule
  ],
  templateUrl: './remove-products.component.html',
  styleUrl: './remove-products.component.scss'
})
export class RemoveProductsComponent implements OnInit {
  public error = false;
  public selectedBatch: IBatch = EMPTY_BATCH;
  public form!: FormGroup;
  public batches: IBatch[] = [];
  public loading = false;
  public amountError = false;
  public motives = ['otro', 'vencimiento'];

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<RemoveProductsComponent>,
    private outputMutation: OutputMutations,
    @Inject(MAT_DIALOG_DATA) public data: IProduct
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      quantity: [1, [Validators.required]],
      observations: ['', [Validators.required]],
      motive: ['', [Validators.required]]
    });
    this.batches = this.data.batches.filter(batch => batch.quantity > 0);
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public async onSubmit(): Promise<void> {
    this.error = false;
    this.amountError = false;
    if (this.selectedBatch.id === 0 || this.form.invalid) {
      this.error = true;
      return;
    }
    if (this.form.controls.quantity.value > this.selectedBatch.quantity) {
      this.amountError = true;
      return;
    }

    this.loading = true;

    const data = {
      batchId: this.selectedBatch.id,
      quantity: this.form.controls.quantity.value,
      productId: this.data.id,
      observation: this.form.controls.observations.value === '' ? 'Sin observaciones' : this.form.controls.observations.value,
      date: new Date(),
      currentQuantity: this.data.batches.reduce((acc, batch) => acc + batch.quantity, 0) - this.form.controls.quantity.value,
      price: this.selectedBatch.price * this.form.controls.quantity.value,
      motive: this.form.controls.motive.value
    };

    const response = await this.outputMutation.createOutput(data);

    if (response) {
      this.dialogRef.close(true);
    } else {
      this.loading = false;
    }
  }

  public getDate(batch: IBatch): string {
    return batch.due ? moment.utc(batch.due).format('DD/MM/YYYY') : 'No Registrado';
  }

  public selectBatch(batch: IBatch): void {
    this.selectedBatch = batch;
  }
}
