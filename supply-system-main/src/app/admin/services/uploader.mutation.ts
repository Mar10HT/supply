import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  constructor(
    private http: HttpClient,
    private toaster: ToastrService
  ) {}

  public uploadFile(file: File, name: string = ''): Promise<boolean> {
    const fileName = name === '' ? file.name : name;
    const fd = new FormData();
    fd.append('file', file, fileName);
    return new Promise<boolean>((resolve, reject) => {
      this.http.post<boolean>(`${environment.apiUrl}/upload`, fd).subscribe(
        (response: boolean) => {
          if (response) {
            this.toaster.success('Archivo sudo exitosamente', 'Listo!');
            resolve(response);
          }
          else {
            this.toaster.error('Ocurrió un error durante la subida', 'Error!');
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
