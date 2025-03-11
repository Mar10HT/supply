import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingComponent, PrimaryButtonComponent, NoResultComponent, DateFilterComponent } from 'src/app/shared';
import { Model } from 'src/app/core/enums';
import { PDFHelper } from 'src/app/core/helpers';
import { SearchService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { IRequisition } from '../../interfaces';
import { RequisitionQueries } from '../../services';
import { NameHelper } from '../../helpers';
import { CancelRequisitionComponent, EditWatchRequisitionComponent, FinishRequisitionComponent, UploadRequisitionComponent } from '../../components';

const TABLE_COLUMNS = ['id', 'date', 'state', 'employee', 'boss', 'department', 'document', 'actions'];

@Component({
  selector: 'app-requisition',
  standalone: true,
  imports: [
    LoadingComponent, CommonModule, FormsModule,
    PrimaryButtonComponent, NoResultComponent, MatTableModule,
    NgxPaginationModule, MatFormFieldModule, MatOptionModule,
    MatSelectModule, DateFilterComponent
  ],
  providers: [PDFHelper, NameHelper],
  templateUrl: './requisitions.component.html',
  styleUrl: './requisitions.component.scss'
})
export class RequisitionComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public requisitions: IRequisition[] = [];
  public filteredRequisitions: IRequisition[] = [];
  public page = 1;
  public monthlyRequisitions = 1;
  public selectedFilter = 'Todos';
  public pending = 0;
  public filterOptions = ['Todos', 'Pendiente por jefe', 'Pendiente por proveeduria', 'Cancelada', 'Finalizada', 'Activa'];
  public end = new Date();
  public start = new Date(this.end.getFullYear(), this.end.getMonth(), 1);

  constructor(
    private searchEngine: SearchService,
    private pdfHelper: PDFHelper,
    private nameHelper: NameHelper,
    private requisitionQuery: RequisitionQueries,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getAllRequisitions();
  }

  public onSearch(term: string): void {
    this.filteredRequisitions = this.searchEngine.filterData(this.requisitions, term, Model.Requisition);
  }

  public goToUrl(link: string): void {
    window.open(link, "_blank");
  }

  public getDate(date: Date): string {
    return moment.utc(date).format('DD/MM/YYYY');
  }

  public generatePDF(): void {
    this.pdfHelper.generateRequisitionsPDF(this.filteredRequisitions, this.start, this.end);
  }

  public getName(fullName: string): string {
    return this.nameHelper.getShortName(fullName);
  }

  public getDepartment(department: string): string {
    return this.nameHelper.capitalizeWords(department);
  }

  public openCancelRequisitionModal(requisition: IRequisition): void {
    this.dialog.open(CancelRequisitionComponent, {
      panelClass: 'dialog-style',
      data: requisition
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllRequisitions();
      }
    });
  }

  public openUploadDocumentModal(id: number): void {
    this.dialog.open(UploadRequisitionComponent, {
      panelClass: 'dialog-style',
      data: id
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllRequisitions();
      }
    });
  }

  public openFinishRequisitionModal(requisition: IRequisition): void {
    this.dialog.open(FinishRequisitionComponent, {
      panelClass: 'dialog-style',
      data: requisition
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllRequisitions();
      }
    });
  }

  public openEditRequisitionModal(requisition: IRequisition, type = 'edit'): void {
    this.dialog.open(EditWatchRequisitionComponent, {
      panelClass: 'dialog-style',
      data: {requisition, type},
      autoFocus: false,
      maxHeight: '100vh'
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllRequisitions();
      }
    });
  }

  public canCancel(state: string): boolean {
    return state === 'Pendiente por proveeduria';
  }

  public canFinish(state: string): boolean {
    return state === 'Activa';
  }

  public canEdit(state: string): boolean {
    return state === 'Pendiente por proveeduria';
  }

  public canWatch(state: string): boolean {
    return state !== 'Pendiente por proveeduria';
  }

  public onFilterChange(filter: string): void {
    if (filter === 'Todos') {
      this.filteredRequisitions = this.requisitions;
      return;
    }
    this.filteredRequisitions = this.requisitions.filter(requisition => requisition.state.state === filter);
  }

  public filterDates(dates: { startDate: Date | null, endDate: Date | null }): void {
    if(dates.startDate && dates.endDate) {
      this.start = dates.startDate;
      this.end = dates.endDate;
      this.filteredRequisitions = this.requisitions.filter(
        (requisition) => {
          const requestDate = moment.utc(requisition.systemDate);
          return moment.utc(requestDate).isBetween(dates.startDate, dates.endDate, null, '[]');
        }
      );
    } else {
      this.filteredRequisitions = this.requisitions;
    }
    this.page = 1;
  }

  private getAllRequisitions(): void {
    this.requisitionQuery.getAllProducts().subscribe((response) => {
      const currentMonth = moment.utc().month();
      this.requisitions = response.data;
      this.filteredRequisitions = this.requisitions.filter((requisition) => {
        return moment.utc(requisition.systemDate).month() === currentMonth;
      });
      this.getMonthlyRequisitions();
      this.pending = this.requisitions.filter((requisition) => requisition.state.state === 'Pendiente por proveeduria').length;
      this.loading = false;
    });
  }

  private getMonthlyRequisitions(): void {
    const currentMonth = moment.utc().month();
    this.monthlyRequisitions = this.requisitions.filter((requisition) => {
      return moment.utc(requisition.systemDate).month() === currentMonth;
    }).length;
  }
}
