import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { LoadingComponent, NoResultComponent, PrimaryButtonComponent } from 'src/app/shared';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchService } from 'src/app/core/services';
import { Model } from 'src/app/core/enums';
import moment from 'moment';
import { EMPTY_PRODUCT, PDFHelper } from 'src/app/core/helpers';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductQueries } from '../../services';
import { IProduct } from '../../interfaces/product.interfaces';
import { CreateUpdateProductComponent, DeleteComponent, RemoveProductsComponent } from '../../components';

const TABLE_COLUMNS = ['name', 'group', 'amount', 'unit', 'closestDueDate', 'price', 'actions'];

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, FormsModule,
    PrimaryButtonComponent, NoResultComponent, MatTableModule,
    NgxPaginationModule
  ],
  providers: [ProductQueries, PDFHelper],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public products: IProduct[] = [];
  public filteredProducts: IProduct[] = [];
  public page = 1;
  public minAmount = 999;
  public minProduct: IProduct = EMPTY_PRODUCT;
  public dueProduct: IProduct = EMPTY_PRODUCT;

  constructor(
    private searchEngine: SearchService,
    private pdfHelper: PDFHelper,
    private productQuery: ProductQueries,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getAllProducts();
  }

  public onSearch(term: string): void {
    this.filteredProducts = this.searchEngine.filterData(this.products, term, Model.Product);
  }

  public getDueDate(product: IProduct): string {
    const date = product.batches.length > 0 && product.batches[0].due ? moment.utc(product.batches[0].due).format('DD/MM/YYYY') : 'N/A';
    return date;
  }

  public getAmount(product: IProduct): number {
    return product.batches.length > 0 ? product.batches.reduce((acc, batch) => acc + batch.quantity, 0) : 0;
  }

  public generatePDF(): void {
    this.pdfHelper.generateProductsPDF(this.filteredProducts);
  }

  public getPrice(product: IProduct): string {
    if (product.batches && product.batches.length > 0) {
      return "L." + product.batches[0].price;
    }
    return "N/A";
  }

  public openCreateUpdateProductModal(modalType: string = 'create', product: IProduct = EMPTY_PRODUCT): void {
    this.dialog.open(CreateUpdateProductComponent, {
      panelClass: 'dialog-style',
      data: { product, modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllProducts();
      }
    });
  }

  public openDeleteProductModal(productId: number): void {
    this.dialog.open(DeleteComponent, {
      panelClass: 'dialog-style',
      data: { id: productId, type: Model.Product }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllProducts();
      }
    });
  }

  public goToInput(): void {
    this.router.navigate(['/admin/input/0']);
  }

  public openRemoveProductsModal(product: IProduct): void {
    this.dialog.open(RemoveProductsComponent, {
      panelClass: 'dialog-style',
      data: product
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllProducts();
      }
    });
  }

  public hasWarning(product: IProduct): boolean {
    const amount = product.batches.length > 0 ? product.batches.reduce((acc, batch) => acc + batch.quantity, 0) : 0;
    const now = moment.utc();
    const due = product.batches.length > 0 && product.batches[0].due ? moment.utc(product.batches[0].due) : moment().utc().endOf('year');
    const date = moment.utc(due);
    return amount < product.minimum || date.diff(now, 'days') < 30 || date.isBefore(now);
  }

  private getAllProducts(): void {
    this.productQuery.getAllProducts().subscribe(({ data }) => {
      this.products = data;
      this.filteredProducts = data;
      this.getClosestDueDate();
      this.getLowestStock();
      this.loading = false;
    });
  }

  private getClosestDueDate(): void {
    const now = moment.utc();
    const perishableProducts = this.filteredProducts.filter(product => product.batches.length > 0 && product.batches[0].due && product.perishable);

    const dueDates = perishableProducts.map(product => {
      const due = product.batches.length > 0 && product.batches[0].due ? moment.utc(product.batches[0].due) : moment().utc().endOf('year');
      return { product, due };
    }).filter(item => item.due.isSameOrAfter(now, 'D'));

    if (dueDates.length > 0) {
      const closestDueDate = dueDates.sort((a, b) => a.due.valueOf() - b.due.valueOf())[0];
      this.dueProduct = closestDueDate.product;
    }
  }

  private getLowestStock(): void {
    this.filteredProducts.forEach(product => {
      const amount = product.batches.length > 0 ? product.batches.reduce((acc, batch) => acc + batch.quantity, 0) : 0;
      if(amount < this.minAmount) {
        this.minAmount = amount;
        this.minProduct = product;
      }
    });
  }
}
