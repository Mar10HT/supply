export interface IYearlyStats {
  month: string;
  revenue: number;
}

export interface IYearlyStatsResponse {
  data: IYearlyStats[];
}

export interface IDashboard {
  products: {
    name: string;
    quantity: number;
  }[];
  days: {
    day: string;
    quantity: number;
  }[];
  groups: {
    name: string;
    quantity: number;
  }[];
  departments: {
    department: string;
    quantity: number;
  }[];
  total: number;
}

export interface IDashboardResponse {
  data: IDashboard;
}
