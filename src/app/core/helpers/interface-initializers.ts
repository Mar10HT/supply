import {
  IVehicle, IModel, IBrand,
  IVehicleStatus, IVehicleType, IGasRefill,
  IGasUnit, ILog, IDriver,
  IRequest, ICity, IRequestStatus,
  IRequestType,
  IUser
} from "src/app/admin/interfaces";

export const EMPTY_CITY: ICity = {
  ID_Ciudad: 0,
  Nombre: "",
  Kms: 0,
  Coordenadas: ""
};

export const EMPTY_REQUEST_STATUS: IRequestStatus = {
  ID_Estado_Solicitud: 0,
  Estado: ""
};

export const EMPTY_REQUEST_TYPE: IRequestType = {
  ID_Tipo_Solicitud: 0,
  Tipo_Solicitud: ""
};

export const EMPTY_USER: IUser = {
  ID_Empleado: 0,
  Nombres: '',
  Apellidos: ''
};

export const EMPTY_REQUEST: IRequest = {
  ID_Solicitud: 0,
  ID_Empleado: 0,
  Departamento: "",
  Nombre_Empleado: "",
  Destino: "",
  Motivo: "",
  Fecha: new Date(),
  Hora_Salida: new Date(),
  Hora_Regreso: new Date(),
  Ciudad: EMPTY_CITY,
  Estado_Solicitud: EMPTY_REQUEST_STATUS,
  Tipo_Solicitud: EMPTY_REQUEST_TYPE,
  Pasajeros: "",
  Documento_URL: "",
  Numero_Memorando: ""
};

export const EMPTY_DRIVER: IDriver = {
  ID_Conductor: 0,
  Nombre: "",
  Solicitudes_Finalizadas: 0,
  Disponible: false
};

export const EMPTY_BRAND: IBrand = {
  ID_Marca_Vehiculo: 0,
  Marca: ''
};

export const EMPTY_VEHICLE_STATE: IVehicleStatus = {
  ID_Estado_Vehiculo: 0,
  Estado_Vehiculo: ''
};

export const EMPTY_VEHICLE_TYPE: IVehicleType = {
  ID_Tipo_Vehiculo: 0,
  Tipo_Vehiculo: ''
};

export const EMPTY_MODEL: IModel = {
  ID_Modelo: 0,
  Modelo: '',
  Marca_Vehiculo: EMPTY_BRAND,
  Tipo_Vehiculo: EMPTY_VEHICLE_TYPE
};

export const EMPTY_GAS_UNIT: IGasUnit = {
  ID_Unidad_Combustible: 0,
  Unidad: '',
};

export const EMPTY_VEHICLE: IVehicle = {
  ID_Vehiculo: 0,
  Placa: '',
  Kilometraje: 0,
  Chasis: '',
  Motor: '',
  KPG: 0,
  Imagen_URL: '',
  Anio: 0,
  Solicitudes: [],
  Color: '',
  Estado_Vehiculo: EMPTY_VEHICLE_STATE,
  Modelo: EMPTY_MODEL,
  Siguiente_Mantenimiento: 0,
  Bitacoras: [],
  Mantenimientos: []
};

export const EMPTY_LOG: ILog = {
  ID_Bitacora: 0,
  Destino: '',
  Pasajeros: '',
  Kilometraje_Entrada: 0,
  Kilometraje_Salida: 0,
  Hora_Salida: new Date(),
  Hora_Entrada: new Date(),
  Fecha: new Date(),
  Observaciones: '',
  Llenados_Combustible: [],
  Conductor: EMPTY_DRIVER,
  Vehiculo: EMPTY_VEHICLE,
  Ciudad: EMPTY_CITY
};

export const EMPTY_GAS_REFILL: IGasRefill = {
  ID_Llenado_Combustible: 0,
  Cantidad: 0,
  Numero_Factura: 0,
  Numero_Orden: 0,
  Estacion_Combustible: '',
  Kilometraje_Recarga: 0,
  Fecha: new Date(),
  Precio: 0,
  Unidad_Combustible: EMPTY_GAS_UNIT,
  Bitacora: EMPTY_LOG
};
