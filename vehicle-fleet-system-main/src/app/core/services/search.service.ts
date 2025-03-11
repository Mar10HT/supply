import { Injectable } from '@angular/core';
import moment from 'moment';
import { ICity, IDriver, ILog, IRequest, IUser, IVehicle } from 'src/app/admin/interfaces';
import { Model } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {}

  public filterData(data: any[], term: string, dataModel: string): any[] {
    if(dataModel === Model.vehicle) {
      return data.filter((vehicle: IVehicle)  =>
        vehicle.Placa.toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleModel(vehicle).toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleType(vehicle).toLowerCase().includes(term.toLowerCase()) ||
        vehicle.Estado_Vehiculo.Estado_Vehiculo.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.driver) {
      return data.filter((driver: IDriver)  =>
        driver.Nombre.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.log) {
      return data.filter((log: ILog)  =>
        log.Destino.toLowerCase().includes(term.toLowerCase()) ||
        moment.utc(log.Fecha).format('DD/MM/YYYY').includes(term.toLowerCase()) ||
        moment.utc(log.Hora_Entrada).format('hh:mm A').includes(term.toLowerCase()) ||
        moment.utc(log.Hora_Salida).format('hh:mm A').includes(term.toLowerCase()) ||
        log.Conductor.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        log.Ciudad.Nombre.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.request) {
      return data.filter((request: IRequest)  =>
        request.Ciudad.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        request.Nombre_Empleado.toLowerCase().includes(term.toLowerCase()) ||
        request.ID_Empleado.toString().includes(term.toLowerCase()) ||
        request.Conductor?.Nombre.toLowerCase().includes(term.toLowerCase()) ||
        request.Vehiculo?.Placa.toLowerCase().includes(term.toLowerCase()) ||
        this.getVehicleModel(request.Vehiculo).toLowerCase().includes(term.toLowerCase()) ||
        moment(request.Fecha).format('DD/MM/YYYY').toLowerCase().includes(term.toLowerCase()) ||
        request.Estado_Solicitud.Estado.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.user) {
      return data.filter((user: IUser)  =>
        user.Nombres.toLowerCase().includes(term.toLowerCase()) ||
        user.Apellidos.toLowerCase().includes(term.toLowerCase()) ||
        user.ID_Empleado.toString().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.city) {
      return data.filter((city: ICity)  =>
        city.Nombre.toLowerCase().includes(term.toLowerCase())
      );
    }
    return data;
  }

  public getVehicleModel(vehicle: IVehicle | undefined): string {
    if(!vehicle) return '';
    const brand = vehicle.Modelo.Marca_Vehiculo.Marca;
    const model = vehicle.Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getVehicleType(vehicle: IVehicle): string {
    return vehicle.Modelo.Tipo_Vehiculo.Tipo_Vehiculo;
  }
}
