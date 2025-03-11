import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { cookieHelper } from 'src/app/core/helpers';
import { environment } from 'src/environments/environments';
import { ISupplier } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SupplierMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private cookieHelper: cookieHelper
  ) {}

  public createSupplier(data: ISupplier): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-supplier`, this.cookieHelper.dataToSend(data)).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Proveedor creado correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error durante la creación', 'Error!');
            resolve(response);
          }
        },
        (error) => {
          this.toaster.error(error.message, 'Error!');
          reject(error);
        }
      );
    });
  }

  public updateSupplier(data: ISupplier): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/update-supplier`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Proveedor editado correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error', 'Error!');
            resolve(response);
          }
        },
        (error) => {
          this.toaster.error(error.message, 'Error!');
          reject(error);
        }
      );
    });
  }

  public deleteSupplier(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/delete-supplier`, { id }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Proveedor eliminado correctamente', 'Listo!');
            resolve(response);
          } else {
            this.toaster.success('Ocurrió un error', 'Error!');
            resolve(response);
          }
        },
        (error) => {
          this.toaster.error(error.message, 'Error!');
          reject(error);
        }
      );
    });
  }
}
