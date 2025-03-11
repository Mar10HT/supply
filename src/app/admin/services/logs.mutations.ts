import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { exportData } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class LogsMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public createMaintenance(data: exportData): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-logs`, data).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Bitácoras agregadas correctamente', 'Listo!');
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
