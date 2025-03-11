import { Component, OnInit } from '@angular/core';
import { EMPTY_VEHICLE, PDFHelper } from 'src/app/core/helpers';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/core/services';
import { ActivatedRoute, Router } from '@angular/router';
import { DateFilterComponent, LoadingComponent, NoResultComponent, PrimaryButtonComponent } from 'src/app/shared';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import moment from 'moment';
import { Model } from 'src/app/core/enums';
import { NgxPaginationModule } from 'ngx-pagination';
import { GasInfoComponent, ShowAddPassengersComponent } from '../../components';
import { vehicleInfoHelper } from '../../helpers';
import { VehicleQueries } from '../../services';
import { ILog, IVehicle } from '../../interfaces';

const TABLE_COLUMNS = [
  'date', 'driver', 'destination', 'city', 'kmsOut', 'kmsIn', 'timeOut', 'timeIn', 'observation', 'passengers', 'gas'
];
@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, FormsModule,
    PrimaryButtonComponent, LoadingComponent, NoResultComponent,
    NgxPaginationModule, DateFilterComponent
  ],
  providers: [vehicleInfoHelper, PDFHelper],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public displayedColumns: string[] = TABLE_COLUMNS;
  public logs: ILog[] = [];
  public filteredLogs: ILog[] = [];
  public vehicle: IVehicle = EMPTY_VEHICLE;
  public page = 1;

  constructor(
    public vehicleHelper: vehicleInfoHelper,
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private pdfHelper: PDFHelper
  ){}

  ngOnInit(): void {
    this.getVehicle();
  }

  public generatePdf(): void {
    this.pdfHelper.generateLogsPdf(this.filteredLogs, this.vehicle);
  }

  public onSearch(term: string): void {
    this.filteredLogs = this.searchEngine.filterData(this.logs, term, Model.log);
  }

  public createLog(): void {
    this.router.navigate([`/admin/create-log/`, this.vehicle.ID_Vehiculo]);
  }

  public openPassengerList(log: ILog): void {
    this.dialog.open(ShowAddPassengersComponent, {
      panelClass: 'dialog-style',
      data: {
        passengers: log.Pasajeros,
        modalType: 'show'
      }
    });
  }

  public openGasInfo(log: ILog, modalType = 'show'): void {
    this.dialog.open(GasInfoComponent, {
      panelClass: 'dialog-style',
      data: { log, modalType }
    });
  }

  public formatDate(date: string): string {
    return moment.utc(date).format('DD/MM/YYYY');
  }

  public formatTime(time: string): string {
    return moment.utc(time).format('hh:mm A');
  }

  public hasGasRefill(log: ILog): boolean {
    return log.Llenados_Combustible.length > 0;
  }

  public goToVehicle(): void {
    this.router.navigate(['/admin/vehicle/', this.vehicle.ID_Vehiculo]);
  }

  public filterDates(dates: { startDate: Date | null, endDate: Date | null }): void {
    if(dates.startDate && dates.endDate) {
      this.filteredLogs = this.logs.filter(
        (log) => {
          const logDate = moment.utc(log.Fecha).format('YYYY-MM-DD');
          return moment(logDate).isBetween(dates.startDate, dates.endDate, null, '[]');
        }
      );
    } else {
      this.filteredLogs = this.logs;
    }
    this.page = 1;
  }

  private getVehicle(): void {
    const vehicleId = this.route.snapshot.params.id;

    this.vehicleQuery.getVehicle(vehicleId).subscribe(({data}) => {
      this.vehicle = data;
      this.logs = this.vehicle.Bitacoras;
      this.filteredLogs = this.logs;
      this.loading = false;
    });
  }
}
