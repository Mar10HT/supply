import { IBatch, IProduct } from ".";

export interface ISupplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  rtn?: string;
  entries: IEntry[];
}

export interface IProductEntry {
  id: number;
  product: IProduct;
  entry: IEntry;
  quantity: number;
  currentQuantity: number;
  price: number;
}

export interface IEntry {
  id: number;
  invoiceUrl?: string;
  date: Date;
  supplier: ISupplier;
  productsEntry: IProductEntry[];
  batches: IBatch[];
}

export interface ISuppliersResponse {
  data: ISupplier[];
}
