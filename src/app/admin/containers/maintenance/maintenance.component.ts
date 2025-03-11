import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingComponent, PrimaryButtonComponent, NoResultComponent, VehicleCardComponent } from 'src/app/shared';
import { SearchService } from 'src/app/core/services';
import { MatDialog } from '@angular/material/dialog';
import { Model } from 'src/app/core/enums';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateMaintenanceComponent } from '../../components';
import { VehicleQueries } from '../../services';
import { IVehicle } from '../../interfaces';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [
    VehicleCardComponent, LoadingComponent,
    CommonModule, FormsModule, PrimaryButtonComponent,
    NoResultComponent, MatFormFieldModule, MatInputModule,
    MatSelectModule, FormsModule
  ],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss'
})
export class MaintenanceComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public vehicles: IVehicle[] = [];
  public filteredVehicles: IVehicle[] = [];
  public lastMonthMaintenanceVehicles = 0;
  public selectedFilter = 'Todos';
  public filterOptions = ['Todos', 'En Mantenimiento', 'Disponible', 'En Uso', 'Mantenimiento Cercano'];

  constructor(
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, Model.vehicle);
  }

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data}) => {
      if(data){
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.loading = false;
        this.getVehiclesMaintenancesLastMonth();
      }
    });
  }

  public openCreateMaintenanceModal(): void {
    this.dialog.open(CreateMaintenanceComponent, {
      panelClass: 'dialog-style'
    }).afterClosed().subscribe((result) => {
      if(result) {
        this.getAllVehicles();
      }
    });
  }

  public onFilterChange(filter: string): void {
    switch(filter) {
      case 'Todos':
        this.filteredVehicles = this.vehicles;
        break;
      case 'En Mantenimiento':
        this.filteredVehicles = this.vehicles.filter(vehicle => vehicle.Estado_Vehiculo.Estado_Vehiculo === 'En Mantenimiento');
        break;
      case 'Disponible':
        this.filteredVehicles = this.vehicles.filter(vehicle => vehicle.Estado_Vehiculo.Estado_Vehiculo === 'Disponible');
        break;
      case 'En Uso':
        this.filteredVehicles = this.vehicles.filter(vehicle => vehicle.Estado_Vehiculo.Estado_Vehiculo === 'En Uso');
        break;
      case 'Mantenimiento Cercano':
        this.filteredVehicles = this.vehicles.filter(vehicle => {
          if (vehicle.Mantenimientos.length > 0) {
            const latestMaintenance = vehicle.Mantenimientos[0];
            const difference = vehicle.Kilometraje - latestMaintenance.Kilometraje;
            return difference >= 4000;
          }
          return false;
        });
        break;
    }
  }

  private getVehiclesMaintenancesLastMonth(): void {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.lastMonthMaintenanceVehicles =  this.vehicles.filter(vehicle =>
      vehicle?.Mantenimientos?.some(mantenimiento => {
        const mantenimientoDate = new Date(mantenimiento.Fecha);
        return mantenimientoDate >= firstDayOfMonth && mantenimientoDate <= lastDayOfMonth;
      })
    ).length;
  }
}
