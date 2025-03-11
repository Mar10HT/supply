export interface ICity {
  ID_Ciudad: number;
  Nombre: string;
  Kms: number;
  Coordenadas: string;
}

export interface IUser {
  ID_Empleado: number;
  Nombres: string;
  Apellidos: string;
}

export interface IUsersResponse {
  data: IUser[];
}

export interface ICitiesResponse {
  data: ICity[];
}

export interface IRequestTypeResponse {
  data: IRequestType[];
}

export interface IRequestType {
  ID_Tipo_Solicitud: number;
  Tipo_Solicitud: string;
}

export interface IRequest {
  ID_Solicitud: number;
  ID_Empleado: number;
  Destino: string;
  Motivo: string;
  Fecha: Date;
  Hora_Salida: Date;
  Hora_Regreso: Date;
  Ciudad: ICity;
  Tipo_Solicitud: IRequestType;
  Pasajeros: string;
}
