import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { cookieHelper } from 'src/app/core/helpers';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class DriverMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private cookieHelper: cookieHelper
  ) {}

  public deleteDriver(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/delete-driver`, { id }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Conductor eliminado correctamente', 'Listo!');
            resolve(response);
          }
          else {
            this.toaster.success('Ocurrió un error durante la eliminación', 'Error!');
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

  public createDriver(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-driver`, this.cookieHelper.dataToSend(data)).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Conductor creado correctamente', 'Listo!');
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

  public editDriver(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/update-driver`, { data }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Conductor editado correctamente', 'Listo!');
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
