import { IVehicle } from '../interfaces';

export class vehicleInfoHelper {
  public getModel(vehicle: IVehicle | undefined): string {
    if(!vehicle) return '';
    const brand = vehicle.Modelo.Marca_Vehiculo.Marca;
    const model = vehicle.Modelo.Modelo;
    const year = vehicle.Anio;
    return `${brand} ${model} ${year}`;
  }

  public getType(vehicle: IVehicle): string {
    return vehicle.Modelo.Tipo_Vehiculo.Tipo_Vehiculo;
  }

  public getVehicleStatus(vehicle: IVehicle): string {
    return vehicle.Estado_Vehiculo.Estado_Vehiculo;
  }
}
