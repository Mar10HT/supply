import { ILog, IRequest } from ".";

export interface IVehicle {
  ID_Vehiculo: number;
  Placa: string;
  Kilometraje: number;
  Chasis: string;
  Motor: string;
  KPG: number;
  Imagen_URL: string;
  Anio: number;
  Color: string;
  Estado_Vehiculo: IVehicleStatus;
  Modelo: IModel;
  Solicitudes: IRequest[];
  Bitacoras: ILog[];
  Mantenimientos: IMaintenance[];
  Siguiente_Mantenimiento?: number;
}

export interface IMaintenance {
  ID_Mantenimiento: number;
  Kilometraje: number;
  Tipo_Mantenimiento: 'Correctivo' | 'Preventivo';
  Vehiculo: IVehicle;
  Fecha: Date;
}

export interface IModel {
  ID_Modelo: number;
  Modelo: string;
  Marca_Vehiculo: IBrand;
  Tipo_Vehiculo: IVehicleType;
}

export interface IBrand {
  ID_Marca_Vehiculo: number;
  Marca: string;
}

export interface IVehicleStatus {
  ID_Estado_Vehiculo: number;
  Estado_Vehiculo: string;
}

export interface IVehicleType {
  ID_Tipo_Vehiculo: number;
  Tipo_Vehiculo: string;
}

export interface IVehicleResponse {
  data: IVehicle;
}

export interface IVehicleInfo {
  kms: number;
  gas: number;
  cost: number;
  kpg: number;
  cpk: number;
}

export interface IVehicleInfoResponse {
  current: IVehicleInfo;
  last: IVehicleInfo;
  maintenance: { date: Date, km: number };
  history: { months: string[], kms: number[] };
}

export interface IVehiclesResponse {
  data: IVehicle[];
  maintenance: { id: number, kms: number };
}

export interface IBrandsResponse {
  data: IBrand[];
}

export interface IModelResponse {
  data: IModel[];
}

export interface IStatusesReponse {
  data: IVehicleStatus[];
}

export interface ITypeResponse {
  data: IVehicleType[];
}
