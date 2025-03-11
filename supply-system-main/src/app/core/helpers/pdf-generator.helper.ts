import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { IProduct, IRequisition, ISupplier } from 'src/app/admin/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PDFHelper {
  private isFirstPageDrawn = false;
  private finalY = 0;

  constructor() {}

  public generatePDF(formattedData: any[], columns: string[], title: string, dates = false, start?: Date, end?: Date, isReport = false, total = 0): void {
    this.isFirstPageDrawn = false;
    let subtitle = '';
    dates ? subtitle += `${moment.utc(start).format('DD/MM/YYYY')} - ${moment.utc(end).format('DD/MM/YYYY')}` : '';
    const doc = new jsPDF('landscape');
    doc.setTextColor(40);
    const blue = '#88CFE0';

    autoTable(doc, {
      head: [columns],
      body: formattedData,
      margin: { top: 45, right: 10, bottom: 20, left: 20 },
      styles: { halign: 'center', valign: 'middle'},
      headStyles: { fillColor: blue },
      didDrawPage: (data) => {
        doc.setFontSize(20);
        const pageSize = doc.internal.pageSize;

        // Header
        if (!this.isFirstPageDrawn) {
          data.settings.margin.top = 4;
          const centerX = pageSize.width / 2;
          doc.text(title, centerX - (doc.getTextWidth(title) / 2), 25);
          subtitle.length > 0 ? doc.text(subtitle, centerX - (doc.getTextWidth(subtitle) / 2), 35) : '';

          doc.addImage('assets/pdf.jpg', 'JPEG', 20, 5, 40, 40);
          doc.addImage('assets/pdf2.jpg', 'JPEG', pageSize.width-50, 2, 40, 40);
          this.isFirstPageDrawn = true;
        }

        // Left stripe
        const margin = 4;
        doc.setFillColor(blue);
        doc.rect(margin, margin, 10, pageSize.height-2*margin, 'F');
        this.finalY = data.cursor?.y || 95;
      },
    });
    const pageCount = (doc as any).internal.getNumberOfPages();
    const footerHeight = doc.internal.pageSize.height - 7;
    const totalY = this.finalY + 5;
    const rowHeight = 20;
    const formattedTotal = total.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const totalString = 'Total:    L.' + formattedTotal;
    const startX = doc.internal.pageSize.width - doc.getTextWidth('Total: ' + total) - 15;

    if (isReport) {
      doc.setFontSize(12);
      if (totalY + rowHeight > doc.internal.pageSize.height) {
        doc.addPage();
        doc.text(totalString, startX, totalY);
      } else {
        doc.text(totalString, startX, totalY);
      }
    }

    // Footer
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('Página ' + i + ' de ' + pageCount, doc.internal.pageSize.width - 35, footerHeight);
      doc.text('Lista generada el ' + moment.utc().format('DD/MM/YYYY'), 25, footerHeight);
    }

    doc.output('dataurlnewwindow');
  }

  public generateSuppliersPDF(suppliers: ISupplier[]): void {
    const columns = ['Nombre', 'Correo', 'Teléfono', 'Dirección', 'RTN', 'Última entrada', '# de Entregas'];
    const formattedSuppliers = this.formatSuppliersForPDF(suppliers);
    this.generatePDF(formattedSuppliers, columns, 'Listado de Proveedores');
  }

  public generateRequisitionsPDF(requisitions: IRequisition[], start: Date, end: Date): void {
    const columns = ['Fecha', 'Estado', 'Empleado', 'Jefe', 'Departamento'];
    const formattedSuppliers = this.formatRequisitionsForPDF(requisitions);
    this.generatePDF(formattedSuppliers, columns, 'Listado de Requisiciones', true, start, end);
  }

  public generateProductsPDF(products: IProduct[]): void {
    const columns = ['Nombre', 'Grupo', 'Cantidad', 'Unidad', 'Vencimiento', 'Precio', 'Total'];
    const formattedVehicles = this.formatProductsForPDF(products);
    const total = products.reduce((acc, product) =>
      acc + product.batches.reduce((sum, batch) => sum + (batch.price * batch.quantity), 0), 0
    );
    this.generatePDF(formattedVehicles, columns, 'Listado de Productos', false, undefined, undefined, true, +total.toFixed(2));
  }

  public generateHistoryPDF(history: any[], start: Date, end: Date): void {
    const columns = ['Fecha', 'Producto', 'Unidad', 'Tipo', 'Razón', 'Cantidad Inicial', 'Cantidad', 'Cantidad Final'];
    const formattedHistory = this.formatHistoryForPDF(history);
    this.generatePDF(formattedHistory, columns, 'Historial de Productos', true, start, end);
  }

  private formatHistoryForPDF(history: any[]) {
    return history.map(entry => {
      return [
        moment.utc(entry.date).format('DD/MM/YYYY'),
        entry.product,
        entry.unit,
        entry.type,
        entry.motive,
        entry.initialQuantity,
        entry.quantity,
        entry.finalQuantity
      ];
    });
  }

  private formatSuppliersForPDF(suppliers: ISupplier[]) {
    return suppliers.map(supplier => {
      return [
        supplier.name || 'No Registrado',
        supplier.email || 'No Registrado',
        supplier.phone || 'No Registrado',
        supplier.address || 'No Registrado',
        supplier.rtn || 'No Registrado',
        supplier.entries.length > 0 ? this.getDate(supplier.entries[0].date) : 'No Registrado',
        supplier.entries.length > 0 ? supplier.entries.length : 0
      ];
    });
  }

  public formatRequisitionsForPDF(requisitions: IRequisition[]) {
    return requisitions.map(requisition => {
      return [
        this.getDate(requisition.systemDate),
        requisition.state.state,
        requisition.employeeName,
        requisition.bossName,
        requisition.department
      ];
    });
  }

  public formatProductsForPDF(products: IProduct[]) {
    return products.map(product => {
      return [
        product.name,
        product.group.name,
        product.batches?.reduce((acc, batch) => acc + batch.quantity, 0),
        product.unit,
        product.batches.length > 0 && product.batches[0].due ? this.getDate(product.batches[0].due) : 'No Registrado',
        product.batches.length > 0 ? 'L.' + product.batches.reduce((sum, batch) => sum + +batch.price, 0) : 'No Registrado',
        product.batches.length > 0 ? 'L.' + product.batches.reduce((sum, batch) => sum + (batch.price * batch.quantity), 0).toFixed(2) : 'No Registrado'
      ];
    });
  }

  private getDate(date: Date): string {
    return moment.utc(date).format('DD/MM/YYYY');
  }
}

