export interface IDriver {
  ID_Conductor: number;
  Nombre: string;
  Solicitudes_Finalizadas: number;
  Disponible: boolean;
}

export interface IDriversResponse {
  data: IDriver[];
}

export interface IDriverResponse {
  data: IDriver;
}
