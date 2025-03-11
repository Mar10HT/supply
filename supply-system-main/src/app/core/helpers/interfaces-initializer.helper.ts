import { IBatch, IDashboard, IGroup, IHistory, IMergedHistory, IProduct, ISupplier } from "src/app/admin/interfaces";

export const EMPTY_DASHBOARD: IDashboard = {
  products: [],
  days: [],
  groups: [],
  departments: [],
  total: 0
};

export const EMPTY_GROUP: IGroup = {
  id: 0,
  name: ""
};

export const EMPTY_BATCH: IBatch = {
  id: 0,
  due: new Date(),
  quantity: 0,
  price: 0
};

export const EMPTY_PRODUCT: IProduct = {
  id: 0,
  minimum: 0,
  perishable: false,
  batched: false,
  name: "",
  unit: "",
  batches: [],
  batchedNumber: 0,
  group: EMPTY_GROUP,
  active: false
};

export const EMPTY_HISTORY: IHistory = {
  entries: [],
  outputs: []
};

export const EMPTY_MERGED_HISTORY: IMergedHistory = {
  date: new Date(),
  product: "",
  unit: "",
  initialQuantity: 0,
  type: "",
  quantity: 0,
  finalQuantity: 0,
  document: "",
  price: 0,
  batched: false,
  range: "",
  motive: ""
};

export const EMPTY_SUPPLIER: ISupplier = {
  id: 0,
  name: "",
  email: '',
  phone: '',
  address: '',
  rtn: '',
  entries: []
};
