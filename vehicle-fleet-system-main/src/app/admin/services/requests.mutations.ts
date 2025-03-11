import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RequestMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public cancelRequest(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/cancel-request`, { id }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Solicitud cancelada exitosamente', 'Listo!');
            resolve(response);
          }
          else {
            this.toaster.success('Ocurrió un error durante la cancelación', 'Error!');
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

  public finishRequest(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/finish-request`, { id }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Solicitud finzalizada exitosamente', 'Listo!');
            resolve(response);
          }
          else {
            this.toaster.success('Ocurrió un error durante la finzalización', 'Error!');
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

  public updateRequest(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/update-request`, { data }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Solicitud actualizada correctamente', 'Listo!');
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
