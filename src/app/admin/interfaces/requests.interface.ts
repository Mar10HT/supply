import { ICity, IVehicle, IDriver, IUser } from ".";

export interface IRequest {
  ID_Solicitud: number;
  ID_Empleado: number;
  Nombre_Empleado: string;
  Nombres_Pasajeros?: string;
  Departamento?: string;
  Destino: string;
  Motivo: string;
  Fecha: Date;
  Documento_URL: string;
  Numero_Memorando: string;
  Hora_Salida: Date;
  Hora_Regreso: Date;
  Ciudad: ICity;
  Vehiculo?: IVehicle;
  Estado_Solicitud: IRequestStatus;
  Tipo_Solicitud: IRequestType;
  Conductor?: IDriver;
  Pasajeros: string;
}

export interface IRequestStatus {
  ID_Estado_Solicitud: number;
  Estado: string;
}

export interface IRequestType {
  ID_Tipo_Solicitud: number;
  Tipo_Solicitud: string;
}

export interface IRequestsResponse {
  data: IRequest[];
}

export interface IRequestResponse {
  data: IRequest;
}
export interface IAvaliableForRequestResponse {
  vehicles: IVehicle[];
  drivers: IDriver[];
  employees: IUser[];
}

export interface IRequestStatusResponse {
  data: IRequestStatus[];
}
