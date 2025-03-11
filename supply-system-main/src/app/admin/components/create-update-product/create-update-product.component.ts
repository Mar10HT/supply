import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileDropComponent, LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Upload } from 'src/app/core/enums';
import { environment } from 'src/environments/environments';
import { FileNameHelper } from '../../helpers';
import { ProductMutations, ProductQueries, UploaderService } from '../../services';
import { IGroup, IProduct } from '../../interfaces';
import { CreateGroupComponent } from '../create-group/create-group.component';

@Component({
  selector: 'app-create-update-product',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, PrimaryButtonComponent,
    FileDropComponent, MatFormFieldModule, FormsModule,
    ReactiveFormsModule, MatInputModule, MatSelectModule,
    MatCheckboxModule
  ],
  providers: [ProductMutations, ProductQueries, FileNameHelper, UploaderService],
  templateUrl: './create-update-product.component.html',
  styleUrl: './create-update-product.component.scss'
})
export class CreateUpdateProductComponent implements OnInit {
  public isCreate = false;
  public loading = true;
  public error = false;
  public groups: IGroup[] = [];
  public productForm!: FormGroup;
  public fileUrl = environment.filesUrl;
  public selectedFile!: File;

  constructor(
    private _formBuilder: FormBuilder,
    private productMutation: ProductMutations,
    private productQuery: ProductQueries,
    private dialogRef: MatDialogRef<CreateUpdateProductComponent>,
    private fileNameHelper: FileNameHelper,
    private dialog: MatDialog,
    private uploaderService: UploaderService,
    @Inject(MAT_DIALOG_DATA) public data: { product: IProduct, modalType: string }
  ){}

  ngOnInit(): void {
    this.isCreate = this.data.modalType === 'create';
    this.productForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      minimum: [1, [Validators.required]],
      unit: ['', [Validators.required]],
      group: ['', [Validators.required]],
      batchedNumber: [0],
      perishable: [false],
      batched: [false],
      active: [true]
    });

    this.getGroups();
    this.fillForm();
  }

  public onCancel(changesMade = false): void {
    this.dialogRef.close(changesMade);
  }

  public isPerishable(): boolean {
    return this.productForm.value.perishable;
  }

  public isBatched(): boolean {
    return this.productForm.value.batched || this.data.product.batched;
  }

  public async onSubmit(): Promise<void> {
    this.error = false;

    if (this.productForm.invalid) {
      this.error = true;
      return;
    }

    this.loading = true;

    let file = this.data.product.imageUrl;
    let fileUploaded = true;

    if(this.selectedFile){
      const fileName = this.fileNameHelper.getFileName(Upload.product, this.selectedFile);
      const realName = this.fileNameHelper.getRealFileName(fileName);
      file = this.fileUrl + 'products/' + realName;
      fileUploaded = await this.uploaderService.uploadFile(this.selectedFile, fileName);
    }

    !this.selectedFile ? file = 'https://static.vecteezy.com/system/resources/previews/028/047/017/non_2x/3d-check-product-free-png.png': null;

    const batchedNumber = this.isBatched() ? this.productForm.value.batchedNumber : 0;

    const data: any = {
      id: this.data.product.id,
      name: this.productForm.value.name,
      minimum: this.productForm.value.minimum,
      unit: this.productForm.value.unit,
      perishable: this.productForm.value.perishable,
      batched: this.productForm.value.perishable ? false : this.productForm.value.batched,
      batchedNumber,
      groupId: this.groups.find((group) => group.name === this.productForm.value.group)?.id || this.groups[0].id,
      imageUrl: file,
      active: this.productForm.value.active
    };

    if(fileUploaded){
      const mutationResponse = this.isCreate
      ? await this.productMutation.createProduct(data)
      : await this.productMutation.updateProduct(data);

      if (mutationResponse) {
        this.onCancel(true);
      }
      this.loading = false;
    }
  }

  public getFiles(files: File[]): void {
    this.selectedFile = files[0];
  }

  public openGroupModal(): void {
    this.dialog.open(CreateGroupComponent, {
      panelClass: 'dialog-style',
      data: this.groups
    }).afterClosed().subscribe((response) => {
      if(response) {
        this.loading = true;
        this.getGroups();
      }
    });
  }

  private fillForm(): void {
    if(this.isCreate) {
      this.loading = false;
      return;
    }

    this.productForm.patchValue({
      name: this.data.product.name,
      minimum: this.data.product.minimum,
      unit: this.data.product.unit,
      group: this.data.product.group.name,
      batchedNumber: this.data.product.batchedNumber,
      perishable: this.data.product.perishable,
      batched: this.data.product.batched,
      active: this.data.product.active
    });
  }

  private async getGroups(): Promise<void> {
    this.productQuery.getGroups().subscribe(({ data }) => {
      this.groups = data;
      this.loading = false;
    });
  }
}
