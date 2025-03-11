import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { cookieHelper } from 'src/app/core/helpers';

@Injectable({
  providedIn: 'root'
})
export class OutputMutations {
  constructor(
    private http: HttpClient,
    private cookieService: cookieHelper,
    private toaster: ToastrService
  ) {}

  public createOutput(output: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-output`, this.cookieService.dataToSend(output)).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Salida creada correctamente', 'Listo!');
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
