import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { SearchService } from 'src/app/core/services';
import { LoadingComponent, NoResultComponent, PrimaryButtonComponent } from 'src/app/shared';
import { EMPTY_VEHICLE, PDFHelper } from 'src/app/core/helpers';
import { Router } from '@angular/router';
import { Model } from 'src/app/core/enums';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateUpdateVehicleComponent, DeleteVehicleComponent } from '../../components';
import { VehicleQueries } from '../../services';
import { IVehicle } from '../../interfaces';
import { vehicleInfoHelper } from '../../helpers';

const TABLE_COLUMNS = [ 'plate', 'model', 'type','status', 'edit'];
@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, FormsModule,
    PrimaryButtonComponent, LoadingComponent, NoResultComponent,
    NgxPaginationModule
  ],
  providers: [VehicleQueries, vehicleInfoHelper, PDFHelper],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})

export class VehiclesComponent implements OnInit {
  public searchInput = '';
  public availableVehicles = 0;
  public maintenance =  { id: 0, kms: 0 };
  public vehicles: IVehicle[] = [];
  public filteredVehicles: IVehicle[] = [];
  public maintenanceVehicle: IVehicle = EMPTY_VEHICLE;
  public displayedColumns: string[] = TABLE_COLUMNS;
  public loading = true;
  public page = 1;

  constructor(
    public vehicleInfoHelper: vehicleInfoHelper,
    private vehicleQuery: VehicleQueries,
    private dialog: MatDialog,
    private searchEngine: SearchService,
    private router: Router,
    private pdfHelper: PDFHelper
  ) {}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, Model.vehicle);
  }

  public openDeleteVehicleModal(vehicle: IVehicle): void {
    this.dialog.open(DeleteVehicleComponent, {
      panelClass: 'dialog-style',
      data: {
        id: vehicle.ID_Vehiculo,
        plate: vehicle.Placa,
        model: this.vehicleInfoHelper.getModel(vehicle)
      }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
        this.searchInput = '';
      }
    });
  }

  public openCreateUpdateVehicleModal(modalType: string = 'create', vehicle: IVehicle = EMPTY_VEHICLE): void {
    this.dialog.open(CreateUpdateVehicleComponent, {
      panelClass: 'dialog-style',
      data: { vehicle, modalType }
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
      }
    });
  }

  public generatePdf(): void {
    this.pdfHelper.generateVehiclesPDF(this.filteredVehicles);
  }

  public vehicleInfo(vehicleId: number): void {
    this.router.navigate([`/admin/vehicle/`, vehicleId]);
  }

  private getMaintenanceInfo(maintenance: { id: number, kms: number } | undefined): void {
    if (!maintenance) return;
    this.maintenance = maintenance;
    this.maintenanceVehicle = this.vehicles.find(vehicle => vehicle.ID_Vehiculo === maintenance.id) || EMPTY_VEHICLE;
  }

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data, maintenance}) => {
      if(data){
        this.vehicles = data;
        this.availableVehicles = this.vehicles.filter(vehicle => this.vehicleInfoHelper.getVehicleStatus(vehicle) === 'Disponible').length;
        this.getMaintenanceInfo(maintenance);
        this.filteredVehicles = this.vehicles;
        this.loading = false;
      }
    });
  }
}
