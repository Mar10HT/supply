import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { IProduct } from 'src/app/admin/interfaces';
import { LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EMPTY_PRODUCT } from 'src/app/core/helpers';
import { map, Observable, startWith } from 'rxjs';
import { SearchService } from 'src/app/core/services';
import { Model } from 'src/app/core/enums';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IProductRequisition, PublicQueries } from '../..';
import { ConfirmComponent } from '../confirm/confirm.component';

const TABLE_COLUMNS = ['n', 'product', 'group', 'quantity', 'unit', 'actions'];

@Component({
  selector: 'app-create-requisition',
  standalone: true,
  imports: [
    LoadingComponent, FormsModule, ReactiveFormsModule,
    MatInputModule, CommonModule, PrimaryButtonComponent,
    MatAutocompleteModule, AsyncPipe, MatFormFieldModule,
    NgxPaginationModule, MatTableModule
  ],
  templateUrl: './create-requisition.component.html',
  styleUrl: './create-requisition.component.scss',
})
export class CreateRequisitionComponent implements OnInit {
  public loading = false;
  public error = false;
  public products: IProduct[] = [];
  public filteredProducts!: Observable<IProduct[]>;
  public requisitionForm!: FormGroup;
  public displayedColumns: string[] = TABLE_COLUMNS;
  public selectedProduct: IProduct = EMPTY_PRODUCT;
  public productRequisitions: IProductRequisition[] = [];
  public requisitionCreated = false;
  public page = 1;

  constructor(
    private publicQuery: PublicQueries,
    private formBuilder: FormBuilder,
    private searchEngine: SearchService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.requisitionForm = this.formBuilder.group({
      product: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });
    this.filteredProducts = this.requisitionForm.controls.product.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.products, value.toString(), Model.Product)),
    );
    this.getProductList();
  }

  public selectProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  public addProduct(): void {
    this.error = false;
    if (this.requisitionForm.invalid) {
      this.error = true;
      return;
    }
    const alreadyInTable = this.checkProductRequisition(this.selectedProduct, this.requisitionForm.controls.quantity.value);

    if(!alreadyInTable) {
      const productRequisition: IProductRequisition = {
        product: this.selectedProduct,
        quantity: this.requisitionForm.controls.quantity.value
      };
      this.productRequisitions.push(productRequisition);
    }
    this.requisitionForm.controls.product.setValue('');
    this.requisitionForm.controls.quantity.setValue(0);
  }

  public async getProductList(): Promise<void> {
    this.publicQuery.getAllProducts().subscribe(({ data }) => {
      this.products = this.filterProducts(data);
      this.loading = false;
    });
  }

  public onSubmit(): void {
    this.dialog.open(ConfirmComponent, {
      panelClass: 'dialog-style',
      data: this.productRequisitions
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.productRequisitions = [];
        this.requisitionCreated = true;
      }
    });
  }

  public editProduct(productRequisition: IProductRequisition): void {
    this.selectedProduct = productRequisition.product;
    this.requisitionForm.controls.product.setValue(productRequisition.product.name);
    this.requisitionForm.controls.quantity.setValue(productRequisition.quantity);
    this.productRequisitions = this.productRequisitions.filter((product) => product.product.id !== productRequisition.product.id);
  }

  public removeProduct(productRequisition: IProductRequisition): void {
    this.productRequisitions = this.productRequisitions.filter((requisition) => requisition.product.id !== productRequisition.product.id);
  }

  private filterProducts(products: IProduct[]): IProduct[] {
    return products.filter((product) => product.batches.reduce((acc, batch) => acc + batch.quantity, 0) > 0 && product.active);
  }

  private checkProductRequisition(product: IProduct, quantity: number): boolean {
    const productIndex = this.productRequisitions.findIndex((productRequisition) => productRequisition.product.id === product.id);
    if (productIndex !== -1) {
      this.productRequisitions[productIndex].quantity += quantity;
      return true;
    }
    return false;
  }
}
