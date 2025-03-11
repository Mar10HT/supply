export interface IProduct {
  id: number;
  name: string;
  minimum: number;
  unit: string;
  imageUrl?: string;
  perishable: boolean;
  batched: boolean;
  batchedNumber: number;
  batches: IBatch[];
  active: boolean;
  group: IGroup;
}

export interface IGroup {
  id: number;
  name: string;
  description?: string;
}

export interface IBatch {
  id: number;
  due?: Date;
  quantity: number;
  price: number;
}

export interface IProductsResponse {
  data: IProduct[];
}

export interface IGroupsResponse {
  data: IGroup[];
}
