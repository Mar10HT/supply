import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { EMPTY_SUPPLIER, PDFHelper } from 'src/app/core/helpers';
import { SearchService } from 'src/app/core/services';
import { LoadingComponent, PrimaryButtonComponent, NoResultComponent } from 'src/app/shared';
import { Model } from 'src/app/core/enums';
import moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuppliersQueries } from '../../services';
import { ISupplier } from '../../interfaces';
import { CreateUpdateSupplierComponent, DeleteComponent } from '../../components';

const TABLE_COLUMNS = ['name', 'email', 'phone', 'address', 'rtn', 'latestEntry', 'amount', 'actions'];

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, FormsModule,
    PrimaryButtonComponent, NoResultComponent, MatTableModule,
    NgxPaginationModule
  ],
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public monthlyDeliveries = 0;
  public displayedColumns: string[] = TABLE_COLUMNS;
  public suppliers: ISupplier[] = [];
  public filteredSuppliers: ISupplier[] = [];
  public page = 1;

  constructor(
    private searchEngine: SearchService,
    private pdfHelper: PDFHelper,
    private supplierQuery: SuppliersQueries,
    private dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getAllSuppliers();
  }

  public onSearch(term: string): void {
    this.filteredSuppliers = this.searchEngine.filterData(this.suppliers, term, Model.Supplier);
  }

  public generatePDF(): void {
    this.pdfHelper.generateSuppliersPDF(this.filteredSuppliers);
  }

  public getAmount(supplier: ISupplier): number {
    return supplier.entries.length;
  }

  public getLatestEntry(supplier: ISupplier): string {
    const date = supplier.entries.length > 0 ? moment.utc(supplier.entries[0].date).format('DD/MM/YYYY') : 'Sin entregas';
    return date;
  }

  public openCreateUpdateSupplierModal(modalType: string = 'create', supplier: ISupplier = EMPTY_SUPPLIER): void {
    this.dialog.open(CreateUpdateSupplierComponent, {
      panelClass: 'dialog-style',
      data: { supplier, modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllSuppliers();
      }
    });
  }

  public openDeleteProductModal(supplierId: number): void {
    this.dialog.open(DeleteComponent, {
      panelClass: 'dialog-style',
      data: { id: supplierId, type: Model.Supplier }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllSuppliers();
      }
    });
  }

  public goToInput(supplierId: number): void {
    this.router.navigate(['/admin/input', supplierId]);
  }

  private getAllSuppliers(): void {
    this.supplierQuery.getAllSuppliers().subscribe(({ data }) => {
      this.suppliers = data;
      this.filteredSuppliers = data;
      this.loading = false;
      this.monthlyDeliveries = this.suppliers.reduce((acc, supplier) => {
        const startOfMonth = moment.utc().startOf('month');
        const now = moment.utc();

        const filteredEntries = supplier.entries.filter(entry => {
          const entryDate = moment.utc(entry.date);
          return entryDate.isBetween(startOfMonth, now, null, '[]');
        });

        return acc + filteredEntries.length;
      }, 0);
    });
  }
}
