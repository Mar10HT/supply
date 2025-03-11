import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';
import { cookieHelper } from 'src/app/core/helpers';
import { IGroup } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GroupMutations {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService,
    private cookieService: cookieHelper
  ) {}

  public createGroup(data: IGroup): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/create-group`, this.cookieService.dataToSend(data)).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Grupo creado correctamente', 'Listo!');
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
