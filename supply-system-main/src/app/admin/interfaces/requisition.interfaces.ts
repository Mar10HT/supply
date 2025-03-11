import { IProduct } from ".";

export interface IRequisition {
  id: number;
  employeeId: number;
  department: string;
  documentUrl?: string;
  employeeName: string;
  bossName: string;
  systemDate: Date;
  state: IState;
  productsRequisition: IProductRequisition[];
}

export interface IState {
  id: number;
  state: string;
}

export interface IProductRequisition {
  id: number;
  quantity: number;
  product: IProduct;
  requisition: IRequisition;
}

export interface IRequisitionResponse {
  data: IRequisition[];
}
