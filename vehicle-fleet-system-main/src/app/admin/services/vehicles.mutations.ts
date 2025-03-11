import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { cookieHelper } from 'src/app/core/helpers';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class VehicleMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private cookieHelper: cookieHelper
  ) {}

  public deleteVehicle(id: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/delete-vehicle`, { id }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Vehículo eliminado correctamente', 'Listo!');
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

  public createBrand(brand: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-brand`, {brand}).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Marca creada correctamente', 'Listo!');
            resolve(response);
          }
          else {
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

  public createModel(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-model`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Modelo creado correctamente', 'Listo!');
            resolve(response);
          }
          else {
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

  public createVehicle(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-vehicle`, this.cookieHelper.dataToSend(data)).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Vehículo creado correctamente', 'Listo!');
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

  public editVehicle(data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/update-vehicle`, { data }).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Vehículo editado correctamente', 'Listo!');
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
