import { IProduct } from "src/app/admin/interfaces";

export interface IProductRequisition {
  product: IProduct;
  quantity: number;
}

export interface IProductRequisitionWithIds {
  productId: number;
  requisitionId: number;
  quantity: number;
}
