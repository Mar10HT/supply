import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { EMPTY_PRODUCT, EMPTY_SUPPLIER } from 'src/app/core/helpers';
import { SearchService } from 'src/app/core/services';
import { Model, Upload } from 'src/app/core/enums';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileDropComponent, LoadingComponent, PrimaryButtonComponent } from 'src/app/shared';
import { ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';
import { environment } from 'src/environments/environments';
import { EntryQueries, ProductQueries, SuppliersQueries, UploaderService } from '../../services';
import { IEntryInvoice, IProduct, ISupplier } from '../../interfaces';
import { ConfirmInputComponent, CreateUpdateProductComponent } from '../../components';
import { FileNameHelper } from '../../helpers';

const TABLE_COLUMNS = ['product', 'group', 'quantity', 'unit', 'price', 'dueDate', 'actions'];
export interface IEntryData {
  product: IProduct;
  quantity: number;
  price: number;
  dueDate: Date;
}

export interface ICreateEntry {
  invoiceUrl: string;
  date: Date;
  supplierId: number;
  invoiceNumber: string;
}

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    LoadingComponent, FormsModule, ReactiveFormsModule,
    MatInputModule, CommonModule, PrimaryButtonComponent,
    MatAutocompleteModule, AsyncPipe, MatFormFieldModule,
    NgxPaginationModule, MatTableModule, MatDatepickerModule,
    FileDropComponent
  ],
  providers: [provideNativeDateAdapter(), FileNameHelper],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit {
  public loading = true;
  public error = false;
  public products: IProduct[] = [];
  public invoiceLink = '';
  public suppliers: ISupplier[] = [];
  public showProducts = false;
  public selectedSupplier: ISupplier = EMPTY_SUPPLIER;
  public filteredProducts!: Observable<IProduct[]>;
  public entryForm!: FormGroup;
  public requisitionForm!: FormGroup;
  public displayedColumns: string[] = TABLE_COLUMNS;
  public selectedProduct: IProduct = EMPTY_PRODUCT;
  public productEntries: IEntryData[] = [];
  public invoice!: File;
  public noInvoice = false;
  public invoiceList: IEntryInvoice[] = [];
  public invoiceError = false;
  public fileUrl = environment.filesUrl;
  public page = 1;

  constructor(
    private formBuilder: FormBuilder,
    private searchEngine: SearchService,
    private dialog: MatDialog,
    private productQuery: ProductQueries,
    private entryQuery: EntryQueries,
    private supplierQuery: SuppliersQueries,
    private route: ActivatedRoute,
    private uploaderService: UploaderService,
    private fileNameHelper: FileNameHelper
  ) {}

  ngOnInit(): void {
    this.entryForm = this.formBuilder.group({
      supplier: ['', [Validators.required]],
      date: ['', [Validators.required]],
      invoiceNumber: ['']
    });
    this.requisitionForm = this.formBuilder.group({
      product: ['', [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      dueDate: [''],
      batchedNumbers: ['']
    });
    this.filteredProducts = this.requisitionForm.controls.product.valueChanges.pipe(
      startWith(''),
      map(value => this.searchEngine.filterData(this.products, value.toString(), Model.Product)),
    );
    this.getProductList();
    this.getSuppliers();
    this.getInvoiceList();
  }

  public editProduct(entry: IEntryData): void {
    this.selectedProduct = entry.product;
    this.requisitionForm.controls.product.setValue(entry.product.name);
    this.requisitionForm.controls.quantity.setValue(entry.quantity);
    this.requisitionForm.controls.price.setValue(entry.price);
    this.requisitionForm.controls.dueDate.setValue(entry.dueDate);
    this.productEntries = this.productEntries.filter((product) => product.product.id !== entry.product.id);
  }

  public removeProduct(entry: IEntryData): void {
    this.productEntries = this.productEntries.filter((requisition) => requisition.product.id !== entry.product.id);
  }

  public selectProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.isPerishable(this.selectedProduct.perishable);
  }

  public openCreateUpdateProductModal(modalType: string = 'create', product: IProduct = EMPTY_PRODUCT): void {
    this.dialog.open(CreateUpdateProductComponent, {
      panelClass: 'dialog-style',
      data: { product, modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getProductList();
      }
    });
  }

  public isPerishable(perishable: boolean): void {
    if(perishable) {
      this.requisitionForm.controls.dueDate.setValidators([Validators.required]);
      this.requisitionForm.controls.dueDate.enable();
    } else {
      this.requisitionForm.controls.dueDate.clearValidators();
      this.requisitionForm.controls.dueDate.setValue('');
      this.requisitionForm.controls.dueDate.disable();
    }
  }

  public selectSupplier(supplier: ISupplier): void {
    this.selectedSupplier = supplier;
  }

  public getFiles(files: File[]): void {
    this.invoice = files[0];
  }

  public getDate(input: IEntryData): string {
    const date  = input.product.perishable ? moment.utc(input.dueDate).format('DD/MM/YYYY'): 'N/A';
    return date;
  }

  public addProduct(): void {
    this.error = false;
    if (this.requisitionForm.invalid) {
      this.error = true;
      return;
    }
    const alreadyInTable = this.checkProductRequisition(this.selectedProduct, this.requisitionForm.controls.quantity.value);

    if(!alreadyInTable) {

      const productRequisition: IEntryData = {
        product: this.selectedProduct,
        quantity: this.requisitionForm.controls.quantity.value,
        price: this.requisitionForm.controls.price.value,
        dueDate: this.requisitionForm.controls.dueDate.value
      };
      this.productEntries.push(productRequisition);
    }
    this.clearForm();
  }

  public seeInvoice(): void {
    window.open(this.invoiceLink, "_blank");
  }

  public continue(): void {
    this.error = false;
    this.noInvoice = false;
    this.invoiceError = false;

    if(this.entryForm.invalid) {
      this.error = true;
      return;
    } else if(this.invoice === undefined) {
      this.noInvoice = true;
      return;
    }
    const invoiceNumber = this.entryForm.controls.invoiceNumber.value;
    const existingInvoice = this.invoiceList.find((invoice) => invoice.invoiceNumber === invoiceNumber);

    if (existingInvoice) {
      this.invoiceError = true;
      this.invoiceLink = existingInvoice.invoiceUrl || '';
      return;
    }

    this.showProducts = true;
  }

  public async onSubmit(): Promise<void> {
    const fileName = this.fileNameHelper.getFileName(Upload.invoice, this.invoice);
    const realName = this.fileNameHelper.getRealFileName(fileName);
    const invoiceUrl = this.fileUrl + 'invoices/' + realName;
    const fileUploaded = await this.uploaderService.uploadFile(this.invoice, fileName);

    const entry: ICreateEntry = {
      invoiceUrl,
      date: this.entryForm.controls.date.value,
      supplierId: this.selectedSupplier.id,
      invoiceNumber: this.entryForm.controls.invoiceNumber.value
    };

    fileUploaded ? this.openModal(entry) : '' ;
  }

  private openModal(entry: ICreateEntry): void {
    this.dialog.open(ConfirmInputComponent, {
      panelClass: 'dialog-style',
      data: { entry, entryData: this.productEntries }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.productEntries = [];
        this.showProducts = false;
        this.clearForm();
      }
    });
  }

  private async getProductList(): Promise<void> {
    this.productQuery.getAllProducts().subscribe(({ data }) => {
      this.products = data;
      this.loading = false;
    });
  }

  private async getInvoiceList(): Promise<void> {
    this.entryQuery.getInvoices().subscribe(( data ) => {
      this.invoiceList = data;
    });
  }

  private checkProductRequisition(product: IProduct, quantity: number): boolean {
    const productIndex = this.productEntries.findIndex((productRequisition) => productRequisition.product.id === product.id);
    if (productIndex !== -1) {
      this.productEntries[productIndex].quantity += quantity;
      return true;
    }
    return false;
  }

  private getSuppliers(): void {
    const supplierId = +this.route.snapshot.params.id;
    this.supplierQuery.getAllSuppliers().subscribe(({ data }) => {
      this.suppliers = data;

      if(supplierId === 0) {
        this.selectedSupplier = EMPTY_SUPPLIER;
        return;
      }
      this.selectedSupplier = this.suppliers.find((supplier) => supplier.id === supplierId) || EMPTY_SUPPLIER;
      this.entryForm.controls.supplier.patchValue(this.selectedSupplier.name);
      this.loading = false;
    });
  }

  private clearForm(): void {
    this.requisitionForm.controls.product.setValue('');
    this.requisitionForm.controls.quantity.setValue(0);
    this.requisitionForm.controls.price.setValue(0);
    this.requisitionForm.controls.dueDate.setValue('');
  }
}
