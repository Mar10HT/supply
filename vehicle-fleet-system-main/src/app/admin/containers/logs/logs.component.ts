import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/core/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButtonComponent, LoadingComponent, NoResultComponent, VehicleCardComponent } from 'src/app/shared';
import moment from 'moment';
import { Model } from 'src/app/core/enums';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { VehicleQueries } from '../../services';
import { IVehicle } from '../../interfaces';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule, PrimaryButtonComponent, FormsModule,
    LoadingComponent, NoResultComponent, VehicleCardComponent,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule
  ],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit {
  public loading = true;
  public searchInput = '';
  public vehicles: IVehicle[] = [];
  public kms = 0;
  public vehiclesCount = 0;
  public filteredVehicles: IVehicle[] = [];
  public selectedFilter = 'Todos';
  public filterOptions = ['Todos', 'En Mantenimiento', 'Disponible', 'En Uso', 'Mantenimiento Cercano'];

  constructor(
    private searchEngine: SearchService,
    private vehicleQuery: VehicleQueries,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getAllVehicles();
  }

  public createLog(): void {
    this.router.navigate(['/admin/create-log/0']);
  }

  public countData(): void {
    const startOfWeek = moment.utc().clone().startOf('week').subtract(1, 'days');
    const endOfWeek = moment.utc().clone().endOf('week').subtract(1, 'days');
    const vehiclesWithLogs = this.vehicles.filter(vehicle => vehicle.Bitacoras.length > 0);
    this.vehiclesCount = vehiclesWithLogs.filter(vehicle => {
      const bitacoraDate = moment.utc(vehicle.Bitacoras[0].Fecha);
      return bitacoraDate.isBetween(startOfWeek, endOfWeek);
    }).length;
    let totalKms = 0;
    vehiclesWithLogs.forEach(vehicle => {
      vehicle.Bitacoras.forEach(bitacora => {
          const bitacoraDate = moment.utc(bitacora.Fecha);
          if (bitacoraDate.isBetween(startOfWeek, endOfWeek)) {
              totalKms += (bitacora.Kilometraje_Entrada - bitacora.Kilometraje_Salida);
          }
      });
    });
    this.kms = totalKms;
  }

  public onSearch(term: string): void {
    this.filteredVehicles = this.searchEngine.filterData(this.vehicles, term, Model.vehicle);
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

  private getAllVehicles(): void {
    this.vehicleQuery.getAllVehicles().subscribe(({data}) => {
      if(data){
        this.vehicles = data;
        this.filteredVehicles = this.vehicles;
        this.countData();
        this.loading = false;
      }
    });
  }
}
