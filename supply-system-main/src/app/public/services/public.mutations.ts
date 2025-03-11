import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { cookieHelper } from 'src/app/core/helpers';
import { environment } from 'src/environments/environments';
import { IProductRequisitionWithIds } from '../interfaces/public.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PublicMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private cookieHelper: cookieHelper
  ) {}

  public createRequisition(requisitions: IProductRequisitionWithIds[]): Promise<boolean> {
    const username = this.cookieHelper.getUsername();
    const data = { requisitions, username };
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-requisition`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Requisición creada correctamente', 'Listo!');
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
}
