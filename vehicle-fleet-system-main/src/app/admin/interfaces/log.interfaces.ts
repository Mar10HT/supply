import { ICity, IDriver, IVehicle } from ".";

export interface ILog {
  ID_Bitacora: number;
  Destino: string;
  Pasajeros: string;
  Kilometraje_Entrada: number;
  Kilometraje_Salida: number;
  Hora_Salida: Date;
  Hora_Entrada: Date;
  Fecha: Date;
  Observaciones: string;
  Llenados_Combustible: IGasRefill[];
  Vehiculo: IVehicle;
  Conductor: IDriver
  Ciudad: ICity;
}

export interface IUser {
  ID_Empleado: number;
  Nombres: string;
  Apellidos: string;
}

export interface IGasRefill {
  ID_Llenado_Combustible: number;
  Cantidad: number;
  Estacion_Combustible: string;
  Kilometraje_Recarga: number;
  Fecha: Date;
  Numero_Factura: number;
  Numero_Orden: number;
  Precio: number;
  Unidad_Combustible: IGasUnit;
  Bitacora: ILog;
}

export interface IGasUnit {
  ID_Unidad_Combustible: number;
  Unidad: string;
}

export interface ILogResponse {
  data: ILog;
}

export interface IUsersResponse {
  data: IUser[];
}

export interface IGasUnitsResponse {
  data: IGasUnit[];
}

export interface FuesWithLog {
  ID_Vehiculo: number;
  Kilometraje_Vehiculo: number;
  Cantidad: number;
  Estacion_Combustible: string;
  Kilometraje_Recarga: number;
  Fecha: Date;
  Precio: number;
  Numero_Factura: number;
  Numero_Orden: number;
  ID_Unidad_Combustible: number;
}

export interface exportData {
  logs: any[];
  refills: FuesWithLog[];
}
