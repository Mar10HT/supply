import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { IVehicle } from 'src/app/admin/interfaces';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { vehicleInfoHelper } from 'src/app/admin/helpers';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule, CommonModule],
  providers: [provideNativeDateAdapter(), vehicleInfoHelper],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss'
})
export class VehicleCardComponent implements OnChanges {
  public model = '';
  public remainingKms = 0;
  public preventiveDates: string[] = [];
  public correctiveDates: string[] = [];
  public logDates: string[] = [];
  public lastMaintenanceDate = new Date();
  public lastLogDate = new Date();
  @Input() public vehicle!: IVehicle;
  @Input() public type: string = 'log';

  constructor(
    private vehicleInfoHelper: vehicleInfoHelper,
    private router: Router
  ){}

  ngOnChanges(): void {
    this.model = this.vehicleInfoHelper.getModel(this.vehicle);
    if(this.type === 'maintenance') {
      this.remainingKms = this.getNextMaintenanceKms();
      this.preventiveDates = this.getDates('Preventivo');
      this.correctiveDates = this.getDates('Correctivo');
    }
    if(this.type === 'log') {
      this.logDates = this.getLogDates();
    }
  }


  public goToVehicle(vehicleId: number): void {
    let path = '';
    this.type === 'log' ? path = 'log' : path = 'vehicle';
    this.router.navigate([`/admin/${path}/${vehicleId}`]);
  }

  maintenanceDateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.toDateString();
      let dateClass = '';
      if (this.preventiveDates.includes(date)) {
        dateClass = 'preventive-date';
      } else if (this.correctiveDates.includes(date)) {
        dateClass = 'corrective-date';
      }
      return dateClass;
    }
    return '';
  };

  logDateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.toDateString();
      const startOfWeek = moment.utc().clone().startOf('week').subtract(1, 'days');
      const endOfWeek = moment.utc().clone().endOf('week').subtract(1, 'days');
      let dateClass = '';
      if(moment.utc(cellDate).isBetween(startOfWeek, endOfWeek)) {
        dateClass = 'log-week';
      }
      if (this.logDates.includes(date)) {
        dateClass = ' log-date';
      }
      return dateClass;
    }
    return '';
  };

  private getDates(type: 'Preventivo' | 'Correctivo'): string[] {
    if(this.vehicle.Mantenimientos.length === 0) return [];
    const dates = this.vehicle.Mantenimientos
                  .filter(m => m.Tipo_Mantenimiento === type)
                  .map(m => moment.utc(m.Fecha).format('ddd MMM DD YYYY'));
    return dates;
  }

  private getLogDates(): string[] {
    if(this.vehicle.Bitacoras.length === 0) return [];
    const dates = this.vehicle.Bitacoras
                  .map(b => moment.utc(b.Fecha).format('ddd MMM DD YYYY'));
    this.lastLogDate = this.vehicle.Bitacoras[0].Fecha;
    return dates;
  }

  private getNextMaintenanceKms(): number {
    if(this.vehicle.Mantenimientos.length === 0) return 0;
    const lastMaintenance = this.vehicle.Mantenimientos.filter(m => m.Tipo_Mantenimiento === 'Preventivo')[0];
    const lastMaintenanceKms = lastMaintenance.Kilometraje;
    const nextMaintenance = lastMaintenanceKms + 5000;
    this.lastMaintenanceDate = lastMaintenance.Fecha;
    return nextMaintenance - this.vehicle.Kilometraje;
  }
}
