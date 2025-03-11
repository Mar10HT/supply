import { Injectable } from '@angular/core';
import moment from 'moment';
import { IProduct } from 'src/app/admin/interfaces/product.interfaces';
import { IMergedHistory, IRequisition, ISupplier } from 'src/app/admin/interfaces';
import { Model } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor() {}

  public filterData(data: any[], term: string, dataModel: string): any[] {
    if(dataModel === Model.Product) {
      return data.filter((product: IProduct)  =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.group.name.toLowerCase().includes(term.toLowerCase()) ||
        product.unit.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.Supplier) {
      return data.filter((supplier: ISupplier) =>
        supplier.name.toLowerCase().includes(term.toLowerCase()) ||
        moment.utc(supplier.entries[0].date).format('DD/MM/YYYY').toLowerCase().includes(term.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(term.toLowerCase()) ||
        supplier.phone?.toLowerCase().includes(term.toLowerCase()) ||
        supplier.address?.toLowerCase().includes(term.toLowerCase()) ||
        supplier.rtn?.toLowerCase().includes(term.toLowerCase())
      );
    }
    if(dataModel === Model.Requisition) {
      return data.filter((requisition: IRequisition) =>
        requisition.state.state.toLowerCase().includes(term.toLowerCase()) ||
        requisition.employeeName.toLowerCase().includes(term.toLowerCase()) ||
        requisition.bossName.toLowerCase().includes(term.toLowerCase()) ||
        requisition.department.toLowerCase().includes(term.toLowerCase()) ||
        requisition.employeeId.toString().includes(term) ||
        requisition.id.toString().includes(term)
      );
    }
    if(dataModel === Model.History) {
      return data.filter((history: IMergedHistory) =>
        history.product.toLowerCase().includes(term.toLowerCase()) ||
        history.unit.toLowerCase().includes(term.toLowerCase()) ||
        history.type.toLowerCase().includes(term.toLowerCase()) ||
        history.range.toLowerCase().includes(term.toLowerCase()) ||
        history.motive.toLowerCase().includes(term.toLowerCase())
      );
    }
    return data;
  }
}
