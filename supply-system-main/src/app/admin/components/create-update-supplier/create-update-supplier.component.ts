import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LoadingComponent, PrimaryButtonComponent, FileDropComponent } from 'src/app/shared';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISupplier } from '../../interfaces';
import { SupplierMutations } from '../../services';

@Component({
  selector: 'app-create-update-supplier',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, PrimaryButtonComponent,
    FileDropComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './create-update-supplier.component.html',
  styleUrl: './create-update-supplier.component.scss'
})
export class CreateUpdateSupplierComponent implements OnInit {
  public isCreate = false;
  public loading = true;
  public error = false;
  public emailError = false;
  public supplierForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateUpdateSupplierComponent>,
    private supplierMutation: SupplierMutations,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: ISupplier, modalType: string }
  ) {}

  ngOnInit(): void {
    this.isCreate = this.data.modalType === 'create';
    this.supplierForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      phone: [''],
      email: ['', [Validators.email]],
      address: [''],
      rtn: ['']
    });

    this.fillForm();
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public async onSubmit(): Promise<void> {
    this.error = false;
    this.emailError = false;

    if (this.supplierForm.controls.email.errors?.email) {
      this.emailError = true;
      return;
    } else if (this.supplierForm.invalid) {
      this.error = true;
      return;
    }

    this.loading = true;

    const data: any = {
      id: this.data.supplier.id,
      name: this.supplierForm.value.name,
      phone: this.supplierForm.value.phone,
      email: this.supplierForm.value.email,
      address: this.supplierForm.value.address,
      rtn: this.supplierForm.value.rtn
    };

    const mutationResponse = this.isCreate
    ? await this.supplierMutation.createSupplier(data)
    : await this.supplierMutation.updateSupplier(data);

    if (mutationResponse) {
      this.onCancel(true);
    }
    this.loading = false;
  }

  private fillForm(): void {
    if(this.isCreate) {
      this.loading = false;
      return;
    }

    this.supplierForm.patchValue({
      name: this.data.supplier.name,
      phone: this.data.supplier?.phone || '',
      email: this.data.supplier?.email || '',
      address: this.data.supplier?.address || '',
      rtn: this.data.supplier?.rtn || ''
    });
    this.loading = false;
  }
}
