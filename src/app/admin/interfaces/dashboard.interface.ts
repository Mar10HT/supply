import { IVehicle } from ".";

export interface monthData {
  gas: number;
  cost: number;
  kms: number;
  requests: number;
  trips: number;
}

export interface IDashboardQuery {
  current_month: monthData;
  last_month: monthData;
  kms: { month: string; kms: number }[];
  cities: { city: string; trips: number }[];
  vehicle: IVehicle;
  cost: { month: string; cost: number }[];
}
